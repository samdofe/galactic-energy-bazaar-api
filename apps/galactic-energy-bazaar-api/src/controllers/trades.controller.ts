import { Request, Response } from 'express';
import Trade , { type ITrade } from '../models/Trade';
import { io } from '../main';
import {formatDate, formatErrorMessage, generateNextTradeId} from "../utils/utils";

export const getAllTrades = async (req: Request, res: Response) => {
    const { planetId, traderId, status, dateFrom, dateTo, page = 1, limit = 10 } = req.query;

    const filter: any = {};

    // Add filters based on query parameters
    if (planetId) filter.planetId = planetId;
    if (traderId) filter.traderId = traderId;
    if (status) filter.status = status;

    // Filter by date range if provided
    if (dateFrom || dateTo) {
        filter.createdAtDate = {};
        if (dateFrom) filter.createdAtDate.$gte = new Date(dateFrom as string);
        if (dateTo) {
            filter.createdAtDate.$lte = new Date(dateTo as string).setHours(23, 59, 59, 999);
        }
    }

    // Parse pagination values
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    try {
        // Fetch trades with filters, pagination, sorting, and extended information
        const trades = await Trade.aggregate([
            {
                $addFields: {
                    createdAtDate: {
                        $dateFromString: {
                            dateString: '$createdAt',
                            format: '%Y-%m-%dT%H:%M:%SZ', // Adjust the format to match your data
                        },
                    },
                },
            },
/*            {
                $match: {
                    createdAtDate: { $gte: startDate, $lte: endDate },
                },
            },*/
            { $match: filter },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: pageSize },
            {
                $lookup: {
                    from: 'planets',
                    localField: 'planetId',
                    foreignField: 'planetId',
                    as: 'planetInfo'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'traderId',
                    foreignField: 'userId',
                    as: 'traderInfo'
                }
            },
            {
                $project: {
                    _id: 0,
                    tradeId: 1,
                    planetId: 1,
                    traderId: 1,
                    type: 1,
                    status: 1,
                    tradeDate: 1,
                    zetaJoules: 1,
                    pricePerUnit: 1,
                    totalPrice: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    planet: {
                        $arrayElemAt: ['$planetInfo', 0]
                    },
                    trader: {
                        $arrayElemAt: ['$traderInfo', 0]
                    }
                }
            },
            {
                $project: {
                    'planet.planetId': 1,
                    'planet.name': 1,
                    'planet.color': 1,
                    'planet.images': 1,
                    'trader.userId': 1,
                    'trader.username': 1,
                    'trader.images': 1,
                    tradeId: 1,
                    planetId: 1,
                    traderId: 1,
                    type: 1,
                    status: 1,
                    tradeDate: 1,
                    zetaJoules: 1,
                    pricePerUnit: 1,
                    totalPrice: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);

        // Get total count for pagination metadata
        const totalTrades = await Trade.countDocuments(filter);

        res.json({
            data: trades,
            meta: {
                total: totalTrades,
                page: pageNumber,
                limit: pageSize,
            },
        });
    } catch (error) {
        res.status(500).json(formatErrorMessage('Failed to fetch trades', error));
    }
};

export const getTradeById = async (req: Request, res: Response) => {
    const { tradeId } = req.params;

    try {
        const trade = await Trade.findOne({tradeId});
        if (!trade) {
            res.status(404).json(formatErrorMessage('Trade not found'));
            return;
        }

        res.json(trade);
    } catch (error) {
        res.status(500).json(formatErrorMessage('Failed to fetch trade', error));
    }
};

export const createTrade = async (req: Request, res: Response) => {
    const {  planetId, type, traderId, zetaJoules, pricePerUnit } = req.body

    try {
        // Validate required fields
        if (!planetId || !type || !traderId || zetaJoules === undefined || pricePerUnit === undefined) {
            res.status(400).json({ error: "Missing required fields" });
            return ;
        }

        // Validate data types
        if (typeof planetId !== "string" || typeof traderId !== "string") {
            res.status(400).json({ error: "Invalid data types for tradeId, planetId, or traderId" });
            return ;
        }

        if (typeof zetaJoules !== "number" || typeof pricePerUnit !== "number") {
            res.status(400).json({ error: "zetaJoules and pricePerUnit must be numbers" });
            return ;
        }

        // Validate trade type
        if (type !== "BUY" && type !== "SELL") {
            res.status(400).json({ error: "Invalid trade type. Must be BUY or SELL" });
            return ;
        }

        // Generate the next trade ID
        const tradeId = await generateNextTradeId()
        // Calculate total price
        const totalPrice = Number((zetaJoules * pricePerUnit).toFixed(2))

        // Get current date and format it
        const currentDate = new Date()
        const formattedDate = formatDate(currentDate)

        // Create new trade object
        const newTrade: ITrade = new Trade({
            tradeId,
            planetId,
            traderId,
            type,
            status: "PENDING",
            tradeDate: formattedDate,
            zetaJoules,
            pricePerUnit,
            totalPrice,
            createdAt: formattedDate,
            updatedAt: formattedDate,
        })

        // Save the trade
        const savedTrade = await newTrade.save()

        // Emit socket event
        io.emit("tradeCreated", savedTrade)

        // Send response
        res.status(201).json(savedTrade)
    } catch (error) {
        console.error("Error creating trade:", error)
        res.status(500).json(formatErrorMessage("Failed to create trade", error))
    }
}

export const updateTrade = async (req: Request, res: Response) => {
    const { tradeId } = req.params;
    const updates = req.body;

    try {
        const trade = await Trade.findOneAndUpdate({tradeId}, updates, { new: true });
        if (!trade) {
            res.status(404).json({ error: 'Trade not found' });
            return;
        }

        io.emit('tradeUpdated', trade);
        res.json(trade);
    } catch (error) {
        res.status(500).json(formatErrorMessage('Failed to update trade', error));
    }
};

export const deleteTrade = async (req: Request, res: Response) => {
    const { tradeId } = req.params;

    try {
        const trade = await Trade.findOneAndDelete({tradeId});
        if (!trade) {
            res.status(404).json(formatErrorMessage('Trade not found'));
            return;
        }

        io.emit('tradeCancel', trade);
        res.json({ message: `Trade with id=${tradeId} canceled`, trade });
    } catch (error) {
        res.status(500).json(formatErrorMessage('Failed to delete trade', error));
    }
};

export const getTradeStats = async (req: Request, res: Response) => {
    const { dateFrom, dateTo } = req.query;

    try {

        if (!dateFrom || !dateTo) {
            res.status(400).json(formatErrorMessage('dateFrom and dateTo are required query parameters'));
            return;
        }
        // Parse and log date range
        const startDate = dateFrom ? new Date(dateFrom as string) : new Date(0);
        const endDate = dateTo ? new Date(dateTo as string) : new Date();
        endDate.setHours(23, 59, 59, 999); // Include the full day for dateTo

        console.log('startDate:', startDate);
        console.log('endDate:', endDate);

        const planetStats = await Trade.aggregate([
            {
                $addFields: {
                    createdAtDate: {
                        $dateFromString: {
                            dateString: '$createdAt',
                            format: '%Y-%m-%dT%H:%M:%SZ', // Adjust the format to match your data
                        },
                    },
                },
            },
            {
                $match: {
                    createdAtDate: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: '$planetId',
                    buyOrders: {
                        $sum: {
                            $cond: [{ $eq: ['$type', 'BUY'] }, 1, 0], // Check for type "buy"
                        },
                    },
                    sellOrders: {
                        $sum: {
                            $cond: [{ $eq: ['$type', 'SELL'] }, 1, 0], // Check for type "sell"
                        },
                    },
                    totalVolume: { $sum: '$zetaJoules' },
                    avgPrice: { $avg: '$pricePerUnit' },
                },
            },
            {
                $lookup: {
                    from: 'planets', // Name of the planets collection
                    localField: '_id', // Field in the trades group (planetId)
                    foreignField: 'planetId', // Field in the planets collection
                    as: 'planetInfo', // Output field for the lookup
                },
            },
            {
                $unwind: '$planetInfo', // Flatten the array resulting from $lookup
            },
            {
                $project: {
                    planetId: '$_id',
                    name: '$planetInfo.name',
                    description: '$planetInfo.description',
                    language: '$planetInfo.language',
                    currency: '$planetInfo.currency',
                    images: '$planetInfo.images',
                    color: '$planetInfo.color',
                    tradeVolume: '$planetInfo.tradeVolume',
                    riskFactors: '$planetInfo.riskFactors',
                    averageDailyConsumption: '$planetInfo.averageDailyConsumption',
                    creditRating: '$planetInfo.creditRating',
                    createdAt: '$planetInfo.createdAt',
                    updatedAt: '$planetInfo.updatedAt',
                    _id: 0,
                    buyOrders: 1,
                    sellOrders: 1,
                    totalVolume: 1,
                    avgPrice: 1,
                },
            },
            {
                $sort: { planetName: 1 }, // Sort by planet name in ascending order
            },
        ]);


        if (!planetStats.length) {
            console.log('No trades found for the specified date range.');
        }

        res.json(planetStats);
    } catch (error) {
        res.status(500).json(formatErrorMessage('Failed to fetch planet trade stats', error));
    }
};

export const getTradeLeaderboards = async (req: Request, res: Response) => {
    try {
        // Leaderboard for planets
        const planetLeaderboard = await Trade.aggregate([
            {
                $group: {
                    _id: '$planetId',
                    tradeCount: { $count: {} },
                },
            },
            {
                $lookup: {
                    from: 'planets', // Name of the planets collection
                    localField: '_id', // Field in the trades group (planetId)
                    foreignField: 'planetId', // Field in the planets collection
                    as: 'planetInfo',
                },
            },
            {
                $unwind: '$planetInfo', // Flatten the lookup result
            },
            {
                $project: {
                    id: '$_id',
                    name: '$planetInfo.name', // Assuming `name` is the field for planet names
                    images: '$planetInfo.images',
                    tradeCount: 1,
                    _id: 0,
                },
            },
            {
                $sort: { tradeCount: -1 }, // Sort by trade count descending
            },
            { $limit: 10 }, // Top 10 planets
        ]);

        // Leaderboard for traders
        const traderLeaderboard = await Trade.aggregate([
            {
                $group: {
                    _id: '$traderId',
                    tradeCount: { $count: {} },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id', // Match traderId in trades
                    foreignField: 'userId', // Match traderId in traders
                    as: 'userInfo',
                },
            },
            {
                $unwind: '$userInfo', // Flatten the lookup results
            },
            {
                $project: {
                    id: '$_id',
                    name: '$userInfo.username',
                    images: '$userInfo.images',
                    tradeCount: 1,
                    _id: 0,
                },
            },
            {
                $sort: { tradeCount: -1 }, // Sort by trade count descending
            },
            { $limit: 10 }, // Top 10 traders
        ]);

        res.json({
            planetLeaderboard,
            traderLeaderboard,
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Failed to fetch leaderboards', details: error.message });
        } else {
            res.status(500).json({ error: 'Failed to fetch leaderboards', details: 'Unknown error' });
        }
    }
};



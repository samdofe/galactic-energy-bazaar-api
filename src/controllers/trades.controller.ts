import { Request, Response } from 'express';
import Trade from '../models/Trade';
import { io } from '../server';
import {formatErrorMessage} from "../utils/utils";
import {PipelineStage} from "mongoose";

export const getAllTrades = async (req: Request, res: Response) => {
    const { planetId, traderId, status, startDate, endDate, page = 1, limit = 10 } = req.query;

    const filter: any = {};

    // Add filters based on query parameters
    if (planetId) filter.planetId = planetId;
    if (traderId) filter.traderId = traderId;
    if (status) filter.status = status;

    // Filter by date range if provided
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate as string); // Greater than or equal to startDate
        if (endDate) filter.createdAt.$lte = new Date(endDate as string);    // Less than or equal to endDate
    }

    // Parse pagination values
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    try {
        // Fetch trades with filters, pagination, and sorting
        const trades = await Trade.find(filter)
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 }); // Sort by creation date (newest first)

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
        const trade = await Trade.find({tradeId});
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
    const { tradeId, planetId, traderId, status, tradeDate, zetaJoules, pricePerUnit } = req.body;

    try {
        const totalPrice = zetaJoules * pricePerUnit;
        const newTrade = new Trade({ tradeId, planetId, traderId, status, tradeDate, zetaJoules, pricePerUnit, totalPrice });
        const savedTrade = await newTrade.save();

        io.emit('tradeCreated', savedTrade);
        res.status(201).json(savedTrade);
    } catch (error) {
        res.status(500).json(formatErrorMessage('Failed to create trade', error));
    }
};

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

export const getPlanetTradeStats = async (req: Request, res: Response) => {
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



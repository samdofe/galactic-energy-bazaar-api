import { Request, Response } from 'express';
import Trade from '../models/Trade';
import { io } from '../server';
import {formatErrorMessage} from "../utils/utils";

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
        if (!trade) res.status(404).json(formatErrorMessage('Trade not found'));

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
        if (!trade) res.status(404).json({ error: 'Trade not found' });

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
        if (!trade) res.status(404).json(formatErrorMessage('Trade not found'));

        io.emit('tradeCancel', trade);
        res.json({ message: `Trade with id=${tradeId} canceled`, trade });
    } catch (error) {
        res.status(500).json(formatErrorMessage('Failed to delete trade', error));
    }
};

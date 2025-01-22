import { Router } from 'express';
import {
    getAllTrades,
    getTradeById,
    createTrade,
    updateTrade,
    deleteTrade,
    getPlanetTradeStats,
    getTradeLeaderboards
} from '../controllers/trades.controller';

const router = Router();

router.get('/', getAllTrades);
router.get('/planetStats', getPlanetTradeStats);
router.get('/leaderBoards', getTradeLeaderboards);
router.get('/:tradeId', getTradeById);
router.post('/', createTrade);
router.put('/:tradeId', updateTrade);
router.delete('/:tradeId', deleteTrade);

export default router;
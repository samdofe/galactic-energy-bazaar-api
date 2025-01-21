import { Router } from 'express';
import {
    getAllTrades,
    getTradeById,
    createTrade,
    updateTrade,
    deleteTrade,
} from '../controllers/trades.controller';

const router = Router();

router.get('/', getAllTrades);
router.get('/:tradeId', getTradeById);
router.post('/', createTrade);
router.put('/:tradeId', updateTrade);
router.delete('/:tradeId', deleteTrade);

export default router;
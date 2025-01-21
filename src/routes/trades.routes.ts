import { Router, Request, Response} from 'express';
import { io } from '../server';
const router = Router();

/**
 * Retrieve all trades (filter by user, planet, status)
 * **/
router.get('/', async (req: Request, res: Response)=>{
    res.json({response: 'This is the ALL TRADES -GET- response'});
});

/**
 * Retreive a specific trade's details
 * **/
router.get('/:id', async (req: Request, res: Response)=>{
    const { id } = req.params;
    res.json({response: `This is the TRADE with id=${id} -GET- details response`});
});

/**
 * Create a new trade (buy/sell/propose)
 * **/
router.post('/', async (req: Request, res: Response)=> {
    const newTrade = {
        id: '0001',
        type: 'sell',
        planet: 'earth'
    };
    io.emit('tradeCreated', newTrade );
    res.status(201).json({response: 'This is the NEW TRADE -POST- response', trade: newTrade});
});

/**
 * Updates a trade (approved|reject a proposal)
 * **/
router.put('/:id', async (req: Request, res: Response)=>{
    const { id } = req.params;
    res.json({response: `This is the UPDATE TRADE -PUT- with id=${id} response`});
});

/**
 * Cancel a trade
 * **/
router.delete('/:id', async (req: Request, res: Response)=>{
    const { id } = req.params;
    res.json({response: `This is the CANCEL TRADE -DELETE- with id=${id} response`});
});

export default router;

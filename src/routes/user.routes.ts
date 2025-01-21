import { Router, Request, Response } from 'express';
 const router = Router();

 router.get('/getAllUsers', async(req: Request, res: Response) => {
     res.json([{id:1, name: 'Samuel Documet Ferroni'}, {id:2, name: 'André Documet Ferroni'}])
 });

 export default router;
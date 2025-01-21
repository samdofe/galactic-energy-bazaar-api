import { Router, Request, Response} from 'express';
const router = Router();

/**
 * Retrieve the logged-in user's details
 * **/
router.get('/me', async (req: Request, res: Response)=>{
    res.json({response: 'This is the ME user'});
});

/**
 * Register a new user
 * **/
router.post('/signup', async (req: Request, res: Response)=>{
    res.json({response: 'This is the SIGNUP repsonse'});
});

/**
 * Authenticate a user and issue a JWT
 * **/
router.post('/login', async (req: Request, res: Response)=>{
    res.json({response: 'This is the LOGIN response'});
});

/**
 * Updates a user's role (admin only)
 * **/
router.put('/roles', async (req: Request, res: Response)=>{
    res.json({response: 'This is the ROLES response'});
});

export default router;

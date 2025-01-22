import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import {formatErrorMessage} from "../utils/utils";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json(formatErrorMessage('Authentication token is required'))
        return;
    }

    try {
        req.user = verifyToken(token);
        next();
    } catch (error) {
        res.status(401).json(formatErrorMessage('Invalid token'));
    }
};

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!roles.includes(user.role)) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }
        next();
    };
};
import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload | string | { userId: string; role: string }; // Replace with your specific user type if needed
        }
    }
}
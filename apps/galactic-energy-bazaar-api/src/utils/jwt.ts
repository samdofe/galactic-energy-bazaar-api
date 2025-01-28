import jwt from 'jsonwebtoken';

const { JWT_SECRET='your-secret-key', JWT_EXPIRATION='1h'} = process.env;

export const generateToken = (userId: string, role: string) => {
    return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
};

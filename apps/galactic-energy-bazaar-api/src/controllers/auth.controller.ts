import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';
import {formatErrorMessage, validatePassword} from "../utils/utils";

export const signUp = async (req: Request, res: Response) => {
    try {
        const { userId, username, email, password, planetId } = req.body;
        // Check if userId, username, or email are already taken
        const existingUser = await User.findOne({
            $or: [{ userId }, { username }, { email }],
        });

        if (existingUser) {
            const message = `The following fields are already taken: ${existingUser.username === username ? 'username ' : ''} ${existingUser.email === email ? 'email' : ''}`;
            res.status(400).json(formatErrorMessage(message));
            return;
        }
        // Validate password
        if (!validatePassword(password)) {
            res.status(400).json(formatErrorMessage('Password must include at least one uppercase letter, one number, and one string.'));
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ userId, username, email, password: hashedPassword, role: 'trader', planetId });
        await newUser.save();
        const token = generateToken(userId, 'trader');

        res.status(201).json({ message: 'User created successfully', token, user:{
                userId,
                username,
                email,
                role: 'trader',
                planetId,
            } });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json(formatErrorMessage('User not found'));
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid){
            res.status(401).json(formatErrorMessage('Invalid credentials'));
            return;
        }

        const token = generateToken(user.userId, user.role);
        res.json({ token });
    } catch (error) {
        res.status(500).json(formatErrorMessage('Error logging in', error));
    }
};

export const getLoggedInUser = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json(formatErrorMessage('Unauthorized'));
            return;
        }
        const { userId } = req.user as {userId: string, role: string};
        const user = await User.findOne({ userId }).select('-password');
        if (!user) {
            res.status(404).json(formatErrorMessage('User not found'));
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(500).json(formatErrorMessage('Error fetching user', error));
    }
};

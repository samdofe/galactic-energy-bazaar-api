import {User} from "../models/User";
import {Request, Response} from "express";
import {formatErrorMessage} from "../utils/utils";

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('-password -_id');
        res.json(users);
    } catch (error) {
        res.status(500).json(formatErrorMessage('Error retrieving users', error));
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const { userId, username, email, password, role, planetId } = req.body;
        const newUser = new User({ userId, username, email, password, role, planetId });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json(formatErrorMessage('Error creating user', error));
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const updatedUser = await User.findOneAndUpdate({userId}, req.body, { new: true });
        if (!updatedUser){
            res.status(404).json(formatErrorMessage('User not found'));
            return;
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json(formatErrorMessage('Error updating user', error) );
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const deletedUser = await User.findOneAndDelete({userId});
        if (!deletedUser){
            res.status(404).json(formatErrorMessage('User not found'));
            return;
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json(formatErrorMessage('Error deleting user', error));
    }
}
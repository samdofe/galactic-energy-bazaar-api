import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    userId: string;
    username: string;
    email: string;
    password: string;
    role: string;
    planetId: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
        userId: { type: String, required: true, unique: true },
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, required: true, enum: ['trader', 'admin', 'council'] },
        planetId: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
        collection: 'users'
    }
    );

export const User = mongoose.model<IUser>('User', UserSchema);

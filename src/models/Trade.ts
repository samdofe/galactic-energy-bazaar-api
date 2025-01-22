import mongoose, { Schema, Document } from 'mongoose';

export interface ITrade extends Document {
    tradeId: string;
    planetId: string;
    traderId: string;
    type: string; // Added 'type' field
    status: string;
    tradeDate: Date;
    zetaJoules: number;
    pricePerUnit: number;
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}

const TradeSchema: Schema = new Schema<ITrade>(
    {
        tradeId: { type: String, required: true, unique: true },
        planetId: { type: String, required: true },
        traderId: { type: String, required: true },
        type: { type: String, enum: ['BUY', 'SELL'], required: true }, // Added 'type' field
        status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'], required: true },
        tradeDate: { type: Date, required: true },
        zetaJoules: { type: Number, required: true },
        pricePerUnit: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt
        collection: 'trades',
    }
);

export default mongoose.model<ITrade>('Trade', TradeSchema);

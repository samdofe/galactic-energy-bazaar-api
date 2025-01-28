import mongoose, { Schema, type Document } from "mongoose"

export interface ITrade extends Document {
    tradeId: string
    planetId: string
    traderId: string
    type: string
    status: string
    tradeDate: string
    zetaJoules: number
    pricePerUnit: number
    totalPrice: number
    createdAt: string
    updatedAt: string
}

const TradeSchema: Schema = new Schema<ITrade>(
    {
        tradeId: { type: String, required: true, unique: true, index:true },
        planetId: { type: String, required: true },
        traderId: { type: String, required: true },
        type: { type: String, enum: ["BUY", "SELL"], required: true },
        status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED", "COMPLETED"], required: true },
        tradeDate: { type: String, required: true },
        zetaJoules: { type: Number, required: true },
        pricePerUnit: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        createdAt: { type: String, required: true },
        updatedAt: { type: String, required: true },
    },
    {
        collection: "trades",
    },
)

export default mongoose.model<ITrade>("Trade", TradeSchema)


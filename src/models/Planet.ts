import mongoose, { Schema, Document } from 'mongoose';

interface IImages {
    dayUrl: string;
    nightUrl: string;
    cloudsUrl: string;
}

interface IPlanet extends Document {
    planetId: string;
    name: string;
    description: string;
    language: string;
    currency: string;
    tradeVolume: number;
    riskFactors: string[];
    averageDailyConsumption: number;
    creditRating: string;
    images: IImages; // Add the images property
    createdAt: Date;
    updatedAt: Date;
}

const PlanetSchema: Schema = new Schema(
    {
        planetId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        description: { type: String },
        language: { type: String, required: true },
        currency: { type: String, required: true },
        tradeVolume: { type: Number, default: 0 },
        riskFactors: [{ type: String }],
        averageDailyConsumption: { type: Number, default: 0 },
        creditRating: { type: String, default: 'AAA' },
        images: {
            dayUrl: { type: String, required: true }, // Add the nested properties
            nightUrl: { type: String, default: '' },
            cloudsUrl: { type: String, default: '' }
        }
    },
    {
        timestamps: true,
        collection: 'planets'
    }
);

export default mongoose.model<IPlanet>('Planet', PlanetSchema);

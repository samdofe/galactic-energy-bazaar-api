import mongoose, {ConnectOptions} from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const {MONGO_BASE, MONGO_CLUSTER, MONGO_USER, MONGO_PASSWORD, MONGO_DDBB, MONGO_QUERY_PARAMS} = process.env;
const MONGO_URI = `${MONGO_BASE}${MONGO_USER}:${MONGO_PASSWORD}${MONGO_CLUSTER}${MONGO_DDBB}${MONGO_QUERY_PARAMS}`;

const clientOptions: ConnectOptions = {
    serverSelectionTimeoutMS: 5000, // Optional: Timeout for server selection
};

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI as string, clientOptions);
        console.log(`MongoDB connected successfully to:  ${mongoose.connection.name}`);
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};


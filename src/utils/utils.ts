import Trade from "../models/Trade";

export const formatErrorMessage = (errorDescription:string, error?: unknown)=>
    error && error instanceof Error
    ? { error: errorDescription, details: error.message }
    : { error: errorDescription, details: 'Unkown error' };

export const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
    return passwordRegex.test(password);
};

export const formatDate = (date: Date): string => {
    return date.toISOString().split(".")[0] + "Z";
}

export const  getDateString = (date: Date): string => {
    return date.toISOString().slice(0, 10).replace(/-/g, "");
}

export const generateNextTradeId = async (): Promise<string> => {
    const today = new Date();
    const dateString = getDateString(today);
    const prefix = `TRD-${dateString}-`;

    // Find the last trade of today
    const lastTrade = await Trade.findOne({
        tradeId: { $regex: `^${prefix}` },
    }).sort({ tradeId: -1 });

    let sequenceNumber = 1;
    if (lastTrade) {
        const lastSequenceNumber = Number.parseInt(lastTrade.tradeId.slice(-4), 10);
        sequenceNumber = lastSequenceNumber + 1;
    }

    return `${prefix}${sequenceNumber.toString().padStart(4, "0")}`;
}
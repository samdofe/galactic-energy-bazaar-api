declare namespace NodeJS {
    interface ProcessEnv {
        PORT?: string;
        MONGO_BASE:string;
        MONGO_DDBB:string;
        MONGO_CLUSTER:string;
        MONGO_QUERY_PARAMS: string;
        MONGO_USER:string;
        MONGO_PASSWORD:string;
        JWT_SECRET:string;
        JWT_EXPIRATION:string;
    }
}
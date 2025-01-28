import dotenvx from '@dotenvx/dotenvx';
dotenvx.config();

const DEFAULT_PORT = 8088;

const config = {
    port: parseInt(process.env.PORT || `${DEFAULT_PORT}`, 10),
    mode: process.env.MODE || 'PROD',
};

export default config;

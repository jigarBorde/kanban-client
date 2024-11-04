type EnvConfig = {
    googleClientId: string | number;
    googleSecret: string;
    backendURI: string;
    serverURI: string;
    appURI: string;
}

const _envVars: EnvConfig = {
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    googleSecret: import.meta.env.VITE_GOOGLE_SECRET || '',
    backendURI: import.meta.env.VITE_BACKEND_URI || '',
    serverURI: import.meta.env.VITE_SERVER_URI || '',
    appURI: import.meta.env.VITE_APP_URI || '',
};


function getEnvValue<K extends keyof EnvConfig>(key: K): EnvConfig[K] {
    const value = _envVars[key];

    if (value === undefined || value === '') {
        throw new Error(`Missing environment variable: ${String(key)}`);
    }

    return value;
}

const envConfig = {
    get: getEnvValue
} as const;

export default envConfig;

export type { EnvConfig };
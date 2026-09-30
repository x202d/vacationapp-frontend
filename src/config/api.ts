export interface AppConfig {
    apiUrl: string
}

declare global {
    interface Window {
        __APP_CONFIG__?: AppConfig
    }
}

const appConfig = window.__APP_CONFIG__

if (!appConfig?.apiUrl) {
    throw new Error('API URL is not configured')
}

export const API_URL = window.__APP_CONFIG__?.apiUrl ?? 'http://localhost:8000/api'

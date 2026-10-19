export interface AppConfig {
    apiUrl: string
    iobrokerUrl: string
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
export const IOBROKER_URL = appConfig.iobrokerUrl?.trim() ?? ''

export const IS_IOBROKER_CONFIGURED = IOBROKER_URL !== ''

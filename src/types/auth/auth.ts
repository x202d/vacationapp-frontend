export interface AuthUser {
    id: string
    username: string
    roles: string[]
}

export interface AuthState {
    token: string | null
    user: AuthUser | null
    isAuthenticated: boolean
}

export interface LoginRequest {
    username: string
    password: string
}

export interface LoginSuccessResponse {
    requiresTwoFactor: false
    token: string
    user: AuthUser
}

export interface LoginTwoFactorResponse {
    requiresTwoFactor: true
}

export type LoginResponse = LoginSuccessResponse | LoginTwoFactorResponse

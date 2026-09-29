import { API_URL } from '../config/api'

export async function api<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem('auth_token')

    const headers = new Headers(options?.headers)

    headers.set('Content-Type', 'application/json')

    if (token) {
        headers.set('Authorization', `Bearer ${token}`)
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    })

    if (!response.ok) {
        throw new Error(`API Fehler: ${response.status}`)
    }

    return response.json()
}

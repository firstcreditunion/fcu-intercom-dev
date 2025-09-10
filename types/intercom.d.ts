// TypeScript declarations for Intercom

declare global {
  interface Window {
    Intercom: (method: string, ...args: unknown[]) => void
    intercomSettings?: {
      api_base?: string
      app_id?: string
      [key: string]: unknown
    }
  }
}

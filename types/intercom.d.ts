// TypeScript declarations for Intercom

export interface IntercomSettings {
  api_base: string
  app_id: string
  user_id?: string
  name?: string
  email?: string
  created_at?: number
  user_hash?: string
  [key: string]: any
}

export interface IntercomBootOptions {
  api_base: string
  app_id: string
  user_id?: string
  name?: string
  email?: string
  created_at?: number
  user_hash?: string
  [key: string]: any
}

declare global {
  interface Window {
    Intercom: {
      (method: 'boot', options: IntercomBootOptions): void
      (method: 'shutdown'): void
      (method: 'update', options?: Partial<IntercomSettings>): void
      (method: 'hide'): void
      (method: 'show'): void
      (method: 'showMessages'): void
      (method: 'showNewMessage', message?: string): void
      (method: 'onHide', callback: () => void): void
      (method: 'onShow', callback: () => void): void
      (
        method: 'onUnreadCountChanged',
        callback: (unreadCount: number) => void
      ): void
      (method: string, ...args: any[]): void
      c?: (args: any) => void
      q?: any[]
    }
    intercomSettings: IntercomSettings
  }
}

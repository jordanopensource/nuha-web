// Authentication types
declare module '#auth-utils' {
  interface User {
    id: string
    email: string
    name?: string
    avatar?: string
    githubId?: string
    username?: string
    provider: 'email' | 'github'
    verified?: boolean
  }

  interface UserSession {
    user: User
    loggedInAt: Date
  }

  interface SecureSessionData {
    magicToken?: string
    githubAccessToken?: string
    refreshToken?: string
  }
}

export {}

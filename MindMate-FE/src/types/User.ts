// src/types/User.ts
export interface User {
  id: string
  email: string
  is_verified: boolean
  first_name: string // NOT optional
  access_token?: string
  refresh_token?: string
}

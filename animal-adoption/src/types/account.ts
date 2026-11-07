export interface Account {
  name: string
  email: string
  password: string
  description?: string
  profileImageUrl?: string
  coverImageUrl?: string
  phone?: string
  notes?: string
  latitude?: number
  longitude?: number
  banned: boolean
}

export interface Account {
  id: number
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

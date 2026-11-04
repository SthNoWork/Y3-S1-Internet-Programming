export interface Account {
  name: string
  description: string
  profileImageUrl: string
  coverImageUrl: string
  email: string
  phone: string
  notes?: string
  locationName: string
  latitude: number
  longitude: number
  banned: boolean
}

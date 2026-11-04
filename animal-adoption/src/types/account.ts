export interface Account {
  id: number
  name: string
  description: string
  coverImageUrl: string
  email: string
  phone: string
  notes?: string
  locationName: string
  latitude: number
  longitude: number
  banned: boolean
}

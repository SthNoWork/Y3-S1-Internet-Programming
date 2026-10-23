export type Species = 'dog' | 'cat' | 'other'
export type AnimalStatus = 'available' | 'adopted'

export interface User {
  id: number
  name: string
  profilePictureUrl: string
  phone: string
  contactNote: string
  locationName: string
  latitude: number
  longitude: number
  role: 'poster' | 'admin'
  banned: boolean
}

export interface Tag {
  id: number
  name: string
}

export interface Animal {
  id: number
  userId: number
  name: string
  species: Species
  details: string
  requirements: string
  imageUrl: string
  status: AnimalStatus
  tagIds: number[]
  createdAt: string
}

export interface Report {
  id: number
  userId: number // the reported account
  reason: string
  createdAt: string
  status: 'open' | 'reviewed'
}

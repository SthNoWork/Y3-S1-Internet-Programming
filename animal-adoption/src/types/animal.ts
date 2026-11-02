export interface Category {
  id: number
  name: string
}

export interface Species {
  id: number
  name: string
}

export interface Animal {
  id: number
  name: string
  age: number
  gender: 'male' | 'female'
  speciesId : number
  status: 'available' | 'pending' | 'adopted'
  description: string
  requirement: string
  thumbnailUrl: string
  imageUrls: string[]
  categoryIds: number[]
  isVaccinated: boolean
  isNeutered: boolean
}

export interface User {
  id: string
  email: string
  name?: string
  credits: number
  created_at: string
}

export interface Thumbnail {
  id: string
  user_id: string
  title: string
  original_image_url: string
  created_at: string
  updated_at: string
}

export interface Variation {
  id: string
  thumbnail_id: string
  variant_number: number
  image_url: string
  text_hook: string
  style_applied: string
  ctr_score: number
  created_at: string
}

export interface Hook {
  id: string
  category: string
  text: string
  viral_score: number
}

export interface GenerateResponse {
  success: boolean
  data?: any
  error?: string
}

export interface CTRScoreRequest {
  text: string
  style: string
  imageUrl: string
}

export interface CTRScoreResponse {
  score: number
  factors: {
    textImpact: number
    styleImpact: number
    contrast: number
    emotionalTrigger: number
  }
}

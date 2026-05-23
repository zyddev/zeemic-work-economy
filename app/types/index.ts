export interface Skill {
  id: string
  title: string
  seller: string
  location: string
  category: string
  delivery: string
  price: number | null
  unit: string
  rating: number
  reviews: number
  blurb: string
  available: string
  motif: number
  tags: string[]
  isBusiness?: boolean
}

export interface Recruiter {
  id: string
  name: string
  title: string
  business: string
  location: string
  specialties: string[]
  placements: number
  rating: number
  reviews: number
  response: string
  languages: string[]
  quote: string
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary: string
  deadline: string
  recruiter: string
  posted: string
  externalLink?: boolean
  applicationUrl?: string
  businessId?: string
}

export interface Business {
  id: string
  slug: string
  name: string
  tag: string
  location: string
  members: number
  listings: number
  rating: number
  website?: string
  description?: string
  shortDescription?: string
}

export interface Lead {
  id: string
  type: 'booking' | 'rfq' | 'lead' | 'brochure' | 'proposal'
  status: 'new' | 'viewed' | 'responded' | 'accepted' | 'declined' | 'converted' | 'archived'
  skill: string
  fromName: string
  contact?: string
  email?: string
  phone?: string
  when: string
  dates?: string
  budget?: string
  timeline?: string
  message?: string
}

export interface Notification {
  id: string
  type: string
  title: string
  body: string
  time: string
  unread: boolean
  actor: string
}

export interface SidebarItem {
  id?: string
  label?: string
  icon?: string
  count?: number
  section?: string
  indent?: boolean
}

export type AccountContext = 'user' | 'business'

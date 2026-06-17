// ---- Rich text (TipTap-compatible) ----
export type JSONContent = {
  type: string
  content?: JSONContent[]
  text?: string
  attrs?: Record<string, unknown>
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>
}

export function toJSONContent(text: string): JSONContent {
  return { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text }] }] }
}

export function fromJSONContent(content: JSONContent | string | null | undefined): string {
  if (!content) return ''
  if (typeof content === 'string') return content
  if ((content as JSONContent).text) return (content as JSONContent).text as string
  return ((content as JSONContent).content ?? []).map(fromJSONContent).join('\n').trim()
}

// ---- Nested job application types ----
export interface WorkExperience {
  id: string
  company: string
  position: string
  location: string
  employmentType?: string
  startDate: string
  endDate: string
  description: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  fieldOfStudy: string
  grade?: string
  startDate: string
  endDate: string
  description: string
}

export interface Certification {
  id: string
  title: string
  issuer: string
  issueDate: string
  expirationDate: string
  credentialUrl: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  date: string
  recognitionLevel?: string
}

// ---- Rating types ----
export interface RatingRollup {
  listingId: string
  weightedAvg: number
  totalRatings: number
  totalFeedback: number
  star5Pct: number
  star4Pct: number
  star3Pct: number
  star2Pct: number
  star1Pct: number
  pctLedToRealJob: number
  pctDescriptionMatch: number
  pctLocationCorrect: number
}

export interface MyRating {
  stars: number
}

// ---- Job types ----
export interface JobIType {
  id?: string
  title: string
  city: string
  country: string
  deadline: string
  category?: string
  industry?: string
  jobType?: string
  verified?: boolean
  description: JSONContent
  postType: 'Job'
  applicationEmail?: string
  applicationUrl?: string
  contactMethod: string | null
  phone: string
  requirements: string
  benefits: string
  maxSalary: number
  minSalary: number
  currency: string
  yearsOfExperience: number
  educationRequirement: string
  additionalInformation: JSONContent
  createdAt: string
  updatedAt: string
  businessId?: string
  JobApplication?: { id: string }[]
}

export interface JobFull extends JobIType {
  user: { firstName: string; lastName: string; profile: { username: string; profilePicture: string } }
  business: { id: string; name: string; slug: string; logoUrl: string }
  job_view: string
  applicationCount?: number
  rating?: RatingRollup | null
}

// ---- Application types ----
export interface JobApplicationInfo {
  id?: string
  summary: string
  languages: string[]
  skills: string[]
  workExperience: WorkExperience[]
  education: Education[]
  certifications: Certification[]
  achievements: Achievement[]
}

export interface JobApplicationDraft {
  applicationInfo: JobApplicationInfo
  selectedSkills: { id: string; name: string; value: string }[]
  lastSavedAt: number
  mode: 'create' | 'update'
}

// ---- User business membership ----
export interface UserBusinessMembership {
  business: { id: string; name: string; slug: string }
  role: string
}

// ---- Skill ----
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

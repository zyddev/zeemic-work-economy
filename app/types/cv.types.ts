import type { WorkExperience, Education, Certification, Achievement } from '~/types'

export interface CVExtractedData {
  summary?: string
  skills?: string[]
  workExperience?: WorkExperience[]
  education?: Education[]
  certifications?: Certification[]
  achievements?: Achievement[]
}

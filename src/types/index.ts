export type UserRole = 'student' | 'recruiter' | 'sponsor' | 'admin'
export type ProjectStatus = 'draft' | 'recruiting' | 'in_progress' | 'completed' | 'archived'
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected'
export type SprintStatus = 'planned' | 'active' | 'completed'
export type SubscriptionTier = 'free' | 'premium'

export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: UserRole
  bio?: string
  skills: string[]
  location?: string
  github_url?: string
  linkedin_url?: string
  portfolio_url?: string
  reputation_score: number
  subscription_tier: SubscriptionTier
  razorpay_customer_id?: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  founder_id: string
  title: string
  description: string
  tags: string[]
  required_skills: string[]
  team_size: number
  status: ProjectStatus
  blueprint?: ProjectBlueprint
  equity_agreement?: string
  github_url?: string
  figma_url?: string
  demo_url?: string
  thumbnail_url?: string
  sponsor_id?: string
  is_sponsored: boolean
  created_at: string
  updated_at: string
  founder?: Profile
  members?: ProjectMember[]
  sprints?: Sprint[]
}

export interface ProjectBlueprint {
  overview: string
  tech_stack: string[]
  milestones: string[]
  required_roles: { role: string; skills: string[]; equity: number }[]
  estimated_weeks: number
}

export interface ProjectMember {
  id: string
  project_id: string
  user_id: string
  role: string
  equity_percentage: number
  joined_at: string
  profile?: Profile
}

export interface Application {
  id: string
  project_id: string
  applicant_id: string
  role: string
  cover_note: string
  status: ApplicationStatus
  created_at: string
  project?: Project
  applicant?: Profile
}

export interface Sprint {
  id: string
  project_id: string
  title: string
  goal: string
  week_number: number
  status: SprintStatus
  starts_at: string
  ends_at: string
  tasks: SprintTask[]
  ai_feedback?: string
  created_at: string
}

export interface SprintTask {
  id: string
  sprint_id: string
  title: string
  assigned_to?: string
  completed: boolean
  due_date?: string
}

export interface SkillBadge {
  id: string
  user_id: string
  project_id: string
  badge_name: string
  skill: string
  issued_at: string
  project?: Project
}

export interface SponsorQuest {
  id: string
  sponsor_id: string
  title: string
  description: string
  prize_amount: number
  deadline: string
  required_skills: string[]
  submissions: number
  is_active: boolean
  created_at: string
  sponsor?: Profile
}

export interface Subscription {
  id: string
  user_id: string
  razorpay_subscription_id: string
  plan_id: string
  status: string
  current_period_start: string
  current_period_end: string
  created_at: string
}

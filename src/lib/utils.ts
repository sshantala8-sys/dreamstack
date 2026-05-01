import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const SKILL_OPTIONS = [
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'Python', 'FastAPI',
  'Node.js', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'AWS', 'GCP',
  'Figma', 'UI/UX Design', 'Product Management', 'Machine Learning',
  'Data Science', 'DevOps', 'Blockchain', 'Mobile (React Native)',
  'Marketing', 'Content Writing', 'Video Editing', 'Go', 'Rust', 'Java',
]

export const REPUTATION_TIERS = [
  { min: 0, max: 100, label: 'Newcomer', color: 'text-gray-500' },
  { min: 100, max: 300, label: 'Builder', color: 'text-blue-500' },
  { min: 300, max: 600, label: 'Contributor', color: 'text-green-500' },
  { min: 600, max: 1000, label: 'Expert', color: 'text-purple-500' },
  { min: 1000, max: Infinity, label: 'Legend', color: 'text-yellow-500' },
]

export function getReputationTier(score: number) {
  return REPUTATION_TIERS.find(t => score >= t.min && score < t.max) || REPUTATION_TIERS[0]
}

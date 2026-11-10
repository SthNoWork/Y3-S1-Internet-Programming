// src/utils/date.ts

export function formatAge(birthDateStr?: string): string {
  if (!birthDateStr) return 'Age unknown'
  const birth = new Date(birthDateStr)
  if (isNaN(birth.getTime())) return 'Age unknown'

  const now = new Date()
  const diffMs = now.getTime() - birth.getTime()
  if (diffMs < 0) return 'Just born'

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 7) {
    return diffDays <= 1 ? '1 day old' : `${diffDays} days old`
  }
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return weeks <= 1 ? '1 week old' : `${weeks} weeks old`
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30.4375)
    return months <= 1 ? '1 month old' : `${months} months old`
  }
  const years = Math.floor(diffDays / 365.25)
  return years <= 1 ? '1 year old' : `${years} years old`
}

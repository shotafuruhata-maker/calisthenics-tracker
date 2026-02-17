export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural || singular + 's')
}

export function formatNumber(num: number): string {
  return num.toLocaleString()
}

export function getDifficultyLabel(difficulty: number): string {
  switch (difficulty) {
    case 1: return 'Beginner'
    case 2: return 'Intermediate'
    case 3: return 'Advanced'
    default: return 'Unknown'
  }
}

export function getDifficultyColor(difficulty: number): string {
  switch (difficulty) {
    case 1: return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
    case 2: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
    case 3: return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
    default: return 'bg-muted text-muted-foreground'
  }
}

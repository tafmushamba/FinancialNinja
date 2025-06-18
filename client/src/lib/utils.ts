import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2
  }).format(amount);
}

export function calculatePercentage(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function getProgressColor(percentage: number): string {
  if (percentage < 30) return 'text-neon-red';
  if (percentage < 70) return 'text-neon-yellow';
  return 'text-neon-green';
}

export function formatTimeRemaining(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

export function getAccentColorClass(accentColor: string, type: 'text' | 'bg' | 'border' | 'hover-bg' | 'hover-border'): string {
  const colorMap: Record<string, Record<string, string>> = {
    'neon-green': {
      text: 'text-neon-green',
      bg: 'bg-neon-green',
      border: 'border-neon-green',
      'hover-bg': 'hover:bg-neon-green/90',
      'hover-border': 'hover:border-neon-green'
    },
    'neon-cyan': {
      text: 'text-neon-cyan',
      bg: 'bg-neon-cyan',
      border: 'border-neon-cyan',
      'hover-bg': 'hover:bg-neon-cyan/90',
      'hover-border': 'hover:border-neon-cyan'
    },
    'neon-purple': {
      text: 'text-neon-purple',
      bg: 'bg-neon-purple',
      border: 'border-neon-purple',
      'hover-bg': 'hover:bg-neon-purple/90',
      'hover-border': 'hover:border-neon-purple'
    },
    'neon-pink': {
      text: 'text-neon-pink',
      bg: 'bg-neon-pink',
      border: 'border-neon-pink',
      'hover-bg': 'hover:bg-neon-pink/90',
      'hover-border': 'hover:border-neon-pink'
    },
    'neon-yellow': {
      text: 'text-neon-yellow',
      bg: 'bg-neon-yellow',
      border: 'border-neon-yellow',
      'hover-bg': 'hover:bg-neon-yellow/90',
      'hover-border': 'hover:border-neon-yellow'
    },
    'neon-red': {
      text: 'text-neon-red',
      bg: 'bg-neon-red',
      border: 'border-neon-red',
      'hover-bg': 'hover:bg-neon-red/90',
      'hover-border': 'hover:border-neon-red'
    }
  };

  // Default to neon-green if the color isn't found
  const defaultColor = 'neon-green';
  const color = colorMap[accentColor] || colorMap[defaultColor];
  return color[type];
}

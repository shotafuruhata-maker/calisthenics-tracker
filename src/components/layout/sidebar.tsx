'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Dumbbell,
  Target,
  ClipboardList,
  Zap,
  MapPin,
  Users,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/exercises', label: 'Exercises', icon: Dumbbell },
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/log', label: 'Log Reps', icon: ClipboardList },
  { href: '/workout', label: 'Workout', icon: Zap },
  { href: '/cardio', label: 'Cardio', icon: MapPin },
  { href: '/social', label: 'Social', icon: Users },
  { href: '/profile', label: 'Profile', icon: User },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-gray-950 dark:bg-gray-900 text-white">
      <div className="flex items-center h-16 px-6 border-b border-gray-800 dark:border-gray-700">
        <Dumbbell className="h-8 w-8 text-emerald-400" />
        <span className="ml-3 text-xl font-bold">CaliTracker</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

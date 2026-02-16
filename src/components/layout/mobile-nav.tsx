'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Dumbbell,
  ClipboardList,
  Zap,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const mobileNavItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/exercises', label: 'Exercises', icon: Dumbbell },
  { href: '/log', label: 'Log', icon: ClipboardList },
  { href: '/workout', label: 'Workout', icon: Zap },
  { href: '/social', label: 'Social', icon: Users },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-50">
      <div className="flex items-center justify-around h-16">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full text-xs',
                isActive ? 'text-emerald-600' : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

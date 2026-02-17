'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Dumbbell,
  ClipboardList,
  Zap,
  MoreHorizontal,
  Target,
  MapPin,
  Users,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

const mobileNavItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/exercises', label: 'Exercises', icon: Dumbbell },
  { href: '/log', label: 'Log', icon: ClipboardList },
  { href: '/workout', label: 'Workout', icon: Zap },
]

const moreLinks = [
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/cardio', label: 'Cardio', icon: MapPin },
  { href: '/social', label: 'Social', icon: Users },
  { href: '/profile', label: 'Profile', icon: User },
]

export function MobileNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  const isMoreActive = moreLinks.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + '/')
  )

  return (
    <>
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
          <button
            onClick={() => setMoreOpen(true)}
            className={cn(
              'flex flex-col items-center justify-center w-full h-full text-xs',
              isMoreActive ? 'text-emerald-600' : 'text-muted-foreground'
            )}
          >
            <MoreHorizontal className="h-5 w-5 mb-1" />
            More
          </button>
        </div>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="rounded-t-xl">
          <SheetHeader>
            <SheetTitle>More</SheetTitle>
          </SheetHeader>
          <nav className="grid grid-cols-2 gap-3 py-4">
            {moreLinks.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                      : 'hover:bg-muted text-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}

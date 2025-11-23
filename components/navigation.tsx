"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Gift, TrendingUp, Gamepad2, BarChart3 } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto max-w-md px-4 py-2">
        <div className="flex justify-around items-center">
          <Link
            href="/"
            className={`flex flex-col items-center py-3 px-4 rounded-lg transition-colors ${
              isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Gift className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Rewards</span>
          </Link>
          <Link
            href="/airdrop"
            className={`flex flex-col items-center py-3 px-4 rounded-lg transition-colors ${
              isActive('/airdrop') ? 'text-secondary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <TrendingUp className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Airdrop</span>
          </Link>
          <Link
            href="/game"
            className={`flex flex-col items-center py-3 px-4 rounded-lg transition-colors ${
              isActive('/game') ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Gamepad2 className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Game</span>
          </Link>
          <Link
            href="/leaderboard"
            className={`flex flex-col items-center py-3 px-4 rounded-lg transition-colors ${
              isActive('/leaderboard') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <BarChart3 className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Rank</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}

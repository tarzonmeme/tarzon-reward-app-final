"use client"

import { useState, useEffect } from 'react'
import { BarChart3, Trophy, Medal, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/navigation'

interface LeaderboardEntry {
  rank: number
  playerName: string
  gorillas: number
  score: number
  reward: number
  isCurrentUser?: boolean
}

interface UserStats {
  rank: number
  gorillas: number
  score: number
  totalEarned: number
  gamesPlayed: number
}

export default function LeaderboardPage() {
  const [currentUserStats, setCurrentUserStats] = useState<UserStats>({
    rank: 847,
    gorillas: 12,
    score: 450,
    totalEarned: 0,
    gamesPlayed: 3,
  })

  const [leaderboardData] = useState<LeaderboardEntry[]>([
    { rank: 1, playerName: 'GorillaMaster', gorillas: 245, score: 8750, reward: 500 },
    { rank: 2, playerName: 'JunglePro', gorillas: 198, score: 7120, reward: 300 },
    { rank: 3, playerName: 'RescueHero', gorillas: 156, score: 5640, reward: 150 },
    { rank: 4, playerName: 'SavageKing', gorillas: 142, score: 5105, reward: 100 },
    { rank: 5, playerName: 'TarzonChampion', gorillas: 128, score: 4610, reward: 75 },
    { rank: 6, playerName: 'FlameWalker', gorillas: 115, score: 4140, reward: 50 },
    { rank: 7, playerName: 'WildRanger', gorillas: 102, score: 3680, reward: 40 },
    { rank: 8, playerName: 'ForestGuard', gorillas: 95, score: 3420, reward: 35 },
    { rank: 9, playerName: 'BeastTamer', gorillas: 87, score: 3135, reward: 30 },
    { rank: 10, playerName: 'JungleKing', gorillas: 78, score: 2810, reward: 25 },
  ])

  const [timeRemaining, setTimeRemaining] = useState('23:45:32')
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'stats'>('today')

  // Update countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const diff = tomorrow.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeRemaining(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const getRankMedal = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return null
  }

  const getRewardColor = (rank: number) => {
    if (rank <= 10) return 'text-accent'
    if (rank <= 25) return 'text-primary'
    if (rank <= 50) return 'text-secondary'
    return 'text-muted-foreground'
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-md px-4 py-4">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Rankings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Global leaderboard</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-md px-4 py-6 space-y-6">
        {/* Your Ranking Card */}
        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-accent/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Your Position</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              <div className="p-3 rounded-lg bg-background/50 text-center">
                <p className="text-xs text-muted-foreground mb-1">Rank</p>
                <p className="text-2xl font-bold text-accent">#{currentUserStats.rank}</p>
              </div>
              <div className="p-3 rounded-lg bg-background/50 text-center">
                <p className="text-xs text-muted-foreground mb-1">Gorillas</p>
                <p className="text-2xl font-bold text-primary">{currentUserStats.gorillas}</p>
              </div>
              <div className="p-3 rounded-lg bg-background/50 text-center">
                <p className="text-xs text-muted-foreground mb-1">Score</p>
                <p className="text-2xl font-bold">{currentUserStats.score}</p>
              </div>
              <div className="p-3 rounded-lg bg-background/50 text-center">
                <p className="text-xs text-muted-foreground mb-1">Earned</p>
                <p className="text-2xl font-bold text-secondary">{currentUserStats.totalEarned}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border">
              <div>
                <p className="text-sm text-muted-foreground">Games Played</p>
                <p className="font-semibold">{currentUserStats.gamesPlayed}</p>
              </div>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        {/* Session Info */}
        <Card className="border-accent/30 bg-accent/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Session Ends In</p>
                <p className="text-2xl font-mono font-bold text-accent">{timeRemaining}</p>
              </div>
              <Trophy className="w-8 h-8 text-accent opacity-50" />
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="flex gap-2">
          <Button
            onClick={() => setActiveTab('today')}
            variant={activeTab === 'today' ? 'default' : 'outline'}
            className="flex-1"
            size="sm"
          >
            Today
          </Button>
          <Button
            onClick={() => setActiveTab('week')}
            variant={activeTab === 'week' ? 'default' : 'outline'}
            className="flex-1"
            size="sm"
          >
            This Week
          </Button>
          <Button
            onClick={() => setActiveTab('stats')}
            variant={activeTab === 'stats' ? 'default' : 'outline'}
            className="flex-1"
            size="sm"
          >
            Stats
          </Button>
        </div>

        {/* Leaderboard Table */}
        {(activeTab === 'today' || activeTab === 'week') && (
          <Card className="border-muted/30">
            <CardHeader>
              <CardTitle className="text-base">
                {activeTab === 'today' ? "Today's Top 10" : "This Week's Top 10"}
              </CardTitle>
              <CardDescription>Rewards for Top 50 Players</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboardData.map(entry => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      entry.rank <= 10
                        ? 'bg-accent/10 border border-accent/20'
                        : 'bg-muted/10 hover:bg-muted/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 text-center flex-shrink-0">
                        {getRankMedal(entry.rank) || (
                          <span className="font-bold text-muted-foreground">#{entry.rank}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{entry.playerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {entry.gorillas} gorillas • {entry.score} pts
                        </p>
                      </div>
                    </div>
                    <div className={`text-right flex-shrink-0 ${getRewardColor(entry.rank)}`}>
                      <p className="text-sm font-bold">{entry.reward}</p>
                      <p className="text-xs">$TARZON</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              <Button variant="outline" className="w-full mt-4" size="sm">
                View All Top 50
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            {/* Stats Cards */}
            <Card className="border-muted/30">
              <CardHeader>
                <CardTitle className="text-base">Your Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                  <span className="text-sm text-muted-foreground">Total Games</span>
                  <span className="font-bold">{currentUserStats.gamesPlayed}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                  <span className="text-sm text-muted-foreground">Total Gorillas Rescued</span>
                  <span className="font-bold text-primary">{currentUserStats.gorillas}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                  <span className="text-sm text-muted-foreground">Average per Game</span>
                  <span className="font-bold">
                    {(currentUserStats.gorillas / currentUserStats.gamesPlayed).toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                  <span className="text-sm text-muted-foreground">Best Score</span>
                  <span className="font-bold text-accent">{currentUserStats.score}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                  <span className="text-sm text-muted-foreground">Lifetime Earnings</span>
                  <span className="font-bold text-secondary">{currentUserStats.totalEarned} $TARZON</span>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-muted/30">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Medal className="w-4 h-4" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="font-semibold text-sm mb-1">First Game</p>
                  <p className="text-xs text-muted-foreground">Completed your first jungle rescue</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/20">
                  <p className="font-semibold text-sm mb-1">Gorilla Guardian</p>
                  <p className="text-xs text-muted-foreground">Rescue 50 gorillas • Locked</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/20">
                  <p className="font-semibold text-sm mb-1">Top 100</p>
                  <p className="text-xs text-muted-foreground">Reach top 100 on leaderboard • Locked</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Prize Pool Info */}
        <Card className="border-secondary/30 bg-secondary/5">
          <CardHeader>
            <CardTitle className="text-base">Today's Prize Pool</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Pool</span>
              <span className="font-bold text-accent">50,000 $TARZON</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Top 10 Share</span>
              <span className="font-bold">80% (40,000)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Top 11-50 Share</span>
              <span className="font-bold">20% (10,000)</span>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Navigation */}
      <Navigation />
    </div>
  )
}

"use client"

import { useState, useEffect } from 'react'
import { Flame, Play, XCircle, AlertCircle, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Navigation from '@/components/navigation'

interface GameSession {
  isPlaying: boolean
  gorillasRescued: number
  score: number
  roundNumber: number
  sessionStartTime: number | null
  sessionEndTime: number | null
}

export default function GamePage() {
  const [gameState, setGameState] = useState<GameSession>({
    isPlaying: false,
    gorillasRescued: 0,
    score: 0,
    roundNumber: 1,
    sessionStartTime: null,
    sessionEndTime: null,
  })

  const [gameBalance, setGameBalance] = useState(1)
  const [showGameScreen, setShowGameScreen] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState('24:00:00')
  const [gameTimer, setGameTimer] = useState(0)
  const [confirmExit, setConfirmExit] = useState(false)

  // Load game state
  useEffect(() => {
    const saved = localStorage.getItem('tarzon_game')
    if (saved) {
      const state = JSON.parse(saved)
      setGameState(state)
    }

    const user = localStorage.getItem('tarzon_user')
    if (user) {
      const userData = JSON.parse(user)
      setGameBalance(userData.gameBalance || 0)
    }
  }, [])

  // Global game timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
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

    return () => clearInterval(timer)
  }, [])

  // Game play timer
  useEffect(() => {
    if (!gameState.isPlaying) return

    const timer = setInterval(() => {
      setGameTimer(prev => prev + 1)
    }, 100)

    return () => clearInterval(timer)
  }, [gameState.isPlaying])

  const handleStartGame = () => {
    if (gameBalance < 1) {
      alert('Not enough $TARZON. You need 1 $TARZON to play.')
      return
    }

    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      gorillasRescued: 0,
      score: 0,
      sessionStartTime: Date.now(),
      roundNumber: prev.roundNumber + 1,
    }))

    setGameTimer(0)
    setShowGameScreen(true)
    setGameBalance(prev => prev - 1)
  }

  const handleRescueGorilla = () => {
    setGameState(prev => ({
      ...prev,
      gorillasRescued: prev.gorillasRescued + 1,
      score: prev.score + Math.floor(Math.random() * 50 + 25),
    }))
  }

  const handleEndGame = () => {
    if (!gameState.isPlaying && gameState.gorillasRescued === 0) {
      setShowGameScreen(false)
      return
    }

    if (gameState.isPlaying) {
      setConfirmExit(true)
      return
    }

    setShowGameScreen(false)
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      sessionEndTime: Date.now(),
    }))

    // Save game state
    localStorage.setItem('tarzon_game', JSON.stringify(gameState))
  }

  const handleConfirmEnd = () => {
    setConfirmExit(false)
    setShowGameScreen(false)
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      sessionEndTime: Date.now(),
    }))

    // Save game state
    localStorage.setItem('tarzon_game', JSON.stringify(gameState))
  }

  // Game Screen Component
  if (showGameScreen && gameState.isPlaying) {
    return (
      <div className="fixed inset-0 bg-background z-50 overflow-hidden">
        {/* Game Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <p className="text-sm text-muted-foreground">Gorillas Rescued</p>
            <p className="text-2xl font-bold text-accent">{gameState.gorillasRescued}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="text-2xl font-bold text-primary">{gameState.score}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Time</p>
            <p className="text-lg font-mono font-bold">{(gameTimer / 10).toFixed(1)}s</p>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 via-background to-secondary/5 p-4 relative overflow-hidden">
          {/* Jungle Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 to-transparent"></div>
          </div>

          {/* Game Content */}
          <div className="relative z-10 w-full max-w-xs h-96 flex flex-col items-center justify-center gap-8">
            {/* Burning Jungle Visual */}
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-b from-primary/30 to-secondary/30 flex items-center justify-center animate-pulse">
              <Flame className="w-16 h-16 text-secondary animate-bounce" />
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-accent/50 animate-spin" style={{ animationDuration: '4s' }}></div>
            </div>

            {/* Gorilla in Danger */}
            <div className="text-center">
              <p className="text-lg font-bold mb-4">Gorilla in Danger!</p>
              <div className="text-6xl mb-4">🦍</div>
              <p className="text-sm text-muted-foreground">Tap rapidly to rescue</p>
            </div>

            {/* Rescue Button */}
            <Button
              onClick={handleRescueGorilla}
              size="lg"
              className="w-full py-8 text-xl font-bold bg-accent hover:bg-accent/90 animate-pulse"
            >
              RESCUE GORILLA
            </Button>

            {/* Exit Button */}
            <Button
              onClick={handleEndGame}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Exit Game
            </Button>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {confirmExit && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-xs">
              <CardHeader>
                <CardTitle className="text-center">End Game Session?</CardTitle>
                <CardDescription className="text-center">
                  You have rescued {gameState.gorillasRescued} gorillas with {gameState.score} points
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-center text-muted-foreground">
                  Your entry fee of 1 $TARZON will not be refunded.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setConfirmExit(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Continue Playing
                  </Button>
                  <Button
                    onClick={handleConfirmEnd}
                    className="flex-1 bg-destructive hover:bg-destructive/90"
                  >
                    End Game
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    )
  }

  // Main Game Lobby
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-md px-4 py-4">
          <h1 className="text-2xl font-bold text-accent flex items-center gap-2">
            <Flame className="w-6 h-6" />
            Jungle Rescue
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Save gorillas, win rewards</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-md px-4 py-6 space-y-6">
        {/* Game Status */}
        <Card className="border-accent/30 bg-gradient-to-br from-accent/10 to-primary/5">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Save the Gorillas</CardTitle>
            <CardDescription>Escape the burning jungle & rescue gorillas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Session Info */}
            <div className="p-4 rounded-lg bg-background/50 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Your Balance</span>
                <span className="text-lg font-bold text-accent">{gameBalance} $TARZON</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Entry Fee</span>
                <span className="text-lg font-bold text-destructive">1 $TARZON</span>
              </div>
              <div className="h-px bg-border"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Session Active</span>
                <span className="text-lg font-bold text-accent">{timeRemaining}</span>
              </div>
            </div>

            {/* Your Stats */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-lg bg-background/50">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Gorillas Saved</p>
                <p className="text-2xl font-bold text-accent">{gameState.gorillasRescued}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Best Score</p>
                <p className="text-2xl font-bold text-primary">{gameState.score}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Games Played</p>
                <p className="text-2xl font-bold">{gameState.roundNumber}</p>
              </div>
            </div>

            {/* Start Game Button */}
            <Button
              onClick={handleStartGame}
              disabled={gameBalance < 1}
              className="w-full py-6 text-lg font-bold bg-accent hover:bg-accent/90 disabled:opacity-50"
            >
              <Play className="w-5 h-5 mr-2" />
              {gameBalance < 1 ? 'Not Enough Tokens' : 'Start Game'}
            </Button>
          </CardContent>
        </Card>

        {/* How to Play */}
        <Card className="border-muted/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              How to Play
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                1
              </div>
              <div>
                <p className="font-semibold text-sm">Pay Entry Fee</p>
                <p className="text-xs text-muted-foreground">1 $TARZON to participate</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                2
              </div>
              <div>
                <p className="font-semibold text-sm">Rescue Gorillas</p>
                <p className="text-xs text-muted-foreground">Tap to rescue gorillas from the burning jungle</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                3
              </div>
              <div>
                <p className="font-semibold text-sm">Check Leaderboard</p>
                <p className="text-xs text-muted-foreground">Top 50 players earn rewards</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                4
              </div>
              <div>
                <p className="font-semibold text-sm">Earn Rewards</p>
                <p className="text-xs text-muted-foreground">Daily 24-hour rounds with prize pools</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard Preview */}
        <Card className="border-primary/30">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Today's Top Players
              </CardTitle>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <a href="/leaderboard">View All</a>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { rank: 1, player: 'GorillaMaster', gorillas: 245, reward: '500 $TARZON' },
                { rank: 2, player: 'JunglePro', gorillas: 198, reward: '300 $TARZON' },
                { rank: 3, player: 'RescueHero', gorillas: 156, reward: '150 $TARZON' },
              ].map(item => (
                <div key={item.rank} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="font-bold text-accent w-6">#{item.rank}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.player}</p>
                      <p className="text-xs text-muted-foreground">{item.gorillas} gorillas</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-accent">{item.reward}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Navigation */}
      <Navigation />
    </div>
  )
}

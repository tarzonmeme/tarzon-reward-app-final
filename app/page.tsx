"use client"

import { useState, useEffect } from 'react'
import { Flame, Gift, Gamepad2, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Navigation from '@/components/navigation'
import AuthModal from '@/components/auth-modal'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(true)
  const [userBalance, setUserBalance] = useState(0)

  useEffect(() => {
    const checkAuth = localStorage.getItem('tarzon_user')
    if (checkAuth) {
      setIsAuthenticated(true)
      setShowAuthModal(false)
    }
  }, [])

  if (!isAuthenticated) {
    return <AuthModal onAuthSuccess={() => {
      setIsAuthenticated(true)
      setShowAuthModal(false)
    }} />
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-md px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">TARZON</h1>
            <p className="text-xs text-muted-foreground">Worldcoin Chain</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Balance</p>
            <p className="text-2xl font-bold text-accent">{userBalance.toFixed(2)}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-md px-4 py-6 space-y-6">
        {/* Featured Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Claim Rewards */}
          <Card className="border-primary/20 bg-card hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Gift className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-sm mb-1">Claim Rewards</h3>
              <p className="text-xs text-muted-foreground">+5 $TARZON</p>
              <p className="text-xs text-muted-foreground mt-2">Every 6 hours</p>
            </CardContent>
          </Card>

          {/* Airdrop */}
          <Card className="border-secondary/20 bg-card hover:border-secondary/50 transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
              </div>
              <h3 className="font-semibold text-sm mb-1">Airdrop</h3>
              <p className="text-xs text-muted-foreground">+5 $TARZON</p>
              <p className="text-xs text-muted-foreground mt-2">React & Claim</p>
            </CardContent>
          </Card>

          {/* Jungle Game */}
          <Card className="col-span-2 border-accent/20 bg-card hover:border-accent/50 transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Flame className="w-6 h-6 text-accent" />
                </div>
              </div>
              <h3 className="font-semibold text-sm mb-1">Jungle Rescue</h3>
              <p className="text-xs text-muted-foreground">Save Gorillas & Earn</p>
              <p className="text-xs text-muted-foreground">1 $TARZON to enter • Top 50 get rewards</p>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card className="col-span-2 border-muted/20 bg-card hover:border-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 rounded-lg bg-muted/10">
                  <Gamepad2 className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
              <h3 className="font-semibold text-sm mb-1">Leaderboard</h3>
              <p className="text-xs text-muted-foreground">Check your rank & prizes</p>
            </CardContent>
          </Card>
        </div>

        {/* Game Status */}
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Flame className="w-4 h-4" />
              Current Game Session
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Time Remaining</span>
              <span className="font-semibold">23:45:32</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Participants</span>
              <span className="font-semibold">1,247</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Prize Pool</span>
              <span className="font-semibold text-accent">50,000 $TARZON</span>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Navigation */}
      <Navigation />
    </div>
  )
}

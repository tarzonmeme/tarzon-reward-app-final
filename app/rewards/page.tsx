"use client"

import { useState, useEffect } from 'react'
import { Gift, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Navigation from '@/components/navigation'

interface RewardState {
  lastClaimedAt: number | null
  totalClaimed: number
  canClaim: boolean
  nextClaimTime: number
}

export default function RewardsPage() {
  const [rewardState, setRewardState] = useState<RewardState>({
    lastClaimedAt: null,
    totalClaimed: 0,
    canClaim: true,
    nextClaimTime: 0,
  })
  const [timeRemaining, setTimeRemaining] = useState<string>('0:00:00')
  const [isClaiming, setIsClaiming] = useState(false)

  // Load reward state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tarzon_rewards')
    if (saved) {
      const state = JSON.parse(saved)
      setRewardState(state)
    }
  }, [])

  // Update countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (!rewardState.lastClaimedAt) {
        setTimeRemaining('Ready!')
        return
      }

      const now = Date.now()
      const sixHours = 6 * 60 * 60 * 1000
      const nextClaimTime = rewardState.lastClaimedAt + sixHours
      const diff = nextClaimTime - now

      if (diff <= 0) {
        setRewardState(prev => ({ ...prev, canClaim: true }))
        setTimeRemaining('Ready!')
      } else {
        const hours = Math.floor(diff / (60 * 60 * 1000))
        const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))
        const seconds = Math.floor((diff % (60 * 1000)) / 1000)
        setTimeRemaining(`${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`)
        setRewardState(prev => ({ ...prev, canClaim: false }))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [rewardState.lastClaimedAt])

  const handleClaimReward = async () => {
    if (!rewardState.canClaim || isClaiming) return

    setIsClaiming(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const now = Date.now()
    const newState: RewardState = {
      lastClaimedAt: now,
      totalClaimed: rewardState.totalClaimed + 5,
      canClaim: false,
      nextClaimTime: now + (6 * 60 * 60 * 1000),
    }

    setRewardState(newState)
    localStorage.setItem('tarzon_rewards', JSON.stringify(newState))
    localStorage.setItem('tarzon_user', JSON.stringify({
      ...JSON.parse(localStorage.getItem('tarzon_user') || '{}'),
      balance: (JSON.parse(localStorage.getItem('tarzon_user') || '{}').balance || 0) + 5,
    }))

    setIsClaiming(false)
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-md px-4 py-4">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Gift className="w-6 h-6" />
            Claim Rewards
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Earn 5 $TARZON every 6 hours</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-md px-4 py-6 space-y-6">
        {/* Claim Card */}
        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-accent/5">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-6 rounded-full bg-primary/20">
                <Gift className="w-12 h-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-primary">5 $TARZON</CardTitle>
            <CardDescription>Available to claim every 6 hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status */}
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-background/50">
              {rewardState.canClaim ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-green-500">Ready to Claim!</span>
                </>
              ) : (
                <>
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold text-muted-foreground">Next claim in</span>
                </>
              )}
            </div>

            {/* Timer */}
            {!rewardState.canClaim && (
              <div className="text-center p-4 rounded-lg bg-background/50 border border-border">
                <p className="text-muted-foreground text-sm mb-2">Time Remaining</p>
                <p className="text-3xl font-mono font-bold text-accent">{timeRemaining}</p>
              </div>
            )}

            {/* Claim Button */}
            <Button
              onClick={handleClaimReward}
              disabled={!rewardState.canClaim || isClaiming}
              className="w-full py-6 text-lg font-bold bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              {isClaiming ? 'Claiming...' : rewardState.canClaim ? 'Claim Now' : 'Come Back Later'}
            </Button>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Claimed</p>
                <p className="text-2xl font-bold text-primary">{rewardState.totalClaimed}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Next Claim</p>
                <p className="text-lg font-semibold text-accent">5 $TARZON</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="border-muted/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              How it Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                1
              </div>
              <div>
                <p className="font-semibold text-sm">Login with World ID</p>
                <p className="text-xs text-muted-foreground">Verify your identity once</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                2
              </div>
              <div>
                <p className="font-semibold text-sm">Claim Every 6 Hours</p>
                <p className="text-xs text-muted-foreground">Fixed 5 $TARZON per claim</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                3
              </div>
              <div>
                <p className="font-semibold text-sm">Watch Your Balance Grow</p>
                <p className="text-xs text-muted-foreground">Tokens added to your wallet</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tip */}
        <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
          <p className="text-sm text-foreground">
            <span className="font-semibold">Pro Tip:</span> Combine with Airdrops and Games to earn even more $TARZON!
          </p>
        </div>
      </main>

      {/* Navigation */}
      <Navigation />
    </div>
  )
}

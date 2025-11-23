"use client"

import { useState, useEffect } from 'react'
import { TrendingUp, Heart, Users, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Navigation from '@/components/navigation'

interface AirdropState {
  hasReacted: boolean
  hasClaimed: boolean
  reactionDate: number | null
  claimDate: number | null
  totalClaimed: number
}

export default function AirdropPage() {
  const [airdropState, setAirdropState] = useState<AirdropState>({
    hasReacted: false,
    hasClaimed: false,
    reactionDate: null,
    claimDate: null,
    totalClaimed: 0,
  })
  const [isClaiming, setIsClaiming] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Load airdrop state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tarzon_airdrop')
    if (saved) {
      const state = JSON.parse(saved)
      setAirdropState(state)
    }
  }, [])

  const handleOpenPUF = () => {
    // Open PUF community link (replace with actual PUF community URL)
    window.open('https://puf.community/tarzon', '_blank')
  }

  const handleReactOnPUF = () => {
    // In a real app, this would verify the reaction via PUF API
    setAirdropState(prev => ({
      ...prev,
      hasReacted: true,
      reactionDate: Date.now(),
    }))
  }

  const handleClaimAirdrop = async () => {
    if (!airdropState.hasReacted || airdropState.hasClaimed || isClaiming) return

    setIsClaiming(true)

    // Simulate API call and verification
    await new Promise(resolve => setTimeout(resolve, 1500))

    const newState: AirdropState = {
      ...airdropState,
      hasClaimed: true,
      claimDate: Date.now(),
      totalClaimed: airdropState.totalClaimed + 5,
    }

    setAirdropState(newState)
    localStorage.setItem('tarzon_airdrop', JSON.stringify(newState))

    // Update user balance
    const user = JSON.parse(localStorage.getItem('tarzon_user') || '{}')
    user.balance = (user.balance || 0) + 5
    localStorage.setItem('tarzon_user', JSON.stringify(user))

    setIsClaiming(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-md px-4 py-4">
          <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Airdrop
          </h1>
          <p className="text-sm text-muted-foreground mt-1">React & Claim Your Tokens</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-md px-4 py-6 space-y-6">
        {/* Success Message */}
        {showSuccess && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-600">Success!</p>
              <p className="text-sm text-green-600">5 $TARZON added to your balance</p>
            </div>
          </div>
        )}

        {/* Airdrop Card */}
        <Card className="border-secondary/30 bg-gradient-to-br from-secondary/10 to-primary/5">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-6 rounded-full bg-secondary/20">
                <TrendingUp className="w-12 h-12 text-secondary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-secondary">5 $TARZON</CardTitle>
            <CardDescription>Available once per airdrop round</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status Steps */}
            <div className="space-y-3">
              {/* Step 1: React on PUF */}
              <div className={`p-4 rounded-lg border transition-all ${
                airdropState.hasReacted
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-background/50 border-border'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Heart className={`w-5 h-5 ${airdropState.hasReacted ? 'text-green-500' : 'text-muted-foreground'}`} />
                    <span className="font-semibold">React on PUF Community</span>
                  </div>
                  {airdropState.hasReacted && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Show your support by reacting to the TARZON post on PUF
                </p>
                {!airdropState.hasReacted ? (
                  <Button
                    onClick={handleOpenPUF}
                    variant="outline"
                    className="w-full text-sm"
                    size="sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open PUF Community
                  </Button>
                ) : (
                  <p className="text-xs text-green-600 font-semibold">Verified!</p>
                )}
              </div>

              {/* Step 2: Claim Airdrop */}
              <div className={`p-4 rounded-lg border transition-all ${
                airdropState.hasClaimed
                  ? 'bg-green-500/10 border-green-500/30'
                  : airdropState.hasReacted
                  ? 'bg-background/50 border-secondary/50'
                  : 'bg-background/50 border-border opacity-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className={`w-5 h-5 ${airdropState.hasClaimed ? 'text-green-500' : airdropState.hasReacted ? 'text-secondary' : 'text-muted-foreground'}`} />
                    <span className="font-semibold">Claim Airdrop</span>
                  </div>
                  {airdropState.hasClaimed && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {airdropState.hasClaimed 
                    ? 'You have claimed this airdrop round'
                    : airdropState.hasReacted
                    ? 'Ready to claim! You have verified your reaction'
                    : 'React on PUF first to unlock this step'}
                </p>
                <Button
                  onClick={handleClaimAirdrop}
                  disabled={!airdropState.hasReacted || airdropState.hasClaimed || isClaiming}
                  className="w-full text-sm bg-secondary hover:bg-secondary/90 disabled:opacity-50"
                  size="sm"
                >
                  {isClaiming ? 'Claiming...' : airdropState.hasClaimed ? 'Already Claimed' : 'Claim Now'}
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Claimed</p>
                <p className="text-2xl font-bold text-secondary">{airdropState.totalClaimed}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg font-semibold text-accent">
                  {airdropState.hasClaimed ? 'Claimed' : airdropState.hasReacted ? 'Ready' : 'Pending'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card className="border-muted/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              To receive the airdrop, you must:
            </p>
            <ul className="space-y-2">
              <li className="flex gap-2 text-sm">
                <span className="text-secondary font-bold">1.</span>
                <span>React on PUF Community</span>
              </li>
              <li className="flex gap-2 text-sm">
                <span className="text-secondary font-bold">2.</span>
                <span>Verify with World ID</span>
              </li>
              <li className="flex gap-2 text-sm">
                <span className="text-secondary font-bold">3.</span>
                <span>Claim before round ends</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Active Rounds */}
        <Card className="border-accent/30 bg-accent/5">
          <CardHeader>
            <CardTitle className="text-base">Current Airdrop Round</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Round</span>
              <span className="font-semibold">#5</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Time Remaining</span>
              <span className="font-semibold">5 days, 12 hours</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Reward</span>
              <span className="font-semibold text-accent">5 $TARZON</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Participants</span>
              <span className="font-semibold">2,847</span>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Navigation */}
      <Navigation />
    </div>
  )
}

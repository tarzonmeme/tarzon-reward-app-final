"use client"
// TEST CHANGE FOR GIT SYNC

import { useState, useEffect } from 'react'
import { TrendingUp, Heart, Users, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Navigation from '@/components/navigation'
import * as MiniKit from '@worldcoin/minikit-js'

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
  const [isVerified, setIsVerified] = useState(false)
  const [wallet, setWallet] = useState("")

  // ✅ Load saved state
  useEffect(() => {
    const saved = localStorage.getItem('tarzon_airdrop')
    if (saved) {
      setAirdropState(JSON.parse(saved))
    }
  }, [])

  // ✅ Install MiniKit
  useEffect(() => {
    if (MiniKit.isInstalled && !MiniKit.isInstalled()) {
      MiniKit.install?.()
    }
  }, [])

  // ✅ World ID Verify Function
  const handleWorldVerify = async () => {
    try {
      const res = await MiniKit.commands.verify({
        type: "world-id",
        signal: "tarzon-human-verification"
      })

      if (res?.finalPayload?.status === "success") {
        setIsVerified(true)
        alert("✅ World ID Verified Successfully!")
      }
    } catch (err) {
      console.error("Verification failed", err)
      alert("❌ Verification Failed")
    }
  }

  const handleOpenPUF = () => {
    window.open('https://puf.community/tarzon', '_blank')
  }

  const handleReactOnPUF = () => {
    setAirdropState(prev => ({
      ...prev,
      hasReacted: true,
      reactionDate: Date.now(),
    }))
  }

  const handleClaimAirdrop = async () => {
    if (!airdropState.hasReacted || airdropState.hasClaimed || !isVerified || isClaiming) return

    setIsClaiming(true)

    await new Promise(resolve => setTimeout(resolve, 1500))

    const newState: AirdropState = {
      ...airdropState,
      hasClaimed: true,
      claimDate: Date.now(),
      totalClaimed: airdropState.totalClaimed + 5,
    }

    setAirdropState(newState)
    localStorage.setItem('tarzon_airdrop', JSON.stringify(newState))

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
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-md px-4 py-4">
          <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Airdrop
          </h1>
          <p className="text-sm text-muted-foreground mt-1">React & Claim Your Tokens</p>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-6 space-y-6">

        {showSuccess && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-semibold text-green-600">Success!</p>
              <p className="text-sm text-green-600">5 $TARZON added</p>
            </div>
          </div>
        )}

        {/* Airdrop Card */}
        <Card className="border-secondary/30 bg-gradient-to-br from-secondary/10 to-primary/5">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold text-secondary">5 $TARZON</CardTitle>
            <CardDescription>Available once per round</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">

            {/* Step 1 */}
            <Button
              onClick={handleOpenPUF}
              variant="outline"
              className="w-full"
              size="sm"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit PUF Community
            </Button>

            {/* Step 2 - World Verify */}
            <Button
              onClick={handleWorldVerify}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="sm"
              disabled={isVerified}
            >
              {isVerified ? "✅ Verified" : "Verify with World ID"}
            </Button>

            {/* Step 3 - Claim */}
            <Button
              onClick={handleClaimAirdrop}
              disabled={!isVerified || airdropState.hasClaimed || isClaiming}
              className="w-full bg-secondary"
              size="sm"
            >
              {isClaiming ? "Claiming..." : airdropState.hasClaimed ? "Already Claimed" : "Claim 5 TARZON"}
            </Button>

          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardContent className="text-center space-y-2">
            <p>Status: <b>{isVerified ? "Verified ✅" : "Not Verified ❌"}</b></p>
            <p>Total Claimed: <b>{airdropState.totalClaimed}</b></p>
          </CardContent>
        </Card>

      </main>

      <Navigation />
    </div>
  )
}

"use client"

import { useState, useEffect } from 'react'
import { Wallet, ArrowUpRight, ArrowDownLeft, History, Copy, CheckCircle2, AlertCircle, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Navigation from '@/components/navigation'

interface Transaction {
  id: string
  type: 'reward' | 'claim' | 'game' | 'airdrop' | 'prize'
  amount: number
  description: string
  timestamp: number
  status: 'completed' | 'pending'
}

interface WalletState {
  address: string
  balance: number
  pendingRewards: number
  transactions: Transaction[]
}

export default function WalletPage() {
  const [walletState, setWalletState] = useState<WalletState>({
    address: '0x' + '0'.repeat(40),
    balance: 0,
    pendingRewards: 0,
    transactions: [],
  })

  const [copied, setCopied] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Load wallet state
  useEffect(() => {
    const user = localStorage.getItem('tarzon_user')
    if (user) {
      const userData = JSON.parse(user)
      setWalletState(prev => ({
        ...prev,
        address: userData.wallet || prev.address,
        balance: userData.balance || 0,
      }))
    }

    // Mock transactions
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        type: 'reward',
        amount: 5,
        description: 'Daily Reward Claim',
        timestamp: Date.now() - 3600000,
        status: 'completed',
      },
      {
        id: '2',
        type: 'game',
        amount: -1,
        description: 'Jungle Game Entry Fee',
        timestamp: Date.now() - 7200000,
        status: 'completed',
      },
      {
        id: '3',
        type: 'airdrop',
        amount: 5,
        description: 'Airdrop Round #5',
        timestamp: Date.now() - 10800000,
        status: 'completed',
      },
    ]

    setWalletState(prev => ({
      ...prev,
      transactions: mockTransactions,
      pendingRewards: 0,
    }))
  }, [])

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletState.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount)
    if (isNaN(amount) || amount <= 0 || amount > walletState.balance) {
      alert('Invalid amount')
      return
    }

    setIsProcessing(true)

    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000))

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'claim',
      amount: -amount,
      description: `Withdrawal to wallet`,
      timestamp: Date.now(),
      status: 'completed',
    }

    setWalletState(prev => ({
      ...prev,
      balance: prev.balance - amount,
      transactions: [newTransaction, ...prev.transactions],
    }))

    setIsProcessing(false)
    setShowWithdraw(false)
    setWithdrawAmount('')
  }

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'reward':
      case 'airdrop':
      case 'prize':
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />
      case 'claim':
      case 'game':
        return <ArrowUpRight className="w-4 h-4 text-red-500" />
      default:
        return <History className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-md px-4 py-4">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Wallet className="w-6 h-6" />
            Wallet
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your $TARZON</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-md px-4 py-6 space-y-6">
        {/* Balance Card */}
        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-accent/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-muted-foreground">Total Balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-5xl font-bold text-primary mb-2">{walletState.balance.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">$TARZON Tokens</p>
            </div>

            {/* Wallet Address */}
            <div className="p-3 rounded-lg bg-background/50 border border-border">
              <p className="text-xs text-muted-foreground mb-2">Worldcoin Wallet Address</p>
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono bg-muted/50 px-2 py-1 rounded flex-1 overflow-hidden text-ellipsis">
                  {walletState.address}
                </code>
                <Button
                  onClick={handleCopyAddress}
                  size="sm"
                  variant="outline"
                  className="flex-shrink-0"
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setShowWithdraw(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4 mr-2" />
                Withdraw
              </Button>
              <Button variant="outline">
                <ArrowDownLeft className="w-4 h-4 mr-2" />
                Deposit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pending Rewards */}
        {walletState.pendingRewards > 0 && (
          <Card className="border-accent/30 bg-accent/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Rewards</p>
                <p className="text-lg font-bold text-accent">{walletState.pendingRewards} $TARZON</p>
              </div>
              <Button size="sm" className="bg-accent hover:bg-accent/90">
                Claim
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Withdraw Modal */}
        {showWithdraw && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
            <Card className="w-full max-w-md rounded-t-2xl rounded-b-none border-t border-x">
              <CardHeader className="pb-3">
                <CardTitle>Withdraw $TARZON</CardTitle>
                <CardDescription>Send tokens to your Worldcoin wallet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Amount</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-lg"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                      $TARZON
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Available: {walletState.balance.toFixed(2)}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-muted/20 border border-border">
                  <p className="text-sm mb-2">
                    <span className="text-muted-foreground">Receiving: </span>
                    <span className="font-bold">{withdrawAmount || '0.00'} $TARZON</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Network: Worldcoin Chain
                  </p>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleWithdraw}
                    disabled={isProcessing || !withdrawAmount}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {isProcessing ? 'Processing...' : 'Confirm Withdrawal'}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowWithdraw(false)
                      setWithdrawAmount('')
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Transactions */}
        <Card className="border-muted/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <History className="w-4 h-4" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {walletState.transactions.length > 0 ? (
                walletState.transactions.map(tx => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 rounded-full bg-muted/20">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(tx.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`font-bold text-sm ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tx.status === 'completed' ? 'Done' : 'Pending'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground py-6">
                  No transactions yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Prize Distribution Info */}
        <Card className="border-secondary/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Prize Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/20 border border-border">
              <p className="font-semibold text-sm mb-2">How Rewards Are Distributed</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Daily Rewards: Claimed manually</li>
                <li>• Airdrops: Added after verification</li>
                <li>• Game Prizes: Distributed after 24-hour rounds</li>
                <li>• Leaderboard: Top 50 get rewards at round end</li>
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
              <p className="font-semibold text-sm mb-2">Current Distribution Method</p>
              <p className="text-xs text-muted-foreground mb-2">
                All tokens are distributed directly to your Worldcoin wallet on the Worldcoin Chain.
              </p>
              <p className="text-xs font-semibold text-accent">
                Network: Worldcoin (WLD)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="border-muted/30">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-3">
              Need help with your wallet or transactions?
            </p>
            <Button variant="outline" className="w-full text-sm">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Navigation */}
      <Navigation />
    </div>
  )
}

"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bold as World } from 'lucide-react'

interface AuthModalProps {
  onAuthSuccess: () => void
}

export default function AuthModal({ onAuthSuccess }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleWorldIDLogin = async () => {
    setIsLoading(true)
    // Simulate World ID authentication
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock user data
    const mockUser = {
      id: 'world_' + Math.random().toString(36).substr(2, 9),
      wallet: '0x' + Math.random().toString(16).substr(2, 40),
      verified: true,
      joinedAt: new Date().toISOString(),
    }
    
    localStorage.setItem('tarzon_user', JSON.stringify(mockUser))
    setIsLoading(false)
    onAuthSuccess()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm border-primary/30 bg-card">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <World className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome to TARZON</CardTitle>
          <CardDescription>
            Sign in with World ID to claim rewards and play games
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleWorldIDLogin}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            {isLoading ? 'Connecting...' : 'Sign in with World ID'}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Powered by Worldcoin on World App
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

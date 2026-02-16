'use client'

import { useState } from 'react'
import {
  useFriends,
  useFriendRequests,
  useSearchUsers,
  useSendFriendRequest,
  useRespondToRequest,
} from '@/lib/hooks/use-social'
import { useAuth } from '@/lib/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, UserPlus, Check, X, Users, Trophy, Rss } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function SocialPage() {
  const { user } = useAuth()
  const { data: friends } = useFriends()
  const { data: requests } = useFriendRequests()
  const [searchQuery, setSearchQuery] = useState('')
  const { data: searchResults } = useSearchUsers(searchQuery)
  const sendRequest = useSendFriendRequest()
  const respondToRequest = useRespondToRequest()

  const friendProfiles = friends?.map((f) => {
    const req = f.requester as unknown as { id: string; username: string; display_name: string | null }
    const addr = f.addressee as unknown as { id: string; username: string; display_name: string | null }
    return req.id === user?.id ? addr : req
  }) || []

  const handleSendRequest = async (userId: string) => {
    try {
      await sendRequest.mutateAsync(userId)
      toast.success('Friend request sent!')
    } catch {
      toast.error('Failed to send request')
    }
  }

  const handleRespond = async (friendshipId: string, status: 'accepted' | 'rejected') => {
    try {
      await respondToRequest.mutateAsync({ friendshipId, status })
      toast.success(status === 'accepted' ? 'Friend added!' : 'Request declined')
    } catch {
      toast.error('Failed to respond')
    }
  }

  const friendIds = new Set(friendProfiles.map((f) => f.id))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Social</h1>
          <p className="text-gray-500">{friendProfiles.length} friends</p>
        </div>
        <div className="flex gap-2">
          <Link href="/social/leaderboard">
            <Button variant="outline" size="sm">
              <Trophy className="h-4 w-4 mr-1" />
              Leaderboard
            </Button>
          </Link>
          <Link href="/social/feed">
            <Button variant="outline" size="sm">
              <Rss className="h-4 w-4 mr-1" />
              Feed
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="friends">
        <TabsList>
          <TabsTrigger value="friends">
            Friends {friendProfiles.length > 0 && `(${friendProfiles.length})`}
          </TabsTrigger>
          <TabsTrigger value="requests">
            Requests {requests?.length ? <Badge className="ml-1 bg-red-500 text-white text-xs">{requests.length}</Badge> : null}
          </TabsTrigger>
          <TabsTrigger value="search">Find Friends</TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="mt-4">
          {!friendProfiles.length ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No friends yet. Search for users to connect!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {friendProfiles.map((profile) => (
                <Link key={profile.id} href={`/profile/${profile.username}`}>
                  <Card className="hover:shadow-sm transition-shadow cursor-pointer mb-2">
                    <CardContent className="py-3 flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-emerald-100 text-emerald-700">
                          {(profile.display_name || profile.username)[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{profile.display_name || profile.username}</p>
                        <p className="text-xs text-gray-500">@{profile.username}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="mt-4">
          {!requests?.length ? (
            <p className="text-center py-8 text-gray-500">No pending requests</p>
          ) : (
            <div className="space-y-2">
              {requests.map((req) => {
                const requester = req.requester as unknown as { id: string; username: string; display_name: string | null }
                return (
                  <Card key={req.id}>
                    <CardContent className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {(requester.display_name || requester.username)[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{requester.display_name || requester.username}</p>
                          <p className="text-xs text-gray-500">@{requester.username}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleRespond(req.id, 'accepted')}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRespond(req.id, 'rejected')}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="search" className="mt-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchResults?.length ? (
            <div className="space-y-2">
              {searchResults
                .filter((u) => u.id !== user?.id)
                .map((profile) => (
                  <Card key={profile.id}>
                    <CardContent className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {(profile.display_name || profile.username)[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{profile.display_name || profile.username}</p>
                          <p className="text-xs text-gray-500">@{profile.username}</p>
                        </div>
                      </div>
                      {friendIds.has(profile.id) ? (
                        <Badge variant="secondary">Friends</Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendRequest(profile.id)}
                          disabled={sendRequest.isPending}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : searchQuery.length >= 2 ? (
            <p className="text-center py-4 text-gray-500">No users found</p>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  )
}

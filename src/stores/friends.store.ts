import type { Friend } from '@/features/friends/hooks/useFriends'
import { create } from 'zustand'

interface FriendsState {
    friends: Friend[]

    setFriends: (friends: Friend[]) => void
    deleteFriendFromStore: (controllerid: string) => void
}

export const useFriendsStore = create<FriendsState>()((set) => ({
    friends: [],
    setFriends: (friends) => set(() => ({ friends })),
    deleteFriendFromStore: (controllerid: string) => {
        set((state) => ({
            friends: state.friends.filter((friend) => friend.controllerid !== controllerid),
        }))
    }
}))
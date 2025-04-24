import type { Volumes } from '@/features/sounds/hooks/useVolumes'
import { create } from 'zustand'

interface SoundsState {
    callJoinPlay: boolean
    callRequestPlay: boolean

    commandRecivedPlay: boolean

    volumes: Volumes;

    setVolumes: (volumes: Volumes) => void

    setCallJoinPlay: (value: boolean) => void

    setCallRequestPlay: (value: boolean) => void
    setCommandRecivedPlay: (value: boolean) => void


}

export const useSoundsStore = create<SoundsState>()((set) => ({
    callJoinPlay: false,
    callRequestPlay: false,
    commandRecivedPlay: false,
    volumes: {
        callJoin: 100,
        callRequest: 100,
        commandRecived: 100,
    },
    setVolumes: (volumes) => set(() => ({ volumes })),

    setCallJoinPlay: (value) => set(() => ({ callJoinPlay: value })),
    setCallRequestPlay: (value) => set(() => ({ callRequestPlay: value })),
    setCommandRecivedPlay: (value) => set(() => ({ commandRecivedPlay: value })),

}))
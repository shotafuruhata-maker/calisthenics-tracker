import { create } from 'zustand'

export interface Waypoint {
  lat: number
  lng: number
  altitude: number | null
  accuracy: number | null
  timestamp: number
  elapsed_s: number
  segment_distance_m: number
}

export interface MileSplit {
  mile: number
  time_s: number
  pace_s_per_km: number
}

interface GpsState {
  isTracking: boolean
  isPaused: boolean
  runId: string | null
  waypoints: Waypoint[]
  totalDistance: number
  elapsedTime: number
  startTime: number | null
  pausedTime: number
  currentPace: number
  mileSplits: MileSplit[]
  watchId: number | null
  timerInterval: ReturnType<typeof setInterval> | null

  startTracking: (runId: string) => void
  pauseTracking: () => void
  resumeTracking: () => void
  stopTracking: () => void
  addWaypoint: (wp: Waypoint) => void
  setWatchId: (id: number | null) => void
  setTimerInterval: (interval: ReturnType<typeof setInterval> | null) => void
  tick: () => void
  reset: () => void
}

export const useGpsStore = create<GpsState>((set, get) => ({
  isTracking: false,
  isPaused: false,
  runId: null,
  waypoints: [],
  totalDistance: 0,
  elapsedTime: 0,
  startTime: null,
  pausedTime: 0,
  currentPace: 0,
  mileSplits: [],
  watchId: null,
  timerInterval: null,

  startTracking: (runId) =>
    set({
      isTracking: true,
      isPaused: false,
      runId,
      waypoints: [],
      totalDistance: 0,
      elapsedTime: 0,
      startTime: Date.now(),
      pausedTime: 0,
      currentPace: 0,
      mileSplits: [],
    }),

  pauseTracking: () => {
    const state = get()
    if (state.timerInterval) clearInterval(state.timerInterval)
    set({ isPaused: true, timerInterval: null })
  },

  resumeTracking: () => {
    set((state) => ({
      isPaused: false,
      pausedTime: state.pausedTime,
    }))
  },

  stopTracking: () => {
    const state = get()
    if (state.watchId !== null) navigator.geolocation.clearWatch(state.watchId)
    if (state.timerInterval) clearInterval(state.timerInterval)
    set({
      isTracking: false,
      isPaused: false,
      watchId: null,
      timerInterval: null,
    })
  },

  addWaypoint: (wp) =>
    set((state) => {
      const newDistance = state.totalDistance + wp.segment_distance_m
      const MILE = 1609.34
      const prevMiles = Math.floor(state.totalDistance / MILE)
      const newMiles = Math.floor(newDistance / MILE)
      const newSplits = [...state.mileSplits]

      if (newMiles > prevMiles) {
        for (let m = prevMiles + 1; m <= newMiles; m++) {
          const prevSplitTime = newSplits.length > 0 ? newSplits[newSplits.length - 1].time_s : 0
          newSplits.push({
            mile: m,
            time_s: wp.elapsed_s - prevSplitTime,
            pace_s_per_km: ((wp.elapsed_s - prevSplitTime) / MILE) * 1000,
          })
        }
      }

      // Calculate current pace (last 30 seconds of data)
      const recentWaypoints = [...state.waypoints, wp].filter(
        (w) => wp.elapsed_s - w.elapsed_s <= 30
      )
      let recentDistance = 0
      for (let i = 1; i < recentWaypoints.length; i++) {
        recentDistance += recentWaypoints[i].segment_distance_m
      }
      const recentTime = recentWaypoints.length > 1
        ? recentWaypoints[recentWaypoints.length - 1].elapsed_s - recentWaypoints[0].elapsed_s
        : 0
      const currentPace = recentDistance > 0 && recentTime > 0
        ? (recentTime / recentDistance) * 1000
        : 0

      return {
        waypoints: [...state.waypoints, wp],
        totalDistance: newDistance,
        mileSplits: newSplits,
        currentPace,
      }
    }),

  setWatchId: (id) => set({ watchId: id }),
  setTimerInterval: (interval) => set({ timerInterval: interval }),

  tick: () =>
    set((state) => {
      if (!state.startTime || state.isPaused) return state
      const elapsed = Math.floor((Date.now() - state.startTime - state.pausedTime) / 1000)
      return { elapsedTime: elapsed }
    }),

  reset: () => {
    const state = get()
    if (state.watchId !== null) navigator.geolocation.clearWatch(state.watchId)
    if (state.timerInterval) clearInterval(state.timerInterval)
    set({
      isTracking: false,
      isPaused: false,
      runId: null,
      waypoints: [],
      totalDistance: 0,
      elapsedTime: 0,
      startTime: null,
      pausedTime: 0,
      currentPace: 0,
      mileSplits: [],
      watchId: null,
      timerInterval: null,
    })
  },
}))

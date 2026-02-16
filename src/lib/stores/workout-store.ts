import { create } from 'zustand'

interface WorkoutState {
  selectedMuscleGroups: string[]
  excludedExerciseIds: string[]
  toggleMuscleGroup: (slug: string) => void
  excludeExercise: (id: string) => void
  includeExercise: (id: string) => void
  resetFilters: () => void
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  selectedMuscleGroups: [],
  excludedExerciseIds: [],

  toggleMuscleGroup: (slug) =>
    set((state) => ({
      selectedMuscleGroups: state.selectedMuscleGroups.includes(slug)
        ? state.selectedMuscleGroups.filter((s) => s !== slug)
        : [...state.selectedMuscleGroups, slug],
    })),

  excludeExercise: (id) =>
    set((state) => ({
      excludedExerciseIds: [...state.excludedExerciseIds, id],
    })),

  includeExercise: (id) =>
    set((state) => ({
      excludedExerciseIds: state.excludedExerciseIds.filter((e) => e !== id),
    })),

  resetFilters: () =>
    set({ selectedMuscleGroups: [], excludedExerciseIds: [] }),
}))

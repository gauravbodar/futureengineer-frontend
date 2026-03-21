import { create } from 'zustand'

export interface Answer {
  questionId: string
  answer: string
}

export interface ProjectIdea {
  title: string
  description: string
  timeEstimate: string
}

export interface Report {
  tier: string
  headline: string
  projectIdeas: ProjectIdea[]
  skills: string[]
  firstStep: string
}

interface AssessState {
  age: number | null
  interests: string[]
  goal: string
  answers: Answer[]
  email: string
  tier: string | null
  readiness: 'high' | 'medium' | 'low' | null
  report: Report | null
  topProjectIdea: string
  sessionId: string | null

  setAge: (age: number) => void
  setInterests: (interests: string[]) => void
  setGoal: (goal: string) => void
  addAnswer: (answer: Answer) => void
  setEmail: (email: string) => void
  setTier: (tier: string) => void
  setReadiness: (readiness: 'high' | 'medium' | 'low') => void
  setReport: (report: Report) => void
  setTopProjectIdea: (idea: string) => void
  setSessionId: (id: string) => void
  clearAssessment: () => void
}

const initialState = {
  age: null,
  interests: [],
  goal: '',
  answers: [],
  email: '',
  tier: null,
  readiness: null,
  report: null,
  topProjectIdea: '',
  sessionId: null,
}

export const useAssessStore = create<AssessState>((set) => ({
  ...initialState,

  setAge: (age) => set({ age }),
  setInterests: (interests) => set({ interests }),
  setGoal: (goal) => set({ goal }),
  addAnswer: (answer) =>
    set((state) => ({
      answers: [
        ...state.answers.filter((a) => a.questionId !== answer.questionId),
        answer,
      ],
    })),
  setEmail: (email) => set({ email }),
  setTier: (tier) => set({ tier }),
  setReadiness: (readiness) => set({ readiness }),
  setReport: (report) => set({ report }),
  setTopProjectIdea: (idea) => set({ topProjectIdea: idea }),
  setSessionId: (id) => set({ sessionId: id }),
  clearAssessment: () => set(initialState),
}))

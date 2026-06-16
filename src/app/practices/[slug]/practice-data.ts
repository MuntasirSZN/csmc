export interface Question {
  id: number
  content: string
  options?: string[]
  order: number
  explanation?: string
  questionType: 'option' | 'text'
  answerType: 'single' | 'multiple'
}

export interface Practice {
  id: number
  title: string
  slug: string
  description: string | null
  content: string
  timeLimit: number
  questions: Question[]
}

export interface PracticeDataState {
  practice: Practice | null
  loading: boolean
  hasExistingAttempt: boolean
  timeRemaining: number
}

export type PracticeDataAction
  = | { type: 'SET_PRACTICE', practice: Practice }
    | { type: 'SET_LOADING', loading: boolean }
    | { type: 'SET_HAS_EXISTING_ATTEMPT', hasExistingAttempt: boolean }
    | { type: 'SET_TIME_REMAINING', timeRemaining: number }
    | { type: 'TICK' }

export function practiceDataReducer(state: PracticeDataState, action: PracticeDataAction): PracticeDataState {
  switch (action.type) {
    case 'SET_PRACTICE':
      return { ...state, practice: action.practice }
    case 'SET_LOADING':
      return { ...state, loading: action.loading }
    case 'SET_HAS_EXISTING_ATTEMPT':
      return { ...state, hasExistingAttempt: action.hasExistingAttempt }
    case 'SET_TIME_REMAINING':
      return { ...state, timeRemaining: action.timeRemaining }
    case 'TICK':
      if (state.timeRemaining <= 0)
        return state
      return { ...state, timeRemaining: state.timeRemaining - 1 }
    default:
      return state
  }
}

export interface UiState {
  showSummary: boolean
  showSubmitConfirmation: boolean
  submitting: boolean
  activeSections: Record<number, boolean>
}

export type UiAction
  = | { type: 'SET_SHOW_SUMMARY', showSummary: boolean }
    | { type: 'SET_SHOW_SUBMIT_CONFIRMATION', showSubmitConfirmation: boolean }
    | { type: 'SET_SUBMITTING', submitting: boolean }
    | { type: 'SET_ACTIVE_SECTIONS', activeSections: Record<number, boolean> }

export function uiReducer(state: UiState, action: UiAction): UiState {
  switch (action.type) {
    case 'SET_SHOW_SUMMARY':
      return { ...state, showSummary: action.showSummary }
    case 'SET_SHOW_SUBMIT_CONFIRMATION':
      return { ...state, showSubmitConfirmation: action.showSubmitConfirmation }
    case 'SET_SUBMITTING':
      return { ...state, submitting: action.submitting }
    case 'SET_ACTIVE_SECTIONS':
      return { ...state, activeSections: action.activeSections }
    default:
      return state
  }
}

export interface Question {
  content: string
  options?: string[]
  correctAnswer?: string
  correctAnswers?: string[]
  explanation?: string
  questionType: 'option' | 'text'
  answerType: 'single' | 'multiple'
  order: number
}

export interface Practice {
  id: number
  title: string
  slug: string
  description: string | null
  content: string
  timeLimit: number
  createdAt: string
  updatedAt: string
  questions?: Question[]
}

export function generateSlugUtil(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Management state (list/CRUD)
export interface ManageState {
  loading: boolean
  fetchingPractices: boolean
  practices: Practice[]
  mode: 'list' | 'create' | 'edit' | 'view'
  currentPractice: Practice | null
  dialogOpen: boolean
  practiceToDelete: Practice | null
}

export type ManageAction
  = | { type: 'FETCH_PRACTICES_START' }
    | { type: 'FETCH_PRACTICES_SUCCESS', practices: Practice[] }
    | { type: 'FETCH_PRACTICES_ERROR' }
    | { type: 'SET_LOADING', loading: boolean }
    | { type: 'SET_MODE', mode: ManageState['mode'] }
    | { type: 'SET_CURRENT_PRACTICE', practice: Practice | null }
    | { type: 'OPEN_DIALOG', practice: Practice }
    | { type: 'CLOSE_DIALOG' }

export const initialManageState: ManageState = {
  loading: false,
  fetchingPractices: true,
  practices: [],
  mode: 'list',
  currentPractice: null,
  dialogOpen: false,
  practiceToDelete: null,
}

export function manageReducer(state: ManageState, action: ManageAction): ManageState {
  switch (action.type) {
    case 'FETCH_PRACTICES_START':
      return { ...state, fetchingPractices: true }
    case 'FETCH_PRACTICES_SUCCESS':
      return { ...state, practices: action.practices, fetchingPractices: false }
    case 'FETCH_PRACTICES_ERROR':
      return { ...state, fetchingPractices: false }
    case 'SET_LOADING':
      return { ...state, loading: action.loading }
    case 'SET_MODE':
      return { ...state, mode: action.mode }
    case 'SET_CURRENT_PRACTICE':
      return { ...state, currentPractice: action.practice }
    case 'OPEN_DIALOG':
      return { ...state, dialogOpen: true, practiceToDelete: action.practice }
    case 'CLOSE_DIALOG':
      return { ...state, dialogOpen: false, practiceToDelete: null }
    default:
      return state
  }
}

// Form state (create/edit)
export interface FormState {
  title: string
  description: string
  content: string
  timeLimit: number
  questions: Question[]
  activeTab: string
  previewMode: 'details' | 'questions'
}

export type FormAction
  = | { type: 'SET_TITLE', title: string }
    | { type: 'SET_DESCRIPTION', description: string }
    | { type: 'SET_CONTENT', content: string }
    | { type: 'SET_TIME_LIMIT', timeLimit: number }
    | { type: 'SET_QUESTIONS', questions: Question[] }
    | { type: 'SET_ACTIVE_TAB', tab: string }
    | { type: 'SET_PREVIEW_MODE', mode: 'details' | 'questions' }
    | { type: 'RESET_FORM' }
    | { type: 'LOAD_FORM', practice: Practice }

export const initialFormState: FormState = {
  title: '',
  description: '',
  content: '',
  timeLimit: 30,
  questions: [
    {
      content: '',
      options: ['', '', '', ''],
      correctAnswer: undefined,
      explanation: '',
      questionType: 'option',
      answerType: 'single',
      order: 0,
    },
  ],
  activeTab: 'details',
  previewMode: 'details',
}

export function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_TITLE':
      return { ...state, title: action.title }
    case 'SET_DESCRIPTION':
      return { ...state, description: action.description }
    case 'SET_CONTENT':
      return { ...state, content: action.content }
    case 'SET_TIME_LIMIT':
      return { ...state, timeLimit: action.timeLimit }
    case 'SET_QUESTIONS':
      return { ...state, questions: action.questions }
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.tab }
    case 'SET_PREVIEW_MODE':
      return { ...state, previewMode: action.mode }
    case 'RESET_FORM':
      return { ...initialFormState }
    case 'LOAD_FORM': {
      const practice = action.practice
      const questions: Question[] = practice.questions && practice.questions.length > 0
        ? practice.questions.map(q => ({
            ...q,
            questionType: (q.questionType || 'option') as 'option' | 'text',
            answerType: (q.answerType || 'single') as 'single' | 'multiple',
            explanation: q.explanation || '',
            correctAnswers: q.correctAnswers || [],
            options: q.options || ['', '', '', ''],
          }))
        : [
            {
              content: '',
              options: ['', '', '', ''],
              correctAnswer: undefined,
              explanation: '',
              questionType: 'option',
              answerType: 'single',
              order: 0,
            },
          ]
      return {
        title: practice.title,
        description: practice.description || '',
        content: practice.content,
        timeLimit: practice.timeLimit,
        questions,
        activeTab: 'details',
        previewMode: 'details',
      }
    }
    default:
      return state
  }
}

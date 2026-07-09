import { useReducer, useCallback, Reducer } from 'react'

const actionTypes = {
  toggle: 'TOGGLE',
  on: 'ON',
  off: 'OFF',
} as const

type ActionType = typeof actionTypes[keyof typeof actionTypes]

interface Action<T = any> {
  type: ActionType
  payload?: T
}

interface State<T = any> {
  isOpen: boolean
  data: T | null
}

function toggleReducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case actionTypes.toggle: {
      return {
        isOpen: !state.isOpen,
        data: !state.isOpen ? (action.payload ?? state.data) : null
      }
    }
    case actionTypes.on: {
      return { isOpen: true, data: action.payload ?? state.data }
    }
    case actionTypes.off: {
      return { isOpen: false, data: null }
    }
    default: {
      throw new Error(`Unhandled type: ${action.type}`)
    }
  }
}

interface UseDisclosureProps<T> {
  reducer?: Reducer<State<T>, Action<T>>
  defaultOpen?: boolean
  defaultData?: T | null
}

function useDisclosure<T = any>({
  reducer = toggleReducer,
  defaultOpen = false,
  defaultData = null
}: UseDisclosureProps<T> = {}) {
  const [{ isOpen, data }, dispatch] = useReducer(reducer, {
    isOpen: defaultOpen,
    data: defaultData
  })

  const onToggle = useCallback((data?: T) => dispatch({ type: actionTypes.toggle, payload: data }), [])
  const onOpen = useCallback((data?: T) => dispatch({ type: actionTypes.on, payload: data }), [])
  const onClose = useCallback(() => dispatch({ type: actionTypes.off }), [])

  return { isOpen, data, onToggle, onClose, onOpen }
}

export { useDisclosure }

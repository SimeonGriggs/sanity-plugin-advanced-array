import {PropsWithChildren, useContext} from 'react'
import {createContext} from 'react'

type MultiSelectContextValue = {
  selected: string[]
  toggleSelected: (key: string) => void
  selectAll: (keys: string[]) => void
  expanded: string[]
  toggleExpanded: (key: string) => void
  collapseAll: () => void
  expandAll: () => void
}

const MultiSelectContext = createContext<MultiSelectContextValue>({
  selected: [],
  toggleSelected: () => null,
  selectAll: () => null,
  expanded: [],
  toggleExpanded: () => null,
  collapseAll: () => null,
  expandAll: () => null,
})

export function useMultiSelectContext() {
  const current = useContext(MultiSelectContext)

  return current
}

type MultiSelectProviderProps = PropsWithChildren & MultiSelectContextValue

export function MultiSelectProvider(props: MultiSelectProviderProps) {
  const {children, ...rest} = props

  return <MultiSelectContext.Provider value={rest}>{children}</MultiSelectContext.Provider>
}

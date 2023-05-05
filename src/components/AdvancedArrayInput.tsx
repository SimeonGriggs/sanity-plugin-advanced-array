import {useCallback, useEffect, useState} from 'react'
import {ArrayOfObjectsInputProps} from 'sanity'
import {Stack} from '@sanity/ui'

import {MultiSelectProvider} from './MultiSelectContext'
import {CONFIG_DEFAULTS} from '../constants'
import {Blank} from './Blank'
import {AdvancedArrayOptions} from '../types'
import {AdvancedArrayFunctions} from './AdvancedArrayFunctions'
import {AddItemSearch} from './AddItemSearch'

export function AdvancedArrayInput(props: ArrayOfObjectsInputProps) {
  const [selected, setSelected] = useState<string[]>([])
  const initialExpanded =
    // @ts-expect-error
    props.schemaType.options.advanced.inline === 'expanded' && props.value && props.value.length
      ? props.value.map((item) => item._key)
      : []
  const [expanded, setExpanded] = useState<string[]>(initialExpanded)

  const toggleSelected = useCallback((key: string) => {
    setSelected((current) =>
      current.includes(key) ? current.filter((selectedId) => selectedId !== key) : [...current, key]
    )
  }, [])

  const selectAll = useCallback((keys: string[]) => {
    setSelected(keys)
  }, [])

  const toggleExpanded = useCallback((key: string) => {
    setExpanded((current) =>
      current.includes(key) ? current.filter((selectedId) => selectedId !== key) : [...current, key]
    )
  }, [])

  const collapseAll = useCallback(() => {
    setExpanded([])
  }, [])

  const expandAll = useCallback(() => {
    if (props.value && props.value.length) {
      setExpanded(props.value.map((item) => item._key))
    }
  }, [props.value])

  // Expand all items on mount and as they are added
  // TODO: Intercept new items and expand them
  // useEffect(() => {
  //   if (
  //     // @ts-expect-error
  //     props.schemaType.options.advanced.inline === 'expanded' &&
  //     props.value &&
  //     props.value.length
  //   ) {
  //     expandAll()
  //   }
  // }, [
  //   expandAll,
  //   props.value,
  //   // @ts-expect-error
  //   props.schemaType.options.advanced.inline,
  // ])

  // @ts-expect-error
  if (!props.schemaType.options.advanced) {
    return props.renderDefault(props)
  }

  const combinedConfig: AdvancedArrayOptions = {
    ...CONFIG_DEFAULTS,
    // @ts-expect-error
    ...props.schemaType.options.advanced,
  }
  const {addItemSearch} = combinedConfig

  let addItemHidden = CONFIG_DEFAULTS.__unstable_addItemHidden

  if (
    '__unstable_addItemHidden' in combinedConfig &&
    typeof combinedConfig.__unstable_addItemHidden === 'function'
  ) {
    addItemHidden = combinedConfig.__unstable_addItemHidden(props.value)
  } else {
    addItemHidden = combinedConfig.__unstable_addItemHidden
  }

  return (
    <MultiSelectProvider
      selected={selected}
      toggleSelected={toggleSelected}
      selectAll={selectAll}
      expanded={expanded}
      toggleExpanded={toggleExpanded}
      collapseAll={collapseAll}
      expandAll={expandAll}
    >
      <Stack space={2}>
        {addItemHidden
          ? props.renderDefault({...props, arrayFunctions: Blank})
          : props.renderDefault(props)}
        {addItemSearch ? <AddItemSearch {...props} /> : null}
        <AdvancedArrayFunctions {...props} />
      </Stack>
    </MultiSelectProvider>
  )
}

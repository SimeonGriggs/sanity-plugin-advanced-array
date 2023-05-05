import {useCallback} from 'react'
import {Button, Menu, MenuButton, MenuItem, MenuDivider} from '@sanity/ui'
import {
  TrashIcon,
  EllipsisVerticalIcon,
  ResetIcon,
  CopyIcon,
  CheckmarkCircleIcon,
  RemoveCircleIcon,
  ClipboardIcon,
  DoubleChevronDownIcon,
  DoubleChevronUpIcon,
} from '@sanity/icons'
import {ArrayOfObjectsInputProps, KeyedObject, insert, unset, useWorkspace} from 'sanity'
import {randomKey} from '@sanity/util/content'
import {useLocalStorage} from 'usehooks-ts'

import {useMultiSelectContext} from './MultiSelectContext'

export function AdvancedArrayFunctions(props: ArrayOfObjectsInputProps) {
  const {value, onChange, readOnly} = props
  const {selected, selectAll, expandAll, collapseAll} = useMultiSelectContext()
  const {projectId, dataset} = useWorkspace()

  const localStorageId = `multi-select-${projectId}-${dataset}-${props.schemaType.type?.name}`
  const [copiedItems, setCopiedItems] = useLocalStorage(localStorageId, ``)

  const handleCopySelected = useCallback(() => {
    if (!selected.length || !value || !value.length) {
      return
    }

    const selectedValues = value.filter((item) => selected.includes(item._key))

    setCopiedItems(JSON.stringify(selectedValues))
  }, [selected, setCopiedItems, value])

  const handlePaste = useCallback(() => {
    if (!copiedItems) {
      return
    }

    const parsedItems = JSON.parse(copiedItems) as KeyedObject[]

    if (!Array.isArray(parsedItems) || !parsedItems.length) {
      return
    }

    onChange(
      parsedItems.map((item) =>
        insert(
          // New key for new item
          [{...item, _key: randomKey(12)}],
          'after',
          [-1]
        )
      )
    )
  }, [copiedItems, onChange])

  const handleSelectAll = useCallback(() => {
    const keys = value && value.length ? value.map((item) => item._key) : null
    if (keys) {
      selectAll(keys)
    }
  }, [selectAll, value])

  const handleSelectNone = useCallback(() => {
    selectAll([])
  }, [selectAll])

  const handleDuplicateSelected = useCallback(() => {
    if (!selected.length || !value || !value.length) {
      return
    }

    const selectedValues = value.filter((item) => selected.includes(item._key))

    onChange(
      selectedValues.map((item) =>
        insert(
          // New key for new item
          [{...item, _key: randomKey(12)}],
          // position
          'after',
          // Old key for insert position
          [{_key: item._key}]
        )
      )
    )
  }, [onChange, selected, value])

  const handleRemoveSelected = useCallback(() => {
    if (!selected.length) {
      return
    }

    const selectedAsKeys = selected.map((key) => ({_key: key}))
    onChange(selectedAsKeys.map((path) => unset([path])))
  }, [onChange, selected])

  const handleRemoveAll = useCallback(() => {
    if (!value || !value.length) {
      return
    }

    const valueKeys = value.map(({_key}) => ({_key}))
    onChange(valueKeys.map((path) => unset([path])))
  }, [onChange, value])

  const handleExpandAll = useCallback(() => {
    expandAll()
  }, [expandAll])

  const handleCollapseAll = useCallback(() => {
    collapseAll()
  }, [collapseAll])

  const {advanced} = props.schemaType.options || {}

  return (
    <MenuButton
      button={
        <Button
          mode="ghost"
          icon={EllipsisVerticalIcon}
          disabled={readOnly}
          text="More actions..."
        />
      }
      id={`${localStorageId}-menu`}
      menu={
        <Menu>
          {advanced.inline === 'off' ? null : (
            <>
              <MenuItem
                text="Expand all"
                icon={DoubleChevronDownIcon}
                onClick={handleExpandAll}
                disabled={readOnly || !value || !value.length}
              />
              <MenuItem
                text="Collapse all"
                icon={DoubleChevronUpIcon}
                onClick={handleCollapseAll}
                disabled={readOnly || !value || !value.length}
              />
              <MenuDivider />
            </>
          )}
          {advanced.select ? (
            <>
              <MenuItem
                text="Select all"
                icon={CheckmarkCircleIcon}
                onClick={handleSelectAll}
                disabled={readOnly || !value || !value.length}
              />
              <MenuItem
                text="Clear selection"
                icon={ResetIcon}
                onClick={handleSelectNone}
                disabled={readOnly || !selected.length || !value || !value.length}
              />
              <MenuItem
                text="Duplicate selected"
                icon={CopyIcon}
                onClick={handleDuplicateSelected}
                disabled={readOnly || !selected.length || !value || !value.length}
              />
              <MenuDivider />
            </>
          ) : null}
          {advanced.select ? (
            <>
              <MenuItem
                text="Copy selected"
                icon={CopyIcon}
                onClick={handleCopySelected}
                disabled={readOnly || !selected.length || !value || !value.length}
              />
              <MenuItem
                text="Paste items"
                icon={ClipboardIcon}
                onClick={handlePaste}
                disabled={readOnly || !copiedItems}
              />
              <MenuDivider />
            </>
          ) : null}
          {advanced.select ? (
            <MenuItem
              icon={RemoveCircleIcon}
              text="Remove selected"
              tone="critical"
              disabled={readOnly || !selected.length || !value || !value.length}
              onClick={handleRemoveSelected}
            />
          ) : null}
          <MenuItem
            icon={TrashIcon}
            text="Remove all"
            tone="critical"
            onClick={handleRemoveAll}
            disabled={readOnly || !value || !value.length}
          />
        </Menu>
      }
      popover={{portal: true}}
    />
  )
}

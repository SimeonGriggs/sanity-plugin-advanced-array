import {ObjectInputMember, ObjectItemProps, KeyedObject} from 'sanity'
import {ChevronUpIcon, ChevronDownIcon, CheckmarkCircleIcon, CircleIcon} from '@sanity/icons'
import {Stack, Text, Card, Flex, Box, Button} from '@sanity/ui'
import {MouseEvent, useCallback} from 'react'

import {useMultiSelectContext} from './MultiSelectContext'
import {CircleButton} from './CircleButton'

export function AdvancedArrayItem(props: ObjectItemProps<KeyedObject>) {
  // @ts-expect-error
  const {advanced} = props.parentSchemaType.options
  const {selected, toggleSelected, expanded, toggleExpanded} = useMultiSelectContext()
  const isSelected = selected.includes(props.value._key)

  const handleSelection = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      toggleSelected(event.currentTarget.value)
    },
    [toggleSelected]
  )

  const isExpanded = expanded.includes(props.value._key)

  const handleToggleExpanded = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      toggleExpanded(event.currentTarget.value)
    },
    [toggleExpanded]
  )

  const {members} = props.inputProps

  const renderProps = {
    renderField: props.inputProps.renderField,
    renderInput: props.inputProps.renderInput,
    renderItem: props.inputProps.renderItem,
    renderPreview: props.inputProps.renderPreview,
  }

  // This item is not required with this configuration
  if (advanced.inline === 'off' && !advanced.select) {
    return props.renderDefault(props)
  }

  return (
    <Card paddingLeft={2}>
      <Flex align="center">
        {advanced.select ? (
          <CircleButton
            tone={isSelected ? `primary` : `default`}
            value={props.value._key}
            mode={isSelected ? `default` : `bleed`}
            onClick={handleSelection}
            padding={2}
          >
            <Text size={3}>{isSelected ? <CheckmarkCircleIcon /> : <CircleIcon />}</Text>
          </CircleButton>
        ) : null}

        {advanced.inline === 'off' || !isExpanded ? (
          <Box flex={1}>{props.renderDefault(props)}</Box>
        ) : (
          <Box flex={1} paddingLeft={3} paddingRight={0} paddingTop={2} paddingBottom={3}>
            <Stack space={3}>
              {members.map((member) => (
                <ObjectInputMember key={member.key} member={member} {...renderProps} />
              ))}
            </Stack>
          </Box>
        )}

        {advanced.inline === 'off' ? null : (
          <Box paddingX={2}>
            <Button
              title={isExpanded ? 'Expand' : 'Collapse'}
              icon={isExpanded ? ChevronUpIcon : ChevronDownIcon}
              mode="bleed"
              value={props.value._key}
              onClick={handleToggleExpanded}
            />
          </Box>
        )}
      </Flex>
    </Card>
  )
}

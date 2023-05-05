import {ArrayOptions as DefaultArrayOptions, KeyedObject} from 'sanity'

/**
 * @public
 */
export type AdvancedArrayOptions = {
  select: boolean
  inline: 'collapsed' | 'expanded' | 'off'
  addItemSearch?: boolean
  __unstable_addItemHidden?: boolean | ((value?: KeyedObject[]) => boolean)
}

export interface AdvancedArrayDefinition extends DefaultArrayOptions {
  options?: AdvancedArrayOptions & DefaultArrayOptions
}

// declare module '@sanity/types' {
declare module 'sanity' {
  export interface ArrayDefinition extends AdvancedArrayDefinition {}
}

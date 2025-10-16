export enum ContentType {
  HYMN = 'HYMN',
  CHORDS = 'CHORDS',
  ANTIPHON = 'ANTIPHON',
  RITUALS = 'RITUALS',
}

export enum SONG_STRUCTURE {
  VERSE = 'VERSE',
  PRE_CHORUS = 'PRE_CHORUS',
  CHORUS = 'CHORUS',
  BRIDGE = 'BRIDGE',
}

export type SONG_ITEM = {
  lines: string[]
  type: SONG_STRUCTURE
}

export type Content = {
  id: string
  type: ContentType
  title: string
  number?: number
  items: SONG_ITEM[] | string[]
  author?: string[]
}

export type Hymnal = {
  id: string
  name: string
  description?: string
  contents: Content[]
}

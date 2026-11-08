export const X = 1 as const
export const O = -1 as const
export const N = 0 as const

export type Player = typeof X | typeof O
export type Cell = typeof X | typeof O | typeof N
export type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell]
export type WinPattern = [number, number, number]

export const WIN_PATTERNS: WinPattern[] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

export const EMPTY_BOARD: Board = [N, N, N, N, N, N, N, N, N]

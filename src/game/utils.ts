import { X, O, N, WIN_PATTERNS, type Board, type Player, type WinPattern } from '../constants.js'

export function score(board: Board): Player | typeof N | null {
  for (const pattern of WIN_PATTERNS) {
    const sum = pattern.reduce((acc, i) => acc + board[i], 0)
    if (sum === 3) return X
    if (sum === -3) return O
  }
  if (board.every(cell => cell !== N)) return N
  return null
}

export function winningLine(board: Board): WinPattern | null {
  for (const pattern of WIN_PATTERNS) {
    const sum = pattern.reduce((acc, i) => acc + board[i], 0)
    if (sum === 3 || sum === -3) return pattern
  }
  return null
}

export function makeMove(board: Board, move: number, player: Player): Board {
  const next = [...board] as Board
  next[move] = player
  return next
}

export function availableMoves(board: Board): number[] {
  if (score(board) !== null) return []
  return board.reduce<number[]>((acc, cell, i) => {
    if (cell === N) acc.push(i)
    return acc
  }, [])
}

export function otherPlayer(player: Player): Player {
  return (player === X ? O : X)
}

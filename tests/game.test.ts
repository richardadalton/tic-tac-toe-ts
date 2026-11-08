import { describe, it, expect } from 'vitest'
import { X, O, N, type Board } from '../src/constants.js'
import { score, winningLine, makeMove, availableMoves, otherPlayer } from '../src/game/utils.js'

const empty: Board = [N, N, N, N, N, N, N, N, N]

describe('score', () => {
  it('returns null for an empty board', () => {
    expect(score(empty)).toBeNull()
  })

  it('detects X winning on top row', () => {
    const board: Board = [X, X, X, O, O, N, N, N, N]
    expect(score(board)).toBe(X)
  })

  it('detects O winning on middle row', () => {
    const board: Board = [X, N, N, O, O, O, X, N, N]
    expect(score(board)).toBe(O)
  })

  it('detects X winning on left column', () => {
    const board: Board = [X, O, N, X, O, N, X, N, N]
    expect(score(board)).toBe(X)
  })

  it('detects X winning on diagonal', () => {
    const board: Board = [X, O, N, O, X, N, N, N, X]
    expect(score(board)).toBe(X)
  })

  it('detects a draw', () => {
    const board: Board = [X, O, X, X, O, O, O, X, X]
    expect(score(board)).toBe(N)
  })

  it('returns null mid-game', () => {
    const board: Board = [X, O, N, N, X, N, N, N, N]
    expect(score(board)).toBeNull()
  })
})

describe('winningLine', () => {
  it('returns null when no winner', () => {
    expect(winningLine(empty)).toBeNull()
  })

  it('returns the winning pattern indices', () => {
    const board: Board = [X, X, X, O, O, N, N, N, N]
    expect(winningLine(board)).toEqual([0, 1, 2])
  })
})

describe('makeMove', () => {
  it('returns a new board with the move applied', () => {
    const next = makeMove(empty, 4, X)
    expect(next[4]).toBe(X)
  })

  it('does not mutate the original board', () => {
    makeMove(empty, 0, X)
    expect(empty[0]).toBe(N)
  })
})

describe('availableMoves', () => {
  it('returns all 9 positions for an empty board', () => {
    expect(availableMoves(empty)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
  })

  it('returns empty array when the game is won', () => {
    const board: Board = [X, X, X, O, O, N, N, N, N]
    expect(availableMoves(board)).toEqual([])
  })

  it('returns empty array for a full board', () => {
    const board: Board = [X, O, X, X, O, O, O, X, X]
    expect(availableMoves(board)).toEqual([])
  })

  it('returns only empty cells mid-game', () => {
    const board: Board = [X, N, O, N, X, N, N, N, N]
    expect(availableMoves(board)).toEqual([1, 3, 5, 6, 7, 8])
  })
})

describe('otherPlayer', () => {
  it('toggles from X to O', () => {
    expect(otherPlayer(X)).toBe(O)
  })

  it('toggles from O to X', () => {
    expect(otherPlayer(O)).toBe(X)
  })
})

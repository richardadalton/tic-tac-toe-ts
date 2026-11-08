import { describe, it, expect } from 'vitest'
import { X, O, N, type Board } from '../src/constants.js'
import { Random } from '../src/ai/random.js'

const random = new Random()
const empty: Board = [N, N, N, N, N, N, N, N, N]

describe('Random', () => {
  it('returns a valid move on an empty board', () => {
    const move = random.getMove(empty, X)
    expect(move).toBeGreaterThanOrEqual(0)
    expect(move).toBeLessThanOrEqual(8)
  })

  it('never picks an occupied cell', () => {
    const board: Board = [X, O, X, O, X, O, N, N, N]
    for (let i = 0; i < 50; i++) {
      const move = random.getMove(board, X)
      expect([6, 7, 8]).toContain(move)
    }
  })

  it('returns null when no moves are available', () => {
    const board: Board = [X, X, X, O, O, N, N, N, N]
    expect(random.getMove(board, O)).toBeNull()
  })
})

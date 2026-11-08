import { describe, it, expect } from 'vitest'
import { X, O, N, type Board } from '../src/constants.js'
import { makeMove, score } from '../src/game/utils.js'
import { Minimax } from '../src/ai/minimax.js'
import { Random } from '../src/ai/random.js'

const minimax = new Minimax()
const random = new Random()
const empty: Board = [N, N, N, N, N, N, N, N, N]

describe('Minimax', () => {
  it('takes the winning move when available', () => {
    // X can win immediately by completing the top row
    const board: Board = [X, X, N, O, O, N, N, N, N]
    expect(minimax.getMove(board, X)).toBe(2)
  })

  it('blocks the only winning threat', () => {
    // X threatens the diagonal [0,4,8] — O must block at 8
    // All other moves let X win immediately
    const board: Board = [X, O, N, O, X, N, N, N, N]
    expect(minimax.getMove(board, O)).toBe(8)
  })

  it('returns null on a finished board', () => {
    const board: Board = [X, X, X, O, O, N, N, N, N]
    expect(minimax.getMove(board, O)).toBeNull()
  })

  it('always draws against itself', () => {
    function playGame(): number | null {
      let board = [...empty] as Board
      let player = X
      while (true) {
        const move = minimax.getMove(board, player)
        if (move === null) break
        board = makeMove(board, move, player)
        const result = score(board)
        if (result !== null) return result
        player = player === X ? O : X
      }
      return score(board)
    }

    for (let i = 0; i < 10; i++) {
      expect(playGame()).toBe(N)
    }
  })

  it('never loses to a random opponent (minimax plays X)', () => {
    for (let i = 0; i < 20; i++) {
      let board = [...empty] as Board
      let player = X

      while (true) {
        const move = player === X
          ? minimax.getMove(board, player)
          : random.getMove(board, player)

        if (move === null) break
        board = makeMove(board, move, player)
        const result = score(board)
        if (result !== null) {
          expect(result).not.toBe(O)
          break
        }
        player = player === X ? O : X
      }
    }
  })
})

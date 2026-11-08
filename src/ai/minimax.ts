import { X, O, type Board, type Player } from '../constants.js'
import { score, makeMove, availableMoves, otherPlayer } from '../game/utils.js'
import type { TicTacToeAlgorithm } from './algorithm.js'

export class Minimax implements TicTacToeAlgorithm {
  getMove(board: Board, player: Player): number | null {
    if (score(board) !== null) return null

    const moves = availableMoves(board)
    const moveScores = new Map<number, number>()

    for (const move of moves) {
      moveScores.set(move, this.minimax(makeMove(board, move, player), otherPlayer(player)))
    }

    const best = player === X
      ? Math.max(...moveScores.values())
      : Math.min(...moveScores.values())

    const bestMoves = [...moveScores.entries()]
      .filter(([, v]) => v === best)
      .map(([k]) => k)

    return bestMoves[Math.floor(Math.random() * bestMoves.length)]
  }

  private minimax(board: Board, player: Player): number {
    const moves = availableMoves(board)

    if (moves.length === 0) return score(board) as number

    const moveScores: number[] = []

    for (const move of moves) {
      const next = makeMove(board, move, player)
      const s = score(next)
      moveScores.push(s !== null ? s : this.minimax(next, otherPlayer(player)))
    }

    return player === X ? Math.max(...moveScores) : Math.min(...moveScores)
  }
}

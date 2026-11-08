import type { Board, Player } from '../constants.js'
import { availableMoves } from '../game/utils.js'
import type { TicTacToeAlgorithm } from './algorithm.js'

export class Random implements TicTacToeAlgorithm {
  getMove(board: Board, _player: Player): number | null {
    const moves = availableMoves(board)
    if (moves.length === 0) return null
    return moves[Math.floor(Math.random() * moves.length)]
  }
}

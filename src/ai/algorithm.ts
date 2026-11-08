import type { Board, Player } from '../constants.js'

export interface TicTacToeAlgorithm {
  getMove(board: Board, player: Player): number | null
}

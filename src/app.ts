import express, { type Request, type Response } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { X, O, N, type Board, type Cell, type Player } from './constants.js'
import { score, winningLine, availableMoves, otherPlayer, makeMove } from './game/utils.js'
import { Minimax } from './ai/minimax.js'
import { Random } from './ai/random.js'
import type { TicTacToeAlgorithm } from './ai/algorithm.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const app = express()

// Trust X-Forwarded-Proto from Fly.io's TLS-terminating proxy so generated
// links use https:// instead of http:// (avoids mixed-content blocking).
app.set('trust proxy', true)

const algorithms: Record<string, TicTacToeAlgorithm> = {
  minimax: new Minimax(),
  random: new Random(),
}

const strToPlayer: Record<string, Player> = { x: X, o: O }
const playerToStr: Record<number, string> = { [X]: 'x', [O]: 'o' }
const strToCell: Record<string, Cell> = { x: X, o: O, b: N }
const cellToStr: Record<number, string> = { [X]: 'x', [O]: 'o', [N]: 'b' }

function parseBoard(s: string): Board {
  return Array.from(s, c => strToCell[c]) as Board
}

function boardToStr(board: Board): string {
  return board.map(c => cellToStr[c]).join('')
}

function scoreToResult(s: number | null): string | null {
  if (s === X) return 'X Wins'
  if (s === O) return 'O Wins'
  if (s === N) return 'Draw'
  return null
}

function baseUrl(req: Request): string {
  return `${req.protocol}://${req.get('host')}`
}

function buildMoveLinks(
  req: Request,
  board: string,
  player: string,
  xPlayer: string,
  oPlayer: string,
): Record<number, string> {
  const moves: Record<number, string> = {}
  for (let i = 0; i < 9; i++) {
    if (board[i] === 'b') {
      const next = board.slice(0, i) + player + board.slice(i + 1)
      moves[i] = `${baseUrl(req)}/api/move?player=${player}&board=${next}&x_player=${xPlayer}&o_player=${oPlayer}`
    }
  }
  return moves
}

function buildResponse(
  req: Request,
  player: string | null,
  board: string,
  gameScore: number | null,
  winLine: number[] | null,
  xPlayer: string,
  oPlayer: string,
) {
  const game: Record<string, unknown> = { player, board, x_player: xPlayer, o_player: oPlayer }
  const result = scoreToResult(gameScore)
  if (result) game.result = result
  if (winLine) game.win_line = winLine

  const moves = gameScore === null && player
    ? buildMoveLinks(req, board, player, xPlayer, oPlayer)
    : {}

  const links: Record<string, unknown> = {
    new_game: `${baseUrl(req)}/api/new`,
    moves,
  }

  if (gameScore === null && player) {
    const playerConfig = player === 'x' ? xPlayer : oPlayer
    const algo = algorithms[playerConfig]
    if (algo) {
      const boardArr = parseBoard(board)
      const playerInt = strToPlayer[player]
      const bestMove = algo.getMove(boardArr, playerInt)
      if (bestMove !== null) {
        const next = board.slice(0, bestMove) + player + board.slice(bestMove + 1)
        links.ai_move = `${baseUrl(req)}/api/move?player=${player}&board=${next}&x_player=${xPlayer}&o_player=${oPlayer}`
      }
    }
  }

  return { game, links }
}

app.get('/api/new', (req: Request, res: Response) => {
  const xPlayer = (req.query.x_player as string) ?? 'human'
  const oPlayer = (req.query.o_player as string) ?? 'minimax'
  res.json(buildResponse(req, 'x', 'bbbbbbbbb', null, null, xPlayer, oPlayer))
})

app.get('/api/move', (req: Request, res: Response) => {
  const board = req.query.board as string
  const player = req.query.player as string
  const xPlayer = (req.query.x_player as string) ?? 'human'
  const oPlayer = (req.query.o_player as string) ?? 'minimax'

  if (!board || !player) {
    res.status(400).json({ error: 'board and player are required' })
    return
  }

  const boardArr = parseBoard(board)
  const gameScore = score(boardArr)

  if (gameScore !== null) {
    const winLine = winningLine(boardArr)
    res.json(buildResponse(req, null, board, gameScore, winLine, xPlayer, oPlayer))
    return
  }

  const nextPlayer = playerToStr[otherPlayer(strToPlayer[player])]
  res.json(buildResponse(req, nextPlayer, board, null, null, xPlayer, oPlayer))
})

app.use(express.static(path.join(__dirname, '..', 'public')))

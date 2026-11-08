import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app.js'

describe('GET /api/new', () => {
  it('returns initial game state with X to move', async () => {
    const res = await request(app).get('/api/new')
    expect(res.status).toBe(200)
    expect(res.body.game.board).toBe('bbbbbbbbb')
    expect(res.body.game.player).toBe('x')
  })

  it('defaults to human X vs minimax O', async () => {
    const res = await request(app).get('/api/new')
    expect(res.body.game.x_player).toBe('human')
    expect(res.body.game.o_player).toBe('minimax')
  })

  it('includes a new_game link', async () => {
    const res = await request(app).get('/api/new')
    expect(res.body.links.new_game).toBeDefined()
  })

  it('includes move links for all 9 cells when both players are human', async () => {
    const res = await request(app).get('/api/new?x_player=human&o_player=human')
    expect(Object.keys(res.body.links.moves)).toHaveLength(9)
  })

  it('includes ai_move link when X is AI', async () => {
    const res = await request(app).get('/api/new?x_player=minimax&o_player=human')
    expect(res.body.links.ai_move).toBeDefined()
  })

  it('does not include ai_move when X is human', async () => {
    const res = await request(app).get('/api/new?x_player=human&o_player=minimax')
    expect(res.body.links.ai_move).toBeUndefined()
  })
})

describe('GET /api/move', () => {
  it('advances the turn to O after X moves', async () => {
    const res = await request(app).get('/api/move?board=xbbbbbbbb&player=x&x_player=human&o_player=human')
    expect(res.status).toBe(200)
    expect(res.body.game.player).toBe('o')
    expect(res.body.game.board).toBe('xbbbbbbbb')
  })

  it('detects X winning on the top row', async () => {
    const res = await request(app).get('/api/move?board=xxxoobbbb&player=x&x_player=human&o_player=human')
    expect(res.body.game.result).toBe('X Wins')
    expect(res.body.game.win_line).toEqual([0, 1, 2])
    expect(res.body.links.moves).toEqual({})
  })

  it('detects O winning on the top row', async () => {
    const res = await request(app).get('/api/move?board=oooxxxbbx&player=o&x_player=human&o_player=human')
    expect(res.body.game.result).toBe('O Wins')
    expect(res.body.game.win_line).toEqual([0, 1, 2])
  })

  it('detects a draw', async () => {
    const res = await request(app).get('/api/move?board=xxoooxxxo&player=x&x_player=human&o_player=human')
    expect(res.body.game.result).toBe('Draw')
    expect(res.body.game.win_line).toBeUndefined()
  })

  it('preserves player configuration in the response', async () => {
    const res = await request(app).get('/api/move?board=xbbbbbbbb&player=x&x_player=random&o_player=minimax')
    expect(res.body.game.x_player).toBe('random')
    expect(res.body.game.o_player).toBe('minimax')
  })

  it('includes ai_move link when the next player is AI', async () => {
    const res = await request(app).get('/api/move?board=xbbbbbbbb&player=x&x_player=human&o_player=minimax')
    expect(res.body.links.ai_move).toBeDefined()
  })

  it('returns 400 when board is missing', async () => {
    const res = await request(app).get('/api/move?player=x')
    expect(res.status).toBe(400)
  })

  it('returns 400 when player is missing', async () => {
    const res = await request(app).get('/api/move?board=bbbbbbbbb')
    expect(res.status).toBe(400)
  })
})

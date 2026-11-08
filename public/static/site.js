const SVGNS = 'http://www.w3.org/2000/svg'
const XLINKNS = 'http://www.w3.org/1999/xlink'

const BOARD_POSITIONS = {
  0: [0, 0],   1: [100, 0],   2: [200, 0],
  3: [0, 100], 4: [100, 100], 5: [200, 100],
  6: [0, 200], 7: [100, 200], 8: [200, 200],
}

const CELL_CENTERS = {
  0: [50, 50],   1: [150, 50],   2: [250, 50],
  3: [50, 150],  4: [150, 150],  5: [250, 150],
  6: [50, 250],  7: [150, 250],  8: [250, 250],
}

let autoPlayTimer = null

async function fetchGame(url) {
  const res = await fetch(url)
  return res.json()
}

function renderGame(data) {
  const board   = data.game.board
  const moves   = data.links.moves
  const aiMove  = data.links.ai_move ?? null
  const result  = data.game.result ?? ''
  const winLine = data.game.win_line ?? null

  document.getElementById('result_text').textContent = result

  const g = document.getElementById('board')
  g.querySelectorAll('.piece, .win-line').forEach(el => el.remove())

  const effectiveMoves = aiMove ? {} : moves
  for (let i = 0; i < 9; i++) {
    showPiece(board, i, effectiveMoves)
  }

  if (winLine) {
    highlightWinningPieces(winLine)
    setTimeout(() => drawWinLine(winLine), 600)
  } else if (result.toLowerCase() === 'draw') {
    highlightAllPieces(board)
  }

  clearTimeout(autoPlayTimer)
  autoPlayTimer = null

  if (aiMove) {
    const player = data.game.player
    document.getElementById('result_text').textContent = `${player.toUpperCase()} is thinking…`
    autoPlayTimer = setTimeout(async () => {
      autoPlayTimer = null
      renderGame(await fetchGame(aiMove))
    }, 1000)
  }

  document.getElementById('new_game_link').onclick = startNewGame
}

function showPiece(board, position, moves) {
  const [x, y] = BOARD_POSITIONS[position]
  const cell = board[position]

  const g = document.getElementById('board')
  const use = document.createElementNS(SVGNS, 'use')

  const symbol = cell === 'x' ? '#x-piece' : cell === 'o' ? '#o-piece' : '#blank'
  use.setAttributeNS(XLINKNS, 'href', symbol)
  use.setAttribute('class', 'piece')
  use.setAttribute('data-position', position)
  use.setAttribute('x', x)
  use.setAttribute('y', y)

  if (position in moves) {
    use.addEventListener('click', () => fetchGame(moves[position]).then(renderGame))
  }

  g.appendChild(use)
}

function highlightWinningPieces(winLine) {
  document.querySelectorAll('#board .piece').forEach(p => {
    const pos = parseInt(p.getAttribute('data-position'), 10)
    if (winLine.includes(pos)) {
      p.setAttribute('class', 'piece winning')
    }
  })
}

function highlightAllPieces(board) {
  document.querySelectorAll('#board .piece').forEach(p => {
    const pos = parseInt(p.getAttribute('data-position'), 10)
    if (board[pos] !== 'b') {
      p.setAttribute('class', 'piece winning')
      setTimeout(() => p.setAttribute('class', 'piece'), 500)
    }
  })
}

function drawWinLine(winLine) {
  const [x1, y1] = CELL_CENTERS[winLine[0]]
  const [x2, y2] = CELL_CENTERS[winLine[2]]

  const line = document.createElementNS(SVGNS, 'line')
  line.setAttribute('x1', x1)
  line.setAttribute('y1', y1)
  line.setAttribute('x2', x2)
  line.setAttribute('y2', y2)
  line.setAttribute('class', 'win-line')

  document.getElementById('board').appendChild(line)
}

async function startNewGame() {
  clearTimeout(autoPlayTimer)
  autoPlayTimer = null

  const xPlayer = document.getElementById('x_player').value
  const oPlayer = document.getElementById('o_player').value
  renderGame(await fetchGame(`/api/new?x_player=${xPlayer}&o_player=${oPlayer}`))
}

startNewGame()

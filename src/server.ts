import { app } from './app.js'

const port = Number(process.env.PORT ?? 9000)
app.listen(port, () => {
  console.log(`tic-tac-toe listening on http://localhost:${port}`)
})

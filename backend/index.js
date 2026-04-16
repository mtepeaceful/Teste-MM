import { createApp } from './src/app.js'

const app = createApp()
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
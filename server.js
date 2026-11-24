import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json({ limit: '50mb' }))

const formatBigInt = (obj) => {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  )
}

app.get('/api/profiles', async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany()
    res.json(formatBigInt(profiles))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/profiles', async (req, res) => {
  try {
    const profile = await prisma.profile.create({
      data: {
        ...req.body,
        storageLimit: req.body.storageLimit ? BigInt(req.body.storageLimit) : undefined
      }
    })
    res.json(formatBigInt(profile))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/folders', async (req, res) => {
  try {
    const folders = await prisma.folder.findMany()
    res.json(formatBigInt(folders))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/folders', async (req, res) => {
  try {
    const folder = await prisma.folder.create({ data: req.body })
    res.json(formatBigInt(folder))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/files', async (req, res) => {
  try {
    const files = await prisma.file.findMany()
    res.json(formatBigInt(files))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/files', async (req, res) => {
  try {
    const file = await prisma.file.create({
      data: {
        ...req.body,
        size: req.body.size ? BigInt(req.body.size) : undefined
      }
    })
    res.json(formatBigInt(file))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/download-links', async (req, res) => {
  try {
    const links = await prisma.downloadLink.findMany()
    res.json(formatBigInt(links))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/download-links', async (req, res) => {
  try {
    const link = await prisma.downloadLink.create({ data: req.body })
    res.json(formatBigInt(link))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/chat-messages', async (req, res) => {
  try {
    const messages = await prisma.chatMessage.findMany({
      orderBy: { createdAt: 'asc' }
    })
    res.json(formatBigInt(messages))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/chat-messages', async (req, res) => {
  try {
    const message = await prisma.chatMessage.create({ data: req.body })
    res.json(formatBigInt(message))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(port, () => {
  console.log(`Prisma API Server running on port ${port}`)
})

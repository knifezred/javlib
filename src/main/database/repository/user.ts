import { AppDataSource } from '../data-source'
import { User } from '../entity/user'

export function initUserApi(server) {
  const userRepository = AppDataSource.getRepository(User)
  server.get('/api/user/:id', async (req, res) => {
    try {
      const result = await userRepository.findOneBy({ id: req.params.id })
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.post('/api/user/', async (req, res) => {
    try {
      const result = await userRepository.save(req.body)
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.post('/api/user/:id', async (req, res) => {
    try {
      const result = await userRepository.update(req.params.id, req.body)
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.delete('/api/user/:id', async (req, res) => {
    try {
      const result = await userRepository.delete(req.params.id)
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.delete('/api/user/batch-delete', async (req, res) => {
    try {
      const result = await userRepository.delete(req.data.ids)
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.post('/api/user/list', async (_req, res) => {
    try {
      const result = await userRepository.find()
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })
}

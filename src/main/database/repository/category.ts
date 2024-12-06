import { AppDataSource } from '../data-source'
import { Category } from '../entity/category'

export function initCategoryApi(server) {
  const repository = AppDataSource.getRepository(Category)

  server.post('/api/category/list', async (req, res) => {
    try {
      const categories = repository.createQueryBuilder('category')
      if (req.body.type != '') {
        categories.andWhere("category.type like '%:key%'", { key: req.body.type })
      }
      const result = await categories.getMany()
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.get('/api/category/:key', async (req, res) => {
    try {
      const result = await repository.findOneBy({ key: req.params.key })
      res.status(200).send(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.post('/api/category/', async (req, res) => {
    try {
      req.body.createdTime = Date.now()
      req.body.updatedTime = Date.now()
      if (req.body.type == 'tag') {
        const tagItem = await repository.findOneBy({ key: req.params.key, type: 'tag' })
        if (tagItem != null) {
          tagItem.value += req.body.value
          await repository.save(tagItem)
        } else {
          await repository.save(req.body)
        }
      }
      res.status(200).json(true)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.post('/api/category/:key', async (req, res) => {
    try {
      req.body.updatedTime = Date.now()
      const result = await repository.update(
        { key: req.params.key, type: req.params.type },
        req.body
      )
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.delete('/api/category/', async (req, res) => {
    try {
      const result = await repository.delete(req.body)
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })
}

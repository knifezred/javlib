import { Equal, In } from 'typeorm'
import { AppDataSource } from '../data-source'
import { Category } from '../entity/category'

export function initCategoryApi(server) {
  const repository = AppDataSource.getRepository(Category)

  server.post('/api/category/list', async (req, res) => {
    try {
      const categories = repository.createQueryBuilder('category')
      if (req.body.type != undefined && req.body.type != null && req.body.type != '') {
        categories.where({
          type: Equal(req.body.type)
        })
      }
      if (req.body.keys != undefined && req.body.keys != null && req.body.keys != '') {
        categories.where({
          key: In(req.body.keys.split('|').filter((x) => x.length > 0))
        })
      }
      const result = await categories
        .orderBy(
          req.body.sortRule == 'RAND' ? 'RANDOM()' : 'category.' + req.body.sort,
          req.body.sortRule == 'RAND' ? 'ASC' : req.body.sortRule
        )
        .take(req.body.pageSize)
        .skip((req.body.page - 1) * req.body.pageSize)
        .getManyAndCount()
      res.status(200).json({
        records: result[0],
        size: req.body.pageSize,
        current: req.body.page,
        total: result[1]
      })
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.get('/api/category/count/:type', async (req, res) => {
    try {
      const result = await repository.countBy({
        type: req.params.type
      })
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })
  server.get('/api/category/:key', async (req, res) => {
    try {
      const result = await repository.findOneBy({ key: req.params.key })
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.post('/api/category/', async (req, res) => {
    try {
      req.body.createdTime = Date.now()
      req.body.updatedTime = Date.now()
      if (req.body.type == 'tag') {
        const tagItem = await repository.findOneBy({ key: req.body.key, type: 'tag' })
        if (tagItem != null) {
          tagItem.value = req.body.value
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
      const result = await repository.update({ key: req.params.key, type: req.body.type }, req.body)
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

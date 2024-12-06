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

  server.post('/api/category/batch/add', async (req, res) => {
    try {
      const categories = repository.createQueryBuilder('category')
      req.body.items.forEach(async (item) => {
        const cate = await repository.findOne({
          where: {
            type: req.body.type,
            key: item.key
          }
        })
        if (cate != null) {
          cate.value = parseInt(cate.value) + parseInt(item.val) + ''
          repository.save(cate)
        } else {
          repository.create({
            type: req.body.type,
            key: item.key,
            value: item.val
          })
        }
      })
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
      console.log(req.body.createdTime)
      const result = await repository.save(req.body)
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.post('/api/category/:key', async (req, res) => {
    try {
      req.body.updatedTime = Date.now()
      const result = await repository.update({ key: req.params.key }, req.body)
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

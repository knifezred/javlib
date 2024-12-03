import { AppDataSource } from '../data-source'
import { Actress } from '../entity/actress'

export function initActressApi(server) {
  const repository = AppDataSource.getRepository(Actress)

  server.post('/api/actress/list', async (req, res) => {
    console.log('/api/actress/list')
    try {
      const queryBuilder = repository.createQueryBuilder('actress')
      if (req.body.tags != null && req.body.tags != undefined) {
        req.body.tags.forEach((tag: string) => {
          queryBuilder.orWhere('actress.tags like %|:tag|%', { tag })
        })
      }
      if (req.body.keyword != '') {
        queryBuilder
          .andWhere("actress.alias like '%:key%'", { key: req.body.keyword })
          .orWhere("actress.name like '%:key%'", { key: req.body.keyword })
      }
      const result = await queryBuilder
        .orderBy('actress.' + req.body.sort, req.body.sortRole)
        .take(req.body.pageSize)
        .skip((req.body.page - 1) * req.body.pageSize)
        .getManyAndCount()
      console.log(result)
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

  server.get('/api/actress_total_count', async (_req, res) => {
    try {
      const result = await repository.countBy({
        isDelete: false || undefined
      })
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.get('/api/actress/:name', async (req, res) => {
    try {
      const result = await repository.findOneBy({ name: req.params.name })
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.post('/api/actress/', async (req, res) => {
    try {
      req.body.createdTime = Date.now()
      req.body.updatedTime = Date.now()
      const result = await repository.save(req.body)
      res.status(200).send(result.id > 0)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.post('/api/actress/:name', async (req, res) => {
    try {
      req.body.updatedTime = Date.now()
      const result = await repository.update({ name: req.params.name }, req.body)
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.delete('/api/actress/', async (req, res) => {
    try {
      const result = await repository.delete(req.body)
      res.status(200).send(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })
}

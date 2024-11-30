import { AppDataSource } from '../data-source'
import { Movie } from '../entity/movie'

export function initMovieApi(server) {
  const repository = AppDataSource.getRepository(Movie)

  server.post('/api/movie/list', async (req, res) => {
    console.log('/api/movie/list')
    try {
      const movies = repository.createQueryBuilder('movie')
      if (req.body.year != null && req.body.year != undefined) {
        req.body.year.forEach((option) => {
          if (option.indexOf('-') > -1) {
            movies.orWhere('movie.year between :yearStart and :yearEnd', {
              yearStart: option.split('-')[0],
              yearEnd: option.split('-')[1]
            })
          } else {
            movies.orWhere('movie.year = :year', { year: option })
          }
        })
      }
      const result = await movies.orderBy('movie.createdTime', 'DESC').getMany()
      console.log(result)
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.get('/api/movie/:num', async (req, res) => {
    try {
      const result = await repository.findOneBy({ num: req.params.num })
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.post('/api/movie/', async (req, res) => {
    try {
      req.body.createdTime = Date.now()
      req.body.updatedTime = Date.now()
      const result = await repository.save(req.body)
      res.status(200).send(result.id > 0)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.post('/api/movie/:num', async (req, res) => {
    try {
      req.body.updatedTime = Date.now()
      const result = await repository.update({ num: req.params.num }, req.body)
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.delete('/api/movie/', async (req, res) => {
    try {
      const result = await repository.delete(req.body)
      res.status(200).send(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })
}

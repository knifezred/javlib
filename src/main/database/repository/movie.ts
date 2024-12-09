import { Between, Equal, In, Like } from 'typeorm'
import { AppDataSource } from '../data-source'
import { Movie } from '../entity/movie'

export function initMovieApi(server) {
  const repository = AppDataSource.getRepository(Movie)

  server.post('/api/movie/list', async (req, res) => {
    console.log('/api/movie/list')
    try {
      const movies = repository.createQueryBuilder('movie')
      if (req.body.years != null && req.body.years != undefined) {
        const years = []
        const singleYear = req.body.years.filter((x) => x.indexOf('-') == -1)
        if (singleYear.length > 0) {
          years.push({
            year: In(singleYear)
          } as never)
        }
        req.body.years
          .filter((x) => x.indexOf('-') > -1)
          .forEach((option: string) => {
            years.push({
              year: Between(option.split('-')[1], option.split('-')[0])
            } as never)
          })
        if (years.length > 0) {
          movies.orWhere(years)
        }
      }
      if (req.body.tags != null && req.body.tags != undefined) {
        req.body.tags.forEach((tag: string) => {
          movies.where('movie.tags like %|:tag|%', { tag })
        })
      }
      if (req.body.keyword != undefined && req.body.keyword != '') {
        movies.where({
          title: Like('%' + req.body.keyword + '%')
        })
      }
      if (req.body.favorite != undefined) {
        movies.where({
          favorite: Equal(req.body.favorite)
        })
      }
      const result = await movies
        .orderBy(
          req.body.sortRule == 'RAND' ? 'RANDOM()' : 'movie.' + req.body.sort,
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

  server.get('/api/movie_total_file_size', async (_req, res) => {
    try {
      const result = await repository.sum('fileSize')
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.get('/api/movie_total_count', async (_req, res) => {
    try {
      // 所有未删除视频数量
      const result = await repository.countBy({
        isDelete: false || undefined
      })
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
      res.status(200).json(result.id > 0)
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
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })
}

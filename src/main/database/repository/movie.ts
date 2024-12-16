import { Between, Equal, In, Like } from 'typeorm'
import { AppDataSource } from '../data-source'
import { Movie } from '../entity/movie'

export function initMovieApi(server) {
  const repository = AppDataSource.getRepository(Movie)

  server.post('/api/movie/list', async (req, res) => {
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
          movies.andWhere(years)
        }
      }
      // and查询
      if (req.body.tags != null && req.body.tags != undefined) {
        const whereParams: any = {}
        let whereStr = ''
        req.body.tags.forEach((tag: string, index: number) => {
          whereStr += 'movie.tags LIKE :tag' + index + ' AND '
          whereParams['tag' + index] = '%|' + tag + '|%'
        })
        whereStr = whereStr.substring(0, whereStr.length - 4)
        movies.andWhere(whereStr, whereParams)
      }
      if (req.body.keyword != undefined && req.body.keyword != '') {
        movies.andWhere({
          title: Like('%' + req.body.keyword + '%')
        })
      }
      if (req.body.actress != undefined && req.body.actress != '') {
        movies.andWhere({
          actress: Like('%|' + req.body.actress + '|%')
        })
      }
      if (req.body.favorite != undefined && req.body.favorite != null) {
        movies.andWhere({
          favorite: Equal(req.body.favorite)
        })
      }
      if (req.body.studio != undefined && req.body.studio != null && req.body.studio != '') {
        movies.andWhere({
          studio: Equal(req.body.studio)
        })
      }
      if (req.body.series != undefined && req.body.series != null && req.body.series != '') {
        movies.andWhere({
          series: Equal(req.body.series)
        })
      }
      movies.andWhere({
        isDelete: Equal(false)
      })
      if (
        req.body.viewCount != undefined &&
        req.body.viewCount != null &&
        req.body.viewCount == 0
      ) {
        movies.andWhere({
          viewCount: Equal(req.body.viewCount)
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

  server.post('/api/movie/all/movies', async (_req, res) => {
    try {
      const result = (await repository.find()).filter((x) => x.isDelete == false)
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.post('/api/movie/all/actress', async (_req, res) => {
    try {
      const movies = repository.createQueryBuilder('movie')

      const result = await movies
        .where({
          isDelete: Equal(false)
        })
        .groupBy('movie.actress')
        .getMany()
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.post('/api/movie/all/studio', async (_req, res) => {
    try {
      const movies = repository.createQueryBuilder('movie')
      const result = await movies
        .select('movie.studio')
        .where({
          isDelete: Equal(false)
        })
        .groupBy('movie.studio')
        .getMany()
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.post('/api/movie/all/director', async (_req, res) => {
    try {
      const movies = repository.createQueryBuilder('movie')
      const result = await movies
        .select('movie.director')
        .where({
          isDelete: Equal(false)
        })
        .groupBy('movie.director')
        .getMany()
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.post('/api/movie/all/series', async (_req, res) => {
    try {
      const movies = repository.createQueryBuilder('movie')
      const result = await movies
        .select('movie.series')
        .where({
          isDelete: Equal(false)
        })
        .groupBy('movie.series')
        .getMany()
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })
  server.post('/api/movie/all/tags', async (_req, res) => {
    try {
      const movies = repository.createQueryBuilder('movie')
      const result = await movies
        .select('movie.tags')
        .where({
          isDelete: Equal(false)
        })
        .groupBy('movie.tags')
        .getMany()
      res.status(200).json(result)
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
      const result = await repository.save(req.body)
      res.status(200).json(result.id > 0)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.post('/api/movie/:num', async (req, res) => {
    try {
      const result = await repository.update({ num: req.params.num }, req.body)
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.delete('/api/movie/:id', async (req, res) => {
    try {
      const result = await repository.remove(req.params.id)
      res.status(200).json(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })
}

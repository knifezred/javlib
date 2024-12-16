import path from 'path'
import { AppDataSource } from '../database/data-source'
import { Category } from '../database/entity/category'
import { Movie } from '../database/entity/movie'
import { Storage } from '../database/entity/storage'
import {
  copyFile,
  getFileExtension,
  getFileFolder,
  getFileStats,
  listFilesRecursively,
  readFile
} from '../utils/common'

export async function updateMovieLibrary(thumbnails: string) {
  console.log('updateMovieLibrary start')
  let movieCount = 0
  const addMovies: Array<Movie> = []

  const titleRegex = /^<title>(.*?)<\/title>$/
  const originalTitleRegex = /^<originaltitle>(.*?)<\/originaltitle>$/
  const ratingRegex = /^<rating>(.*?)<\/rating>$/
  const plotRegex = /^<plot>(.*?)<\/plot>$/
  const premieredRegex = /^<premiered>(.*?)<\/premiered>$/
  const tagRegex = /^<tag>(.*?)<\/tag>$/
  const genreRegex = /^<genre>(.*?)<\/genre>$/
  const studioRegex = /^<studio>(.*?)<\/studio>$/
  const directorRegex = /^<director>(.*?)<\/director>$/
  const countryRegex = /^<country>(.*?)<\/country>$/
  const numRegex = /^<uniqueid.*>(.*?)<\/uniqueid>$/
  const nameRegex = /^<name>(.*?)<\/name>$/

  const storageRepo = AppDataSource.getRepository(Storage)
  const movieRepo = AppDataSource.getRepository(Movie)
  const allMovies = await movieRepo.find()
  console.log('find ' + allMovies.length + ' movies ')
  const tagIndex = await storageRepo.findOneBy({ key: 'tag_index' })
  let replaceTags = [] as string[]
  if (tagIndex != null) {
    replaceTags = tagIndex.value.split('\n')
  }
  const res = await storageRepo.findOneBy({ key: 'media_folders' })
  if (res) {
    const folders = res.value.split('\n')
    for (const folder of folders) {
      const files = await listFilesRecursively(folder)
      // 读取nfo文件
      for (const file of files) {
        const data = await readFile(file)
        const lines = data.split('\n')
        const movieInfo = {
          title: '',
          originTitle: '',
          introduction: '',
          file: '',
          torrent: '',
          cover: '',
          poster: '',
          tags: '',
          studio: '',
          series: '',
          genres: '',
          actress: '',
          director: '',
          year: 1700,
          releaseTime: '',
          score: 0,
          country: '',
          uniqueid: '',
          num: '',
          fileSize: 0,
          createdTime: new Date().getTime(),
          viewCount: 0,
          favorite: false,
          personalScore: 0
        }
        let isSet = false
        let isActor = false
        lines.forEach((line) => {
          line = line.trim()
          if (titleRegex.test(line)) {
            movieInfo.title = getMatchContent(line, titleRegex)
          } else if (originalTitleRegex.test(line)) {
            movieInfo.originTitle = getMatchContent(line, originalTitleRegex)
          } else if (ratingRegex.test(line)) {
            movieInfo.score = parseFloat(getMatchContent(line, ratingRegex))
          } else if (plotRegex.test(line)) {
            movieInfo.introduction = getMatchContent(line, plotRegex)
          } else if (premieredRegex.test(line)) {
            movieInfo.releaseTime = getMatchContent(line, premieredRegex)
            movieInfo.year = parseInt(movieInfo.releaseTime.substring(0, 4))
          } else if (tagRegex.test(line)) {
            movieInfo.tags += replaceTag(getMatchContent(line, tagRegex), replaceTags)
          } else if (genreRegex.test(line)) {
            movieInfo.genres += replaceTag(getMatchContent(line, genreRegex), replaceTags)
          } else if (directorRegex.test(line)) {
            movieInfo.director = getMatchContent(line, directorRegex)
          } else if (countryRegex.test(line)) {
            movieInfo.country = getMatchContent(line, countryRegex)
          } else if (studioRegex.test(line)) {
            movieInfo.studio = getMatchContent(line, studioRegex)
          } else if (line.startsWith('<uniqueid type="num"')) {
            movieInfo.num = getMatchContent(line, numRegex)
          } else if (line.startsWith('<uniqueid')) {
            movieInfo.uniqueid = getMatchContent(line, numRegex)
          } else if (line == '<set>') {
            isSet = true
          } else if (line == '</set>') {
            isSet = false
          } else if (line == '<actor>') {
            isActor = true
          } else if (line == '</actor>') {
            isActor = false
          } else if (isSet && line.startsWith('<name>')) {
            movieInfo.series = getMatchContent(line, nameRegex)
          } else if (isActor && line.startsWith('<name>')) {
            movieInfo.actress += '|' + getMatchContent(line, nameRegex)
          }
        })
        if (movieInfo.uniqueid != '') {
          if (movieInfo.num == '') {
            movieInfo.num = movieInfo.uniqueid
          }
          let hasVideo = false
          if (movieInfo.tags.length > 0) {
            movieInfo.tags += '|'
          }
          if (movieInfo.actress.length > 0) {
            movieInfo.actress += '|'
          }
          if (movieInfo.genres.length > 0) {
            movieInfo.genres += '|'
          }
          // 复制nfo文件
          var nfoPath = path.join(thumbnails, movieInfo.num, movieInfo.num + getFileExtension(file))
          copyFile(file, nfoPath)

          const coverFolder = getFileFolder(file)
          // 是否存在视频
          for (const dirFile of files.filter((x) => x.startsWith(coverFolder))) {
            if (dirFile.endsWith('.jpg')) {
              if (dirFile.includes('poster') && movieInfo.poster == '') {
                var posterPath = path.join(
                  thumbnails,
                  movieInfo.num,
                  'poster' + getFileExtension(dirFile)
                )
                copyFile(dirFile, posterPath)
                movieInfo.poster = posterPath
              } else if (
                dirFile.includes('fanart') ||
                (dirFile.includes('background') && movieInfo.cover == '')
              ) {
                var coverPath = path.join(
                  thumbnails,
                  movieInfo.num,
                  'fanart' + getFileExtension(dirFile)
                )
                copyFile(dirFile, coverPath)
                movieInfo.cover = coverPath
              }
            }
            // 兼容多视频
            if (dirFile.endsWith('.mp4') || dirFile.endsWith('.mkv') || dirFile.endsWith('.iso')) {
              hasVideo = true
              movieInfo.file += dirFile + ','
              if (dirFile.includes('-C.') || dirFile.includes('-UC.')) {
                movieInfo.tags += '中文字幕' + '|'
              }
              if (dirFile.includes('-UC.') || dirFile.includes('-U.')) {
                movieInfo.tags += '无码破解' + '|'
              }
              const stats = await getFileStats(dirFile)
              if (stats != null) {
                movieInfo.fileSize += stats.size
                movieInfo.createdTime = stats.mtime.getTime()
              }
            }
          }
          if (movieInfo.file.endsWith(',')) {
            movieInfo.file = movieInfo.file.slice(0, -1)
          }
          const movieRes = allMovies.find((x) => x.num == movieInfo.num)
          if (movieRes) {
            if (movieRes.isDelete) {
              const updateMovieInfo = {
                ...movieInfo,
                id: movieRes.id,
                isDelete: !hasVideo,
                favorite: movieRes.favorite,
                personalScore: movieRes.personalScore,
                viewCount: movieRes.viewCount
              } as Movie
              addMovies.push(updateMovieInfo)
            } else {
              const updateMovieInfo = {
                ...movieRes,
                file: movieInfo.file,
                fileSize: movieInfo.fileSize,
                isDelete: !hasVideo
              } as Movie
              addMovies.push(updateMovieInfo)
            }
            console.log('update movie : ' + movieInfo.num)
          } else {
            const dbMovie = {
              ...movieInfo,
              isDelete: !hasVideo,
              favorite: false,
              personalScore: 0,
              viewCount: 0
            } as Movie
            console.log('add movie : ' + dbMovie.num)
            addMovies.push(dbMovie)
          }
        }
      }
    }
  }
  if (addMovies.length > 0) {
    const childrenArray = chunkArray(addMovies, 100)
    for (const child of childrenArray) {
      const createResult = await movieRepo.save(child as Array<Movie>)
      if (createResult) {
        movieCount += createResult.length
        console.log('batch add movies success : ' + createResult.length)
      }
    }
  }

  // 更新标签 update Tags
  const categoryRepo = AppDataSource.getRepository(Category)
  const allTags = await categoryRepo
    .createQueryBuilder('category')
    .where({
      type: 'tag'
    })
    .getMany()
  allTags.forEach((item) => (item.value = 0))
  const movies = movieRepo.createQueryBuilder('movie')
  const movieTags = await movies.select('movie.tags').groupBy('movie.tags').getMany()
  if (movieTags.length > 0) {
    console.log('update tags')
    movieTags.forEach((item) => {
      item.tags
        .split('|')
        .filter((x) => x.length > 0)
        .forEach((tag) => {
          const category = allTags.find((x) => x.key == tag)
          if (category) {
            category.value++
          } else {
            allTags.push({
              type: 'tag',
              key: tag,
              value: 1,
              favorite: false,
              createdTime: new Date().getTime()
            } as never)
          }
        })
    })
    if (allTags.length > 0) {
      const childrenTags = chunkArray(allTags, 100)
      for (const child of childrenTags) {
        const saveResult = await categoryRepo.save(child as Array<Category>)
        console.log('batch save tags success : ' + saveResult.length)
      }
    }
  }
  console.log('updateMovieLibrary end')
  return movieCount
}
function chunkArray(array, chunkSize) {
  const result = []
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize)
    result.push(chunk as never)
  }
  return result
}
function getMatchContent(line: string, reg: RegExp) {
  const matches = line.match(reg)
  if (matches != null && matches.length >= 1) {
    return matches[1]
  } else {
    return ''
  }
}

function replaceTag(tag: string, replaceTags: Array<string>) {
  const replaceTag = replaceTags.find((x) => x.startsWith(tag + '|'))
  if (replaceTag == undefined) {
    return '|' + tag
  } else {
    if (replaceTag.split('|')[1] == '删除') {
      return ''
    } else {
      return '|' + replaceTag.split('|')[1]
    }
  }
}

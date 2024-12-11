import path from 'path'
import { AppDataSource } from '../database/data-source'
import { Movie } from '../database/entity/movie'
import { Storage } from '../database/entity/storage'
import { getFileStats, listFilesRecursively, readFile } from '../utils/common'

export async function updateMovieLibrary() {
  console.log('updateMovieLibrary start')
  let movieCount = 0
  let addMovies: Array<Movie> = []

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
  const tagIndex = await storageRepo.findOneBy({ key: 'tag_index' })
  let replaceTags = [] as string[]
  if (tagIndex != null) {
    replaceTags = tagIndex.value.split('\n')
  }
  const res = await storageRepo.findOneBy({ key: 'media_folders' })
  if (res) {
    const folders = res.value.split('\n')
    folders.forEach(async (folder) => {
      const files = listFilesRecursively(folder)
      // 读取nfo文件
      files
        .filter((x) => x.endsWith('.nfo'))
        .forEach(async (file, fileIndex) => {
          console.log(fileIndex + ' : ' + file)
          const data = readFile(file)
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
            } else if (line.startsWith('<uniqueid type="cid"')) {
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
          if (movieInfo.num != '') {
            // 是否存在视频
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
            // 找封面文件
            const coverFolder = path.dirname(file)
            files
              .filter((x) => x.startsWith(coverFolder))
              .forEach((dirFile) => {
                if (dirFile.endsWith('.jpg')) {
                  if (dirFile.includes('poster')) {
                    movieInfo.poster = dirFile
                  } else if (dirFile.includes('fanart')) {
                    movieInfo.cover = dirFile
                  } else {
                    movieInfo.poster = dirFile
                  }
                }
                // 兼容多视频
                if (dirFile.endsWith('.mp4') || dirFile.endsWith('.mkv')) {
                  hasVideo = true
                  movieInfo.file += dirFile + ','
                  if (dirFile.includes('-C.') || dirFile.includes('-UC.')) {
                    movieInfo.tags += '中文字幕' + '|'
                  }
                  if (dirFile.includes('-UC.') || dirFile.includes('-U.')) {
                    movieInfo.tags += '无码破解' + '|'
                  }
                  const stats = getFileStats(dirFile)
                  if (stats != null) {
                    movieInfo.fileSize += stats.size
                  }
                }
              })
            if (movieInfo.file.endsWith(',')) {
              movieInfo.file = movieInfo.file.slice(0, -1)
            }
            const movieRes = await movieRepo.findOneBy({ num: movieInfo.num })
            console.log('find movie ok: ' + movieInfo.title)
            if (movieRes == null) {
              //   const updateMovieInfo = {
              //     ...movieInfo,
              //     isDelete: false,
              //     favorite: movieRes.favorite,
              //     personalScore: movieRes.personalScore,
              //     viewCount: movieRes.viewCount
              //   } as Movie
              //   movieRepo.save(updateMovieInfo)
              // } else {
              const dbMovie = {
                ...movieInfo,
                isDelete: !hasVideo,
                favorite: false,
                personalScore: 0,
                viewCount: 0
              } as Movie
              console.log('add movie : ' + dbMovie.title)
              const createResult = await movieRepo.save(dbMovie)
              addMovies = []
              if (createResult) {
                movieCount += 1
                console.log('add movie success : ' + dbMovie.title)
              }
            }
          }
        })
    })
  }
  console.log('updateMovieLibrary end')
  return movieCount
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

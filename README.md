# jav-lib

JavLib是一个本地影视库，主要用来管理日本影片、演员数据。

JavLib is a local film and television library, mainly used to manage Japanese film and actor data.

> 需要自行刮削影片并生成影片同目录的nfo、poster.jpg、background.jpg/fanart.jpg文件以便本软件展示获取相关信息和封面图
> You need to scrape the movie yourself and generate nfo, poster. jpg, background.jpg/fanart. jpg files in the same directory as the movie for this software to display and obtain relevant information and cover images

## 特性 / Features

- **检查更新**：支持检测更新，下载安装新版本。
- **演员列表**：支持搜索编辑演员数据，如头像、姓名、别名、身材颜值等信息
- **影片库**：异步同步目录，支持多条件筛选排序搜索
- **标签映射**：支持将不同标签/多语言标签映射为同一标签，支持删除不需要的标签
- **厂商系列**：支持按厂商/系列查看所属影片列表
- **收藏功能**：支持收藏影片、演员、厂商、系列等信息并单独页面展示

## 预览图 / Preview Image

![首页/Home page](/readme/dashboard.png)

首页 / Home page

![影片库/Film lib](/readme/film-lib.png)

影片库 / Film lib

![影片详情/Film Detail](/readme/film-detail.png)

影片详情 / Film Detail

![演员库/Actress](/readme/actress.png)

演员库 / Actress

![演员详情/Actress Detail](/readme/actress-detail.png)

演员详情 / Actress Detail

![系列/Series](/readme/series.png)

系列 / series

![收藏页面/Favorites](/readme/favorites.png)

收藏页面 / Favorites Page

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)

## Project Setup

### Install

```bash
$ pnpm i
```

### Development

```bash
$ pnpm dev
```

### Build

```bash
# For windows
$ pnpm build:win

# For macOS
$ pnpm build:mac

# For Linux
$ pnpm build:linux
```

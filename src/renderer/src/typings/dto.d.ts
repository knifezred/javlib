declare namespace Dto {
  interface PaginatingCommonParams {
    /** current page number */
    current: number
    /** page size */
    size: number
    /** total count */
    total: number
  }

  /** common params of paginating query list data */
  interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
    records: T[]
  }

  namespace Auth {
    interface LoginToken {
      token: string
      accessToken: string
      refreshToken: string
    }

    interface UserInfo {
      userId: string
      userName: string
      roles: string[]
      buttons: string[]
    }
  }
  namespace Route {
    type ElegantConstRoute = import('@elegant-router/types').ElegantConstRoute

    interface MenuRoute extends ElegantConstRoute {
      id: string
    }

    interface UserRoute {
      routes: MenuRoute[]
      home: import('@elegant-router/types').LastLevelRouteKey
    }
  }

  /** AppUser，用户 */
  type AppUser = Api.Common.CommonRecord<{
    /** 姓名 */
    username?: string
    /** 账号 */
    account?: string
    /** 头像 */
    avatar?: string
    /** 是否删除 */
    deleted?: boolean
    /** 邮箱 */
    email?: string
    /** 主键id */
    id?: number
    /** 是否启锁定 */
    locked?: boolean
    /** 所属部门id */
    organizationId?: number
    /** 密码 */
    password?: string
    /** 电话 */
    phone?: string
  }>
  /** UserDTO */
  type UserDTO = Api.Common.CommonRecord<{
    /** 账号 */
    account: string
    /** 头像 */
    avatar: string
    /** 邮箱 */
    email: string
    /** 是否启锁定 */
    locked: boolean
    /** 所属部门id */
    organizationId: number
    /** 所属部门 */
    organizationName: string
    /** 电话 */
    phone: string
    /** 角色 */
    roles: AllRole[]
    /** 已选择的角色 */
    selectedRoles: Array<number>
    /** 姓名 */
    username: string
  }>

  /** UserModifyDTO */
  type UserModifyDTO = Api.Common.CommonRecord<{
    /** 姓名 */
    username?: string
    /** 账号 */
    account?: string
    /** 头像 */
    avatar?: string
    /** 是否删除 */
    deleted?: boolean
    /** 邮箱 */
    email?: string
    /** 是否启锁定 */
    locked: boolean
    /** 所属部门id */
    organizationId?: number
    /** 密码 */
    password?: string
    /** 电话 */
    phone?: string
    /** 角色 */
    roles?: number[]
  }>

  /**
   * user gender
   *
   * - "1": "male"
   * - "2": "female"
   */
  type UserGender = '1' | '2'

  /** user */
  type User = Api.Common.CommonRecord<{
    username: string
    userGender: UserGender | null
    nickName: string
    phone: string
    email: string
    // roles: string[];
    organizationIds: number[]
    locked: boolean
  }>

  /** AppUserPagedQueryRequest */
  interface AppUserPagedQueryRequest {
    /** 是否锁定 */
    locked?: boolean
    /** 部门 */
    organizationIds?: number[]
    /** 用户姓名 */
    username: string
  }
  /** user search params */
  type UserSearchParams = CommonType.RecordNullable<
    Pick<SystemManage.AppUserPagedQueryRequest, 'username' | 'organizationIds' | 'locked'> &
      CommonSearchParams
  >

  /** user list */
  type UserList = PaginatingQueryRecord<AppUserDTO>

  /** Storage */
  type DbStorage = {
    id?: number
    key: string
    value: string
    createdTime?: number
    updatedTime?: number
  }

  type MovieSearchOption = {
    tags: string[] | null
    years: string[] | null
    type: string[] | null
    keyword: string
    sort: string
    sortRole: string
    page: number
    pageSize: number
  }

  interface DbMovie extends MovieInfo {
    id?: number
    createdTime: number //添加时间
    updatedTime?: number
    isDelete?: boolean
    viewCount: number //查看次数
    favorite: boolean //收藏
    personalScore: number | undefined //私人评分
  }
  type DbMovieQuery = {
    page: number
    pageSize: number
    uniqueid?: string //唯一标识
    num?: string //番号
    title?: string //中文标题
    introduction?: string //简介
    tags?: string[] | null //标签
    genres?: string[] | null //流派
    studio?: string //厂商
    country?: string //地区
    series?: string //系列
    actor?: string //演员
    director?: string //导演
    year?: string[] | null //年份
    releaseTime?: string //上映时间
  }
  type MovieList = PaginatingQueryRecord<DbMovie>
  type MovieInfo = {
    uniqueid: string //唯一标识
    num: string //番号
    title: string //中文标题
    originTitle: string //原始标题
    introduction: string //简介
    file: string //文件路径
    torrent: string //种子
    cover: string //封面
    poster: string //海报
    tags: string //标签
    genres: string //流派
    studio: string //厂商
    country: string //地区
    series: string //系列
    actor: string //演员
    director: string //导演
    year: number //年份
    releaseTime: string //上映时间
    score: number //评分
    fileSize: number
  }

  type ActorInfo = {
    localeName: string
    originName: string
    introduction: string
    birth: string
    age: number
    faceVal: number
    bodyVal: number
    score: number
    tags: string[]
  }
}

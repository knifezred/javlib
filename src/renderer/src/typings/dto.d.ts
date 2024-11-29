declare namespace Dto {
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
  type UserList = Api.Common.PaginatingQueryRecord<AppUserDTO>

  /** Storage */
  type DbStorage = {
    id?: number
    key: string
    value: string
    createdTime?: number
    updatedTime?: number
  }
}

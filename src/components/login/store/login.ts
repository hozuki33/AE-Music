import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { gotoPhoneLogin, getUserAccount } from '../service/login'
import { message } from 'antd'
// import md5 from 'js-md5'
import loginInfo from '@/config/token'
import { getLoginInfo, setLoginInfo } from '@/utils/secret-key'
import { IRootState, DispatchType } from '@/store'

const md5 = (str: string): string => {
  let hash = 0,
    i,
    chr
  if (str.length === 0) return hash.toString()
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0
  }
  return hash.toString(16)
}
type AppThunkApi = {
  state: IRootState
  dispatch: DispatchType
  rejectValue: string
}

export interface IProfile {
  id?: number
  nickname?: string
  [key: string]: any
}

// Login State 核心类型
interface ILoginState {
  isVisible: boolean // 登录弹窗显隐
  isLogin: boolean // 登录状态
  profile: IProfile | null // 用户信息
  token: string // 登录token
  cookie: string // 登录cookie
}
interface LoginResponse {
  code: number
  cookie?: string
  token?: string
  profile?: {
    id?: number
    nickname?: string
    avatarUrl?: string
    [key: string]: any
  }
}
const initialState: ILoginState = {
  isVisible: false,
  isLogin: false,
  profile: null,
  token: '',
  cookie: ''
}
// 扫码登录成功后的统一处理
export const fetchQrLoginSuccess = createAsyncThunk<
  void,
  { cookie: string },
  AppThunkApi
>('login/fetchQrLoginSuccess', async ({ cookie }, { dispatch }) => {
  try {
    // 1. 设置 cookie
    if (cookie) {
      document.cookie = cookie
      dispatch(changeUserLoginCookieAction(cookie))
    }

    // 2. 标记已登录
    dispatch(changeUserLoginStateAction(true))

    // 3. 拉取用户信息
    // 用 cookie 换 profile
    // const profileRes = await getUserAccount() / getUserProfile()
    // dispatch(changeUserProfileAction(profileRes.profile))

    message.success('登录成功')

    // 4. 关闭登录弹窗
    dispatch(changeIsVisibleAction(false))
  } catch (err) {
    message.error('登录状态初始化失败')
  }
})
//刷新后恢复登录状态
export const restoreLoginState = createAsyncThunk<
  void,
  void,
  AppThunkApi
>('login/restoreLoginState', async (_, { dispatch }) => {
  try {
    const res = await getUserAccount()

    if (res.code !== 200 || !res.profile) {
      return
    }

    // 恢复登录态
    dispatch(changeUserLoginStateAction(true))
    dispatch(changeUserProfileAction(res.profile))

  } catch (err) {
    console.log('未检测到有效登录态')
  }
})
// 异步Action：获取登录信息（替换原 getLoginProfileInfo）
export const fetchLoginProfileInfo = createAsyncThunk<
  void,
  { username: string; password: string; tip?: boolean },
  AppThunkApi
>('login/fetchLoginProfile', async (params, { dispatch }) => {
  const { username, password, tip } = params
  try {
    console.log('开始登录...', username, password)
    // const res = await gotoPhoneLogin(username, undefined, md5(password))
    const res = (await gotoPhoneLogin({
      phone: username,
      password
      // md5_password: password
    })) as LoginResponse // 显式指定返回值类型
    if (res.code !== 200) {
      message.error('账号或密码错误')
      return
    }

    tip && message.success('登录成功')
    const cookie = res.cookie || ''
    if (cookie) {
      document.cookie = cookie
      dispatch(changeUserLoginCookieAction(cookie))
    }
    dispatch(changeUserProfileAction(res?.profile))
    dispatch(changeUserLoginStateAction(true))
    dispatch(changeUserLoginTokenAction(res.token))
    dispatch(changeUserLoginCookieAction(res.cookie))

    // 持久化登录信息到本地
    loginInfo.username = username
    loginInfo.password = password
    loginInfo.state = true
    const newLoginInfo = Object.assign(getLoginInfo('loginInfo'), loginInfo)
    setLoginInfo('loginInfo', newLoginInfo)

    // 关闭登录弹窗
    dispatch(changeIsVisibleAction(false))
  } catch (error) {
    console.error('登录请求失败:', error)
    message.error('登录失败，请稍后重试')
  }
})

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    // 更改登录弹窗显隐
    changeIsVisibleAction(state, { payload }) {
      state.isVisible = payload
    },
    // 更改用户信息
    changeUserProfileAction(state, { payload }) {
      state.profile = payload
    },
    // 更改登录状态
    changeUserLoginStateAction(state, { payload }) {
      state.isLogin = payload
    },
    // 更改token
    changeUserLoginTokenAction(state, { payload }) {
      state.token = payload
    },
    // 更改cookie
    changeUserLoginCookieAction(state, { payload }) {
      state.cookie = payload
    }
    // 扩展：退出登录（可选补充）
    // logoutAction(state) {
    //   state.isLogin = false
    //   state.profile = ''
    //   state.token = ''
    //   state.cookie = ''
    //   // 清空本地持久化信息
    //   const emptyLoginInfo = { ...getLoginInfo('loginInfo'), state: false }
    //   setLoginInfo('loginInfo', emptyLoginInfo)
    // }
  }
})

export const {
  changeIsVisibleAction,
  changeUserProfileAction,
  changeUserLoginStateAction,
  changeUserLoginTokenAction,
  changeUserLoginCookieAction
  // logoutAction
} = loginSlice.actions

export default loginSlice.reducer

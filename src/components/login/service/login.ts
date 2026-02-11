import hyRequest from '@/service'

/**
 * 手机号登录接口参数类型
 */
export interface PhoneLoginParams {
  phone: string | number
  password?: string
  md5_password?: string
  countrycode?: string | number
}

/**
 * 邮箱登录接口参数类型
 */
export interface EmailLoginParams {
  email: string
  password?: string
  md5_password?: string
}

/**
 * 发送验证码接口参数类型
 */
export interface SendCaptchaParams {
  phone: string | number
}

/**
 * 手机号注册接口参数类型
 */
export interface RegisterParams {
  captcha: string | number
  phone: string | number
  password: string
  nickname: string
}

/**
 * 通用登录/注册接口返回值类型
 */
export interface LoginResponse {
  code: number // 状态码 200=成功
  cookie?: string // 登录cookie
  token?: string // 登录token
  profile?: {
    // 用户信息
    id: number
    nickname: string
    avatarUrl?: string
  }
  [key: string]: any
}

/**
 * 手机号登录
 * @param params 登录参数
 * @returns Promise<LoginResponse>
 */
export function gotoPhoneLogin({
  phone,
  password,
  md5_password,
  countrycode = 86
}: PhoneLoginParams): Promise<LoginResponse> {
  return hyRequest.get({
    url: '/login/cellphone',
    params: {
      phone,
      password,
      countrycode,
      md5_password
    }
  })
}

/**
 * 邮箱登录
 * @param params 登录参数
 * @returns Promise<LoginResponse>
 */
export function gotoEmailLogin({
  email,
  password,
  md5_password
}: EmailLoginParams): Promise<LoginResponse> {
  return hyRequest.get({
    url: '/login',
    params: {
      email,
      password,
      md5_password
    }
  })
}

/**
 * 发送注册验证码
 * @param params 验证码参数
 * @returns Promise<{ code: number; msg?: string }>
 */
export function sendRegisterCode({
  phone
}: SendCaptchaParams): Promise<{ code: number; msg?: string }> {
  return hyRequest.get({
    url: '/captcha/sent',
    params: {
      phone
    }
  })
}

/**
 * 手机号注册
 * @param params 注册参数
 * @returns Promise<LoginResponse>
 */
export function sendRegister({
  captcha,
  phone,
  password,
  nickname
}: RegisterParams): Promise<LoginResponse> {
  return hyRequest.get({
    url: '/register/cellphone',
    params: {
      captcha,
      phone,
      password,
      nickname
    }
  })
}

/**
 * 获取二维码 key
 */
export function getQrKey(): Promise<{
  code: number
  data: {
    unikey: string
  }
}> {
  return hyRequest.get({
    url: '/login/qr/key',
    params: {
      timestamp: Date.now()
    }
  })
}

/**
 * 创建二维码
 */
export function createQrCode(unikey: string): Promise<{
  code: number
  data: {
    qrimg: string
    qrurl: string
  }
}> {
  return hyRequest.get({
    url: '/login/qr/create',
    params: {
      key: unikey,
      qrimg: true,
      timestamp: Date.now()
    }
  })
}

/**
 * 检查二维码登录状态
 */
export function checkQrStatus(unikey: string): Promise<{
  code: number
  cookie?: string
  message?: string
}> {
  return hyRequest.get({
    url: '/login/qr/check',
    params: {
      key: unikey,
      timestamp: Date.now()
    }
  })
}
export function getUserAccount(): Promise<{
  code: number
  profile?: {
    userId: number
    nickname: string
    avatarUrl: string
    [key: string]: any
  }
}> {
  return hyRequest.get({
    url: '/user/account'
  })
}

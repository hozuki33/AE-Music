import CryptoJS from 'crypto-js'
import { message } from 'antd'
import { secretKey } from '@/config/token'

/**
 * 加密信息，本地存储
 * @param key 本地存储 key
 * @param info 用户信息
 */
export async function setLoginInfo(
  key: string,
  info: Record<string, any>
): Promise<boolean> {
  if (key.length > 0 && JSON.stringify(info) !== '{}') {
    // 1. 要存储的值
    // 2. 加密秘钥（解密时必须一致）
    const cipherText = CryptoJS.AES.encrypt(
      JSON.stringify(info),
      secretKey
    ).toString()

    localStorage.setItem(key, cipherText)
    return true
  } else {
    message.error('网络异常, 请稍后重试')
    return false
  }
}

/**
 * 取出加密后的信息
 * @param key 本地存储 key
 */
export function getLoginInfo<T = any>(key: string): T | null {
  if (!key.length) return null

  const tk = localStorage.getItem(key)
  if (!tk) return null

  try {
    const bytes = CryptoJS.AES.decrypt(tk, secretKey)
    const originalText = bytes.toString(CryptoJS.enc.Utf8)

    if (!originalText) return null

    return JSON.parse(originalText) as T
  } catch (error) {
    console.error('getLoginInfo decrypt error:', error)
    return null
  }
}

/**
 * 清除登录状态
 */
export function clearLoginState(): void {
  localStorage.clear()
  window.location.reload()
}

/**
 * 格式化数字（万/亿单位）
 * @param count 要格式化的数字
 * @returns 格式化后的字符串（如：1234 → 1234，12345 → 1.2万，123456789 → 1.2亿）
 */
export function getCount(count: number): string | number | undefined {
  if (count < 0) return undefined
  if (count < 10000) {
    return count
  } else if (Math.floor(count / 10000) < 10000) {
    return Math.floor(count / 1000) / 10 + '万'
  } else {
    return Math.floor(count / 10000000) / 10 + '亿'
  }
}

/**
 * 简化版数字格式化（仅万单位）
 * @param count 要格式化的数字
 * @returns 格式化后的字符串（如：123456 → 12万）
 */
export function formatCount(count: number): string | number {
  if (count > 100000) {
    return Math.floor(count / 10000) + '万'
  } else {
    return count
  }
}

/**
 * 获取指定尺寸的图片URL（正方形）
 * @param imgUrl 原始图片URL
 * @param size 尺寸（宽=高）
 * @returns 带尺寸参数的图片URL
 */
export function getSizeImage(imgUrl: string, size: number): string {
  if (!imgUrl) return '' // 兜底空URL
  return `${imgUrl}?param=${size}x${size}`
}

/**
 * 获取指定尺寸的图片URL（支持宽高不同）
 * @param imageUrl 原始图片URL
 * @param width 宽度
 * @param height 高度（默认等于宽度）
 * @returns 带尺寸参数的图片URL
 */
export function getImageSize(
  imageUrl: string,
  width: number,
  height: number = width
): string {
  if (!imageUrl) return '' // 兜底空URL
  return imageUrl + `?params=${width}y${height}`
}

/**
 * 获取歌曲播放URL
 * @param id 歌曲ID
 * @returns 播放URL
 */
export function getPlayUrl(id: number): string {
  if (!id) return '' // 兜底空ID
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`
}

/**
 * 补零函数（内部使用）
 * @param str 要补零的字符串
 * @returns 补零后的字符串
 */
function padLeftZero(str: string): string {
  // 替换 substr → slice（标准 API）
  return ('00' + str).slice(-str.length)
}

/**
 * 格式化日期
 * @param time 时间戳（毫秒）
 * @param fmt 格式（如：yyyy-MM-dd hh:mm:ss）
 * @returns 格式化后的日期字符串
 */
export function formatDate(time: number, fmt: string): string {
  if (!time || !fmt) return '' // 兜底空值
  const date = new Date(time)

  // 处理年份：替换 RegExp.$1 → 分组捕获 + 替换函数
  fmt = fmt.replace(/(y+)/, (match, group1) => {
    const year = date.getFullYear().toString()
    // 替换 substr → slice（标准 API）
    return year.slice(-group1.length)
  })

  // 处理月/日/时/分/秒
  const o: Record<string, number> = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }

  // 替换 RegExp.$1 → 分组捕获 + 替换函数
  Object.keys(o).forEach((k) => {
    fmt = fmt.replace(new RegExp(`(${k})`), (match, group1) => {
      const value = o[k].toString()
      return group1.length === 1 ? value : padLeftZero(value)
    })
  })

  return fmt
}

/**
 * 格式化日期为 月/日（如：02月09日）
 * @param time 时间戳（毫秒）
 * @returns 格式化后的字符串
 */
export function formatMonthDay(time: number): string {
  return formatDate(time, 'MM月dd日')
}

/**
 * 格式化时长为 分:秒（如：03:45）
 * @param time 时长（毫秒）
 * @returns 格式化后的字符串
 */
export function formatMinuteSecond(time: number): string {
  if (!time) return '00:00' // 兜底空值
  return formatDate(time, 'mm:ss')
}

/**
 * 函数防抖: 解决高频触发问题
 * @param func 要防抖的函数
 * @param delay 防抖延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout | null = null

  // 显式指定 this 类型为 unknown
  return function (this: unknown, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
// export function formatCount(count: number) {
//   if (count > 100000) {
//     return Math.floor(count / 10000) + '万'
//   } else {
//     return count
//   }
// }
// export function getImageSize(
//   imageUrl: string,
//   width: number,
//   height: number = width
// ) {
//   return imageUrl + `?params=${width}y${height}`
// }
/**
 * 定义登录模式的枚举（替代魔法字符串，更规范）
 */
export enum LoginMode {
  Phone = 'phone',
  Email = 'email'
}

/**
 * 解析登录状态，返回对应的中文登录模式
 * @param loginState 登录模式（仅支持 phone/email）
 * @returns 中文登录模式名称
 */
export function getParseLoginState(loginState: LoginMode | string): string {
  let loginMode: string = '手机号' // 初始化默认值

  switch (loginState) {
    case LoginMode.Phone:
      loginMode = '手机号'
      break
    case LoginMode.Email:
      loginMode = '邮箱'
      break
    default:
      loginMode = '手机号' // 非预期值默认返回手机号
      break
  }

  return loginMode
}

/**
 * 根据登录方式返回对应的校验正则
 * @param loginState 登录模式（仅支持 phone/email）
 * @returns 手机号/邮箱正则表达式，非预期值返回空字符串
 */
export function getMatchReg(loginState: LoginMode | string): RegExp | string {
  switch (loginState) {
    case LoginMode.Phone:
      // 匹配手机号（支持+86/0086前缀）
      return /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
    case LoginMode.Email:
      // 标准邮箱正则
      return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    default:
      return ''
  }
}

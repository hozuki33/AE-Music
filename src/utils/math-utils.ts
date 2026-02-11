/**
 * 生成 0 到 num-1 之间的随机整数
 * @param num 随机数上限（不包含）
 * @returns {number} 随机整数
 */
export const getRandomNumber = (num: number): number => {
  if (typeof num !== 'number' || num <= 0) {
    console.warn('getRandomNumber: 参数必须是大于 0 的数字')
    return 0
  }
  return Math.floor(Math.random() * num)
}

/**
 * 在数组中根据 id 查找元素的索引
 * @param arr 待查找的数组（元素必须包含 id 字段）
 * @param findId 要查找的 id 值
 * @returns {number} 找到返回索引，未找到返回 -1
 */
export const getFindIdIndex = <T extends { id: number }>(
  arr: T[],
  findId: number
): number => {
  if (!Array.isArray(arr)) {
    console.warn('getFindIdIndex: 第一个参数必须是数组')
    return -1
  }

  if (typeof findId !== 'number') {
    console.warn('getFindIdIndex: 查找的 id 必须是数字')
    return -1
  }

  return arr.findIndex((song) => song.id === findId)
}

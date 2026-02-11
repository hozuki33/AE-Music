/**
 * 平滑滚动元素到指定位置
 * @param element 需要滚动的 DOM 元素
 * @param to 目标滚动位置（scrollTop 值）
 * @param duration 滚动时长（毫秒）
 */
export function scrollTo(
  element: HTMLElement | null,
  to: number,
  duration: number
): void {
  // 边界值判断：时长<=0 或元素不存在时直接返回
  if (duration <= 0 || !element) return

  const difference = to - element.scrollTop
  const perTick = (difference / duration) * 10

  setTimeout(() => {
    element.scrollTop = element.scrollTop + perTick
    // 滚动到目标位置或剩余时长不足时终止递归
    if (Math.abs(element.scrollTop - to) < 1 || duration - 10 <= 0) {
      element.scrollTop = to // 修正最终位置偏差
      return
    }
    scrollTo(element, to, duration - 10)
  }, 10)
}

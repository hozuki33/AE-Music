import { useDispatch } from 'react-redux'
import { useEffect, type KeyboardEvent } from 'react'
import { changeFocusStateAction } from '@/components/app-header/store/header'
import { useAppDispatch } from '@/store'

/**
 * 调用该函数,返回一个函数,改变搜索下拉框的状态(默认为false)
 * @param state 下拉框目标状态（true:显示，false:隐藏）
 * @returns {() => void} 触发状态变更的函数
 */
export function useChangeDropBoxState(state: boolean = false): () => void {
  // 使用项目封装的 useAppDispatch，保持风格统一
  const dispatch = useAppDispatch()

  return () => {
    dispatch(changeFocusStateAction(state))
  }
}

/**
 * 调用该hook注册全局键盘事件: ctrl+k唤醒搜索框  esc关闭下拉框
 * ✨ 修复：添加 useEffect 处理事件监听，避免内存泄漏
 */
export function useGlobalKeyboardEvent(): void {
  const showDropBoxState = useChangeDropBoxState(true)
  const closeDropBoxState = useChangeDropBoxState(false)

  useEffect(() => {
    // 事件处理函数（添加类型注解）
    const handleKeyDown = (e: KeyboardEvent | globalThis.KeyboardEvent) => {
      // 类型收窄：确保是 DOM 键盘事件
      const event = e as globalThis.KeyboardEvent

      // Ctrl+K 唤醒搜索框
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault()
        showDropBoxState()
      }

      // ESC 关闭下拉框
      if (event.key === 'Escape') {
        closeDropBoxState()
      }
    }

    // 注册全局键盘事件
    document.addEventListener('keydown', handleKeyDown)

    // 清理函数：组件卸载时移除事件监听（避免内存泄漏）
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showDropBoxState, closeDropBoxState]) // 依赖项
}

/**
 * 唤醒登录框
 * @deprecated 暂未实现，保留类型定义
 */
// export function useAwakenModal(): void {
//   const dispatch = useAppDispatch()
//   // 假设 changeIsVisible 是控制登录框显隐的 action
//   // dispatch(changeIsVisible(true))
// }

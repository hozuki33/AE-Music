import { useDispatch } from 'react-redux'
import type { MessageInstance } from 'antd/es/message/interface'
import { fetchCurrentSongAction } from '@/views/discover/c-views/player/store/player'
import { getFindIdIndex } from '@/utils/math-utils'
import { useAppDispatch } from '@/store' // 替换原生 useDispatch，保持和项目风格一致

// ====================== 类型定义 ======================
// 播放列表项类型（匹配 player.ts 中的 ISong 接口）
interface IPlayListItem {
  id: number
  [key: string]: any // 兼容其他字段
}

// 事件类型（兼容不同元素的事件对象）
type AddPlaylistEvent = {
  preventDefault?: () => void
  stopPropagation?: () => void
  [key: string]: any
}

/**
 * 调用该函数:传递播放列表和message组件,返回一个函数供于合成事件调用
 * @param {Array} playlist redux保存中播放列表
 * @param {MessageInstance} message Ant design消息组件:用于弹窗
 * @returns {(e: AddPlaylistEvent, id: number) => void} 事件处理函数
 */
export function useAddPlaylist(
  playlist: IPlayListItem[],
  message: MessageInstance
) {
  // 使用项目封装的 useAppDispatch（保持风格统一）
  const dispatch = useAppDispatch()

  return (e: AddPlaylistEvent, id: number) => {
    // 阻止超链接跳转
    e.preventDefault && e.preventDefault()

    // 获取歌曲详情,添加到播放列表
    dispatch(fetchCurrentSongAction(id))

    // 提示添加成功或失败
    const index = getFindIdIndex(playlist, id)

    switch (index) {
      case -1:
        message.success({ content: '添加成功' })
        break
      default:
        message.success({ content: '不能添加重复的歌曲' })
    }
  }
}

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getSongDetail, getSongLyric } from '../service/player'
import { ILyricInfo, parseLyric } from '@/utils/parse-lyric'
import { IRootState, DispatchType } from '@/store'

type AppThunkApi = {
  state: IRootState
  dispatch: DispatchType
  rejectValue: string
}

// 歌曲类型定义
export interface ISong {
  id: number
  name: string
  ar: Array<{ id: number; name: string }>
  dt: number
  al?: {
    picUrl: string
  }
}

// Player State 类型定义
interface IPlayerState {
  currentSong: ISong | null
  lyrics: ILyricInfo[]
  lyricIndex: number
  playSongList: ISong[]
  currentSongIndex: number
  playMode: number // 0:顺序 1:随机 2:单曲循环
}

// 初始状态
const initialState: IPlayerState = {
  currentSong: null,
  lyrics: [],
  lyricIndex: -1,
  playSongList: [],
  currentSongIndex: -1,
  playMode: 0
}

// 抽离公共函数：加载歌词
const loadSongLyric = async (id: number, dispatch: DispatchType) => {
  try {
    const res = await getSongLyric(id)
    if (res?.lrc?.lyric) {
      const lyrics = parseLyric(res.lrc.lyric)
      dispatch(changeLyricsAction(lyrics))
    } else {
      dispatch(changeLyricsAction([]))
    }
  } catch (error) {
    console.error('加载歌词失败:', error)
    dispatch(changeLyricsAction([]))
  }
}

// 获取/添加当前播放歌曲
export const fetchCurrentSongAction = createAsyncThunk<
  void,
  number,
  AppThunkApi
>('player/fetchCurrentSong', async (id, { dispatch, getState }) => {
  try {
    const { player } = getState()
    const { playSongList } = player

    const findIndex = playSongList.findIndex((item) => item.id === id)

    if (findIndex === -1) {
      const res = await getSongDetail(id)
      if (!res?.songs?.length) {
        console.warn('未获取到歌曲详情:', id)
        return
      }

      const newSong = res.songs[0]
      const newPlaySongList = [...playSongList, newSong]

      dispatch(changeCurrentSongAction(newSong))
      dispatch(changePlaySongListAction(newPlaySongList))
      dispatch(changeCurrentSongIndexAction(newPlaySongList.length - 1))
    } else {
      const song = playSongList[findIndex]
      dispatch(changeCurrentSongAction(song))
      dispatch(changeCurrentSongIndexAction(findIndex))
      console.log('切换到已存在的歌曲:', song.name)
    }

    await loadSongLyric(id, dispatch)
  } catch (error) {
    console.error('获取歌曲失败:', error)
  }
})

// 切换上一首/下一首
export const changePlaySongAction = createAsyncThunk<
  void,
  boolean,
  AppThunkApi
>('player/changePlaySong', async (isNext, { dispatch, getState }) => {
  try {
    const { player } = getState()
    const { playMode, currentSongIndex, playSongList } = player

    if (playSongList.length === 0) {
      console.warn('播放列表为空，无法切换歌曲')
      return
    }

    let newIndex = currentSongIndex

    switch (playMode) {
      case 1: // 随机播放
        do {
          newIndex = Math.floor(Math.random() * playSongList.length)
        } while (newIndex === currentSongIndex && playSongList.length > 1)
        break
      case 2: // 单曲循环
        newIndex = currentSongIndex
        break
      default: // 顺序播放
        newIndex = isNext ? currentSongIndex + 1 : currentSongIndex - 1
        if (newIndex >= playSongList.length) newIndex = 0
        if (newIndex < 0) newIndex = playSongList.length - 1
        break
    }

    const newSong = playSongList[newIndex]
    dispatch(changeCurrentSongAction(newSong))
    dispatch(changeCurrentSongIndexAction(newIndex))

    await loadSongLyric(newSong.id, dispatch)
  } catch (error) {
    console.error('切换歌曲失败:', error)
  }
})

// 创建 Slice
const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    changeCurrentSongAction(state, { payload }) {
      state.currentSong = payload
    },
    changeLyricsAction(state, { payload }) {
      state.lyrics = payload
    },
    changeLyricIndexAction(state, { payload }) {
      state.lyricIndex = payload
    },
    changeCurrentSongIndexAction(state, { payload }) {
      state.currentSongIndex = payload
    },
    changePlaySongListAction(state, { payload }) {
      state.playSongList = payload
    },
    changePlayModeAction(state, { payload }) {
      state.playMode = payload
    },
    clearPlaySongListAction(state) {
      state.playSongList = []
      state.currentSong = null
      state.currentSongIndex = -1
      state.lyrics = []
      state.lyricIndex = -1
    }
  }
})

export const {
  changeLyricIndexAction,
  changeCurrentSongAction,
  changeLyricsAction,
  changeCurrentSongIndexAction,
  changePlaySongListAction,
  changePlayModeAction,
  clearPlaySongListAction
} = playerSlice.actions

export default playerSlice.reducer

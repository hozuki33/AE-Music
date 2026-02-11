import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getSearchSongData } from '@/components/app-header/service/header'
import { IRootState, DispatchType } from '@/store'

type AppThunkApi = {
  state: IRootState
  dispatch: DispatchType
  rejectValue: string
}

// 搜索歌曲项类型
export interface ISearchSong {
  id: number
  name: string
  artists: Array<{ id: number; name: string }>
  album?: {
    id: number
    name: string
    picUrl?: string
  }
  duration?: number
  [key: string]: any
}

// 搜索歌手项类型
export interface ISearchSinger {
  id: number
  name: string
  picUrl?: string
  albumSize?: number
  [key: string]: any
}

// 搜索State类型
interface ISearchState {
  // 搜索基础状态
  focusState: boolean // 搜索框是否聚焦
  searchValue: string // 搜索框输入值
  searchHistory: string[] // 搜索历史

  // 搜索结果
  searchSongList: ISearchSong[] // 歌曲列表
  singerList: ISearchSinger[] // 歌手列表
  loading: boolean // 加载状态
  errorMsg: string // 错误信息

  // 搜索下拉框相关
  recordActive: number // 下拉框选中项索引
}

const initialState: ISearchState = {
  // 基础状态
  focusState: false,
  searchValue: '',
  searchHistory: [],

  // 搜索结果
  searchSongList: [],
  singerList: [],
  loading: false,
  errorMsg: '',

  // 下拉框
  recordActive: -1
}

// 获取搜索歌曲列表
export const fetchSearchSongListAction = createAsyncThunk<
  void,
  string,
  AppThunkApi
>(
  'search/fetchSearchSongList',
  async (keyword, { dispatch, rejectWithValue }) => {
    try {
      if (!keyword.trim()) {
        // 清空搜索结果
        dispatch(changeSearchSongListAction([]))
        dispatch(changeErrorMsgAction(''))
        return
      }

      // 开始加载
      dispatch(changeLoadingAction(true))

      // 调用接口获取数据（type=1 表示搜索歌曲）
      const res = await getSearchSongData(keyword, 20, 1)

      if (res?.result?.songs) {
        // 格式化歌曲数据
        const songList = res.result.songs.map((song: any) => ({
          id: song.id,
          name: song.name,
          artists: song.ar || song.artists || [],
          album: song.al || { id: 0, name: '' },
          duration: song.dt || song.duration
        }))

        dispatch(changeSearchSongListAction(songList))
        dispatch(changeErrorMsgAction(''))

        // 添加到搜索历史（去重）
        dispatch(addSearchHistoryAction(keyword))
      } else {
        dispatch(changeSearchSongListAction([]))
        dispatch(changeErrorMsgAction('未找到相关歌曲'))
      }
    } catch (error) {
      console.error('搜索歌曲失败:', error)
      dispatch(changeErrorMsgAction('搜索失败，请重试'))
      return rejectWithValue('搜索失败')
    } finally {
      // 结束加载
      dispatch(changeLoadingAction(false))
    }
  }
)

// 获取搜索歌手列表
export const fetchSearchSingerListAction = createAsyncThunk<
  void,
  string,
  AppThunkApi
>(
  'search/fetchSearchSingerList',
  async (keyword, { dispatch, rejectWithValue }) => {
    try {
      if (!keyword.trim()) {
        dispatch(changeSingerListAction([]))
        dispatch(changeErrorMsgAction(''))
        return
      }

      dispatch(changeLoadingAction(true))

      // type=100 表示搜索歌手
      const res = await getSearchSongData(keyword, 20, 100)

      if (res?.result?.artists) {
        const singerList = res.result.artists.map((singer: any) => ({
          id: singer.id,
          name: singer.name,
          picUrl: singer.picUrl,
          albumSize: singer.albumSize
        }))

        dispatch(changeSingerListAction(singerList))
        dispatch(changeErrorMsgAction(''))
      } else {
        dispatch(changeSingerListAction([]))
        dispatch(changeErrorMsgAction('未找到相关歌手'))
      }
    } catch (error) {
      console.error('搜索歌手失败:', error)
      dispatch(changeErrorMsgAction('搜索失败，请重试'))
      return rejectWithValue('搜索失败')
    } finally {
      dispatch(changeLoadingAction(false))
    }
  }
)

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    // 基础状态修改
    changeFocusStateAction(state, { payload }: { payload: boolean }) {
      state.focusState = payload
    },
    changeSearchValueAction(state, { payload }: { payload: string }) {
      state.searchValue = payload
    },
    changeRecordActiveAction(state, { payload }: { payload: number }) {
      state.recordActive = payload
    },

    // 搜索结果修改
    changeSearchSongListAction(state, { payload }: { payload: ISearchSong[] }) {
      state.searchSongList = payload
    },
    changeSingerListAction(state, { payload }: { payload: ISearchSinger[] }) {
      state.singerList = payload
    },
    changeLoadingAction(state, { payload }: { payload: boolean }) {
      state.loading = payload
    },
    changeErrorMsgAction(state, { payload }: { payload: string }) {
      state.errorMsg = payload
    },

    // 搜索历史相关
    addSearchHistoryAction(state, { payload }: { payload: string }) {
      // 去重：如果已存在则删除原有项，添加到顶部
      const newHistory = state.searchHistory.filter((item) => item !== payload)
      state.searchHistory = [payload, ...newHistory].slice(0, 10) // 最多保留10条
    },
    clearSearchHistoryAction(state) {
      state.searchHistory = []
    },
    deleteSearchHistoryAction(state, { payload }: { payload: string }) {
      state.searchHistory = state.searchHistory.filter(
        (item) => item !== payload
      )
    },

    // 重置搜索状态
    resetSearchStateAction(state) {
      state.searchSongList = []
      state.singerList = []
      state.loading = false
      state.errorMsg = ''
      state.recordActive = -1
    }
  }
})

export const {
  // 基础状态
  changeFocusStateAction,
  changeSearchValueAction,
  changeRecordActiveAction,

  // 搜索结果
  changeSearchSongListAction,
  changeSingerListAction,
  changeLoadingAction,
  changeErrorMsgAction,

  // 搜索历史
  addSearchHistoryAction,
  clearSearchHistoryAction,
  deleteSearchHistoryAction,

  // 重置状态
  resetSearchStateAction
} = searchSlice.actions

export default searchSlice.reducer

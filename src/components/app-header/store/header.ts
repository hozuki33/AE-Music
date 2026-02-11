import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getSearchSongData } from '../service/header'
import { IRootState, DispatchType } from '@/store'

type AppThunkApi = {
  state: IRootState
  dispatch: DispatchType
  rejectValue: string
}

export interface ISearchSong {
  id: number
  name: string
  artists: Array<{
    id?: number
    name: string
  }>
}

interface IHeaderState {
  searchSongList: ISearchSong[] // 搜索结果列表
  focusState: boolean // 搜索框焦点状态
}

const initialState: IHeaderState = {
  searchSongList: [],
  focusState: false
}

// 获取搜索歌曲列表
export const fetchSearchSongListAction = createAsyncThunk<
  void,
  string, // 参数：搜索关键词
  AppThunkApi
>(
  'header/fetchSearchSongList',
  async (searchStr, { dispatch, rejectWithValue }) => {
    try {
      // 过滤空字符串
      if (!searchStr.trim()) {
        dispatch(changeSearchSongListAction([]))
        return
      }

      // 调用接口获取搜索数据
      const res = await getSearchSongData(searchStr)

      // 解析返回的歌曲列表（根据实际接口结构调整）
      const songList = res?.result?.songs || []

      // 更新搜索列表
      dispatch(changeSearchSongListAction(songList))

      // 获取焦点时自动显示下拉框
      dispatch(changeFocusStateAction(true))
    } catch (error) {
      console.error('获取搜索列表失败:', error)
      return rejectWithValue('获取搜索结果失败')
    }
  }
)

const headerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    // 更新搜索歌曲列表
    changeSearchSongListAction(state, { payload }) {
      state.searchSongList = payload
    },

    // 切换搜索框焦点状态
    changeFocusStateAction(state, { payload }) {
      state.focusState = payload
    },

    // 清空搜索列表（可选）
    clearSearchSongListAction(state) {
      state.searchSongList = []
    }
  }
})

export const {
  changeSearchSongListAction,
  changeFocusStateAction,
  clearSearchSongListAction
} = headerSlice.actions

export default headerSlice.reducer

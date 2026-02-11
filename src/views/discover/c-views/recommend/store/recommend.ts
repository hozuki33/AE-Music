import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getArtistlist,
  getBanners,
  getHotRecommend,
  getNewAlbum,
  getPlaylistDetail
} from '../service/recommend'
export const fetchBannerDataAction = createAsyncThunk(
  'banner',
  async (arg, { dispatch }) => {
    const res = await getBanners()
    dispatch(changeBannerAction(res.banners))
  }
)
export const fetchHotRecommendAction = createAsyncThunk(
  'hotRecommend',
  async (arg, { dispatch }) => {
    const res = await getHotRecommend(8)
    dispatch(changeHotRecommendAction(res.result))
  }
)
export const fetchNewAlbumAction = createAsyncThunk(
  'newAlbum',
  async (arg, { dispatch }) => {
    const res = await getNewAlbum()
    dispatch(changeNewAlbumsAction(res.albums))
  }
)
const rankingIds = [19723756, 3779629, 2884035]
export const fetchRankingDataAction = createAsyncThunk(
  'rankingData',
  async (arg, { dispatch }) => {
    const promises: Promise<any>[] = []
    for (const id of rankingIds) {
      promises.push(getPlaylistDetail(id))
    }
    Promise.all(promises).then((res) => {
      const rankings = res.map((item) => item.playlist)
      dispatch(changeRankingDataAction(rankings))
    })
  }
)

export const fetchArtistlistAction = createAsyncThunk(
  'artistlist',
  async (arg, { dispatch }) => {
    const res = await getArtistlist()
    dispatch(changeArtistlistAction(res.artists))
  }
)
interface IRecommendState {
  banners: any[]
  hotRecommends: any[]
  newAlbums: any[]
  rankings: any[]
  artistlist: any[]
}
const initialState: IRecommendState = {
  banners: [],
  hotRecommends: [],
  newAlbums: [],
  rankings: [],
  artistlist: []
}
const recommendSlice = createSlice({
  name: 'recommend',
  initialState,
  reducers: {
    changeBannerAction(state, { payload }) {
      state.banners = payload
    },
    changeHotRecommendAction(state, { payload }) {
      state.hotRecommends = payload
    },
    changeNewAlbumsAction(state, { payload }) {
      state.newAlbums = payload
    },
    changeRankingDataAction(state, { payload }) {
      state.rankings = payload
    },
    changeArtistlistAction(state, { payload }) {
      state.artistlist = payload
    }
  }
})
export const {
  changeBannerAction,
  changeHotRecommendAction,
  changeNewAlbumsAction,
  changeRankingDataAction,
  changeArtistlistAction
} = recommendSlice.actions
export default recommendSlice.reducer

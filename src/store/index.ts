import { configureStore } from '@reduxjs/toolkit'
import {
  useSelector,
  useDispatch,
  shallowEqual,
  TypedUseSelectorHook
} from 'react-redux'
import counterReducer from './modules/counter'
import recommendReducer from '@/views/discover/c-views/recommend/store/recommend'
import playerReducer from '@/views/discover/c-views/player/store/player'
import headerReducer from '@/components/app-header/store/header'
import searchReducer from '@/views/search/store/search'
import loginReducer from '@/components/login/store/login'
const store = configureStore({
  reducer: {
    counter: counterReducer,
    recommend: recommendReducer,
    player: playerReducer,
    header: headerReducer,
    search: searchReducer,
    login: loginReducer
  }
})

type GetStateFnType = typeof store.getState
export type IRootState = ReturnType<GetStateFnType>
export type DispatchType = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector
export const useAppDispatch: () => DispatchType = useDispatch
export const shallowEqualApp = shallowEqual
export default store

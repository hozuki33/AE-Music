import React, { Suspense, useEffect } from 'react'
import { Link, Outlet, useRoutes } from 'react-router-dom'
import { useAppSelector, useAppDispatch, shallowEqualApp } from '@/store'
import { changeValueAction } from '@/store/modules/counter'
import routes from './router'
import AppHeader from './components/app-header'
import AppFooter from './components/app-footer'
import AppPlayerBar from './views/discover/c-views/player/app-player-bar'
import { fetchCurrentSongAction } from './views/discover/c-views/player/store/player'
import { restoreLoginState } from './components/login/store/login'
function App() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchCurrentSongAction(1842025914))
    dispatch(restoreLoginState())
    console.log('app:登陆')
  }, [])
  return (
    <div className="App">
      <AppHeader />
      <Suspense fallback="">
        <div className="main">{useRoutes(routes)}</div>
      </Suspense>
      <AppFooter />
      <AppPlayerBar />
    </div>
  )
}

export default App

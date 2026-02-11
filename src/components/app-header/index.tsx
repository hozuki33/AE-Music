import { memo, useCallback, useEffect, useRef, useState } from 'react'
import type {
  FC,
  ReactNode,
  KeyboardEvent,
  ChangeEvent,
  SyntheticEvent
} from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { shallowEqual, useSelector } from 'react-redux'

import { debounce } from '@/utils/format'
import {
  fetchSearchSongListAction,
  changeFocusStateAction,
  ISearchSong
} from './store/header'
import { fetchCurrentSongAction } from '@/views/discover/c-views/player/store/player'
import headerLinks from '@/assets/data/header_titles.json'

import { Dropdown, Input, InputRef, Menu } from 'antd'
import { DownOutlined, SearchOutlined } from '@ant-design/icons'
import { HeaderLeft, HeaderRight, HeaderWrapper } from './style'
import { IRootState, useAppDispatch } from '@/store'
import ThemeLogin from '@/components/login/index'
import { changeIsVisibleAction } from '@/components/login/store/login'
// import { fetchLogoutAction } from './store/login'
import { clearLoginState } from '@/utils/secret-key'

interface IProps {
  children?: ReactNode
}

const AppHeader: FC<IProps> = () => {
  const [isRedirect, setIsRedirect] = useState(false)
  const [value, setValue] = useState('')
  const [recordActive, setRecordActive] = useState(-1)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { searchSongList, focusState, isLogin, profile } = useSelector(
    (state: IRootState) => ({
      searchSongList: state.header.searchSongList,
      focusState: state.header.focusState,
      isLogin: state.login.isLogin,
      profile: state.login.profile
    }),
    shallowEqual
  )

  const inputRef = useRef<InputRef>(null)

  useEffect(() => {
    console.log(isLogin)
    if (focusState && inputRef.current) {
      inputRef.current.focus()
    } else if (inputRef.current) {
      inputRef.current.blur()
    }
  }, [focusState])

  useEffect(() => {
    if (isRedirect && value.trim()) {
      const searchParams = new URLSearchParams({ song: value.trim() })
      navigate(`/search/single?${searchParams.toString()}`)
      setIsRedirect(false) // 重置跳转状态
    }
  }, [isRedirect, value, navigate])
  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (!inputRef.current) return

      const inputDom = inputRef.current.input
      if (inputDom && !inputDom.contains(e.target as Node)) {
        dispatch(changeFocusStateAction(false))
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dispatch])

  // 打开登录弹窗
  const handleOpenLogin = useCallback(() => {
    if (!isLogin) {
      dispatch(changeIsVisibleAction(true))
    }
  }, [dispatch, isLogin])

  // 渲染用户头像/昵称
  const renderProfileContent = useCallback(() => {
    if (!isLogin || !profile) return null

    return (
      <img
        src={profile.avatarUrl || '默认头像地址'}
        alt={profile.nickname || '用户头像'}
        className="profile-img"
        style={{ width: 35, height: 35, borderRadius: '50%' }}
      />
    )
  }, [isLogin, profile])

  const renderProfileMenu = useCallback(() => {
    if (!isLogin || !profile || typeof profile !== 'object') return []

    return [
      {
        key: 'nickname',
        label: <span>{profile.nickname || '未设置昵称'}</span>
      },
      {
        key: 'profile',
        label: (
          <NavLink to="/user" onClick={(e) => e.preventDefault()}>
            我的主页
          </NavLink>
        )
      },
      {
        key: 'logout',
        label: '退出登录',
        danger: true,
        onClick: clearLoginState
      }
    ]
  }, [isLogin, profile, clearLoginState])

  const showItem = useCallback(
    (item: { title: string; link: string }, index: number) => {
      if (index < 3) {
        return (
          <NavLink
            key={item.title}
            to={item.link}
            className={({ isActive }: { isActive: boolean }) =>
              isActive ? 'item active' : 'item'
            }
          >
            {item.title}
          </NavLink>
        )
      } else {
        return (
          <a
            href={item.link}
            key={item.title}
            className="item"
            rel="noreferrer"
            target="_blank"
          >
            {item.title}
          </a>
        )
      }
    },
    []
  )

  const changeInput = debounce((target: HTMLInputElement) => {
    const inputValue = target.value.trim()
    if (inputValue.length < 1) return
    dispatch(fetchSearchSongListAction(inputValue))
  }, 400)

  const changeCurrentSong = useCallback(
    (id: number, item: ISearchSong) => {
      setValue(`${item.name}-${item.artists[0].name}`)
      dispatch(fetchCurrentSongAction(id))
      dispatch(changeFocusStateAction(false))

      // 自动播放音乐
      const audioElement = document.getElementById('audio') as HTMLAudioElement
      if (audioElement) {
        audioElement.autoplay = true
      }
    },
    [dispatch]
  )

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      let searchValue = value.trim()

      // 如果通过上下键选中了歌曲，使用选中的歌曲名作为搜索关键词
      if (recordActive >= 0 && searchSongList[recordActive]) {
        searchValue = `${searchSongList[recordActive].name}-${searchSongList[recordActive].artists[0].name}`
        setValue(searchValue)
      }

      dispatch(changeFocusStateAction(false))
      setIsRedirect(true) // 触发跳转
    },
    [dispatch, recordActive, searchSongList, value]
  )

  const handleSearchClick = useCallback(() => {
    if (value.trim()) {
      setIsRedirect(true)
      dispatch(changeFocusStateAction(false))
    } else {
      // 无输入时聚焦输入框
      if (inputRef.current) inputRef.current.focus()
    }
  }, [dispatch, value])

  const handleFocus = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.select()
    }
    dispatch(changeFocusStateAction(true))
    setIsRedirect(false)
  }, [dispatch])

  const handleInput = useCallback(
    (e: SyntheticEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement
      changeInput(target)
    },
    [changeInput]
  )

  const watchKeyboard = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      let activeNumber = recordActive
      if (e.key === 'ArrowUp') {
        activeNumber--
        activeNumber =
          activeNumber < 0 ? searchSongList.length - 1 : activeNumber
        setRecordActive(activeNumber)
      } else if (e.key === 'ArrowDown') {
        activeNumber++
        activeNumber = activeNumber >= searchSongList.length ? 0 : activeNumber
        setRecordActive(activeNumber)
      }
    },
    [recordActive, searchSongList]
  )

  return (
    <HeaderWrapper>
      <div className="content wrap-v1">
        <HeaderLeft>
          <a className="logo sprite_01" href="/">
            网易云音乐
          </a>
          <div className="title-list">
            {headerLinks.map((item, index) => (
              <div className="item" key={item.title}>
                {showItem(item, index)}
              </div>
            ))}
          </div>
        </HeaderLeft>
        <HeaderRight>
          <span className="input">
            <div className="search-wrapper">
              <Input
                ref={inputRef}
                className="search"
                placeholder="音乐/视频/电台/用户"
                prefix={
                  <SearchOutlined
                    onClick={handleSearchClick}
                    style={{ cursor: 'pointer' }}
                  />
                }
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setIsRedirect(false)
                  setValue(e.target.value)
                }}
                onInput={handleInput}
                onFocus={handleFocus}
                onPressEnter={handleEnter}
                value={value}
                onKeyDown={watchKeyboard}
              />

              <div
                className="down-slider"
                style={{ display: focusState ? 'block' : 'none' }}
              >
                <div className="search-header">
                  <span className="discover">搜"{value}"相关用户&gt;</span>
                </div>
                <div className="content">
                  <div className="zuo">
                    <span className="song">单曲</span>
                  </div>
                  <span className="main">
                    {searchSongList.map((item: ISearchSong, index) => (
                      <div
                        className={`item ${recordActive === index ? 'active' : ''}`}
                        key={item.id}
                        onClick={() => changeCurrentSong(item.id, item)}
                      >
                        <span>{item.name}</span>-{item.artists[0].name}
                      </div>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          </span>

          <span className="center">创作者中心</span>
        
          <Dropdown
            menu={{ items: renderProfileMenu() }}
            trigger={['hover']}
            disabled={!isLogin}
            placement="bottom"
          >
            <div
              className="login"
              onClick={handleOpenLogin}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {isLogin ? renderProfileContent() : '登录'}
            </div>
          </Dropdown>
        </HeaderRight>
      </div>
      <div className="divider"></div>

      <ThemeLogin />
    </HeaderWrapper>
  )
}

export default memo(AppHeader)

import React, { memo, useState, useEffect } from 'react'
import type { FC, MouseEvent } from 'react'
import { useLocation, useNavigate, NavLink, Outlet } from 'react-router-dom' // 新增 Outlet
import qs from 'query-string'

import { Input } from 'antd'
import { useChangeDropBoxState } from '@/hooks/change-state'
import { searchCategories } from '@/assets/data/local_data'

import { SearchWrapper } from './style'
const { Search: InputSearch } = Input

interface ISearchCategory {
  title: string
  link: string
  [key: string]: any
}

interface ISearchProps {}

const ISearch: FC<ISearchProps> = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { song } = qs.parse(location.search) as {
    song?: string | null
  }

  const [searchSongName, setSearchSongName] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  // 组件渲染时更新歌曲名称
  useEffect(() => {
    if (song === undefined) {
      setSearchSongName(null)
    } else {
      setSearchSongName(song)
    }
  }, [song])

  // 初始化本地存储的选中索引
  useEffect(() => {
    if (!localStorage.hasOwnProperty('activeIndex')) {
      localStorage.setItem('activeIndex', '0')
    }

    const storedIndex = localStorage.getItem('activeIndex')
    const parsedIndex = storedIndex ? JSON.parse(storedIndex) : 0
    setActiveIndex(parsedIndex)
  }, [])

  useEffect(() => {
    if (activeIndex !== null) {
      localStorage.setItem('activeIndex', JSON.stringify(activeIndex))
    }
  }, [activeIndex])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchSongName(e.target.value)
  }

  // 处理导航项点击
  const handleNavClick = (
    index: number,
    item: ISearchCategory,
    e: MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault()

    setActiveIndex(index)

    const targetUrl = `${item.link}${item.link.includes('?') ? '&' : '?'}song=${encodeURIComponent(searchSongName || '')}`
    navigate(targetUrl)
  }

  return (
    <SearchWrapper onClick={useChangeDropBoxState()}>
      <div className="w980 content">
        <div className="search-wrapper">
          <InputSearch
            value={searchSongName || ''}
            style={{ width: 490 }}
            onChange={handleSearchChange}
          />
        </div>

        <div className="search-content">
          <div className="search-info">
            搜索"{song}", 找到
            <span className="music-amount"> 20 </span>单曲
          </div>

          <div className="m-tab search-category">
            {(searchCategories as ISearchCategory[]).map((item, index) => {
              const linkUrl = `${item.link}${item.link.includes('?') ? '&' : '?'}song=${encodeURIComponent(song || '')}`

              return (
                <NavLink
                  key={item.link || index}
                  to={linkUrl}
                  className={`route-item m-tab ${activeIndex === index ? 'active' : ''}`}
                  onClick={(e) => handleNavClick(index, item, e)}
                >
                  <em>{item.title}</em>
                </NavLink>
              )
            })}
          </div>

          <Outlet />
        </div>
      </div>
    </SearchWrapper>
  )
}

export default memo(ISearch)

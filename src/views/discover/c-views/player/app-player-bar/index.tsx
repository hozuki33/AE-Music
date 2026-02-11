import React, { memo, useEffect, useRef, useState, useCallback } from 'react'
import type { FC, ReactNode } from 'react'
import { BarControl, BarOperator, BarPlayInfo, PlayerBarWrapper } from './style'
import { NavLink } from 'react-router-dom'
import { shallowEqualApp, useAppDispatch, useAppSelector } from '@/store'
import { formatTime } from '@/utils/handle-player'
import { getSongPlayUrl } from '../service/player'
import { message, Slider } from 'antd'
import {
  changeLyricIndexAction,
  changePlayModeAction,
  changePlaySongAction,
  clearPlaySongListAction
} from '../store/player'
import AppPlayList from '../app-player-pannel'

interface IProps {
  children?: ReactNode
}

interface LyricItem {
  time: number // 毫秒
  content: string
}

const AppPlayerBar: FC<IProps> = () => {
  // 控制播放列表面板显隐的状态
  const [showPanel, setShowPanel] = useState(false)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isChanging, setIsChanging] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [progress, setProgress] = useState(0)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentSong = useAppSelector(
    (state) => state.player.currentSong,
    shallowEqualApp
  )
  const lyrics = useAppSelector(
    (state) => state.player.lyrics || [],
    shallowEqualApp
  )
  const lyricIndex = useAppSelector((state) => state.player.lyricIndex)
  const playMode = useAppSelector((state) => state.player.playMode)
  const playSongList = useAppSelector(
    (state) => state.player.playSongList || [],
    shallowEqualApp
  )

  const dispatch = useAppDispatch()
  const handleClearPlayList = useCallback(() => {
    // 1. 暂停音频
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
    // 2. 调用 Store 清空 Action
    dispatch(clearPlaySongListAction())
    // 3. 重置播放状态
    setDuration(0)
    setCurrentTime(0)
    setProgress(0)

    setShowPanel(false)
  }, [dispatch])
  useEffect(() => {
    if (!currentSong || !currentSong.id) {
      setIsPlaying(false)
      setDuration(0)
      setCurrentTime(0)
      setProgress(0)
      return
    }

    if (!audioRef.current) return
    setIsPlaying(false)

    const loadRealAudioUrl = async () => {
      try {
        const res = await getSongPlayUrl(currentSong.id)
        const songUrlInfo = res.data[0]

        let audioUrl = ''
        if (songUrlInfo && songUrlInfo.url) {
          audioUrl = songUrlInfo.url
        } else {
          console.error('获取真实音频URL失败:', res)
        }
        if (!audioRef.current) return
        if (audioUrl) {
          audioRef.current.src = audioUrl
          audioRef.current.load()
        }

        setDuration(currentSong.dt || 0)
        // message.info(`已加载《${currentSong.name}》，请点击播放按钮开始播放`, 2)
      } catch (error) {
        console.error('加载音频URL失败:', error)
        message.error(`《${currentSong.name}》URL加载失败，请检查接口服务`, 2)
      }
    }

    loadRealAudioUrl()
  }, [currentSong])

  useEffect(() => {
    const handleLoadedMetadata = () => {
      if (audioRef.current && currentSong) {
        const actualDuration = Math.floor(audioRef.current.duration * 1000)
        setDuration(actualDuration || currentSong.dt || 0)
      }
    }

    const audio = audioRef.current
    if (audio) {
      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      }
    }
  }, [currentSong])

  function handleTimeUpdate() {
    if (!audioRef.current || !currentSong || isChanging) return

    const currentTimeSec = audioRef.current.currentTime
    const currentTimeMs = Math.floor(currentTimeSec * 1000)

    if (duration > 0) {
      const progress = (currentTimeMs / duration) * 100
      setCurrentTime(currentTimeMs)
      setProgress(Math.min(progress, 100))
    }

    if (!lyrics.length) return

    let currentLyricIndex = -1
    for (let i = 0; i < lyrics.length; i++) {
      const lyricItem = lyrics[i] as LyricItem
      if (lyricItem.time > currentTimeMs) {
        currentLyricIndex = i - 1
        break
      }
      if (i === lyrics.length - 1 && lyricItem.time <= currentTimeMs) {
        currentLyricIndex = i
      }
    }

    if (currentLyricIndex >= 0 && currentLyricIndex !== lyricIndex) {
      dispatch(changeLyricIndexAction(currentLyricIndex))
      const currentLyric = lyrics[currentLyricIndex] as LyricItem
    }
  }

  /** 播放结束处理 */
  function handlePlayEnded() {
    if (!currentSong || !playSongList.length) return

    if (playMode === 2 || playSongList.length === 1) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        setCurrentTime(0)
        setProgress(0)
        setIsPlaying(false)
      }
    } else {
      handleChangeBtnClick(true)
    }
  }

  /** 进度条拖动中 */
  function handleSliderChanging(value: number) {
    if (duration <= 0) return

    setIsChanging(true)
    setProgress(value)
    const calcCurrentTime = (value / 100) * duration
    setCurrentTime(calcCurrentTime)
  }

  /** 进度条拖动完成 */
  function handleSliderAfterChange(value: number) {
    if (!audioRef.current || duration <= 0) return

    const targetTime = ((value / 100) * duration) / 1000
    audioRef.current.currentTime = targetTime
    setCurrentTime((value / 100) * duration)
    setIsChanging(false)

    if (!isPlaying) {
      audioRef.current.pause()
    }
  }

  /** 播放/暂停按钮 */
  function handlePlayBtnClick() {
    if (!audioRef.current || !currentSong) {
      message.warning('暂无播放歌曲')
      return
    }

    const audio = audioRef.current
    const newIsPlaying = !isPlaying

    if (newIsPlaying) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true)
          setHasUserInteracted(true)
        })
        .catch((err) => {
          console.error('播放失败:', err)
          setIsPlaying(false)

          if (err.name === 'NotAllowedError') {
            message.warning('浏览器限制自动播放，请点击播放按钮后再试')
          } else {
            message.error('播放失败：可能是歌曲链接失效或网络问题')
          }
        })
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  /** 上一首/下一首 */
  function handleChangeBtnClick(isNext = true) {
    if (!playSongList.length) {
      message.warning('播放列表为空')
      return
    }
    dispatch(changePlaySongAction(isNext))
    setIsPlaying(false)
  }

  /** 切换播放模式 */
  function handlePlayModeClick() {
    let newPlayMode = playMode + 1
    if (newPlayMode === 3) newPlayMode = 0

    const modeNames = ['顺序播放', '随机播放', '单曲循环']
    message.success(`当前模式: ${modeNames[newPlayMode]}`)

    dispatch(changePlayModeAction(newPlayMode))
  }

  /** 音频错误处理 */
  function handleAudioError() {
    console.error('音频加载失败:', currentSong?.name)
    setIsPlaying(false)

    if (currentSong) {
      message.error(
        `《${currentSong.name}》加载失败，请检查：
1. 歌曲ID是否有效
2. 音频链接是否可访问
3. 网络连接是否正常`,
        5
      )
    } else {
      message.error('音频加载失败：暂无有效歌曲', 3)
    }
  }

  const togglePlayPanel = useCallback(() => {
    setShowPanel((prev) => !prev)
  }, [])

  return (
    <PlayerBarWrapper className="sprite_playbar">
      <div className="content wrap-v2">
        <BarControl $isPlaying={isPlaying}>
          <button
            className="btn sprite_playbar prev"
            onClick={() => handleChangeBtnClick(false)}
            disabled={!playSongList.length}
          ></button>
          <button
            className="btn sprite_playbar play"
            onClick={handlePlayBtnClick}
            disabled={!currentSong}
            title={currentSong ? '播放/暂停' : '暂无歌曲'}
          ></button>
          <button
            className="btn sprite_playbar next"
            onClick={() => handleChangeBtnClick()}
            disabled={!playSongList.length}
          ></button>
        </BarControl>

        <BarPlayInfo>
          <NavLink to="/discover/player">
            <img
              src={
                currentSong?.al?.picUrl ||
                'https://p2.music.126.net/OVkXDNmbk2uj6wE1KTZIwQ==/109951165203334337.jpg?param=34y34'
              }
              alt={currentSong?.name || '默认封面'}
              width={34}
              height={34}
            />
          </NavLink>

          <div className="info">
            <div className="song">
              <span className="song-name">
                {currentSong?.name || '暂无歌曲'}
              </span>
              <span className="singer-name">
                {currentSong?.ar?.[0]?.name || '未知歌手'}
              </span>
            </div>

            <div className="progress">
              <Slider
                step={0.1}
                value={progress}
                onChange={handleSliderChanging}
                onChangeComplete={handleSliderAfterChange}
                tooltip={{ open: false }}
                disabled={duration <= 0}
              />
              <div className="time">
                <span className="current">{formatTime(currentTime)}</span>
                <span className="divider">/</span>
                <span className="duration">{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </BarPlayInfo>

        <BarOperator $playMode={playMode}>
          <div className="left">
            <button className="btn pip"></button>
            <button className="btn sprite_playbar favor"></button>
            <button className="btn sprite_playbar share"></button>
          </div>
          <div className="right sprite_playbar">
            <button className="btn sprite_playbar volume"></button>
            <button
              className="btn sprite_playbar loop"
              onClick={handlePlayModeClick}
              title={`当前模式：${['顺序', '随机', '单曲循环'][playMode]}播放`}
            ></button>
            <button
              className="btn sprite_playbar playlist"
              onClick={togglePlayPanel}
              title="播放列表"
            >
              {playSongList.length}
            </button>
          </div>
        </BarOperator>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handlePlayEnded}
        onError={handleAudioError}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        preload="metadata"
      />

      {showPanel && <AppPlayList onClearPlayList={handleClearPlayList} />}
    </PlayerBarWrapper>
  )
}

export default memo(AppPlayerBar)

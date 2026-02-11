import React, {
  memo,
  useRef,
  useState,
  MouseEvent,
  FocusEvent,
  ReactNode
} from 'react'
import { Button, message, Modal } from 'antd'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { changeIsVisibleAction } from './store/login'
import { PhoneOutlined } from '@ant-design/icons'
import LoginIcon from '@/components/login-icon/index'
import { LoginLeft, LoginRight, LoginWrapper, PhoneLoginModal } from './style'
import ThemeLoginForm from '../login-form'
import { IRootState } from '@/store'

// 定义登录状态类型
type LoginStateType = 'default' | 'phone' | 'email' | 'register' | 'qr'

/**
 * 登录页面(模态框) - 修复memo类型错误 + 注释拖拽功能
 */
const ThemeLogin: React.FC = memo(() => {
  // 核心登录状态（仅保留必要state）
  const [loginState, setLoginState] = useState<LoginStateType>('default')

  // Redux状态和dispatch
  const dispatch = useDispatch()
  const { isVisible } = useSelector(
    (state: IRootState) => ({
      isVisible: state.login.isVisible
    }),
    shallowEqual
  )

  // 关闭弹窗
  const handleCancel = (e: MouseEvent<HTMLElement>): void => {
    dispatch(changeIsVisibleAction(false))
    setTimeout(() => {
      setLoginState('default')
    }, 100)
  }

  // 切换登录模式
  const handleLogin = (loginMode: LoginStateType): void => {
    setLoginState(loginMode)
  }

  // 默认登录界面
  const defaultWrapperContent: ReactNode = (
    <LoginWrapper>
      <LoginLeft>
        <div className="login-content">
          <div className="login-bg"></div>
          <Button
            ghost={true}
            onClick={() => handleLogin('register')}
            shape="round"
            icon={<PhoneOutlined />}
            className="gap"
          >
            注册
          </Button>
          <Button
            type="primary"
            shape="round"
            icon={<PhoneOutlined />}
            onClick={() => handleLogin('phone')}
          >
            手机号登录
          </Button>
        </div>
      </LoginLeft>
      <LoginRight>
        <div className="icons-wrapper">
          <LoginIcon
            onClick={() => message.warning('暂不做')}
            position="-150px -670px"
            description="微信登录"
          />
          <LoginIcon
            onClick={() => message.warning('暂不做')}
            position="-190px -670px"
            description="QQ登录"
          />
          <LoginIcon
            onClick={() => message.warning('暂不做')}
            position="-231px -670px"
            description="微博登录"
          />
          <LoginIcon
            onClick={() => handleLogin('email')}
            position="-271px -670px"
            description="网易邮箱登录"
          />
          <LoginIcon
            onClick={() => handleLogin('qr')}
            position="-312px -670px"
            description="二维码登录"
          />
        </div>
      </LoginRight>
    </LoginWrapper>
  )

  // 登录表单渲染（显式指定返回值类型）
  const phoneLogin = (loginState?: LoginStateType): ReactNode => {
    return (
      <PhoneLoginModal>
        <ThemeLoginForm loginState={loginState || 'phone'} />
      </PhoneLoginModal>
    )
  }

  // 显式返回合法的ReactNode（核心修复）
  return (
    <Modal
      centered
      footer={null}
      title={
        <div
          style={{ width: '100%', cursor: 'default' }}
          onFocus={(e: FocusEvent<HTMLDivElement>) => {}}
          onBlur={(e: FocusEvent<HTMLDivElement>) => {}}
        >
          {loginState === 'register' ? '注册' : '登录'}
        </div>
      }
      open={isVisible}
      onCancel={handleCancel}
    >
      {loginState === 'default' && defaultWrapperContent}
      {loginState === 'phone' && phoneLogin()}
      {loginState === 'email' && phoneLogin('email')}
      {loginState === 'register' && phoneLogin('register')}
      {loginState === 'qr' && phoneLogin('qr')}
    </Modal>
  )
})

export default ThemeLogin

import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Checkbox, message, Card, Spin } from 'antd'
import type { FormProps } from 'antd'
import { useDispatch } from 'react-redux'

import { getParseLoginState, getMatchReg } from '@/utils/format'
import { fetchLoginProfileInfo } from '../login/store/login'
import { fetchQrLoginSuccess } from '../login/store/login'
import { getQrKey, createQrCode, checkQrStatus } from '../login/service/login'

import loginFormStyle from './style.module.css'

interface ThemeLoginFormProps {
  loginState?: string
}

const ThemeLoginForm: React.FC<ThemeLoginFormProps> = (props) => {
  const { loginState = 'phone' } = props

  const parseLoginModeText = getParseLoginState(loginState)
  const mathchReg = getMatchReg(loginState)
  const pwdReg = /^[0-9a-zA-Z._-]{6,20}$/

  const dispatch = useDispatch<any>()

  const onFinish: FormProps['onFinish'] = (values) => {
    const { username, password } = values as any
    dispatch(
      fetchLoginProfileInfo({
        username,
        password,
        tip: true
      })
    )
  }

  // 二维码登录 
  const [qrImg, setQrImg] = useState('')
  const [qrKey, setQrKey] = useState('')
  const [qrStatus, setQrStatus] = useState<
    'init' | 'waiting' | 'scanned' | 'success' | 'expired'
  >('init')

  // 初始化二维码
  const initQrLogin = async () => {
    try {
      setQrStatus('init')

      const keyRes = await getQrKey()
      const key = keyRes.data.unikey
      setQrKey(key)

      const qrRes = await createQrCode(key)
      setQrImg(qrRes.data.qrimg)

      setQrStatus('waiting')
    } catch (e) {
      message.error('二维码生成失败')
    }
  }

  // 轮询二维码状态
  useEffect(() => {
    if (!qrKey || qrStatus === 'success' || qrStatus === 'expired') return

    const timer = setInterval(async () => {
      try {
        const res = await checkQrStatus(qrKey)

        if (res.code === 801) setQrStatus('waiting')
        if (res.code === 802) setQrStatus('scanned')
        if (res.code === 803 && res.cookie) {
          setQrStatus('success')
          clearInterval(timer)

          // 交给 store
          dispatch(fetchQrLoginSuccess({ cookie: res.cookie }))
        }
        if (res.code === 800) {
          setQrStatus('expired')
          clearInterval(timer)
        }
      } catch (e) {}
    }, 2000)

    return () => clearInterval(timer)
  }, [qrKey, qrStatus, dispatch])

  useEffect(() => {
    if (loginState === 'qr') initQrLogin()
  }, [loginState])

  return (
    <>
      <Form
        style={{ display: loginState !== 'qr' ? 'block' : 'none' }}
        name="login"
        onFinish={onFinish}
      >
        <Form.Item
          label={parseLoginModeText}
          name="username"
          rules={[
            {
              pattern: mathchReg instanceof RegExp ? mathchReg : undefined,
              message: '格式错误'
            },
            { required: true }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ pattern: pwdReg }, { required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Checkbox defaultChecked>自动登录</Checkbox>

        <Button type="primary" htmlType="submit" block>
          登录
        </Button>
      </Form>

      {loginState === 'qr' && (
        <Card
          title="扫码登录"
          style={{ width: 320, margin: '0 auto', textAlign: 'center' }}
        >
          {qrImg ? <img src={qrImg} style={{ width: 200 }} /> : <Spin />}

          <div style={{ marginTop: 12 }}>
            {qrStatus === 'waiting' && '请使用网易云音乐 App 扫码'}
            {qrStatus === 'scanned' && '已扫码，请在手机确认'}
            {qrStatus === 'expired' && '二维码已过期'}
            {qrStatus === 'success' && '登录成功'}
          </div>

          {qrStatus === 'expired' && (
            <Button style={{ marginTop: 12 }} onClick={initQrLogin}>
              重新生成二维码
            </Button>
          )}
        </Card>
      )}
    </>
  )
}

export default ThemeLoginForm


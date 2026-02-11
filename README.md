## 音乐播放器 Web 应用

基于 React + Redux Toolkit + TypeScript + Ant Design 开发的音乐播放器，实现核心音乐播放、搜索、登录/注册等功能。

## 核心功能

- 音乐播放：支持单曲/随机/循环播放、歌词同步、播放列表管理；
- 搜索功能：防抖搜索、歌曲列表展示、点击播放；
- 登录注册：二维码登录、表单实时校验、加载状态提示。

## 技术栈

- 前端框架：React 18（Hooks：useState/useDispatch/useSelector）；
- 状态管理：Redux Toolkit（createSlice/createAsyncThunk）；
- 类型校验：TypeScript（完整类型定义、接口约束）；
- UI 组件：Ant Design（Form/Modal/Button 等组件封装）；
- 工程化：ESLint/Prettier（代码规范）；
- 网络请求：Axios（接口封装、异常处理）。

## 运行方式

```bash
# 克隆项目
git clone https://github.com/hozuki33/music.git
# 安装依赖
npm install
# 启动接口
npx NeteaseCloudMusicApi@latest
# 启动项目
npm run start
```
## 项目展示
首页
<img width="3185" height="1721" alt="首页" src="https://github.com/user-attachments/assets/87d08e15-42bd-4f67-bda5-e95701e90d63" />
<img width="3185" height="1721" alt="首页-下半" src="https://github.com/user-attachments/assets/104ec815-c15a-4912-91c7-c7e4d23203fd" />
播放音乐
<img width="3185" height="1721" alt="音乐播放" src="https://github.com/user-attachments/assets/67c8857a-d3d2-4705-b0af-1c8ad0cb0ef9" />
搜索
<img width="3185" height="1721" alt="搜索" src="https://github.com/user-attachments/assets/77b64a94-449c-40d6-8081-d677677483e9" />
搜索结果展示
<img width="3185" height="1721" alt="搜索结果" src="https://github.com/user-attachments/assets/2fe350bf-f692-404e-9368-162cd4b4242e" />


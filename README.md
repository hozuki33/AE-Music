# 音乐播放器 Web 应用

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

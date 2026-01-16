# 星空日志 (Starry Log)

一个基于 Node.js + Koa + MongoDB 的个人日志/博客系统，拥有唯美的星空动态背景和沉浸式的用户体验。

## ✨ 特性

- **唯美星空背景**：
  - 动态生成的星星，支持随机闪烁。
  - **流星雨效果**：随机爆发的流星雨，大小、速度、飞行轨迹完全随机，符合物理视觉效果。
  - **星座连线**：鼠标移动时自动连接附近的星星，形成独特的星座图案。
  - **404 星空页**：专属定制的 404 页面，让迷失也成为一种风景。

- **沉浸式阅读体验**：
  - **瀑布流布局**：日志卡片自动错落排列，美观且高效。
  - **时间轴导航**：左侧侧边栏提供按年月归档的时间轴，方便回顾。
  - **玻璃拟态 UI**：现代感的半透明设计，与星空背景完美融合。

- **功能完善**：
  - **Markdown/富文本支持**：集成 Summernote 编辑器，支持排版、插入链接等。
  - **日志管理**：支持创建、编辑、删除日志（管理员权限）。
  - **分享功能**：一键生成公开分享链接，支持随时取消分享。
  - **权限管理**：区分管理员（可编辑）和访客（仅查看）权限。

## 🛠️ 技术栈

- **后端**：Node.js, Koa 2, Mongoose (MongoDB)
- **前端**：HTML5, CSS3, jQuery, Bootstrap 5
- **插件**：Masonry (瀑布流), Summernote (富文本), FontAwesome (图标)

## 🚀 快速开始

### 1. 环境准备
确保您的电脑已安装：
- [Node.js](https://nodejs.org/) (v14+)
- [MongoDB](https://www.mongodb.com/) (v4+)

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量
项目根目录下已包含 `.env` 文件，您可以根据需要修改：

```env
PORT=3003
MONGODB_URI=mongodb://localhost:27017/kanban
SESSION_SECRET=your_secret_key
# 默认管理员密码
ADMIN_PASSWORD=admin123
# 默认访客密码
VIEWER_PASSWORD=guest123
```

### 4. 启动项目

```bash
# 开发模式
npm run dev

# 或直接启动
node src/app.js
```

访问：[http://localhost:3003](http://localhost:3003)

## 📖 使用指南

1. **登录**：
   - 点击右上角或未登录时的弹窗进行登录。
   - 管理员密码：`admin123` (拥有所有权限)
   - 访客密码：`guest123` (仅查看权限)

2. **写日志**：
   - 登录管理员后，点击右上角的 **+ 新建** 按钮。
   - 填写标题和内容，支持富文本编辑。

3. **分享日志**：
   - 点击任意日志卡片查看详情。
   - 点击底部的 **生成分享链接**。
   - 复制链接发送给朋友，对方无需登录即可查看。
   - 如需收回权限，点击 **取消分享**，原链接将失效并跳转至 404 星空页。

## 📁 目录结构

```
kanban/
├── public/             # 前端静态资源
│   ├── css/            # 样式文件
│   ├── js/             # 前端逻辑
│   ├── 404.html        # 自定义 404 页面
│   └── index.html      # 主页
├── src/                # 后端源码
│   ├── controllers/    # 控制器 (业务逻辑)
│   ├── models/         # 数据模型 (MongoDB Schema)
│   ├── routes/         # 路由定义
│   └── app.js          # 入口文件
├── .env                # 配置文件
└── package.json        # 项目依赖
```

## 📝 开发备注

- **流星效果调整**：可在 `public/js/main.js` 中调整 `scheduleShootingStar` 和 `createShootingStar` 函数的参数，如频率、速度、大小等。
- **性能优化**：已对星星数量和连线算法进行优化，确保在普通设备上也能流畅运行。

## 🌟 个性化配置指南

您可以修改 `public/js/main.js` 文件来调整星空效果：

### 1. 调整背景星星数量
找到文件开头的 `starCount` 变量：
```javascript
// 建议范围：100 - 300 (数量越多越消耗性能)
const starCount = 150; 
```

### 2. 调整流星雨密度
找到 `triggerMeteorShower` 函数：
```javascript
function triggerMeteorShower() {
    // 修改此处控制每次爆发的流星数量 (最小值, 最大值)
    // 当前配置：每次随机产生 3 到 10 颗
    const count = Math.floor(Math.random() * (10 - 3 + 1)) + 3;
    ...
}
```

### 3. 调整流星出现频率
找到 `scheduleShootingStar` 函数：
```javascript
function scheduleShootingStar() {
    // 修改此处控制爆发间隔 (毫秒)
    // 当前配置：约 3秒 (3000ms) 一次
    const interval = 3000;
    ...
}
```

---
*Created with ❤️ by Trae AI*

require('dotenv').config();
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
// 修复 koa-session v7.x 导出变更问题
const sessionObj = require('koa-session');
const session = sessionObj.default || sessionObj;
const mongoose = require('mongoose');
const path = require('path');
const apiRoutes = require('./routes');

const app = new Koa();

// MongoDB 数据库连接
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kanban';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Please ensure MongoDB is installed and running.');
    console.error('Download MongoDB: https://www.mongodb.com/try/download/community');
  });

// Session 会话配置
app.keys = [process.env.SESSION_SECRET || 'secret_key_kanban_starry'];
const CONFIG = {
  key: 'kanban:sess',
  maxAge: 86400000,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false,
  secure: false, // http 环境下设为 false
};

// 确保 session 是个函数再使用
if (typeof session === 'function') {
  app.use(session(CONFIG, app));
} else {
  console.error('Error: koa-session import failed. session is not a function.');
}

// 中间件配置
app.use(bodyParser());
app.use(serve(path.join(__dirname, '../public')));

// 路由注册
app.use(apiRoutes.routes()).use(apiRoutes.allowedMethods());

// 启动服务器
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

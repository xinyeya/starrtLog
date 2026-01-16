const Log = require('../models/Log');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  // 用户登录
  login: async (ctx) => {
    const { password } = ctx.request.body;
    
    if (password === process.env.ADMIN_PASSWORD) {
      ctx.session.user = { role: 'admin' };
      ctx.body = { success: true, role: 'admin' };
    } else if (password === process.env.VIEWER_PASSWORD) {
      ctx.session.user = { role: 'viewer' };
      ctx.body = { success: true, role: 'viewer' };
    } else {
      ctx.status = 401;
      ctx.body = { success: false, message: 'Invalid password' };
    }
  },

  // 用户登出
  logout: async (ctx) => {
    ctx.session = null;
    ctx.body = { success: true };
  },

  // 检查认证状态
  checkAuth: async (ctx) => {
    if (ctx.session && ctx.session.user) {
      ctx.body = { authenticated: true, role: ctx.session.user.role };
    } else {
      ctx.body = { authenticated: false };
    }
  },

  // 获取所有日志 (支持搜索和筛选)
  getAllLogs: async (ctx) => {
    const { search, status, startDate, endDate } = ctx.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const logs = await Log.find(query).sort({ createdAt: -1 });
    ctx.body = logs;
  },

  // 公开分享链接获取日志 (无需认证)
  getPublicLog: async (ctx) => {
    const { token } = ctx.params;
    try {
      // 通过 shareToken 查找日志
      const log = await Log.findOne({ shareToken: token });
      if (!log) {
        ctx.status = 404;
        ctx.body = { error: 'Shared log not found or link expired' };
        return;
      }
      ctx.body = log;
    } catch (err) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid Request' };
    }
  },

  // 生成分享链接
  shareLog: async (ctx) => {
    const { id } = ctx.params;
    // 生成唯一 Token
    const token = uuidv4();
    const log = await Log.findByIdAndUpdate(id, { shareToken: token }, { new: true });
    
    if(!log) {
        ctx.status = 404;
        return;
    }
    
    ctx.body = { success: true, shareToken: token };
  },

  // 取消分享
  unshareLog: async (ctx) => {
    const { id } = ctx.params;
    const log = await Log.findByIdAndUpdate(id, { shareToken: null }, { new: true });
    
    if(!log) {
        ctx.status = 404;
        return;
    }
    
    ctx.body = { success: true };
  },

  // 根据 ID 获取日志 (内部/管理用)
  getLogById: async (ctx) => {
    const { id } = ctx.params;
    try {
      const log = await Log.findById(id);
      if (!log) {
        ctx.status = 404;
        ctx.body = { error: 'Log not found' };
        return;
      }
      ctx.body = log;
    } catch (err) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid ID' };
    }
  },

  // 创建新日志
  createLog: async (ctx) => {
    const { title, content, status } = ctx.request.body;
    const log = new Log({ title, content, status });
    await log.save();
    ctx.body = log;
  },

  // 更新日志
  updateLog: async (ctx) => {
    const { id } = ctx.params;
    const updateData = ctx.request.body;
    updateData.updatedAt = Date.now();
    
    const log = await Log.findByIdAndUpdate(id, updateData, { new: true });
    ctx.body = log;
  },

  // 删除日志
  deleteLog: async (ctx) => {
    const { id } = ctx.params;
    await Log.findByIdAndDelete(id);
    ctx.body = { success: true };
  }
};

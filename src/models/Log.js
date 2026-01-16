const mongoose = require('mongoose');

// 日志数据模型
const LogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true // 标题必填
  },
  content: {
    type: String, // 存储富文本 HTML 内容
    required: true // 内容必填
  },
  status: {
    type: String,
    enum: ['todo', 'doing', 'done'], // 状态枚举：待办、进行中、已完成
    default: 'todo'
  },
  createdAt: {
    type: Date,
    default: Date.now // 创建时间，默认当前时间
  },
  updatedAt: {
    type: Date,
    default: Date.now // 更新时间
  },
  shareToken: {
    type: String, // 分享 Token，用于生成公开链接
    default: null // 默认为空（未分享）
  }
});

module.exports = mongoose.model('Log', LogSchema);

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/terminal-server',{
  useNewUrlParser: true,
  useCreateIndex: true,
})

// User 模型
const loginLogShema = new mongoose.Schema({
  // 登陆用户属性关联用户数据集合
  // user: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
  user: {type: String},
  operateTime: {type: String},
  ip: {type: String},
  des: {type: String},
  browser: {type: String},
})

const LoginLog = mongoose.model('LoginLog', loginLogShema);

// //删除集合
// LoginLog.db.dropCollection('loginlogs');

module.exports = LoginLog;
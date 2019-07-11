const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost:27017/terminal-server',{
  useNewUrlParser: true,
  useCreateIndex: true,
})

// User 模型
const userShema = new mongoose.Schema({
  username: {type: String, unique: true},
  password: {type: String,
    set(val){
     return bcrypt.hashSync(val, 8); // 使用bscrypt.hashSync同步将密码变为随机散列 
    }
  },
  merchantMobile: {type: String, unique: false},
  userId: {type: String, unique: false},
  merchantId: {type: String, unique: false},
})

// 添加虚拟字段用来查找登录信息
userShema.virtual('loginLogs', {
  ref: 'LoginLog', //关联集合
  localField: '_id', //本地用哪个鍵来关联
  foreignField: 'user', //关联集合的鍵
  justOne: false, // 返回数组
})

const User = mongoose.model('User', userShema);

// //删除集合
// User.db.dropCollection('users');

module.exports = User;
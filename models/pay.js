const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost:27017/terminal-server', {
  useNewUrlParser: true,
  useCreateIndex: true,
})

// Pay 模型
const payShema = new mongoose.Schema({
  appid: { type: String, unique: true },
  appkey: { type: String, unique: false },
  appsecret: { type: String, unique: false },
  detail: { type: String, unique: false },
  id: { type: String, unique: false },
  mchId: { type: String, unique: false },
  userId: { type: String },
  name: { type: String, unique: false },
  remark1: { type: String, unique: false },
  remark2: { type: String, unique: false }, //qrcode
  remark3: { type: String, unique: false },
  refundCertificate: { type: String, unique: false },
})

// // 添加虚拟字段用来查找登录信息
// payShema.virtual('loginLogs', {
//   ref: 'LoginLog', //关联集合
//   localField: '_id', //本地用哪个鍵来关联
//   foreignField: 'pay', //关联集合的鍵
//   justOne: false, // 返回数组
// })

const Pay = mongoose.model('Pay', payShema);

// //删除集合
// Pay.db.dropCollection('pays');

module.exports = Pay;
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/terminal-server', {
  useNewUrlParser: true,
  useCreateIndex: true,
})

// pics 模型
const picsShema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String },
  cover: { type: String },
  imgTotal: { type: Number },
  sorting: { type: Number },
  description: {type: String}
})

// 添加虚拟字段用来查找图片信息
picsShema.virtual('picsArr', {
  ref: 'Img', //关联集合
  localField: '_id', //本地用哪个鍵来关联
  foreignField: 'pics', //关联集合的鍵
  justOne: false, // 返回数组
})

const Pics = mongoose.model('Pics', picsShema);

// //删除集合
// Pics.db.dropCollection('pics');

module.exports = Pics;
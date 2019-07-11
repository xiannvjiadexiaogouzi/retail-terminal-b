const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/terminal-server', {
  useNewUrlParser: true,
  useCreateIndex: true,
})

// Style 模型
const styleShema = new mongoose.Schema({
  id: { type: Number, unique: true },
  styleName: { type: String },
  // propertyNum: { type: Number }, //属性数量
  // paramNum: { type: Number }, //参数数量
})

// 虚拟字段 属性
styleShema.virtual('property', {
  ref: 'Property', //关联集合
  localField: '_id', //本地用哪个鍵来关联
  foreignField: 'style', //关联集合的鍵
  justOne: false, // 返回数组
})

// 虚拟字段 参数
styleShema.virtual('param', {
  ref: 'Param', //关联集合
  localField: '_id', //本地用哪个鍵来关联
  foreignField: 'style', //关联集合的鍵
  justOne: false, // 返回数组
})


const Style = mongoose.model('Style', styleShema);

// //删除集合
// Style.db.dropCollection('styles');

module.exports = Style;
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/terminal-server', {
  useNewUrlParser: true,
  useCreateIndex: true,
})

// Type 模型
const typeShema = new mongoose.Schema({
  id: { type: Number, unique: true },
  typeName: { type: String },
  parentId: { type: Number },
  showStatus: { type: Boolean },
  goodsUnit: { type: String },
  goodsSort: { type: Number },
  typeIcon: {type: String},
  typeDesc: {type: String},
  goodsNum: {type: Number}
  //相关商品数量 (关联数据)
  // goodsNum: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
})

// 虚拟字段 分类type
typeShema.virtual('products', {
  ref: 'Product', //关联集合
  localField: '_id', //本地用哪个鍵来关联
  foreignField: 'secondType', //关联集合的鍵
  justOne: false, // 返回数组
})


const Type = mongoose.model('Type', typeShema);

// //删除集合
// Type.db.dropCollection('types');

module.exports = Type;
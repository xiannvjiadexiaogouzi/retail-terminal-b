const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/terminal-server', {
  useNewUrlParser: true,
  useCreateIndex: true,
})

// Stock 模型
const stockShema = new mongoose.Schema({
  id: { type: Number, unique: true }, 
  code: { type: String }, // => _id
  operateType: { type: Number }, // 1入库 2出库
  changeNum : { type: Number },
  changeAfter: { type: Number },
  createTime: { type: String },
  //商品 (关联数据)
  goods: { type: mongoose.SchemaTypes.ObjectId, ref: 'Product' },
  order: { type: mongoose.SchemaTypes.ObjectId, ref: 'Order' },

})

// // 虚拟字段 分类stock
// stockShema.virtual('products', {
//   ref: 'Product', //关联集合
//   localField: '_id', //本地用哪个鍵来关联
//   foreignField: 'secondType', //关联集合的鍵
//   justOne: false, // 返回数组
// })


const Stock = mongoose.model('Stock', stockShema);

// //删除集合
// Stock.db.dropCollection('stocks');

module.exports = Stock;
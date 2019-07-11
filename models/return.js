const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/terminal-server', {
  useNewUrlParser: true,
  useCreateIndex: true,
})

// Returning 模型
const returningShema = new mongoose.Schema({
  code: { type: String }, // => _id
  createTime: { type: String },
  mobilePhone: { type: String }, //用户账户
  contact: { type: String }, //联系人
  phone: { type: String }, //联系方式
  returnReason: { type: String }, //退货原因
  problemDescription: { type: String }, //问题描述
  problemPics: { type: Array }, //问题图片
  buyNum: { type: Number },
  orderCode: { type: String },
  //0已完成 1待处理 2同意退货 3拒绝退货 4收到货确认退款 5收到货拒绝退款 
  status: { type: Number },
  returnName: { type: String }, //收件人
  returnPhone: { type: String }, //收件人电话
  returnAddress: { type: String }, //收件地址
  applicationReturnMoney: { type: Number },//订单金额
  returnMoney: { type: Number },
  resolveRemark: { type: String }, //备注
  //商品 (关联数据)
  goods: { type: mongoose.SchemaTypes.ObjectId, ref: 'Product' },
})

// // 虚拟字段 分类returning
// returningShema.virtual('products', {
//   ref: 'Product', //关联集合
//   localField: '_id', //本地用哪个鍵来关联
//   foreignField: 'secondType', //关联集合的鍵
//   justOne: false, // 返回数组
// })


const Returning = mongoose.model('Returning', returningShema);

// //删除集合
// Returning.db.dropCollection('returnings');

module.exports = Returning;
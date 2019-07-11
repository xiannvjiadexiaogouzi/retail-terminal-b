const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/terminal-server', {
  useNewUrlParser: true,
  useCreateIndex: true,
})

// Order 模型
const orderShema = new mongoose.Schema({
  code: { type: String }, // => _id
  createTime: { type: String },
  mobilePhone: { type: String }, //用户账户
  payType: { type: Number }, //支付方式 1微信支付
  paySrc: { type: Number },//订单来源 1微信小程序
  orderType: {type: Number}, //1普通订单 0秒杀订单
  //状态 0关闭 1待付款 2待发货 3已发货 4已收货 5已评价 6已完成 7删除
  status: { type: Number },
  sendCode: { type: Number }, //快递单号
  sendCompany: { type: String }, //快递公司
  sendEndTime: {type: String}, //确认收货时间
  receiver: { type: String }, //收件人
  phone: { type: String }, //收件人电话
  address: { type: String }, //收件地址
  totalNum: {type: Number}, //商品合计
  sendCost: {type: String}, //运费
  totalMoney: { type: Number },
  mechantRemark: {type: String}, //备注
  userId: {type: Number},
  //商品 (关联数据)
  goods: { type: mongoose.SchemaTypes.ObjectId, ref: 'Product' },
  account: { type: mongoose.SchemaTypes.ObjectId, ref: 'Account' },
})

// // 虚拟字段 分类order
// orderShema.virtual('products', {
//   ref: 'Product', //关联集合
//   localField: '_id', //本地用哪个鍵来关联
//   foreignField: 'secondType', //关联集合的鍵
//   justOne: false, // 返回数组
// })


const Order = mongoose.model('Order', orderShema);

// //删除集合
// Order.db.dropCollection('orders');

module.exports = Order;
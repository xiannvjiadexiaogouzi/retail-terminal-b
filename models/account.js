const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/terminal-server', {
  useNewUrlParser: true,
  useCreateIndex: true,
})

// Account 模型
const accountShema = new mongoose.Schema({
  id: { type: Number, unique: true },
  user: {
    realName: { type: String },
    mobilePhone: { type: String },
    userStatus: { type: Boolean },
    createTime: { type: String },
  },
  addressList: { type: Array },
  consumption: { type: Number }, //消费金额
  order_count: { type: Number },
  favourite: { type: Number },
  evaluation: { type: Number }, //评价
  return_record: { type: Number }, //退货
  login_count: { type: Number },


  // //商品 (关联数据)
  // goods: { type: mongoose.SchemaTypes.ObjectId, ref: 'Product' },
  // order: { type: mongoose.SchemaTypes.ObjectId, ref: 'Order' },

})

// 虚拟字段 orders
accountShema.virtual('orders', {
  ref: 'Order', //关联集合
  localField: '_id', //本地用哪个鍵来关联
  foreignField: 'account', //关联集合的鍵
  justOne: false, // 返回数组
})


const Account = mongoose.model('Account', accountShema);

// //删除集合
// Account.db.dropCollection('accounts');

module.exports = Account;
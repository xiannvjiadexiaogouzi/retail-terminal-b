const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/terminal-server', {
  useNewUrlParser: true,
  useCreateIndex: true,
})

// Comment 模型
const commentShema = new mongoose.Schema({
  id: { type: Number, unique: true },
  status: { type: Boolean }, //显示状态
  userName: { type: String },
  goodsName: { type: String },
  commentLevel: { type: Number }, //评价
  commentIp: { type: String },
  createTime: { type: String },
  commentContent: { type: String },
  commentReplyContent: { type: String },
  //商品 (关联数据)
  product: { type: mongoose.SchemaTypes.ObjectId, ref: 'Product' },
})

// // 虚拟字段 评价
// styleShema.virtual('property', {
//   ref: 'Property', //关联集合
//   localField: '_id', //本地用哪个鍵来关联
//   foreignField: 'style', //关联集合的鍵
//   justOne: false, // 返回数组
// })

const Comment = mongoose.model('Comment', commentShema);

// //删除集合
// Comment.db.dropCollection('comments');

module.exports = Comment;
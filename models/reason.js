const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/terminal-server', {
  useNewUrlParser: true,
  useCreateIndex: true,
})

// Reason 模型
const reasonShema = new mongoose.Schema({
  id: { type: Number, unique: true },
  isUse: { type: Boolean }, //
  reasonType: { type: String },
  createTime: { type: String },
  sorts: { type: Number },
  //相关商品数量 (关联数据)
  // user: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
})

const Reason = mongoose.model('Reason', reasonShema);

// //删除集合
// Reason.db.dropCollection('reasons');

module.exports = Reason;
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/terminal-server', {
  useNewUrlParser: true,
  useCreateIndex: true,
})

// Site 模型
const siteShema = new mongoose.Schema({
  id: { type: Number, unique: true },
  returnAddress: { type: String },
  returnName: { type: String },
  returnPhone: { type: String },
  returnPname: { type: String },
  //相关商品数量 (关联数据)
  // user: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
})

const Site = mongoose.model('Site', siteShema);

// //删除集合
// Site.db.dropCollection('sites');

module.exports = Site;
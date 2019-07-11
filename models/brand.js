const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/terminal-server', {
  useNewUrlParser: true,
  useCreateIndex: true,
})

// Brand 模型
const brandShema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String },
  firstChar: { type: String },
  isShow: { type: Boolean },
  logo: { type: String },
  areaLogo: { type: String },
  story: { type: String },
  sorting: { type: Number },
  //相关商品数量 (关联数据)
  // user: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
})

const Brand = mongoose.model('Brand', brandShema);

// //删除集合
// Brand.db.dropCollection('brands');

module.exports = Brand;
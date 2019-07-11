const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/terminal-server', {
  useNewUrlParser: true,
  useCreateIndex: true,
})

// Img 模型
const imgShema = new mongoose.Schema({
  imgUrl: { type: String },
  path: { type: String },
  image: { type: String, unique: true },
  description: { type: String },
  // 关联相册
  pics: { type: mongoose.SchemaTypes.ObjectId, ref: 'Pics' },
})

const Img = mongoose.model('Img', imgShema);

// //删除集合
// Img.db.dropCollection('imgs');

module.exports = Img;
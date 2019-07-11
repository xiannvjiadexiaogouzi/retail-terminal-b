const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/terminal-server', {
  useNewUrlParser: true,
  useCreateIndex: true,
})

// Ad 模型
const adShema = new mongoose.Schema({
  id: { type: Number, unique: true },
  adLink: { type: String },
  adName: { type: String },
  adPicture: { type: String },
  adPosition: { type: Number },
  online: { type: Boolean },
  remark: { type: String },
  topState: { type: Boolean },
  clickNumber: {type: Number},

})


const Ad = mongoose.model('Ad', adShema);

// //删除集合
// Ad.db.dropCollection('ads');

module.exports = Ad;
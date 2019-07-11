const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/terminal-server', {
  useNewUrlParser: true,
  useCreateIndex: true,
})

// Param 模型
const paramShema = new mongoose.Schema({
  id: { type: Number, unique: true },
  styleId: { type: Number },
  paramName: { type: String }, //参数数量
  paramList: { type: Array }, //参数
  paramSelect: { type: Number }, //唯一参数0，单选1，多选2
  proprtyOrder: { type: Number }, //参数排序
  // style (关联数据)
  style: {type: mongoose.SchemaTypes.ObjectId, ref: 'Style'},
})

const Param = mongoose.model('Param', paramShema);

// //删除集合
// Param.db.dropCollection('params');

module.exports = Param;
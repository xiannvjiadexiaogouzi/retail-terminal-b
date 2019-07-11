const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/terminal-server', {
  useNewUrlParser: true,
  useCreateIndex: true,
})

// Property 模型
const propertyShema = new mongoose.Schema({
  id: { type: Number, unique: true },
  styleId: { type: Number },
  propertyName: { type: String }, //属性数量
  propertyList: { type: Array }, //参数
  propertySelect: { type: Number }, //唯一属性0，单选1，多选2
  proprtyOrder: { type: Number }, //参数排序
  // style (关联数据)
  style: {type: mongoose.SchemaTypes.ObjectId, ref: 'Style'},
})

const Property = mongoose.model('Property', propertyShema);

// //删除集合
// Property.db.dropCollection('properties');

module.exports = Property;
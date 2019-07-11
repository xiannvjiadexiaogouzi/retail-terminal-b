const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/terminal-server', {
  useNewUrlParser: true,
  useCreateIndex: true,
})

// Operate 模型
const operateShema = new mongoose.Schema({
  id: { type: Number, unique: false },
  operator: { type: String },
  operationDate: { type: String },
  ip: { type: String },
  operationRecord: { type: String },
  userId: { type: String, unique: false },
})

const Operate = mongoose.model('Operate', operateShema);

// //删除集合
// Operate.db.dropCollection('operates');

module.exports = Operate;
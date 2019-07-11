const express = require('express');

const { getFront, getOption, getPages, createNo, randomNum, getForm } = require('../util/mixin')
const { User, Operate } = require('../models/index');

const router = express.Router();

// operate 所有
router.get('/all', async (req, res) => {
  let operates = await Operate.find();
  res.send(operates);
})

// operate 列表
router.post('/query_user_operation_log', async (req, res) => {
  //获取前端参数
  let front = getFront(req);
  let user = await User.findOne({_id: req.body.userId});
  let option = {
    operator: req.session.username || user.username,
  }
  await getPages(front, Operate, option).then((val) => {
    Object.assign(front, val);
  });
  let operates = await Operate.find().where(option).sort().skip(front.pageSize * (front.currentPage - 1) || 0).limit(front.pageSize || 5);
  let data = [];
  let id = 0;
  for(let i = 0, len = operates.length; i < len; i++){
    data.push(operates[i]);
    data[i].no = ++ id;
  }
  // console.log(data)
  front.data = data;
  res.send(front);
})

module.exports = router

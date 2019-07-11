const express = require('express');

const { getFront, getOption, getPages, createNo, getForm } = require('../util/mixin')
const { Reason } = require('../models/index');

const router = express.Router();

// 查看所有reason
router.get('/all', async (req, res) => {
  //获取前端参数
  let data = await Reason.find();
  res.send(data);
})

// reason列表
router.post('/query_for_page', async (req, res) => {
  //获取前端参数
  let front = getFront(req);
  let option = getOption(req.body, '');
  await getPages(front, Reason, option).then((val) => {
    Object.assign(front, val);
  });
  front.data = await Reason.find().where(option).sort({ id: 1 }).skip(front.pageSize * (front.currentPage - 1) || 0).limit(front.pageSize || 5);
  res.send(front);
})

// 添加 / 修改reason
router.post('/add', async (req, res) => {
  if (req.body.id) {
    let option = getOption(req.body, 'id');
    let reason = await Reason.findOne(option);
    getForm(req.body, reason);
    await reason.save();
    res.send(reason);
  } else {
    let id = 0;
    await createNo(Reason).then(val => {
      id = val;
    })
    let reason = await Reason.create({
      id: id,
      isUse: req.body.isUse,
      reasonType: req.body.reasonType,
      sorts: req.body.sorts,
      createTime: new Date().toLocaleString()
    })
    res.send(reason);
  }
})

// 删除reason
router.post('/delete', async (req, res) => {
  // 前端传入ids数组， 遍历ids，执行删除
  let ids = req.body;
  for(let i = 0, len = ids.length; i < len; i++){
    let reason = await Reason.findOne({id: ids[i]});
    await reason.remove();
  }
  res.send({
    msg: '删除成功'
  });
})


module.exports = router
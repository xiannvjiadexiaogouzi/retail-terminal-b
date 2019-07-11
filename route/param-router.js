const express = require('express');

const { getFront, getOption, getPages, createNo, getForm } = require('../util/mixin')
const { Style, Param } = require('../models/index');

const router = express.Router();

// 查看所有参数
router.get('/all', async (req, res) => {
  //获取前端参数
  data = await Param.find();
  res.send(data);
})

// 参数列表
router.post('/merchant_goods_param_list_page', async (req, res) => {
  // //获取前端参数
  let front = getFront(req);
  // 搜索条件
  let option = getOption(req.body, 'styleId');
  await getPages(front, Param, option).then((val) => {
    Object.assign(front, val);
  });
  front.data = await Param.find().where(option).populate('style').sort({ id: 1 }).skip(front.pageSize * (front.currentPage - 1) || 0).limit(front.pageSize || 5);
  res.send(front);
})

// 查看参数
router.post('/merchant_goods_type_by_id', async (req, res) => {
  //获取前端参数
  let front = getFront(req);
  let option = getOption(req.body, 'id');
  front.data = await Param.findOne(option);
  res.send(front);
})

// 添加参数
router.post('/merchant_goods_type_add', async (req, res) => {
  let id = 0;
  await createNo(Param).then(val => {
    id = val;
  })
  let list = req.body.paramList.split(',');
  let style = await Style.findOne({id: req.body.styleId});
  let param = await Param.create({
    id: id,
    styleId: req.body.styleId,
    paramName: req.body.paramName,
    paramList: list,
    paramSelect: req.body.paramSelect,
    style: style,
  })
  res.send(param);
})

// 修改参数
router.post('/merchant_goods_type_update', async (req, res) => {
  let option = getOption(req.body, 'id');
  let param = await Param.findOne(option);
  getForm(req.body, param);
  await param.save();
  res.send(param);
})

// 删除参数 批量
router.post('/delete_batch', async (req, res) => {
  // 前端传入ids数组， 遍历ids，执行删除
  let ids = req.body;
  for (let i = 0, len = ids.length; i < len; i++) {
    let param = await Param.findOne({ id: ids[i] });
    await param.remove();
  }
  res.send({
    msg: '删除成功'
  });
})


module.exports = router

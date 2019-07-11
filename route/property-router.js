const express = require('express');

const { getFront, getOption, getPages, createNo, getForm } = require('../util/mixin')
const { Style, Property } = require('../models/index');

const router = express.Router();

// 查看所有属性
router.get('/all', async (req, res) => {
  //获取前端参数
  data = await Property.find();
  res.send(data);
})

// 属性列表
router.post('/merchant_goods_property_list_page', async (req, res) => {
  // //获取前端参数
  let front = getFront(req);
  // 搜索条件
  let option = getOption(req.body, 'styleId');
  await getPages(front, Property, option).then((val) => {
    Object.assign(front, val);
  });
  front.data = await Property.find().where(option).populate('style').sort({ id: 1 }).skip(front.pageSize * (front.currentPage - 1) || 0).limit(front.pageSize || 5);
  res.send(front);
})

// 查看属性
router.post('/merchant_goods_type_by_id', async (req, res) => {
  //获取前端参数
  let front = getFront(req);
  let option = getOption(req.body, 'id');
  front.data = await Property.findOne(option);
  res.send(front);
})

// 添加属性
router.post('/merchant_goods_type_add', async (req, res) => {
  let id = 0;
  await createNo(Property).then(val => {
    id = val;
  })
  let list = req.body.propertyList.split(',');
  let style = await Style.findOne({id: req.body.styleId});
  console.log(style)
  let property = await Property.create({
    id: id,
    styleId: req.body.styleId,
    propertyName: req.body.propertyName,
    propertyList: list,
    propertySelect: req.body.propertySelect,
    style: style,
  })
  res.send(property);
})

// 修改属性
router.post('/merchant_goods_type_update', async (req, res) => {
  let option = getOption(req.body, 'id');
  let property = await Property.findOne(option);
  getForm(req.body, property);
  property.propertyList = property.propertyList[0].split(',');
  await property.save();
  res.send(property);
})

// 删除属性 批量
router.post('/delete_batch', async (req, res) => {
  // 前端传入ids数组， 遍历ids，执行删除
  let ids = req.body;
  for (let i = 0, len = ids.length; i < len; i++) {
    let property = await Property.findOne({ id: ids[i] });
    await property.remove();
  }
  res.send({
    msg: '删除成功'
  });
})


module.exports = router

const express = require('express');

const { getFront, getOption, getPages, createNo, getForm } = require('../util/mixin')
const { Style } = require('../models/index');

const router = express.Router();

// 查看所有类型
router.get('/allStyles', async (req, res) => {
  //获取前端参数
  data = await Style.find();
  res.send(data);
})

// 类型列表
router.post('/merchant_goods_style_list_page', async (req, res) => {
  // //获取前端参数
  let front = getFront(req);
  // 搜索条件
  let option = getOption(req.body, '');
  // // 重新整理propertyNum和paramNum
  // adjustStyle(Style);
  await getPages(front, Style, option).then((val) => {
    Object.assign(front, val);
  });
  front.data = await Style.find().where(option).sort({ id: 1 }).skip(front.pageSize * (front.currentPage - 1) || 0).limit(front.pageSize || 5).populate('param').populate('property').lean();
  res.send(front);
})

// 所有类型选择表
router.get('/merchant_goods_type_list', async (req, res) => {
  let styles = await Style.find();
  let data = [];
  styles.forEach(el => {
    data.push(getOption(el, 'id', 'styleName'))
  });
  // console.log(data)
  res.send(data);
})

// 添加类型
router.post('/merchant_goods_type_add', async (req, res) => {
  let id = 0;
  await createNo(Style).then(val => {
    id = val;
  })
  let style = await Style.create({
    id: id,
    styleName: req.body.styleName,
  })
  res.send(style);
})

// 修改类型
router.post('/merchant_goods_type_update', async (req, res) => {
  let option = getOption(req.body, 'id');
  let style = await Style.findOne(option);
  getForm(req.body, style);
  await style.save();
  res.send(style);
})

// 删除类型 单个 非批量
router.post('/merchant_goods_type_delete', async (req, res) => {
  // 前端传入ids数组， 遍历ids，执行删除
  let id = req.body.id;
  let style = await Style.findOne({ id: id });
  await style.remove();
  res.send({
    msg: '删除成功'
  });
})

// // 重新计算style的prop和param数量
// let adjustStyle = async(database) => {
//   let arr = await database.find().populate('property').populate('param');
//   arr.forEach(async val =>{
//     val.propertyNum = val.property.length;
//     val.paramNum = val.param.length;
//     console.log(val)
//     // await val.save();
//   })
//   await arr.save();
// }

module.exports = router

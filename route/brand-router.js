const express = require('express');

const { getFront, getOption, getPages, createNo, getForm } = require('../util/mixin')
const { Brand } = require('../models/index');

const router = express.Router();

// 品牌列表
router.post('/query_for_page', async (req, res) => {
  //获取前端参数
  let front = getFront(req);
  let option = getOption(req.body, 'name');
  console.log(option)
  await getPages(front, Brand, option).then((val) => {
    Object.assign(front, val);
  });
  front.data = await Brand.find().where(option).sort({ id: 1 }).skip(front.pageSize * (front.currentPage - 1) || 0).limit(front.pageSize || 5);
  res.send(front);
})

// 所有品牌选择表
router.get('/query_list', async (req, res) => {
  let brands = await Brand.find();
  let data = [];
  brands.forEach(el => {
    data.push(getOption(el, 'id', 'name'))
  });
  // console.log(data)
  res.send(data);
})

// 查看品牌
router.post('/query_by_id', async (req, res) => {
  //获取前端参数
  let front = getFront(req);
  let option = getOption(req.body, 'id');
  front.data = await Brand.findOne(option);
  res.send(front);
})

// 添加品牌
router.post('/add', async (req, res) => {
  let id = 0;
  await createNo(Brand).then(val => {
    id = val;
  })
  let brand = await Brand.create({
    id: id,
    name: req.body.name,
    firstChar: req.body.firstChar,
    isShow: req.body.isShow,
    logo: req.body.logo,
    areaLogo: req.body.areaLogo,
    story: req.body.story,
    sorting: req.body.sorting,
  })
  res.send(brand);
})

// 修改品牌
router.post('/update', async (req, res) => {
  let option = getOption(req.body, 'id');
  // console.log(req.body)
  let brand = await Brand.findOne(option);
  getForm(req.body, brand);
  await brand.save();
  res.send(brand);
})

// 删除品牌
router.post('/delete_batch', async (req, res) => {
  // 前端传入ids数组， 遍历ids，执行删除
  let ids = req.body;
  for(let i = 0, len = ids.length; i < len; i++){
    let brand = await Brand.findOne({id: ids[i]});
    await brand.remove();
  }
  res.send({
    msg: '删除成功'
  });
})


module.exports = router

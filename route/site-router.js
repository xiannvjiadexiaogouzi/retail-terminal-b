const express = require('express');

const { getFront, getOption, getPages, createNo, getForm } = require('../util/mixin')
const { Site } = require('../models/index');

const router = express.Router();

// 查看所有site
router.get('/all', async (req, res) => {
  //获取前端参数
  data = await Site.find();
  res.send(data);
})

// 地点列表
router.post('/query_for_page', async (req, res) => {
  //获取前端参数
  let front = getFront(req);
  let option = getOption(req.body, '');
  await getPages(front, Site, option).then((val) => {
    Object.assign(front, val);
  });
  front.data = await Site.find().where(option).sort({ id: 1 }).skip(front.pageSize * (front.currentPage - 1) || 0).limit(front.pageSize || 5);
  res.send(front);
})

// 查看地点
router.post('/query_by_id', async (req, res) => {
  //获取前端参数
  let front = getFront(req);
  let option = getOption(req.body, 'id');
  front.data = await Site.findOne(option);
  res.send(front);
})

// 添加 / 修改地点
router.post('/add_or_update', async (req, res) => {
  if (req.body.id) {
    let option = getOption(req.body, 'id');
    let site = await Site.findOne(option);
    getForm(req.body, site);
    await site.save();
    res.send(site);
  } else {
    let id = 0;
    await createNo(Site).then(val => {
      id = val;
    })
    let site = await Site.create({
      id: id,
      returnAddress: req.body.returnAddress,
      returnName: req.body.returnName,
      returnPhone: req.body.returnPhone,
      returnPname: req.body.returnPname,
    })
    res.send(site);
  }
})

// 删除地点
router.post('/delete', async (req, res) => {
  // 前端传入ids数组， 遍历ids，执行删除
  let ids = req.body;
  for(let i = 0, len = ids.length; i < len; i++){
    let site = await Site.findOne({id: ids[i]});
    await site.remove();
  }
  res.send({
    msg: '删除成功'
  });
})


module.exports = router

const express = require('express');

const { getFront, getOption, getPages, createNo, randomNum, getForm } = require('../util/mixin')
const { Ad } = require('../models/index');

const router = express.Router();

// ad 所有
router.get('/all', async (req, res) => {
  let ads = await Ad.find();
  res.send(ads);
})

// ad列表
router.post('/get_merchant_ad_list', async (req, res) => {
  //获取前端参数
  let front = getFront(req);
  let option = getOption(req.body, '');
  // console.log(req.body)
  await getPages(front, Ad, option).then((val) => {
    Object.assign(front, val);
  });
  front.data = await Ad.find().where(option).populate().lean().sort({ id: 1 }).skip(front.pageSize * (front.currentPage - 1) || 0).limit(front.pageSize || 5);
  res.send(front);
})

// 查看ad
router.post('/get_single_merchant_ad', async (req, res) => {
  let front = getFront(req);
  let option = getOption(req.body, 'id');
  front.data = await Ad.findOne(option);
  res.send(front);
})

// 添加ad
router.post('/add_merchant_ad', async (req, res) => {
  let id = 0;
  await createNo(Ad).then(val => {
    id = val;
  })
  let ad = await Ad.create({
    id: id,
    adLink: req.body.adLink,
    adName: req.body.adName,
    adPicture: req.body.adPicture,
    adPosition: req.body.adPosition,
    online: req.body.online,
    remark: req.body.remark,
    clickNumber: randomNum(0, 999),
  })
  res.send(ad);
})

// 修改ad
router.post('/change_merchant_ad', async (req, res) => {
  let option = getOption(req.body, 'id');
  // console.log(req.body)
  let ad = await Ad.findOne(option);
  getForm(req.body, ad);
  await ad.save();
  res.send(ad);
})

// 删除ad
router.post('/delete_merchant_ad', async (req, res) => {
  // 前端传入ids数组， 遍历ids，执行删除
  let ids = req.body;
  for(let i = 0, len = ids.length; i < len; i++){
    let ad = await Ad.findOne({id: ids[i]});
    await ad.remove();
  }
  res.send({
    msg: '删除成功'
  });
})


module.exports = router

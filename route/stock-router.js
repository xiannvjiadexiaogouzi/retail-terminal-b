const express = require('express');

const { getFront, getOption, getPages, createNo,  randomNum, randomDate } = require('../util/mixin')
const { Product, Stock } = require('../models/index');

const router = express.Router();

// 查看所有stock
router.get('/all', async (req, res) => {
  //获取前端参数
  data = await Stock.find().populate('order').populate('goods');
  res.send(data);
})

// stock列表
router.post('/query_for_page', async (req, res) => {
  //获取前端参数
  let front = getFront(req);
  let option = getOption(req.body, 'operateType');
  await getPages(front, Stock, option).then((val) => {
    Object.assign(front, val);
  });
  front.data = await Stock.find().where(option).populate('order').populate('goods').sort({ id: 1 }).skip(front.pageSize * (front.currentPage - 1) || 0).limit(front.pageSize || 5);
  res.send(front);
})

// 添加入库stock
router.post('/add', async (req, res) => {
  //商品
  let changeNum =  randomNum(1, 200);
  let goods = await Product.find().populate('brand');
  let goodsLen = goods.length;
  // let goodsNum = random(1, goodsLen); //总商品类数
  let goodsIdx = randomNum(1, goodsLen) - 1; //随机商品编号
  let good = goods[goodsIdx];
  good.goodsStock += changeNum;
  await good.save();
  //库存
  let id = 0;  
  await createNo(Stock).then(val => {
    id = val;
  })
  let stock = await Stock.create({
    id: id,
    operateType: 1,
    changeNum: changeNum,
    changeAfter: good.goodsStock,
    createTime:  randomDate('2018', false),
  })
  stock.code = stock._id;
  stock.goods = good;
  await stock.save();
  res.send(stock);
})

// // 选择stock
// router.post('/query_type', async (req, res) => {
//   // 前端传入ids数组， 遍历ids，执行删除
//   let option = req.body;
//   let data = await Stock.find().where(option).populate('order').populate('goods').sort({ id: 1 }).skip(front.pageSize * (front.currentPage - 1) || 0).limit(front.pageSize || 5);
//   res.send(data);
// })


module.exports = router

const express = require('express');

const { getFront, getOption, getPages, getForm, randomDate, randomNum, createNo } = require('../util/mixin')
const { Stock, Product, Order } = require('../models/index');

const router = express.Router();

const STATUS = ['ygb', 'dfk', 'dfh', 'yfh', 'ysh', 'ywc', 'todayOrderNum', 'todayOrderMoney', 'yesterdayOrderMoney', 'nearlySevenDaysOrderMoney']
const SEND = ['圆通', '中通', '顺丰', '申通', 'EMS'];
const RECEIVER = ['段聿飞', '陈焱', '张镞远', '林琳', '符晓', '林云龙', '林资山', '叶民崇', '王小惠', '陈一冰'];

// 查看所有订单
router.get('/all', async (req, res) => {
  //获取前端参数
  data = await Order.find();
  res.send(data);
})

// 添加订单
router.post('/add', async (req, res) => {
  // 随机自动补全
  req.body.createTime = randomDate('2018', false);
  req.body.mobilePhone = randomNum(135, 139).toString() + randomNum(10000000, 99999999).toString();
  req.body.orderType = randomNum(0, 1);
  req.body.status = Math.floor(Math.random() * 8);
  req.body.totalMoney = randomNum(1, 999);
  req.body.sendCode = req.body.status > 2 ? randomNum(0, 9999999999999) : '';
  req.body.sendCompany = req.body.status > 1 ? SEND[randomNum(0, 4)] : '';
  req.body.sendEndTime = req.body.status > 3 ? randomDate(req.body.createTime.split(' ')[0].replace(/-/g, '/'), true, randomNum(0, 1000000000)) : '';
  req.body.receiver = RECEIVER[randomNum(0, 9)];
  req.body.phone = randomNum(135, 139).toString() + randomNum(10000000, 99999999).toString();
  req.body.address = '西安市雁塔区小寨东路90号';
  req.body.sendCost = '包邮';
  let order = await Order.create(req.body);
  // // 补全其他信息
  order.code = order._id;
  // 关联商品信息
  let goods = await Product.find().populate('brand');
  let goodsLen = goods.length;
  // let goodsNum = random(1, goodsLen); //总商品类数
  let goodsIdx = randomNum(1, goodsLen) - 1; //随机商品编号
  let good = goods[goodsIdx];
  order.goods = good;
  order.totalNum = randomNum(1, 10);
  order.totalMoney = order.goods.goodsPrice * order.totalNum;
  await order.save();
  // // 关联商品
  // // order.product = await Product.findOne({ goodsName: order.goodsName });
  // 添加入库记录
  good.goodsStock -= order.totalNum;
  await good.save();
  let id = 0;  
  await createNo(Stock).then(val => {
    id = val;
  })
  let stock = await Stock.create({
    id: id,
    operateType: 0,
    changeAfter: good.goodsStock,
    createTime:  randomDate(req.body.createTime.split(' ')[0].replace(/-/g, '/'), true, randomNum(0, 1000000)),
  })
  stock.order = order;
  stock.goods = good;
  await stock.save();
  res.send(order);
})

// 订单概览
router.post('/getOrderAllCount', async (req, res) => {
  let data = {

  };
  let orders = await Order.find().sort({ status: 1 });
  data.allOrder = orders.length;
  STATUS.forEach(val => {
    data[val] = 0;
  })
  orders.forEach(val => {
    switch (val.status) {
      case 0:
        data.ygb++;
        break;
      case 1:
        data.dfk++;
        break;
      case 2:
        data.dfh++;
        break;
      case 3:
        data.yfh++;
        break;
      case 4:
        data.ysh++;
        break;
      case 5:
        data.ywc++;
        break;
      case 6:
        data.ywc++;
        break;
      case 7:
        break;
    }
  });
  res.send(data);
})

// 订单列表
router.post('/query_for_page', async (req, res) => {
  //获取前端参数
  let front = getFront(req);
  // 搜索条件
  let option = getOption(req.body, 'code', 'mobilePhone', 'status', 'userId');
  // console.log(option)
  await getPages(front, Order, option).then((val) => {
    Object.assign(front, val);
  });
  front.data = await Order.find().where(option).populate().sort({createTime: -1}).skip(front.pageSize * (front.currentPage - 1) || 0).limit(front.pageSize || 5);
  res.send(front);
})

// 查看订单
router.post('/query_By_Id', async (req, res) => {
  //获取前端参数
  let option = getOption(req.body, 'code');
  let order = await Order.findOne(option).populate('goods');
  // let data = getOption(order, 'sendCode', 'sendCompany', 'receiver', 'phone', 'address');
  res.send(order);
})


// 修改回复
router.post('/updateOrder', async (req, res) => {
  let option = getOption(req.body, 'code');
  let order = await Order.findOne(option);
  getForm(req.body, order);
  // // 关联评论
  // order.orderReplyContent = req.body.orderReplyContent;
  await order.save();
  res.send(order);
})

// 关闭订单
router.post('/close', async (req, res) => {
  // 前端传入ids数组， 遍历ids，修改status
  let ids = req.body;
  for (let i = 0, len = ids.length; i < len; i++) {
    let order = await Order.findOne({ code: ids[i] });
    order.status = 0;
    await order.save();
  }
  res.send({
    msg: '关闭成功'
  });
})

// 确认收货
router.post('/receive', async (req, res) => {
  // 前端传入ids数组， 遍历ids，修改status
  let ids = req.body;
  for (let i = 0, len = ids.length; i < len; i++) {
    let order = await Order.findOne({ code: ids[i] });
    order.status = 4;
    await order.save();
  }
  res.send({
    msg: '关闭成功'
  });
})

// 删除订单 批量
router.post('/delete', async (req, res) => {
  // 前端传入ids数组， 遍历ids，执行删除
  let ids = req.body;
  for (let i = 0, len = ids.length; i < len; i++) {
    let order = await Order.findOne({ code: ids[i] });
    await order.remove();
  }
  res.send({
    msg: '删除成功'
  });
})

// 设置订单
router.post('/queryOrderSet', async (req, res) => {
  let data = {
    commentEndTime: 1,
    finalEndTime: 5,
    normalEndpayTime: 25,
    seckillEndpayTime: 5,
    sendEndTime: 20
  }
  res.send(data);
})


module.exports = router

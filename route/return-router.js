const express = require('express');

const { getFront, getOption, getPages, getForm, randomDate, randomNum } = require('../util/mixin')
const { Product, Returning } = require('../models/index');

const STATUS = ['dcl', 'thz', 'ywc', 'yjj', 'ytk', 'btk']
const CONTACT = ['段聿飞', '陈焱', '张镞远', '林琳', '符晓', '林云龙', '林资山', '叶民崇', '王小惠', '陈一冰'];

const router = express.Router();

// 查看所有退货
router.get('/all', async (req, res) => {
  //获取前端参数
  data = await Returning.find();
  res.send(data);
})

// 添加退货
router.post('/add', async (req, res) => {
  // 随机自动补全
  req.body.createTime = randomDate('2018', false);
  req.body.mobilePhone = randomNum(135, 139).toString() + randomNum(10000000, 99999999).toString();
  req.body.phone = randomNum(135, 139).toString() + randomNum(10000000, 99999999).toString();
  req.body.status = randomNum(0, 5);
  req.body.totalMoney = randomNum(1, 999);
  req.body.problemDescription = '默认原因';
  req.body.contact = CONTACT[randomNum(0, 9)];
  let returning = await Returning.create(req.body);
  // // 补全其他信息
  returning.code = returning._id;
  returning.orderCode = returning._id;
  // 关联商品信息
  let goods = await Product.find().populate('brand');
  let goodsLen = goods.length;
  // let goodsNum = random(1, goodsLen); //总商品类数
  let goodsIdx = randomNum(1, goodsLen) - 1; //随机商品编号
  returning.goods = goods[goodsIdx];
  returning.buyNum = randomNum(1, 10);
  returning.returnMoney = returning.goods.goodsPrice * returning.buyNum;
  returning.applicationReturnMoney = returning.returnMoney;
  await returning.save();
  res.send(returning);
})

// 退货概览
router.post('/getReturningAllCount', async (req, res) => {
  let data = {};
  let returnings = await Returning.find().sort({ status: 1 });
  data.all = returnings.length;
  STATUS.forEach(val => {
    data[val] = 0;
  })
  returnings.forEach(val => {
    switch (val.status) {
      case 0:
        data.ywc++;
        break;
      case 1:
        data.dcl++;
        break;
      case 2:
        data.thz++;
        break;
      case 3:
        data.yjj++;
        break;
      case 4:
        data.ytk++; //已退款
        break;
      case 5:
        data.btk++; //不退款
        break;
    }
  });
  res.send(data);
})

// 退货列表
router.post('/query_for_page', async (req, res) => {
  //获取前端参数
  let front = getFront(req);
  // 搜索条件
  let option = getOption(req.body, 'code', 'mobilePhone', 'status', 'createTime');
  option.createTime = new RegExp(option.createTime);
  await getPages(front, Returning, option).then((val) => {
    Object.assign(front, val);
  });
  front.data = await Returning.find().where(option).populate().sort({ createTime: -1 }).skip(front.pageSize * (front.currentPage - 1) || 0).limit(front.pageSize || 5);
  res.send(front);
})

// 查看退货
router.post('/query_By_Id', async (req, res) => {
  //获取前端参数
  let option = getOption(req.body, 'code');
  let returning = await Returning.findOne(option).populate('goods');
  // let data = getOption(returning, 'sendCode', 'sendCompany', 'receiver', 'phone', 'address');
  res.send(returning);
})


// 修改
router.post('/update', async (req, res) => {
  let option = getOption(req.body, 'code');
  let returning = await Returning.findOne(option);
  getForm(req.body, returning);
  // // 关联评论
  // returning.returningReplyContent = req.body.returningReplyContent;
  await returning.save();
  res.send(returning);
})

// 删除退货 批量
router.post('/delete', async (req, res) => {
  // 前端传入ids数组， 遍历ids，执行删除
  let ids = req.body;
  for (let i = 0, len = ids.length; i < len; i++) {
    let returning = await Returning.findOne({ code: ids[i] });
    await returning.remove();
  }
  res.send({
    msg: '删除成功'
  });
})


module.exports = router

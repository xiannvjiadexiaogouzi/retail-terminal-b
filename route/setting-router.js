const express = require('express');

const { getFront, getOption, getPages, createNo, randomNum, getForm } = require('../util/mixin')
const { User, Pay } = require('../models/index');

const router = express.Router();

// pay 所有
router.get('/all', async (req, res) => {
  let pays = await Pay.find();
  res.send(pays);
})

// pay设置 加载
router.post('/query', async (req, res) => {
  //获取前端参数
  let front = getFront(req);
  let option = getOption(req.body, 'userId');
  // console.log(req.body)
  front.data = await Pay.findOne(option).populate();
  res.send(front);
})

// pay设置 修改
router.post('/update', async (req, res) => {
  //获取前端参数
  let front = getFront(req);
  let option = getOption(req.body, 'userId');
  // console.log(req.body)
  let pay = await Pay.findOne(option);
  getForm(req.body, pay);
    await pay.save();
  res.send(front);
})

// // pay设置 add
// router.post('/add', async (req, res) => {
//   //获取前端参数
//   let front = getFront(req);
//   let option = getOption(req.body, 'userId');
//   // console.log(req.body)
//   let user = await User.findOne(option);
//   if (user.username) {
//     let pay = await Pay.create({
//       userId: '5ce26806069b9e7b411b009b',
//     });
//     front.data = pay;
//   }
//   res.send(front);
// })

// // 查看pay
// router.post('/get_single_merchant_pay', async (req, res) => {
//   let front = getFront(req);
//   let option = getOption(req.body, 'id');
//   front.data = await Pay.findOne(option);
//   res.send(front);
// })

// // 添加pay
// router.post('/payd_merchant_pay', async (req, res) => {
//   let id = 0;
//   await createNo(Pay).then(val => {
//     id = val;
//   })
//   let pay = await Pay.create({
//     id: id,
//     payLink: req.body.payLink,
//     payName: req.body.payName,
//     payPicture: req.body.payPicture,
//     payPosition: req.body.payPosition,
//     online: req.body.online,
//     remark: req.body.remark,
//     clickNumber: randomNum(0, 999),
//   })
//   res.send(pay);
// })

// // 修改pay
// router.post('/change_merchant_pay', async (req, res) => {
//   let option = getOption(req.body, 'id');
//   // console.log(req.body)
//   let pay = await Pay.findOne(option);
//   getForm(req.body, pay);
//   await pay.save();
//   res.send(pay);
// })

// // 删除pay
// router.post('/delete_merchant_pay', async (req, res) => {
//   // 前端传入ids数组， 遍历ids，执行删除
//   let ids = req.body;
//   for(let i = 0, len = ids.length; i < len; i++){
//     let pay = await Pay.findOne({id: ids[i]});
//     await pay.remove();
//   }
//   res.send({
//     msg: '删除成功'
//   });
// })


module.exports = router

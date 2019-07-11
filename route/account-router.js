const express = require('express');

const { getFront, getOption, getPages, createNo, randomNum, randomDate, getForm } = require('../util/mixin')
const { Account } = require('../models/index');

const NAME = ['段聿飞', '陈焱', '张镞远', '林琳', '符晓', '林云龙', '林资山', '叶民崇', '王小惠', '陈一冰'];
const DISTRICT = ['撒地', '阿凡达', '番奋', '候补', '阿斯顿'];
const ROAD = ['即可', '人的噶', '阿三', '额外', '改变'];

const router = express.Router();

// account 所有
router.get('/all', async (req, res) => {
  let accounts = await Account.find();
  res.send(accounts);
})

//用户总览
router.get('/user_index', async (req, res) => {
  let accounts = await Account.find();
  let data = {
    todayAddUserCount: 0,
    yesterdayAddUserCount: 0,
    monthAddUserCount: 0,
    allUserCount: accounts.length,
  };
  // accounts.forEach(val => {

  // })
  res.send(data);
})

// account列表
router.post('/get_user_list', async (req, res) => {
  //获取前端参数
  let front = getFront(req);
  option = getOption(req.body, 'realName', 'mobilePhone');
  // console.log(req.body)
  await getPages(front, Account, option).then((val) => {
    Object.assign(front, val);
  });
  front.data = await Account.find().where(option).populate('orders').lean().sort({ id: 1 }).skip(front.pageSize * (front.currentPage - 1) || 0).limit(front.pageSize || 5);
  res.send(front);
})

// 查看account
router.post('/detail/:id', async (req, res) => {
  // console.log(req.params.id)
  if (req.params.id) {
    let account = await Account.findOne({ id: req.params.id }).populate('orders');
    account.consumption = 0;
    account.orders.forEach(order => {
      // console.log(order);
      account.consumption += order.totalMoney;
    })
    account.order_count = account.orders.length;
    // account.evaluation = ;
    // account.return_record = ;
    // account.favourite = randomNum(0, 10);
    // account.login_count = randomNum(0, 50);
    await account.save();
    res.send(account);
    // next()
  }
  // // console.log('account')
  // res.send('account');
})
// router.param('id', async (req, res, next, id) => {
//   next();
// })

// //随机绑定订单
// router.get('/order', async (req, res) => {
//   // 绑定订单
//   let orders = await Order.find();
//   orders.forEach(async order => {
//     let user = await Account.findOne({ id: randomNum(1, 11) })
//     order.account = user;
//     order.userId = user.id;
//     await order.save();
//   })
//   // //修改默认地址
//   // let accounts = await Account.find();
//   // accounts.forEach(async account => {
//   //   account.addressList[0].defaultState = true;
//   //   await account.save();
//   //   console.log(account)
//   // })
//   // // 绑定评论
//   // let accounts = await Account.find();
//   // accounts.forEach( async account =>{
//   //   account.evaluation = randomNum(0, 10);
//   //   account.return_record = randomNum(0, 5);
//   //   await account.save();
//   // })
//   //   let orders = await Order.find();
//   // orders.forEach(async order => {
//   //   let user = await Account.findOne({ id: randomNum(1, 11) })
//   //   order.account = user;
//   //   await order.save();
//   // })
//   // 绑定退货
//   res.send('ok')
// })

// 添加account
router.post('/add', async (req, res) => {
  let id = 0;
  await createNo(Account).then(val => {
    id = val;
  })
  //用户信息
  let user = {};
  user.realName = NAME[randomNum(0, 9)];
  user.mobilePhone = randomNum(135, 139).toString() + randomNum(10000000, 99999999).toString();
  user.userStatus = true;
  user.createTime = randomDate('2018', false);
  //地址
  let address = {};
  address.userName = NAME[randomNum(0, 9)];
  address.phone = randomNum(135, 139).toString() + randomNum(10000000, 99999999).toString();
  address.address = DISTRICT[randomNum(0, DISTRICT.length)] + '区' + ROAD[randomNum(0, ROAD.length)] + '路' + randomNum(1, 100) + '号';
  address.defaultState = true;
  let addressArr = [];
  addressArr.push(address);
  let account = await Account.create({
    id: id,
    user: user,
    addressList: addressArr,
    favourite: randomNum(0, 10),
    login_count: randomNum(0, 50),
    consumption: 0,
    evaluation: randomNum(0, 10),
    return_record: randomNum(0, 3),
  })
  res.send(account);
})

// 修改account
router.post('/change_user_status', async (req, res) => {
  let option = getOption(req.body, 'id');
  // console.log(req.body)
  let account = await Account.findOne(option);
  account.user.userStatus = req.body.userStatus;
  await account.save();
  res.send(account);
})

// // 删除account
// router.post('/delete_batch', async (req, res) => {
//   // 前端传入ids数组， 遍历ids，执行删除
//   let ids = req.body;
//   for(let i = 0, len = ids.length; i < len; i++){
//     let account = await Account.findOne({id: ids[i]});
//     await account.remove();
//   }
//   res.send({
//     msg: '删除成功'
//   });
// })


module.exports = router

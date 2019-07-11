const express = require('express');
const bcrypt = require('bcrypt');

const { getFront, getPages, getTime, getIp, getIpInfo, getBrowser } = require('../util/mixin')
const { User, LoginLog } = require('../models/index');
const upload = require('../api/upload');

const router = express.Router();

// get所有用户
router.get('/users', async (req, res) => {
  let users = await User.find();
  res.send(users);
})

// 注册
router.post('/register', async (req, res) => {
  let user = await User.create({
    username: req.body.username,
    password: req.body.password,
  })
  res.send(user);
})

// 登陆
router.post('/login', async (req, res) => {
  // user是否存在
  let user = await User.findOne({
    username: req.body.username,
  })
  //如果用户不存在
  if (!user) {
    return res.status(422).send({
      msg: '用户不存在'
    })
  }
  //检测密码
  let isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
  if (!isPasswordValid) {
    return res.status(422).send({
      msg: '密码错误'
    })
  }

  // //修改用户数据
  // user.userId = user._id;
  //生成loginLog
  let loginInfo = await LoginLog.create({
    user: user.username,
    operateTime: getTime(), // 获取时间
    ip: getIp(req),   // 获取ip
    browser: getBrowser(req), //获取浏览器信息
  });
  getIpInfo(loginInfo); // 查询ip地址
  // console.log('loginInfo ok!')
  await user.save();

  // 生成session
  req.session.username = user.username

  //返回
  let userInfo = {};
  userInfo.username = user.username;
  userInfo.userId = user._id;
  res.send({
    userInfo,
    msg: '返回成功',
    // token: 'token...'
  });
})

// 登录信息
router.post('/get_merchant_login_info_list', async (req, res) => {
  // 关联数据库用法
  // let loginLogs = await User.findOne({
  //   username: req.body.username,
  // }).populate('loginLogs').lean();
  // res.send(loginLogs.loginLogs);
  //获取前端参数
  let front = getFront(req);
  await getPages(front, LoginLog, {
    user: req.body.username
  }).then((val) => {
    Object.assign(front, val);
  });
  // console.log(front);
  // 直接数据库用法 
  front.data = await LoginLog.find().where({
    user: req.body.username,
  }).sort({ operateTime: -1 }).skip(front.pageSize * (front.currentPage - 1) || 0).limit(front.pageSize || 5);
  res.send(front);
})

//所有登陆信息 列表
router.get('/login_info', async (req, res) => {
  // let loginLogs = await LoginLog.find().populate('user');
  let loginLogs = await LoginLog.find();
  res.send(loginLogs);
})

// 登出
router.get('/logout', async (req, res) => {
  // 检测session是否存在
  // console.log(req.session)
  req.session.destroy((err) => {
    if (err) {
      console.log("退出失败!");
      return;
    }
    //清除登录cookie
    req.cookie
    res.clearCookie('connect.sid');
    res.send({
      msg: 'logout is ok'
    });
  })
})

//查看用户
router.post('/detail', async (req, res) => {
  let user = await User.findOne({ _id: req.body.userId });
  res.send(user);
})

//修改用户
router.post('/change', async (req, res) => {
  let user = await User.findOne({ _id: req.body.userId });
  console.log(user);
  //检测密码
  let isPasswordValid = bcrypt.compareSync(req.body.oldPw, user.password);
  if (!isPasswordValid) {
    return res.status(422).send({
      msg: '原密码错误'
    })
  }else{
    user.password = req.body.newPw;
    await user.save();
  }
  console.log(user)
  res.send('修改成功');
})

//上传图片
router.post('/upload_file', upload)

module.exports = router

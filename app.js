const express = require('express');
// const bcrypt = require('bcrypt');

const SECRET = 'secrettoken'

const routers = require('./route/index.js');

const { Operate } = require('./models/index');
const { OPERATE } = require('./util/static');
const { getIp, createNo } = require('./util/mixin');

const app = new express();
app.use(express.json());

const session = require('express-session');
app.use(session({
  secret: SECRET, //用来对session id相关的cookie进行签名
  resave: true, //是否每次都重新保存会话，建议false
  saveUninitialized: true,
  rolling: true, //根据最后一次请求重新计时
  cookie: {
    maxAge: 1000 * 60 * 20, //最长保存时间，20min
  }
}))

app.listen(3000, () => {
  console.log('3000 is running')
})

// //检测session中间件
// app.use(async (req, res, next) => {
//   // 检测session是否存在
//   // console.log(req.session.username)
//   // 判断是否有cookie，排除登陆/注册页面
//   if (req.session.username || req.path === '/merchant/login') {
//     next();
//   } else {
//     return res.status(416).send({
//       msg: '会话过期'
//     })
//   }
// })

//添加操作记录
app.use(async (req, res, next) => {
  // 检测session是否存在
  // console.log(req.originalUrl);
  let id = 0;
  await createNo(Operate).then(val => {
    id = val;
  })
  let url = req.originalUrl;
  let operation = '';
  for (let i = 0, len = OPERATE.length; i < len; i++) {
    let j = url.indexOf(OPERATE[i].name);
    if (j !== -1) {
      operation = OPERATE[i].str;
      let operate = await Operate.create({
        id: id,
        operator: req.session.username,
        operationDate: new Date().toLocaleDateString(),
        operationRecord: operation,
        ip: getIp(req),
      })
      // console.log(operate)
      next();
      return
    }
  }
  next();
})

routers.forEach(val => {
  app.use('/' + val.path, val.router);
});

// 静态文件
// https://expressjs.com/zh-cn/starter/static-files.html
app.use('/static', express.static('public'));

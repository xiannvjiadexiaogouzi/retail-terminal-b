const express = require('express');

const { getFront, getOption, getPages, createNo } = require('../util/mixin')
const { Product, Comment } = require('../models/index');

const router = express.Router();

// 查看所有评论
router.get('/all', async (req, res) => {
  //获取前端参数
  data = await Comment.find();
  res.send(data);
})

// 添加评论
router.post('/add', async (req, res) => {
  let id = 0;
  await createNo(Comment).then(val => {
    id = val;
  })
  let comment = await Comment.create(req.body);
  // 补全其他信息
  comment.id = id; //id
  comment.status = false;
  // 关联商品
  comment.product = await Product.findOne({ goodsName: comment.goodsName });
  await comment.save();
  res.send(comment);
})

// 评论列表
router.post('/merchant_goods_type_list_page', async (req, res) => {
  //获取前端参数
  let front = getFront(req);
  // 搜索条件
  let option = getOption(req.body, 'goodsName', 'userName', 'id');
  // console.log(option)
  await getPages(front, Comment, option).then((val) => {
    Object.assign(front, val);
  });
  front.data = await Comment.find().where(option).populate().sort({ id: 1 }).skip(front.pageSize * (front.currentPage - 1) || 0).limit(front.pageSize || 5);
  res.send(front);
})

// 添加回复
router.post('/merchant_comment_reply', async (req, res) => {
  let option = getOption(req.body, 'id');
  let comment = await Comment.findOne(option);
  // 关联商品
  comment.commentReplyContent = req.body.commentReplyContent;
  await comment.save();
  res.send(comment);
})

// 显示状态
router.post('/delete_not_show', async (req, res) => {
  let option = getOption(req.body, 'id');
  let comment = await Comment.findOne(option);
  comment.status = req.body.status;
  await comment.save();
  res.send(comment);
})

// 删除评论 批量
router.post('/delete_batch', async (req, res) => {
  // 前端传入ids数组， 遍历ids，执行删除
  let ids = req.body;
  for (let i = 0, len = ids.length; i < len; i++) {
    let comment = await Comment.findOne({ id: ids[i] });
    await comment.remove();
  }
  res.send({
    msg: '删除成功'
  });
})


module.exports = router

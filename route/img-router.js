const express = require('express');

const { getFront } = require('../util/mixin')
const { Pics, Img } = require('../models/index');
const fs = require('fs');
const router = express.Router();


// 查看所有图片
router.post('/query_for_page', async (req, res) => {
  //获取前端参数
  let front = getFront(req);
  let galleriesId = req.body.picsId;
  let pics = await Pics.findOne({ id: galleriesId }).populate('picsArr').lean();
  // console.log(pics)
  front.totalCount = pics.picsArr.length;
  front.totalPage = Math.ceil(pics.totalCount / front.pageSize) || 1;
  let imgs = await Img.find().populate('pics');
  front.data = [];
  imgs.forEach(val => {
    if (val.pics.id == galleriesId) {
      front.data.push(val);
    }
  })
  res.send(front);
})

// 转移相册
router.post('/change_galleries_batch', async (req, res) => {
  let ids = req.body.ids;
  let newPics = await Pics.findOne({ id: req.body.changeToGalleries });
  ids.forEach(async val => {
    let img = await Img.findOne({ _id: val });
    img.pics = newPics;
    await img.save();
  })
  res.send({
    msg: '转移成功'
  });
})

// 相册内上传图片 批量
router.post('/add_batch', async (req, res) => {
  // goodsGalleriesId
  // imgUrl []
  let ids = req.body.ids;
  let newPics = await Pics.findOne({ id: req.body.goodsGalleriesId });
  ids.forEach(async val => {
    let img = await Img.findOne({ _id: val });
    img.pics = newPics;
    await img.save();
  })
  res.send({
    msg: '转移成功'
  });
})

// 删除图片 批量
router.post('/delete_batch', async (req, res) => {
  let ids = req.body;
  ids.forEach(async val =>{
    let img = await Img.findOne({_id: val});
    //删除本地文件
    let name = img.image;
    await img.remove();
    fs.unlinkSync('./public/' + name);
  })
  res.send({
    msg: '删除成功'
  });
})

module.exports = router

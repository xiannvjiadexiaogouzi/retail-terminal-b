const express = require('express');

const { getFront, getOption, getPages, createNo, getForm } = require('../util/mixin')
const { Pics, Img } = require('../models/index');

const router = express.Router();

// 查看所有相册
router.get('/all', async (req, res) => {
  adjustPics();
  //获取前端参数
  let data = await Pics.find().populate('picsArr').lean();
  res.send(data);
})

// 相册列表
router.post('/query_for_page', async (req, res) => {
  // //获取前端参数
  let front = getFront(req);
  // let option = null;
  let option = getOption(req.body, 'name');
  await getPages(front, Pics, option).then((val) => {
    Object.assign(front, val);
  });
  adjustPics();
  front.data = await Pics.find().populate('picsArr').where(option).sort({ id: 1 }).skip(front.pageSize * (front.currentPage - 1) || 0).limit(front.pageSize || 5);
  res.send(front);
})

// 相册选择表
router.get('/query', async (req, res) => {
  let pics = await Pics.find();
  let data = [];
  pics.forEach(el => {
    data.push(getOption(el, 'id', 'name'))
  });
  // console.log(data)
  res.send(data);
})

// 查看相册
router.post('/query_by_id', async (req, res) => {
  //获取前端参数
  let front = getFront(req);
  let option = getOption(req.body, 'id');
  front.data = await Pics.findOne(option);
  res.send(front);
})


// 添加相册
router.post('/add', async (req, res) => {
  let id = 0;
  await createNo(Pics).then(val => {
    id = val;
  })
  let pic = await Pics.create({
    id: id,
    name: req.body.name,
    cover: req.body.cover,
    imgTotal: 0,
    sorting: req.body.sorting,
    description: req.body.description,
  })
  res.send(pic);
})


// 修改相册
router.post('/update', async (req, res) => {
  let option = getOption(req.body, 'id');
  let pic = await Pics.findOne(option);
  getForm(req.body, pic);
  await pic.save();
  res.send("pic");
})

// 删除相册 单个 非批量
router.post('/remove', async (req, res) => {
  let img = await Img.findOne({
    _id: '5cecd19612f88de67efacd6e'
  })
  await img.remove();
  res.send({
    msg: '删除成功'
  });
})

// 删除相册 批量
router.post('/delete_batch', async (req, res) => {
  // 前端传入ids数组， 遍历ids，执行删除
  let ids = req.body;
  // 如果是1级相册
  for (let i = 0, len = ids.length; i < len; i++) {
    let pic = await Pics.findOne({ id: ids[i] });
    await pic.remove();
  }
  res.send({
    msg: '删除成功'
  });
})

// 调整相册
let adjustPics = async () => {
  let data = await Pics.find().populate('picsArr');
  data.forEach(async val => {
    // 清算相册内照片数量
    val.imgTotal = val.picsArr.length;
    // 选择默认封面
    if (!val.cover && val.picsArr.length) {
      let img = val.picsArr[0];
      val.cover = img.imgUrl + img.path + img.image;
    }
    await val.save();
  })
}

module.exports = router

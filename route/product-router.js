const express = require('express');

const { getFront, getOption, getPages, createNo, getForm } = require('../util/mixin')
const { Brand, Type, Product } = require('../models/index');

const router = express.Router();

// 查看所有商品
router.get('/all', async (req, res) => {
  //获取前端参数
  let data = await Product.find();
  res.send(data);
})

//商品总览 首页
router.get('/goodsCountStatistics', async (req, res) => {
  let products = await Product.find();
  let data = {
    all: products.length,
    put: 0,
    notPull: 0,
    count: 0,
  };
  products.forEach(val => {
    if (val.status) {
      data.put++;
    } else {
      data.notPull++;
    }
    if (val.goodsStock < val.goodsWarning * 2) data.count++;
  })
  res.send(data);
})

// 商品列表
router.post('/merchant_goods_list_page', async (req, res) => {
  //获取前端参数
  let front = getFront(req);
  // 搜索条件
  let option = getOption(req.body, 'goodsName', 'brandId', 'typeId');
  Object.assign(option, { recycle: false });
  // console.log(option)
  await getPages(front, Product, option).then((val) => {
    Object.assign(front, val);
  });
  front.data = await Product.find().where(option).populate('brand').sort({ id: 1 }).skip(front.pageSize * (front.currentPage - 1) || 0).limit(front.pageSize || 5);
  res.send(front);
})

// 查看商品
router.post('/merchant_goods_by_id', async (req, res) => {
  //获取前端参数
  let front = getFront(req);
  let option = getOption(req.body, 'id');
  front.data = await Product.findOne(option);
  res.send(front);
})

// 添加商品
router.post('/merchant_goods_add', async (req, res) => {
  let id = 0;
  await createNo(Product).then(val => {
    id = val;
  })
  let product = await Product.create(req.body);
  // 补全其他信息
  product.id = id; //id
  if (!product.goodsNo) product.goodsNo = product._id; //货号
  product.status = false;
  product.recycle = false;
  // 关联数据
  brand = await Brand.findOne({ id: product.brandId });
  product.brand = brand;
  product.brandName = brand.name;
  // product.firstType = await Type.findOne({ id: product.typeId });
  product.secondType = await Type.findOne({ id: product.childId });
  await product.save();
  res.send(product);
})

// 修改商品
router.post('/merchant_goods_update', async (req, res) => {
  let option = getOption(req.body, 'id');
  let product = await Product.findOne(option);
  getForm(req.body, product);
  // 临时修改信息
  // // 关联品牌
  // product.brand = await Brand.findOne({ id: product.brandId });
  // product.recycle = false;
  // delete product.navId;
  // delete product.navChildId;
  // product.secondType = await Type.findOne({ id: product.childId });
  // brand = await Brand.findOne({ id: product.brandId });
  // product.brandName = brand.name;
  await product.save();
  res.send(product);
})

// 上架
router.post('/merchant_goods_put', async (req, res) => {
  let option = getOption(req.body, 'id');
  let product = await Product.findOne(option);
  product.status = true;
  await product.save();
  res.send(product);
})

// 下架
router.post('/merchant_goods_pull', async (req, res) => {
  let option = getOption(req.body, 'id');
  let product = await Product.findOne(option);
  product.status = false;
  await product.save();
  res.send(product);
})

// 删除商品到回收站
router.post('/delete_batch', async (req, res) => {
  // 前端传入ids数组， 遍历ids，执行删除
  let ids = req.body;
  for (let i = 0, len = ids.length; i < len; i++) {
    let product = await Product.findOne({ id: ids[i] });
    product.recycle = true;
    await product.save();
  }
  res.send({
    msg: '删除成功'
  });
})

//回收站列表
router.post('/merchant_goods_recycling', async (req, res) => {
  //获取前端参数
  let front = getFront(req);
  // 搜索条件
  let option = getOption(req.body, 'goodsName', 'brandId', 'typeId');
  Object.assign(option, { recycle: true });
  // console.log(option)
  await getPages(front, Product, option).then((val) => {
    Object.assign(front, val);
  });
  front.data = await Product.find().where(option).populate('brand').sort({ id: 1 }).skip(front.pageSize * (front.currentPage - 1) || 0).limit(front.pageSize || 5);
  res.send(front);
})

// 还原商品 批量
router.post('/merchant_goods_batch_reduction', async (req, res) => {
  // 前端传入ids数组， 遍历ids，执行删除
  let ids = req.body;
  for (let i = 0, len = ids.length; i < len; i++) {
    let product = await Product.findOne({ id: ids[i] });
    product.recycle = false;
    await product.save();
  }
  res.send({
    msg: '删除成功'
  });
})

// 删除商品 批量
router.post('/delete_batch_recycling', async (req, res) => {
  // 前端传入ids数组， 遍历ids，执行删除
  let ids = req.body;
  for (let i = 0, len = ids.length; i < len; i++) {
    let product = await Product.findOne({ id: ids[i] });
    await product.remove();
  }
  res.send({
    msg: '删除成功'
  });
})


module.exports = router

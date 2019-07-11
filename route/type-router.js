const express = require('express');

const { getFront, getOption, getPages, createNo, getForm } = require('../util/mixin')
const { Type } = require('../models/index');

const router = express.Router();

// 查看所有分类
router.get('/allTypes', async (req, res) => {
  //获取前端参数
  data = await Type.find();
  res.send(data);
})

// 分类列表
router.post('/merchant_goods_type_list_page', async (req, res) => {
  // //获取前端参数
  let front = getFront(req);
  // let option = null;
  let option = getOption(req.body, 'parentId');
  await getPages(front, Type, option).then((val) => {
    Object.assign(front, val);
  });
  adjustNum();
  front.data = await Type.find().where(option).populate('products').lean().sort({ id: 1 }).skip(front.pageSize * (front.currentPage - 1) || 0).limit(front.pageSize || 5);
  res.send(front);
})

// 一级分类选择表
router.get('/merchant_goods_type_list', async (req, res) => {
  let option = {
    parentId: 0
  };
  let types = await Type.find().where(option).sort({ id: 1 });
  let data = [];
  types.forEach(el => {
    data.push(getOption(el, 'id', 'typeName'));
  });
  //添加二级分类列表
  for (let i = 0, len = data.length; i < len; i++) {
    data[i].list = await Type.find().where({ parentId: data[i].id });
  }
  console.log(data)
  res.send(JSON.stringify(data));
})

// 所有分类选择表
router.get('/query_goods_type_tree', async (req, res) => {
  let types = await Type.find();
  let data = [];
  types.forEach(el => {
    data.push(getOption(el, 'id', 'typeName'))
  });
  res.send(data);
})

// 查看分类
router.post('/merchant_goods_type_by_id', async (req, res) => {
  //获取前端参数
  let front = getFront(req);
  let option = getOption(req.body, 'id');
  front.data = await Type.findOne(option);
  res.send(front);
})


// 添加分类
router.post('/merchant_add_goods_type', async (req, res) => {
  let id = 0;
  await createNo(Type).then(val => {
    id = val;
  })
  let type = await Type.create({
    id: id,
    typeName: req.body.typeName,
    parentId: req.body.parentId,
    showStatus: req.body.showStatus,
    goodsUnit: req.body.goodsUnit,
    goodsSort: req.body.goodsSort,
  })
  res.send(type);
})

// 转移分类
router.post('/merchant_goods_type_transfer', async (req, res) => {
  let option = getOption(req.body, 'id');
  let type = await Type.findOne(option);
  type.parentId = req.body.newParentId
  await type.save();
  res.send(type);
})

// 修改分类
router.post('/merchant_goods_type_update', async (req, res) => {
  let option = getOption(req.body, 'id');
  let type = await Type.findOne(option);
  getForm(req.body, type);
  await type.save();
  res.send(type);
})

// 删除分类 单个 非批量
router.post('/merchant_goods_type_delete', async (req, res) => {
  // 前端传入ids数组， 遍历ids，执行删除
  let id = req.body.id;
  let type = await Type.findOne({ id: id });
  let parentId = type.parentId;
  // 如果是1级分类
  if (!parentId) {
    let secondTypes = await Type.find().where({ parentId: id });
    console.log(secondTypes)
    for (let i = 0, len = secondTypes.length; i < len; i++) {
      await secondTypes[i].remove();
    }
  }
  await type.remove();
  res.send({
    msg: '删除成功'
  });
})

// 调整goodsNum
let adjustNum = async () => {
  let firstTypes = await Type.find().where({ parentId: 0 });
  let types = await Type.find().populate('products');
  types.forEach(async el => {
    if (el.parentId) {
      el.goodsNum = el.products.length;
      await el.save();
    }
  })
  firstTypes.forEach(async el => {
    let childTypes = await Type.find().where({ parentId: el.id });
    // console.log(childTypes)
    let num = 0;
    childTypes.forEach(child => {
      num += child.goodsNum;
    })
    el.goodsNum = num;
    await el.save();
  })
}

module.exports = router

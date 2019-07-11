const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/terminal-server', {
  useNewUrlParser: true,
  useCreateIndex: true,
})

// Product 模型
const productShema = new mongoose.Schema({
  id: { type: Number, unique: true },
  status: {type: Boolean}, //上架状态
  recycle: {type: Boolean}, //回收状态
  //step1
  typeId: {type: Number}, //一级分类
  typeName: {type: String},
  childId: {type: Number}, //二级分类
  childName: {type: String},
  //step2
  goodsName: {type: String}, //名称
  goodsSubtitle: {type: String}, //副标题
  brandId: {type: Number}, //品牌id
  goodsDesc: {type: String}, //介绍
  goodsNo: {type: String}, //货号 = _id
  goodsImg: {type: Array},
  goodsPrice: {type: Number}, //售价
  marketPrice: {type: Number}, //市场价
  goodsStock: {type: Number}, //库存
  goodsWarning: {type: Number}, //库存预警 > 库存
  goodsUnit: {type: String}, //计量单位
  goodsWeight: {type: Number}, //重量
  //step3
  styleId: {type: Number},
  styleName: {type: String},
  // navId: {type: Number}, //一级类目
  // navChildId: {type: Number}, //二级类目
  merchantGoodsTypePropertyList: {type: Array}, //prop 属性
  merchantParamDetailIds: {
    //param 参数
    merchantParamDetails: {type: Array},
    mainMaterial: {type: String}, //主含材料
    paramObject: {type: String} //适用对象
  },
  merchantSpecifications: {type: Array}, //商品详情
  goodsMobileImg: {type: String},
  //品牌 (关联数据)
  brand: {type: mongoose.SchemaTypes.ObjectId, ref: 'Brand'},
  brandName: {type: String},
  // 分类 type
  // firstType: {type: mongoose.SchemaTypes.ObjectId, ref: 'Type'},
  secondType: {type: mongoose.SchemaTypes.ObjectId, ref: 'Type'},
  // 类型 styles

  // 库存
})

// // 虚拟字段 评价
// styleShema.virtual('property', {
//   ref: 'Property', //关联集合
//   localField: '_id', //本地用哪个鍵来关联
//   foreignField: 'style', //关联集合的鍵
//   justOne: false, // 返回数组
// })

const Product = mongoose.model('Product', productShema);

// //删除集合
// Product.db.dropCollection('products');

module.exports = Product;
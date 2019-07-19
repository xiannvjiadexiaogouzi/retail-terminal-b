// let proxyUrl = 'https://bird.ioliu.cn/v1?url=';
// let baseApi = 'http://47.107.167.164:8080/';
// let proApi = proxyUrl + baseApi;
// let devApi = 'api/'
let devApi = 'http://68.168.131.20/';
let proApi = 'http://68.168.131.20/';
let api = {
  host: '',
  // 首页
  register: 'merchant/register',
  login: 'merchant/login', //登陆
  logout: 'merchant/logout', //logout
  login_info: 'merchant/get_merchant_login_info_list', //登陆用户信息
  good_count_statistic: 'merchantGoods/goodsCountStatistics', //商品总览
  user_index: 'user/user_index', //用户总览
  order_count: 'merchant_order/getOrderAllCount', //订单总数
  //商家
  login_log: 'merchant/get_merchant_login_info_list', //登陆信息列表
  login_detail: 'merchant/detail', //用户信息
  login_change: 'merchant/change', //修改用户信息
  // 上传图片
  upload: 'merchant/upload_file', //上传文件
  // 商品
  product_list: 'merchantGoods/merchant_goods_list_page', //商品列表
  product_detail: 'merchantGoods/merchant_goods_by_id', //查看商品
  product_pull: 'merchantGoods/merchant_goods_pull', //下架
  product_put: 'merchantGoods/merchant_goods_put', //上架
  product_add: 'merchantGoods/merchant_goods_add', //添加商品
  product_update: 'merchantGoods/merchant_goods_update', //修改商品
  product_delete: 'merchantGoods/delete_batch', //删除商品
  //回收站
  recycle: 'merchantGoods/merchant_goods_recycling', //回收站
  reduction: 'merchantGoods/merchant_goods_batch_reduction', //还原
  recycle_delete: 'merchantGoods/delete_batch_recycling', //还原
  // 品牌
  brand_detail: "merchant_goods_brand/query_by_id", //查看品牌
  brand: 'merchant_goods_brand/query_for_page', //品牌列表
  brand_add: 'merchant_goods_brand/add', //添加品牌
  brand_update: 'merchant_goods_brand/update', //修改品牌
  brand_delete: 'merchant_goods_brand/delete_batch', //删除品牌
  brand_list: 'merchant_goods_brand/query_list', //品牌选择表
  // 分类 types
  type_list: 'merchantGoodsType/merchant_goods_type_list', // 一级分类选择表
  type: "merchantGoodsType/merchant_goods_type_list_page", // 分类列表
  type_detail: "merchantGoodsType/merchant_goods_type_by_id", // 查看分类
  type_trans: "merchantGoodsType/merchant_goods_type_transfer", //转移分类
  type_tree: "merchantGoodsType/query_goods_type_tree", // 所有分类选择表
  type_add: 'merchantGoodsType/merchant_add_goods_type', //添加分类
  type_update: 'merchantGoodsType/merchant_goods_type_update', //修改分类
  type_delete: "merchantGoodsType/merchant_goods_type_delete", //删除分类
  // 相册
  pics: 'merchant_goods_galleries/query_for_page', //相册列表
  pics_update: 'merchant_goods_galleries/update', //修改相册
  pics_delete: 'merchant_goods_galleries/delete_batch', //删除相册
  pics_detail: 'merchant_goods_galleries/query_by_id', //查看相册
  pics_add: 'merchant_goods_galleries/add', //添加相册
  pics_list: 'merchant_goods_galleries/query', // 相册选择表
  // 图片页
  pics_img:"merchant_goods_galleries_detail/query_for_page",// 查看照片
  pics_trans: 'merchant_goods_galleries_detail/change_galleries_batch', //转移图片 批量
  pics_img_add: 'merchant_goods_galleries_detail/add_batch', // 在相册内添加图片
  pics_img_delete: 'merchant_goods_galleries_detail/delete_batch', // 删除图片
  // 类型 styles
  style: 'merchantGoodsStyle/merchant_goods_style_list_page', //类型列表
  style_add: 'merchantGoodsStyle/merchant_goods_type_add', //增加类型
  style_update: 'merchantGoodsStyle/merchant_goods_type_update', //修改类型
  style_delete: 'merchantGoodsStyle/merchant_goods_type_delete', //删除类型
  style_list: 'merchantGoodsStyle/merchant_goods_type_list', //类型选择表
  // property
  property: 'merchantGoodsProperty/merchant_goods_property_list_page', //属性列表
  property_delete: 'merchantGoodsProperty/delete_batch',//删除属性
  property_detail:'merchantGoodsProperty/merchant_goods_type_by_id', //查看属性
  property_add:'merchantGoodsProperty/merchant_goods_type_add', //添加属性
  property_update:'merchantGoodsProperty/merchant_goods_type_update', //修改属性
  // param
  param: 'merchantGoodsParam/merchant_goods_param_list_page', //参数列表
  param_delete: 'merchantGoodsParam/delete_batch', //删除参数
  param_detail: 'merchantGoodsParam/merchant_goods_type_by_id', //查看参数
  param_add: 'merchantGoodsParam/merchant_goods_type_add', //添加参数
  param_update: 'merchantGoodsParam/merchant_goods_type_update', //添加参数
  // 评价
  comment: 'merchantGoodsComment/merchant_goods_type_list_page',//评级列表
  comment_show: 'merchantGoodsComment/delete_not_show',//显示评级
  comment_delete: 'merchantGoodsComment/delete_batch',//删除评级
  comment_reply: 'merchantGoodsComment/merchant_comment_reply', //评论回复
  // 订单
  order_view: 'merchant_order/getOrderAllCount', //订单概览
  order: 'merchant_order/query_for_page', //订单列表
  order_detail: 'merchant_order/query_By_Id', //查看订单
  order_close: 'merchant_order/close', //关闭订单
  order_delete: 'merchant_order/delete', //删除订单
  order_update: 'merchant_order/updateOrder', //修改订单
  order_receive: 'merchant_order/receive', //修改订单
  order_set: 'merchant_order/queryOrderSet', //修改订单
  // 退货
  return_view: 'merchant_return_goods/getReturningAllCount', //退货概览
  return: 'merchant_return_goods/query_for_page', //退货列表
  return_delete: 'merchant_return_goods/delete', //删除退货
  return_detail: 'merchant_return_goods/query_By_Id', //查看退货
  return_update: 'merchant_return_goods/update', //修改退货
  //退货地点
  return_site: 'return_send/query_for_page', //选择退货地点
  return_site_detail: 'return_send/query_By_Id', //选查看退货地点
  return_site_delete: 'return_send/delete', //删除地点
  return_site_add: 'return_send/add_or_update', //修改地点
  //退货原因
  reason: 'return_reason/query_for_page',// 原因列表
  reason_add: 'return_reason/add',// 添加原因
  reason_delete: 'return_reason/delete',// 添加原因
  //库存
  stock: 'merchant_goods_log/query_for_page',//库存列表
  stock_list: 'merchant_goods_log/query_type',//选择库存类型
  //用户
  user: 'user/get_user_list', //用户列表
  user_status: 'user/change_user_status', //更改用户状态
  user_detail: 'user/detail/', //更改用户状态
  // 运营 广告
  ad: 'merchant_ad/get_merchant_ad_list', //列表
  ad_detail: 'merchant_ad/get_single_merchant_ad', //详情页
  ad_add: 'merchant_ad/add_merchant_ad', //添加
  ad_update: 'merchant_ad/change_merchant_ad', //修改
  ad_delete: 'merchant_ad/delete_merchant_ad', //删除
  //设置
  pay: 'merchant_pay_mode/query', // 支付
  pay_update: 'merchant_pay_mode/update', // 修改支付
  //操作
  operate: 'user_operation_log/query_user_operation_log', //操作日志
  
  

  
  // newsLatest: 'news/latest',
  // newsBefore: 'news/before/',
  // storyExtra: 'story-extra/',
  // story: 'story/',
  // news: 'news/'
}

if (process.env.NODE_ENV === 'development') {
  Reflect.ownKeys(api).forEach(key => {
    api[key] =  devApi + api[key];
  })
}

if (process.env.NODE_ENV === 'production') {
  Reflect.ownKeys(api).forEach(key => {
    api[key] = proApi + api[key];
  })
}

export default api
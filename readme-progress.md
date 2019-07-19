12.6 
- 安装node-sass, sass-loader依赖
    * 使用scss有高亮和提示，比较方便
- login
    - ??? el-input 无法调整高度
    * https://www.cnblogs.com/XHappyness/p/7686267.html
    * 使用一个resetEleme.scss样式表去覆盖

12.8
- index
    - ziti
    https://blog.csdn.net/lxhzz0411/article/details/81982576?utm_source=blogxgwz8

12.10
- 配置完路由
    - json 写完menu层级
    - json导入index

12.11
- sys-index
    - ??? echarts没有用
- admin-info
- msg
- account-setting
- sys-info
    - 分页组件 ?? => 单独做一个组件

12.13
- 缩放页面
    - @media
    - https://www.cnblogs.com/maixi/p/4736828.html
    - zoom
    - login里面bg重写absolute出来,并进行等比放大

12.14
- 分页组件
    - https://smohan.net/blog/pgk1qr
    - elmentui自带，改一下样式
- api测试，好像部分借口都没有给，直接参考源码
    - this.$axios({
        method: 'post',
        url: 'url',
        data:{...}
    })
- product-list

12.17
- 登陆功能的实现
    - 登陆api
        - axios post form/data
        - 这次这个接口是formdata格式，请求接口时将type设为form
        https://blog.csdn.net/wopelo/article/details/78783442
        https://blog.csdn.net/wupuyi/article/details/80269907
        https://www.jianshu.com/p/b22d03dfe006
        - 对请求设置一个拦截器，然后用qs把请求的参数序列化一下

- vuerouter 拦截器
    - main.js中
    - router.beforeEach((to, from ,next) => {...})
    - https://segmentfault.com/q/1010000012065855
    - https://blog.csdn.net/shirukai/article/details/80781586
    - https://segmentfault.com/q/1010000012065855
    - ??? router的meta有什么用？

12.18 
- porduct-list
    - 最底部全选按钮
        - el-table中加入        @selection-change="handleSelectionChange", 用以操作表格选项后判断是否全选或半全选状态
        - 全选按钮加入@change="handleCheckAllChange", 用以添加点击后全部选中或删除表格中的选项

    - 编辑货品信息
        - el-dialog
    - ??? unfinished

12.20
- add-product
    - ？？？ 进度条 颜色
    - 富文本编辑器
        - https://www.awesomes.cn/repo/surmon-china/vue-quill-editor
        https://blog.csdn.net/senmage/article/details/82388728
        https://www.jianshu.com/p/4e00f11583fa
        https://www.jianshu.com/p/21dab85b7fa8
- rating
    - ？？ 显示按钮 api 无法连接

12.21
- rating-detail
    - 全部aboslute 覆盖原来的title
    - ??? 提交reply function

12.24
- style
    - 编辑 中的form 的提交func
    - 删除func
- property
    - ??? 删除


- add-property
    - 因为要区分新增/编辑已有属性，url使用$router.query来传参(router.js中不用设置参数)，可以保证有没有参数都可以跳转页面
    https://blog.csdn.net/mf_717714/article/details/81945218
    - 提交
        - 严格遵守格式
            id: "15"
            propertyList: "大,小"
            propertyName: "花卷"
            propertyOrder: 20
            propertySelect: 1
            styleId: 8

- params
    - ??? 删除

12.26
- types
    - ??? 删除
    - 转移商品
    - 是否显示

- addtype

12.27
- brands
    - 删除 完成！！

- add-brand
    - api -> form格式

- ??? 修改el-button :hover 样式

- pics

- add-pic
    - api -> form格式

- check-pics

- ??? 上传图片？
    - https://segmentfault.com/a/1190000010034177?utm_source=tag-newest
    https://www.jianshu.com/p/032294380341
    https://blog.csdn.net/a12541254/article/details/
    https://segmentfault.com/a/1190000015806229
    https://blog.csdn.net/qq_41688165/article/details/80834842
    - 上传组件中 -> 图片上传+获取上传后的图片url ->
再在‘确定’鍵中 -> 提交表单，包含已上传的图片url信息

12.28
- recycle
    - 表格属性没有对应
- order-list
- oder-deatil

1.1 
- receipt

1.3 
- return 
    - for 嵌套 axios, 无法得到正确结果
        - https://segmentfault.com/q/1010000017001260
        浏览器js执行是单线程，执行的都是同步任务
        遇到像请求这种任务会拿出去单独执行，js线程继续执行他的任务
        所以for循环和下面的console是先执行完的，当请求响应后才会把回调放到js线程最后执行，这是个异步问题，可以搜一下事件循环，任务队列，event Loop，js单线程异步等关键字了解下
        你可以把获取到数据后要执行的相关逻辑放到请求的回调函数里执行
        - https://segmentfault.com/q/1010000011291864
        * let promiseAll = arr.map((val) => 异步axios);
        let that = this;
        this.$axios.all(promiseAll).then(function(resArr) {
            resArr.forEach((res, index){
                循环处理res数组
            })
    - 导出excel
        - https://blog.csdn.net/u010427666/article/details/79208145

- refund
     - 删除
- refund-detail
    - 完成！

1.4
- return-detail
    - 手机号字段检查
        - http://caibaojian.com/phone-regexp.html
    - 完成！
1.5
- return-reason
    - 完成！
1.7
- stock-in
    - 完成！
- stock-out
    - 完成！
- sale ? 无法完成
1.8
- accout-list
    - 完成
- account-detail
    - 完成 ！
1.9
- ad-list
    - 完成！
- add-ad
    - 完成！
1.10
- pay-setting
    - 完成！
- refund-certificate
- QRcode
     -上传图片
- operation-log
    - 完成！
1.11
- sys-index

- product-list
    - nav - status - class.active

1.15
- 所有表格的操作class ？
- add-product step数字往后-1
- 改掉所有进度条progress的颜色 => 灰色，进度+1
    - ok
- btn class
- step 0 里的分类选中 class
    - ok
- 所有覆盖页 的style
- 重写msg警告
    - ok

1.24
- add-product 
    - ok!
- product-list
    - 补写完整
    - ? remove
- recycle
    - 批量删除 - ok
    - ? 批量还原接口有问题，无法实现
- 所有表格的操作列style

- rating-detail 
    - 提交form

- add-type
    - upload
    - input v-model
- styles
    - 编辑
    - 删除
- property
    - 编辑
    - 删除
- param
    - 编辑
    - 删除
- brands
    - 编辑
    - 删除
    - 批量
- add-brand
    - upload
- pics
    - 批量操作
        - 删除
- add-pic
    - style
    - upload
    - submit
- check-pics
    - style
    - upload
    - submit
    - add
    - batch
        - 全选
        - 删除
        - 转移
1.28 
- order-list
    - search-filter styel
    - 表头 select status 禁用
    - common style
    - 到处订单
2.22
- reciept
    - common style
    - ？删除api
    - 导出订单
- order-setting
    - common style
- return
- refund
- return-reason
- add-site
- order-detail
    - ? 当前状态 hover
- ? return-detail
- ? refund-detail
- in
- out
- account-list
- account-detail
- ad-list
    - online
    - topState
    - remove
- add-ad
    - upload pic
- pay-setting
- refund-certificate
    - 获取证书data
    - 上传证书
    - ? 保存api
- merchant-QRcode
    - upload pic
2.25
- vuex state 保存菜单状态
    - 通过path来倒推
    - 在导航守卫里面，每转跳后向vuex添加path，再回到页面倒推出对应的nav

## Q&A

- 完成开发环境与生产环境区分
- 修改所有api，打包后加上代理
- 导航守卫没有跳转
- 修改更新后的eleme样式，直接覆盖在src文件里
- 优化
    - 不带注释打包
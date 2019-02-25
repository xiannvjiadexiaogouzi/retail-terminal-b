export default {
    data() {
        return {
            loading: false, //加载
            showSearch: false, //显示搜索栏
            isIndeterminate: false, //非全选
            checkAll: false, //全选
            goodsName: "", //商品搜索
            userName: '', //用户搜索
            productTypes: [], //分类选项
            typeId: "", //分类搜索
            brandId: "", //品牌搜索
            brandList: [], //品牌选项
            sort: [], //排序
            nowSort: '', //当前排序
            tableData: [],
            pageSize: 10, //每页数据量
            totalPage: 0, //总页数
            dataCount: 0, //总数据量
            currentPage: 1, //当前页数
            tableSelection: [], //表格选中项
            batchOperation: ["删除"], //批量操作
            nowBatchOperation: "", //选中批量操作
            // uploadUrl: 'api/merchant/upload_file',
        }
    },
    computed: {
        showSeachTxt() {
            return this.showSearch ? "收起筛选" : "展开筛选";
        },
    },
    methods: {
        //提交
        submitForm(url, form, extraData) {
            let totalForm = Object.assign(form, extraData);
            //发送请求
            this.$axios({
                    method: "post",
                    url: url,
                    // // type: "form",
                    data: totalForm,
                    // //使用qs模块转化data为form格式提交
                    // transformRequest: [
                    //     function (data) {
                    //         data = Qs.stringify(data);
                    //         return data;
                    //     }
                    // ],
                    // // 修改header为formdata格式
                    // headers: {
                    //     "Content-Type": "application/x-www-form-urlencoded"
                    // }
                })
                // .then(res => {
                //     // console.log(res);
                // })
                .catch(err => {
                    // console.log(err);
                    this.msg(err, 'error');
                    return;
                });
        },
        //显示搜索栏
        searchShow() {
            this.showSearch = !this.showSearch;
        },
        //table selector
        handleSelectionChange(val) {
            this.tableSelection = val;
            if (this.tableSelection.length == this.tableData.length) {
                this.checkAll = true;
                this.isIndeterminate = false;
            } else {
                this.checkAll = false;
                this.isIndeterminate =
                    this.tableSelection.length > 0 &&
                    this.tableSelection.length < this.tableData.length ?
                    true :
                    false;
            }
        },
        //全选
        handleCheckAllChange(val) {
            if (val) {
                this.$refs.productTable.toggleAllSelection();
            } else {
                this.$refs.productTable.clearSelection();
            }
            this.tableSelection = val ? this.tableData : [];
            this.isIndeterminate = false;
        },
        //换页
        pageChange(page) {
            // console.log('mixin'+ page)
            this.getTableData(page);
            this.currentPage = page;
        },
        //更改每页显示数据量
        handlePageSize(size) {
            this.pageSize = size;
            this.currentPage = 1;
            this.getTableData(1);
        },
        //上传图片，提交formdata，*qs.stringify()只能序列化文字，文件不行，用原生formdata()
        uploadImg(file) {
            return new Promise((resolve, reject) => {
                let formData = new FormData(); //创建新的formdata对象
                formData.append('file', file); //向formdata中插入键值对(数据)\
                //上传图片
                this.$axios({
                    method: 'post',
                    url: 'api/merchant/upload_file',
                    data: formData,
                    type: "form",
                    headers: {
                        "Content-Type": "multipart/form-data" //* 和json文字数据不一样
                    },
                }).then((res) => {
                    // console.log(res);
                    resolve({
                        imgUrl: res.data.data.imgUrl + res.data.data.image
                    })
                }).catch(err => {
                    // console.log(err);
                    reject(err);
                })
            })
        },
        // uploadFile(content){
        //     this.uploadImg(content.file).then((res)=>{
        //         console.log(res);
        //     })
        // },
        //分离图片
        handleImg(urls) {
            let picArr = [];
            if (urls) {
                if (urls.indexOf(",") !== -1) {
                    picArr = urls.split(",");
                } else {
                    picArr.push(urls);
                }
            }
            return picArr[0];
        },
        // //批量操作
        // batchOperate() {
        //     let arr = [];
        //     this.tableSelection.forEach(item => {
        //         arr.push(item.id);
        //     });
        //     switch (this.nowBatchOperation) {
        //         case "":
        //             this.msg("请选择操作", "error");
        //             break;
        //         case "删除":
        //             this.remove(arr);
        //             break;
        //     }
        // },
        //msg
        msg(str, type) {
            this.$message({
                message: str || "提交成功",
                type: type || "success",
                showClose: true,
                duration: 2500
            });
        },
        //后退
        goBack() {
            setTimeout(() => {
                this.$router.back();
            }, 500);
        }

    },
}
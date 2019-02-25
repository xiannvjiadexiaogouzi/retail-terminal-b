<template>
  <div class="check-pics">
    <!-- 覆盖title -->
    <div class="view-title">
      <i class="view-title-before"/>
      <span class="title">图片列表</span>
      <div class="refresh-btn">
        <el-button icon="el-icon-close" @click="$router.go(-1)">关闭</el-button>
      </div>
    </div>
    <div class="main-wrapper">
      <!-- 表格 -->
      <div class="product-list-wrapper">
        <!-- 表头按钮 -->
        <header class="table-header">
          <div class="table-header-left">图片列表</div>
          <div class="table-header-right">
            <el-button @click="dialogVisible=true">上传图片</el-button>
          </div>
        </header>
        <!-- 表格本体 -->
        <div class="main-table">
          <el-checkbox-group
            v-model="tableSelection"
            ref="productTable"
            @change="handleSelectionChange"
          >
            <div v-for="item in tableData" :key="item.id" class="check-item">
              <img :src="item.imgUrl" alt>
              <el-checkbox :label="item.id"/>
              <div class="item-operation">
                <span @click="transPics(item.id)">转移相册</span>
                <span @click="remove([item.id])">删除图片</span>
              </div>
            </div>
          </el-checkbox-group>
        </div>
        <!-- 表格批量操作+页码 -->
        <footer>
          <div class="select-all-wrapper">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="checkAllChange"
            >全选</el-checkbox>
            <el-select v-model="nowBatchOperation" clearable placeholder="批量操作" class="margin">
              <el-option v-for="item in batchOperation" :key="item" :value="item" :label="item"/>
            </el-select>
            <el-button @click="batchOperate">确定</el-button>
          </div>
          <div class="pagination-wrapper">
            <pagination
              :totalPage="totalPage"
              :dataCount="dataCount"
              :pageSize="pageSize"
              :currentPage="currentPage"
              @pageChange="pageChange"
            />
          </div>
        </footer>
      </div>
      <!-- 上传图片 -->
      <el-dialog title="上传图片" :visible.sync="dialogVisible" width="30%">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          v-loading="loading"
        >
          <el-form-item label="选择相册" prop="goodsGalleriesId">
            <el-select v-model="ruleForm.goodsGalleriesId" placeholder="请选择相册">
              <el-option
                v-for="item in goodsGalleriesList"
                :key="item.name"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="选择图片" prop="logo">
            <div class="upload-pics-wrapper" v-if="ruleForm.imgUrl.length">
              <div class="pic-wrapper" v-for="(img,index) in ruleForm.imgUrl" :key="img">
                <img :src="img" alt>
                <i class="el-icon-circle-close-outline" @click="ruleForm.imgUrl.splice(index,1)"/>
              </div>
            </div>
            <el-upload
              class="upload-demo"
              action="url"
              :http-request="uploadFile"
              accept="image/jpeg, image/png"
            >
              <el-button type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">可批量选择多张图片上传 (最多上传5张)</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitRuleForm('ruleForm')">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 转移相册 -->
      <el-dialog title="转移相册" :visible.sync="dialogVisible1" width="30%">
        <el-form
          :model="ruleForm1"
          :rules="rules1"
          ref="ruleForm1"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="选择相册" prop="changeToGalleries">
            <el-select v-model="ruleForm1.changeToGalleries" placeholder="请选择相册">
              <el-option
                v-for="item in goodsGalleriesList"
                :key="item.name"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="submitRuleForm1('ruleForm1')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
//使用axios中的qs模块转化request
import Qs from "qs";
import mixin from "@/util/mixin.js";
import Pagination from "../common/pagination";

export default {
  mixins: [mixin],
  components: {
    Pagination
  },
  data() {
    return {
      // dialogLoad: false,
      isAdd: true,
      picList: [],
      dialogVisible: false, //上传
      dialogVisible1: false, //转移
      goodsGalleriesList: [],
      ruleForm1: {
        //转移
        changeToGalleries: "",
        ids: [],
        subGalleries: ""
      },
      ruleForm: {
        //上传照片
        goodsGalleriesId: "",
        imgUrl: []
      },
      rules: {
        goodsGalleriesId: [
          { required: true, message: "请选择相册", trigger: "change" }
        ],
        imgUrl: [{ required: true, message: "请上传t图片", trigger: "change" }]
      },
      rules1: {
        goodsGalleriesId: [
          { required: true, message: "请选择相册", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getTableData();
    this.ruleForm.goodsGalleriesId = this.$route.query.picsId;
    this.ruleForm1.subGalleries = this.$route.query.picsId;
    this.ruleForm1.changeToGalleries = this.ruleForm1.subGalleries;
    //获取goodsGalleriesList
    this.$axios("api/merchant_goods_galleries/query")
      .then(res => {
        console.log(res);
        this.goodsGalleriesList = res.data.data.list;
      })
      .catch(err => {
        // console.log(err);
        this.msg(err, "error");
      });
    this.batchOperation.push("转移");
  },
  methods: {
    //刷新页面，重新获取数据
    getTableData(page) {
      this.$axios({
        method: "post",
        url: "api/merchant_goods_galleries_detail/query_for_page",
        data: {
          currentPage: page || this.currentPage,
          pageSize: this.pageSize,
          galleriesId: this.$route.query.picsId
        }
      })
        .then(res => {
          // console.log(res);
          this.tableData = res.data.data.list;
          this.totalPage = res.data.data.totalPage;
          this.dataCount = res.data.data.totalCount;
        })
        .catch(err => {
          // console.log(err);
          this.msg(err, "error");
        });
    },
    //el-upload
    // 上传图片 logo
    uploadFile(content) {
      if (this.ruleForm.imgUrl.length >= 5) {
        this.msg("最多上传5张图片！", "error");
        return;
      }
      this.uploadImg(content.file).then(res => {
        // console.log(res);
        this.ruleForm.imgUrl.push(res.imgUrl);
      });
    },
    //提交表单 上传照片
    submitRuleForm(formName) {
      this.$refs[formName].validate(valid => {
        //先检验表单
        if (valid) {
          // if (this.isAdd) {
          this.submitForm(
            "api/merchant_goods_galleries_detail/add_batch",
            this.ruleForm
          );
          // }
          this.msg();
          this.dialogVisible = false;
          this.getTableData();
        } else {
          this.msg("error submit!!", "error");
          return false;
        }
      });
    },
    //提交表单1 转移
    submitRuleForm1(formName) {
      this.$refs[formName].validate(valid => {
        //先检验表单
        if (valid) {
          if (this.isAdd) {
            //判断是否新增参数
            this.submitForm(
              "api/merchant_goods_galleries_detail/change_galleries_batch",
              this.ruleForm1
            );
          }
          this.$nextTick(() => {
            this.msg();
            this.dialogVisible1 = false;
            this.getTableData();
          });
        } else {
          this.msg("error submit!!", "error");
          return false;
        }
      });
    },

    //转移相册
    transPics(id) {
      this.ruleForm1.ids = [];
      this.dialogVisible1 = true;
      this.ruleForm1.ids.push(id);
    },
    //全选
    checkAllChange($event) {
      let arr = [];
      this.tableData.forEach(item => {
        arr.push(item.id);
      });
      this.tableSelection = $event ? arr : [];
      this.isIndeterminate = false;
    },
    // 删除
    remove(ids) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios({
          method: "post",
          url: "api/merchant_goods_galleries_detail/delete_batch",
          data: ids
        })
          .then(() => {
            this.msg("删除成功");
            this.getTableData();
          })
          .catch(err => {
            this.msg(err, "error");
            this.getTableData();
          });
      });
    },
    //批量操作
    batchOperate() {
      if (!this.tableSelection.length) {
        this.msg("请选择图片", "error");
        return;
      }
      switch (this.nowBatchOperation) {
        case "":
          this.msg("请选择操作", "error");
          break;
        case "删除":
          this.remove(this.tableSelection);
          break;
        case "转移":
          this.dialogVisible1 = true;
          this.ruleForm1.ids = this.tableSelection;
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/mixin.scss";

.check-pics {
  @include title();

  //表格
  .main-wrapper {
    padding: 37px 45px 0 45px;
    // display: flex;
    // justify-content: center;
    @include table();
    .main-table {
      padding: 20px;
      border-left: 1px solid rgba(191, 191, 191, 1);
      border-right: 1px solid rgba(191, 191, 191, 1);
      display: flex;
      .el-checkbox-group {
        display: flex;
        // justify-content: space-between;
        flex-wrap: wrap;
        .check-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin: 5px 20px;
          width: 150px;
          position: relative;
          & > img {
            width: 100%;
            height: 150px;
            border-radius: 4px;
          }
          .item-operation {
            display: flex;
            width: 100%;
            justify-content: space-between;
            margin-top: 5px;
            align-self: flex-end;
            .label span {
              font-size: 0;
            }
            & > span {
              display: inline-block;
              font-size: 16px;
              margin: 0;
            }
          }
          .el-checkbox {
            position: absolute;
            top: 0;
            left: 0;
          }
        }
      }
    }
    .el-dialog {
      .el-form {
        .upload-pics-wrapper {
          display: flex;
          align-items: center;
          .pic-wrapper {
            margin: 0 10px 0 0;
            width: 100px;
            position: relative;
            img {
              width: 100%;
              height: auto;
            }
            i {
              position: absolute;
              right: -5px;
              top: -5px;
              color: red;
              font-size: 16px;
              background: white;
              border-radius: 50%;
              &:hover {
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
}
</style>

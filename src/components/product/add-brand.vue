<template>
  <div class="add-brand">
    <!-- 覆盖title -->
    <div class="view-title">
      <i class="view-title-before"/>
      <span class="title">{{titleTxt}}</span>
      <div class="refresh-btn">
        <el-button icon="el-icon-close" @click="$router.go(-1)">关闭</el-button>
      </div>
    </div>
    <!-- 表单本体 -->
    <div class="main-wrapper">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入分类名称"/>
        </el-form-item>
        <el-form-item label="品牌首字母" prop="firstChar">
          <el-input v-model="ruleForm.firstChar" placeholder="请输入分类名称"/>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logo">
          <img :src="logo" alt v-if="ruleForm.logo">
          <el-upload
            class="upload-demo"
            action="url"
            :http-request="uploadFile"
            accept="image/jpeg, image/png"
          >
            <el-button type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png格式文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="品牌专区大图" prop="areaLogo">
          <img :src="ruleForm.areaLogo" alt v-if="ruleForm.areaLogo">
          <el-upload
            class="upload-demo"
            action="url"
            :http-request="uploadAreaFile"
            accept="image/jpeg, image/png"
          >
            <el-button type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png格式文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="排序" prop="sorting">
          <el-input v-model="ruleForm.sorting" type="number"/>
        </el-form-item>
        <el-form-item label="品牌故事" prop="story">
          <el-input v-model="ruleForm.story" type="textarea"/>
        </el-form-item>
        <el-form-item label="是否显示" prop="isShow">
          <el-radio-group v-model="ruleForm.isShow">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">不显示</el-radio>
            <p>当品牌下还没有商品的时候，分类页的品牌区将不会显示该品牌</p>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitRuleForm('ruleForm')">{{titleTxt}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
//使用axios中的qs模块转化request
import Qs from "qs";
import mixin from "@/util/mixin.js";

export default {
  mixins: [mixin],
  data() {
    return {
      isAdd: true,
      fileList: [],
      ruleForm: {
        areaLogo: "",
        // code: "",
        firstChar: "",
        // goodsTotal: "",
        // isManufacturer: "",
        isShow: 1,
        logo: "",
        name: "",
        sorting: ""
      },
      rules: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
        logo: [{ required: true, message: "请上传logo", trigger: "change" }],
        isShow: [
          { required: true, message: "请选择是否显示", trigger: "change" }
        ]
      }
    };
  },
  created() {
    if (this.$route.query.brandId) {
      this.isAdd = false;
      this.getFormData();
    } else {
      this.isAdd = true;
    }
  },
  computed: {
    titleTxt() {
      return this.isAdd ? "新增品牌" : "修改品牌";
    },
    logo() {
      //取最后一个http
      let idx = this.ruleForm.logo.lastIndexOf("http");
      return this.ruleForm.logo.substr(idx);
    }
  },
  methods: {
    //获取data
    getFormData() {
      this.$axios({
        method: "post",
        url: "api/merchant_goods_brand/query_by_id",
        type: "form",
        data: {
          id: this.$route.query.brandId
        },
        //使用qs模块转化data为form格式提交
        transformRequest: [
          function(data) {
            data = Qs.stringify(data);
            return data;
          }
        ],
        // 修改header为formdata格式
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
        .then(res => {
          console.log(res);
          this.ruleForm = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 上传图片 logo
    uploadFile(content) {
      this.uploadImg(content.file).then(res => {
        // console.log(res);
        this.ruleForm.logo = res.imgUrl;
      });
    },
    // 上传图片 areaLogo
    uploadAreaFile(content) {
      this.uploadImg(content.file).then(res => {
        // console.log(res);
        this.ruleForm.areaLogo = res.imgUrl;
      });
    },

    //提交表单
    submitRuleForm(formName) {
      this.$refs[formName].validate(valid => {
        //先检验表单
        if (valid) {
          if (this.isAdd) {
            //判断是否新增参数
            this.submitForm("api/merchant_goods_brand/add", this.ruleForm);
          } else {
            this.submitForm("api/merchant_goods_brand/update", this.ruleForm);
          }
          this.msg();
          this.goBack();
        } else {
          this.msg("error submit!!", "error");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/mixin.scss";

.add-brand {
  @include title();

  //表单
  .main-wrapper {
    padding: 37px 45px 0 45px;
    display: flex;
    justify-content: center;
    & p {
      width: 500px;
      font-size: 14px;
      color: #9fa0a0;
      line-height: 20px;
    }
    .el-form {
      .el-form-item {
        img {
          width: 150px;
        }
        .el-radio-group {
          margin-top: 10px;
        }
      }
    }
  }
}
</style>

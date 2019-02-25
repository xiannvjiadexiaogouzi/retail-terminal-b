<template>
  <div class="add-pic">
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
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="相册名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入分类名称"/>
        </el-form-item>
        <el-form-item label="相册封面" prop="cover">
          <img :src="ruleForm.cover" alt v-if="ruleForm.cover">
          <el-upload
            class="upload-demo"
            action="url"
            :http-request="uploadFile"
            accept="image/jpeg, image/png"
          >
            <el-button type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png格式文件，文件不能超过200kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="排序" prop="sorting">
          <el-input v-model="ruleForm.sorting" type="number"/>
        </el-form-item>
        <el-form-item label="相册描述" prop="description">
          <el-input v-model="ruleForm.description" type="textarea"/>
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
        cover: "",
        description: "",
        name: "",
        sorting: "",
      },
      rules: {
        name: [{ required: true, message: "请输入相册名称", trigger: "blur" }],
        cover: [{ required: true, message: "请上传封面", trigger: "change" }]
      }
    };
  },
  created() {
    if (this.$route.query.picsId) {
      this.isAdd = false;
      this.getFormData();
    } else {
      this.isAdd = true;
    }
  },
  computed: {
    titleTxt() {
      return this.isAdd ? "新增相册" : "修改相册";
    }
  },
  methods: {
    //获取data
    getFormData() {
      this.$axios({
        method: "post",
        url: "api/merchant_goods_galleries/query_by_id",
        type: "form",
        data: {
          id: this.$route.query.picsId
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
          // console.log(res);
          this.ruleForm = res.data.data;
        })
        .catch(err => {
          this.msg(err, "error");
        });
    },
    // 上传图片 logo
    uploadFile(content) {
      this.uploadImg(content.file).then(res => {
        // console.log(res);
        this.ruleForm.cover = res.imgUrl;
      });
    },
    //提交表单
    submitRuleForm(formName) {
      this.$refs[formName].validate(valid => {
        //先检验表单
        if (valid) {
          console.log(this.isAdd)
          if (this.isAdd) {
            //判断是否新增参数
            this.submitForm("api/merchant_goods_galleries/add", this.ruleForm);
          } else {
            this.submitForm(
              "api/merchant_goods_galleries/update",
              this.ruleForm
            );
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

.add-pic {
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
    .el-tag + .el-tag {
      margin-left: 15px;
    }
    .button-new-tag {
      margin-left: 15px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      width: 90px;
      margin-left: 15px;
      vertical-align: bottom;
    }
    .el-form {
      .el-form-item {
        img {
          width: 150px;
        }
      }
    }
  }
}
</style>

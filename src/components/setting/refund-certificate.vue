<template>
  <div class="refund-certificate">
    <!-- 表单本体 -->
    <div class="main-wrapper">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="200px"
        class="demo-ruleForm"
      >
        <el-form-item label="支付证书" prop="remark1">
          <div>{{certiFile}}</div>
          <el-upload
            class="upload-demo"
            action="url"
            :http-request="uploadFile"
            accept="application/x-pkcs12"
          >
            <el-button type="primary">{{ruleForm.remark1 ? '重新上传' : '点击上传'}}</el-button>
            <div slot="tip" class="el-upload__tip">只能上传p12证书文件</div>
          </el-upload>
          <img src="../../assets/img/setting/wechat-merchant.png" alt class="form-img">
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitRuleForm('ruleForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import mixin from "@/util/mixin.js";

export default {
  mixins: [mixin],
  data() {
    return {
      fileList: [],
      ruleForm: {
        remark1: ""
      },
      rules: {
        remark1: [{ required: true, message: "请上传证书", trigger: "change" }]
      }
    };
  },
  created() {
    this.getFormData();
  },
  computed: {
    certiFile() {
      return this.ruleForm.remark1.split("/").pop();
    }
  },
  methods: {
    //获取data
    getFormData() {
      this.$axios({
        method: "post",
        url: this.$api.pay,
        data: {
          merchantId: JSON.parse(localStorage.user).merchantId
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
    //上传证书
    uploadFile(content) {
      if (content.file.type !== "application/x-pkcs12") {
        this.msg("请上传p12文件", "error");
        return;
      } else {
        // let formData = new FormData(); //创建新的formdata对象
        // formData.append("file", content.file); //向formdata中插入键值对(数据)\
        // //上传文件
        // this.$axios({
        //   method: "post",
        //   url: this.$api.upload,
        //   data: formData,
        //   type: "form",
        //   headers: {
        //     "Content-Type": "multipart/form-data" //* 和json文字数据不一样
        //   }
        // })
        //   .then(res => {
            this.msg("上传成功");
        //     // console.log(res);
        //     //根据res来更改当前证书数据
        //   })
        //   .catch(err => {
        //     this.msg(err, "error");
        //   });
      }
    },
    //提交表单
    submitRuleForm(formName) {
      this.$refs[formName].validate(valid => {
        //先检验表单
        if (valid) {
          // this.submitForm("api/?", this.ruleForm);
          this.msg("提交成功");
          this.getFormData();
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
.refund-certificate {
  .main-wrapper {
    display: flex;
    justify-content: center;
    .el-form {
      img {
        width: 100%;
      }
    }
  }
}
</style>

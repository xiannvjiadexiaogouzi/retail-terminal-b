<template>
  <div class="merchant-QRcode">
    <!-- 表单本体 -->
    <div class="main-wrapper">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="200px"
        class="demo-ruleForm"
      >
        <el-form-item label="商户二维码" prop="remark2">
          <img :src="ruleForm.remark2" alt class="form-img">
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
        remark2: ""
      },
      rules: {
        remark2: [{ required: true, message: "请上传二维码", trigger: "change" }]
      }
    };
  },
  created() {
    this.getFormData();
  },
  computed: {},
  methods: {
    //获取data
    getFormData() {
      this.$axios({
        method: "post",
        url: "api/merchant_pay_mode/query",
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
    // 上传图片
    uploadFile(content) {
      this.uploadImg(content.file).then(res => {
        // console.log(res);
        this.ruleForm.remark2 = res.imgUrl;
      });
    },
    //提交表单
    submitRuleForm(formName) {
      this.$refs[formName].validate(valid => {
        //先检验表单
        if (valid) {
          this.submitForm("api/merchant_pay_mode/add_qrCode", this.ruleForm);
          this.msg("保存成功");
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
.merchant-QRcode {
  .main-wrapper {
    display: flex;
    justify-content: center;
    .form-img {
      width: 200px;
    }
  }
}
</style>

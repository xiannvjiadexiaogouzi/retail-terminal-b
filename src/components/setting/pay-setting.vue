<template>
  <div class="pay-setting">
    <!-- 表单本体 -->
    <div class="main-wrapper">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="200px"
        class="demo-ruleForm"
      >
        <el-form-item label="支付名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入支付名称"/>
        </el-form-item>
        <el-form-item label="支付描述" prop="detail">
          <el-input v-model="ruleForm.detail" type="textarea"/>
        </el-form-item>
        <el-form-item label="AppID" prop="appid">
          <el-input v-model="ruleForm.appid" placeholder="请输入AppID"/>
        </el-form-item>
        <el-form-item label="AppSecret" prop="appsecret">
          <el-input v-model="ruleForm.appsecret" placeholder="请输入AppSecret"/>
        </el-form-item>
        <el-form-item label="商户密钥key" prop="appkey">
          <el-input v-model="ruleForm.appkey" placeholder="请输入商户密钥key"/>
        </el-form-item>
        <el-form-item label="支付商户号" prop="mchId">
          <el-input v-model="ruleForm.mchId" placeholder="请输入支付商户号"/>
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
      ruleForm: {
        appid: "",
        appkey: "",
        appsecret: "",
        detail: "",
        id: "",
        mchId: "",
        userId: JSON.parse(localStorage.user).userId || localStorage.userId,
        name: "",
        remark1: "",
        remark2: "",
        remark3: ""
      },
      rules: {
        name: [{ required: true, message: "请输入支付名称", trigger: "blur" }],
        appid: [{ required: true, message: "请输入AppID", trigger: "blur" }],
        appsecret: [
          { required: true, message: "请输入AppSecret", trigger: "blur" }
        ],
        appkey: [
          { required: true, message: "请输入商户密钥key", trigger: "blur" }
        ],
        mchId: [
          { required: true, message: "请输入支付商户号", trigger: "blur" }
        ]
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
        url: this.$api.pay,
        data: {
          userId: JSON.parse(localStorage.user).userId || localStorage.userId
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
    //提交表单
    submitRuleForm(formName) {
      this.$refs[formName].validate(valid => {
        //先检验表单
        if (valid) {
          this.submitForm(this.$api.pay_update, this.ruleForm);
          this.msg("提交成功");
          // this.$nextTick(() => {
            this.getFormData();
          // });
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
.pay-setting {
  .main-wrapper {
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
    .form-img {
      width: 300px;
    }
  }
}
</style>

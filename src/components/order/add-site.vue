<template>
  <div class="add-site">
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
        <el-form-item label="发货点名称" prop="returnPname">
          <el-input v-model="ruleForm.returnPname" placeholder="请输入发货点名称"/>
        </el-form-item>
        <el-form-item label="发货人姓名" prop="returnName">
          <el-input v-model="ruleForm.returnName" placeholder="请输入发货人姓名"/>
        </el-form-item>
        <el-form-item label="详细地址" prop="returnAddress">
          <el-input v-model="ruleForm.returnAddress" placeholder="请输入详细地址" type="textarea"/>
        </el-form-item>
        <el-form-item label="联系电话" prop="returnPhone">
          <el-input v-model="ruleForm.returnPhone" placeholder="请输入联系电话"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitRuleForm('ruleForm')">{{titleTxt}}</el-button>
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
    //验证手机号
    var validatePhoneNumber = (rule, value, callback) => {
      let reg = /^1[3|4|5|7|8][0-9]{9}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    return {
      isAdd: true,
      fileList: [],
      ruleForm: {
        id: "",
        // merchantId: "",
        returnAddress: "",
        returnName: "",
        returnPhone: "",
        returnPname: ""
      },
      rules: {
        returnName: [
          { required: true, message: "请输入发货人姓名", trigger: "blur" }
        ],
        returnPhone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          { validator: validatePhoneNumber, trigger: "blur" }
        ],
        returnPname: [
          { required: true, message: "请输入发货地", trigger: "blur" }
        ],
        returnAddress: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    if (this.$route.query.siteId) {
      this.isAdd = true;
      this.getFormData();
    } else {
      this.isAdd = false;
    }
  },
  computed: {
    titleTxt() {
      return this.isAdd ? "修改发货点" : "新增发货点";
    }
  },
  methods: {
    //获取data
    getFormData() {
      this.$axios({
        method: "post",
        url: this.$api.return_site_detail,
        data: {
          id: this.$route.query.siteId
        }
      })
        .then(res => {
          console.log(res);
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
          this.submitForm(this.$api.return_site_add, this.ruleForm);
          this.msg();
          setTimeout(() => {
            this.$router.back();
          }, 2500);
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

.add-site {
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
      width: 600px;
      .el-form-item {
        img {
          width: 150px;
        }
      }
    }
  }
}
</style>

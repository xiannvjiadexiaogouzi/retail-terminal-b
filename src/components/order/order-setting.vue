<template>
  <div class="order-setting">
    <!-- 覆盖title -->
    <div class="view-title">
      <i class="view-title-before"/>
      <span class="title">订单设置</span>
      <div class="refresh-btn">
        <el-button icon="el-icon-close" @click="$router.go(-1)">关闭</el-button>
      </div>
    </div>
    <!-- 表单本体 -->
    <div class="main-wrapper">
      <div class="center">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="150px"
          class="demo-ruleForm"
        >
          <el-form-item label="正常订单超过" prop="normalEndpayTime">
            <el-input v-model="ruleForm.normalEndpayTime" placeholder="请输入分类名称" type="number">
              <template slot="append">分</template>
            </el-input>
          </el-form-item>
          <el-form-item label="发货超过" prop="sendEndTime">
            <el-input v-model="ruleForm.sendEndTime" placeholder="请输入分类名称" type="number">
              <template slot="append">天</template>
            </el-input>
          </el-form-item>
          <el-form-item label="最终评论时间" prop="commentEndTime">
            <el-input v-model="ruleForm.commentEndTime" placeholder="请输入分类名称" type="number">
              <template slot="append">天</template>
            </el-input>
          </el-form-item>
          <el-form-item label="完成收获后" prop="finalEndTime">
            <el-input v-model="ruleForm.finalEndTime" placeholder="请输入分类名称" type="number">
              <template slot="append">天</template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitRuleForm('ruleForm')">完成设置</el-button>
          </el-form-item>
        </el-form>
        <div class="form-right">
          <p>未付款，订单自动关闭</p>
          <p>未收货，订单自动完成</p>
          <p>好评并完成</p>
          <p>不能申请售后</p>
        </div>
      </div>
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
        commentEndTime: "",
        finalEndTime: "",
        // merchantId: "",
        normalEndpayTime: "",
        sendEndTime: ""
      },
      rules: {
        commentEndTime: [
          { required: true, message: "请输入天数", trigger: "blur" }
        ],
        finalEndTime: [
          { required: true, message: "请输入天数", trigger: "blur" }
        ],
        normalEndpayTime: [
          { required: true, message: "请输入天数", trigger: "blur" }
        ],
        sendEndTime: [
          { required: true, message: "请输入天数", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getFormData();
  },
  methods: {
    //获取data
    getFormData() {
      this.$axios({
        method: "post",
        url: this.$api.order_set
        // data: {
        //   merchantId: JSON.parse(localStorage.user).merchantId
        // }
      })
        .then(res => {
          // console.log(res);
          this.ruleForm = res.data;
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
          this.submitForm(
            this.$api.order_set,
            this.ruleForm
          );
          this.msg();
          setTimeout(() => {
            this.getFormData();
          }, 3000);
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

.order-setting {
  @include title();
  //表单
  .main-wrapper {
    padding: 37px 45px 0 45px;
    display: flex;
    justify-content: center;
    .center {
      display: flex;
    }
    .form-right {
      p {
        color: #595757;
        line-height: 40px;
        margin-left: 10px;
        margin-bottom: 23px;
      }
    }
  }
}
</style>

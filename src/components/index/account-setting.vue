<template>
  <dir class="account-setting">
    <div class="avatar-img-wrapper">
      <div class="avartar-img">
        <img :src="logo" alt>
      </div>
      <el-upload
        class="upload-demo"
        action="url"
        :http-request="uploadFile"
        accept="image/jpeg, image/png"
      >
        <el-button type="primary">上传头像</el-button>
        <div slot="tip" class="el-upload__tip"/>
      </el-upload>
    </div>
    <div class="new-info-wrapper">
      <div class="left">
        <p>用户名</p>
        <!-- <p>Email</p> -->
        <p>旧密码</p>
        <p>新密码</p>
        <p>确认密码</p>
      </div>
      <div class="right">
        <el-input v-model="user.merchantName" disabled/>
        <!-- <el-input v-model="email" disabled="true"/> -->
        <el-input v-model="oldPw"/>
        <el-input v-model="newPw"/>
        <el-input v-model="cfmPw"/>
      </div>
    </div>
    <div class="btn-wrapper">
      <el-button type="primary">提交</el-button>
    </div>
  </dir>
</template>

<script>
import mixin from "@/util/mixin.js";

export default {
  mixins: [mixin], //vue 混入
  data() {
    return {
      user: {},
      logo: "",
      oldPw: "",
      newPw: "",
      cfmPw: ""
    };
  },
  created() {
    this.getFormData();
  },

  methods: {
    //获取data
    getFormData() {
      //从服务器取
      // this.$axios({
      //   method: "post",
      //   url: "api/..."
      //   // data: {
      //   //   merchantId: JSON.parse(localStorage.user).merchantId
      //   // }
      // })
      //   .then(res => {
      //     // console.log(res);
      //     // this.ruleForm = res.data.data;
      //   })
      //   .catch(err => {
      //     // console.log(err);
      //   });
      //直接从本地取
      this.user = JSON.parse(this.$store.state.user);
      this.logo = JSON.parse(this.$store.state.user).imgUrl + JSON.parse(this.$store.state.user).merchantLogo;
    },
    // 上传头像
    uploadFile(content) {
      this.uploadImg(content.file).then(res => {
        // console.log(res);
        this.logo = res.imgUrl;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/mixin.scss";

.account-setting {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 462px;
  margin: 10px auto 0 auto;
  padding: 0;
  .avatar-img-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 366px;
    margin-left: 96px;
    .upload-demo {
      ul {
        display: none;
      }
    }
    .avartar-img {
      width: 160px;
      height: 160px;
      border-radius: 50%;
      overflow: hidden;
      @include bg("../../assets/img/index/account-setting/avatar.png");
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .new-info-wrapper {
    display: flex;
    .left {
      p {
        text-align: end;
        line-height: 50px;
        margin-top: 16px;
        margin-right: 18px;
      }
      & :before {
        content: "* ";
        font-weight: bold;
        color: red;
        //   display: inline-block;
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      .el-input {
        width: 366px;
        height: 50px;
        margin-top: 16px;
      }
    }
  }
  .btn-wrapper {
    display: flex;
    justify-content: center;
    align-self: flex-end;
    width: 366px;
    .el-button {
      margin-top: 40px;
      width: 126px;
      height: 50px;
      // background: rgba(91, 192, 191, 1);
      font-size: 18px;
      color: rgba(255, 255, 255, 1);
    }
  }
}
</style>

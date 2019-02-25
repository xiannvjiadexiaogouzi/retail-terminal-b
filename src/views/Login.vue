<template>
  <div class="login-vue">
    <div class="login-bg"></div>
    <div class="login-wrapper">
      <div class="login">
        <div class="title">后台业务管理系统</div>
        <el-input v-model="user" placeholder="请输入用户名称" clearable/>
        <el-input type="password" v-model="password" placeholder="请输入登录密码" clearable/>
        <transition name="alert-trans">
          <el-alert type="warning" center show-icon v-if="showAlert">{{text}}</el-alert>
        </transition>
        <el-button @click="loginIn">登 录</el-button>
      </div>
      <footer>
        <p>copyright....</p>
      </footer>
    </div>
  </div>
</template>

<script>
//使用axios中的qs模块转化request
import Qs from "qs";

export default {
  name:'login',
  data() {
    return {
      showAlert: false,
      user: "13932493200",
      password: "000000",
      text: ""
    };
  },
  computed: {
    //因为该系统为单商户应用，无注册功能，登录信息如下：
    // loginName: "13932493200",
    // loginPassword: "000000"
  },
  methods: {
    alertShow() {
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
    },
    loginIn() {
      //检查填写
      if (!this.user) {
        this.text = "请填写用户名称";
        this.alertShow();
      } else if (!this.password) {
        this.text = "请填写登录密码";
        this.alertShow();
      } else {
        //发送请求
        this.$axios({
          method: "post",
          url: "api/merchant/login",
          type: "form",
          data: {
            loginName: this.user,
            loginPassword: this.password
          },
          //使用qs模块转化data为form格式提交
          transformRequest: [
            function(data) {
              data = Qs.stringify(data);
              return data;
            }
          ],
          // 修改header为formdata格式
          headers: { "Content-Type": "application/x-www-form-urlencoded" }
        })
          .then(res => {
            // console.log(res);
            //验证成功
            if (res.data.errno == 200 && res.data.msg === "返回成功") {
              this.text = "登陆成功";
              this.alertShow();
              //存储用户信息 --> vuex
              // console.log(res)
              this.$store.commit("SET_USER", JSON.stringify(res.data.data));
              localStorage.userId = res.data.data.userId;
              localStorage.userMobile = res.data.data.merchantMobile;
              localStorage.merchantId_ID = res.data.data.merchantId;
              localStorage.moduleId = 300;
              //转跳
              setTimeout(() => {
                //直接同步会使得alertShow显示不出来
                this.$router.push("/index/sys-index");
              }, 900);
            } else {
              //验证失败
              this.text = "用户名密码不匹配";
              this.alertShow();
            }
          })
          .catch(err => {
            // console.log(err);
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/mixin.scss";

div.login-bg {
  position: absolute;
  height: 100vh;
  width: 100%;
  @include bg("../assets/img/login/login-bg.png");
}

div.login-wrapper {
  // @include bg("../assets/img/login/login-bg.png");

  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  div.login {
    width: 350px;
    height: 389px;
    position: relative;
    div.title {
      width: 100%;
      margin-bottom: 57px;
      text-align: center;
      font-size: 27px;
      font-weight: 700;
      color: rgb(255, 255, 255);
    }
    .el-alert {
      position: absolute;
      width: 100%;
      height: 45px;
      bottom: 60px;
      background: rgb(130, 230, 230);
      color: rgb(255, 255, 255);
      font-size: 18px;
    }
    .el-button {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 2;
      margin-top: 65px;
      width: 100%;
      height: 60px;
      background: $blue;
      font-size: 21px;
      color: rgb(255, 255, 255);
      border: none;
    }
    .alert-trans-enter {
      // .alert-trans-leave-to {
      opacity: 0;
      -webkit-transform: translateY(60px);
      transform: translateY(60px);
    }
    .alert-trans-enter-active {
      // .alert-trans-leave-active {
      transition: transform 1s ease;
    }
  }
}

footer {
  position: absolute;
  bottom: 6.5%;
  max-width: 100%;
  display: flex;
  justify-content: center;
  font-size: 20px;
  color: rgb(255, 255, 255);
}
</style>

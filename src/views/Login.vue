<template>
  <div class="login-wrapper">
    <div class="login">
      <div class="title">后台业务管理系统</div>
      <el-input v-model="user" placeholder="请输入用户名称" clearable />
      <el-input type="password" v-model="password" placeholder="请输入登录密码" clearable />
      <button @click="loginIn">登 录</button>
      <!-- <el-button @click="register">注 册</el-button> -->
    </div>
    <footer>
      <p>copyright....</p>
    </footer>
  </div>
</template>

<script>
//使用axios中的qs模块转化request
import Qs from "qs";
import mixin from "../util/mixin";

export default {
  name: "login",
  mixins: [mixin],
  data() {
    return {
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
  // created() {
  //   this.$axios({
  //     method: "get",
  //     url: this.$api.host
  //     // url: 'http://68.168.131.20'
  //   }).then(res => console.log(res));
  // },
  methods: {
    // alertShow() {
    //   this.showAlert = true;
    //   setTimeout(() => {
    //     this.showAlert = false;
    //   }, 3000);
    // },
    loginIn() {
      //检查填写
      if (!this.user) {
        // this.text = "请填写用户名称";
        // this.alertShow();
        this.msg("请填写用户名称", "error");
      } else if (!this.password) {
        // this.text = "请填写登录密码";
        // this.alertShow();
        this.msg("请填写登录密码", "error");
      } else {
        //发送请求
        this.$axios({
          method: "post",
          url: this.$api.login,
          // url: '68.168.131.20/merchant/login',
          // url: "api/merchant/login",
          // type: "form",
          data: {
            // loginName: this.user,
            // loginPassword: this.password
            username: this.user,
            password: this.password
          }
          // //使用qs模块转化data为form格式提交
          // transformRequest: [
          //   function(data) {
          //     data = Qs.stringify(data);
          //     return data;
          //   }
          // ],
          // // 修改header为formdata格式
          // headers: { "Content-Type": "application/x-www-form-urlencoded" }
        })
          .then(res => {
            console.log(res);
            //验证成功
            if (res.data.msg === "返回成功") {
              // this.text = "登陆成功";
              this.msg("登陆成功");
              // this.alertShow();
              //存储用户信息 --> vuex
              // console.log(res)
              this.$store.commit("SET_USER", JSON.stringify(res.data.userInfo));
              localStorage.userId = res.data.userInfo.userId;
              localStorage.username = res.data.userInfo.username;
              // localStorage.userMobile = res.data.data.merchantMobile;
              // localStorage.merchantId_ID = res.data.data.merchantId;
              // localStorage.moduleId = 300;
              //转跳
              setTimeout(() => {
                // console.log(1)
                //直接同步会使得alertShow显示不出来
                this.$router.push("/index/sys-index");
              }, 900);
            } else {
              //验证失败
              this.text = "用户名密码不匹配";
            }
          })
          .catch(err => {
            console.log(err);
            this.msg(err, "error");
          });
      }
    },
    register() {
      this.$axios({
        method: "post",
        // url: this.$api.register,
        url: "68.168.131.20/merchant/login",
        data: {
          username: this.user,
          password: this.password
        }
      })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
          this.msg(err, "error");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/mixin.scss";

div.login-wrapper {
  background-image: linear-gradient(
    125deg,
    #2c3e50,
    #27ae60,
    #2980b9,
    #e74c3c,
    #8e44ad
  );
  background-size: 400%;
  animation: bganimation 60s linear infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;

  div.login {
    padding: 20px 5px;
    width: 400px;
    height: 400px;
    border-radius: 5px;
    position: relative;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    div.title {
      width: 100%;
      // margin-bottom: 57px;
      text-align: center;
      font-size: 27px;
      font-weight: 700;
      color: rgb(255, 255, 255);
    }
    button {
      // position: absolute;
      // bottom: 0;
      // left: 0;
      // z-index: 2;
      // margin-top: 65px;
      margin: 15px 0;
      border-radius: 5px;
      width: 80%;
      height: 60px;
      background: transparent;
      font-size: 21px;
      color: rgb(255, 255, 255);
      border: 2px $blue solid;
      outline: 0;
      &:hover{
        background: $rule-blue;
        cursor: pointer;
      }
      &{
        background: $blue;
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
}

@keyframes bganimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>

<style scoped>
.login-wrapper .login .el-input {
  width: 80%;
}
</style>


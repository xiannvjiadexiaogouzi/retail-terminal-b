<template>
  <div class="program-authorize">
    <div class="main-wrapper">
      <p class="title">小程序授权</p>
      <p>将微信小程序授权给予点滴时光，快速生成专属小程序，并提交微信</p>
      <p>1、微信官方规定：用户必须自己进行小程序注册。然后才可以将小程序授权给任意第三方进行设计和代码管理。</p>
      <p>
        2、微信官方规定：小程序个人开放的服务类目是有严格规定的，内容不在服务类目中的，是审核不通过的。
        <a
          style="color: lightblue;"
          target="_blank"
          href="https://developers.weixin.qq.com/miniprogram/dev/devtools/ext.html"
        >查看详情</a>
      </p>
      <div class="btn-group">
        <el-button @click="open">已注册微信小程序，直接授权</el-button>
        <el-button @click="sign" type="primary">未注册小程序账号，去微信注册</el-button>
      </div>
      <p class="title">绑定体验者</p>
      <p>添加体验者后，即可体验未发布的小程序 如果想查看所有体验者，请到微信公众平台-登录小程序-用户身份中设置，点击这里跳转。</p>
      <div class="btn-group">
        <el-button @click="sign" type="primary">添加体验者</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Qs from "qs";
import mixin from "@/util/mixin.js";

export default {
  mixins: [mixin],
  methods: {
    open() {
      this.$axios({
        method: "post",
        url: "https://wxpro.diandianyuyue.com/useropen/authMinPro",
        type: "form",
        data: {
          module_id: localStorage.moduleId,
          account: localStorage.userMobile,
          merchant_id: localStorage.merchantId_ID,
          remote_url: "SmallProgram"
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
          var newWeb = window.open("_blank");
          newWeb.location =
            "https://wxpro.diandianyuyue.com/diandianplatform/accountSelect.html?merchantId=" +
            localStorage.merchantId_ID +
            "&moduleId=" +
            localStorage.moduleId +
            "&userMobile=" +
            localStorage.userMobile;
        })
        .catch(err => {
          this.msg(err, "error");
        });
    },
    sign() {
      let web = window.open("_blank");
      web.location = "https://mp.weixin.qq.com/";
    }
  }
};
</script>

<style lang="scss" scoped>
.program-authorize {
  font-size: 18px;
  display: flex;
  justify-content: center;
  // align-items: center;
  .main-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: rgba(136, 136, 136, 1);
    .title {
      font-weight: bold;
    }
    & > p:not(.title) {
      line-height: 30px;
    }
    .btn-group {
      margin: 20px auto;
    }
  }
}
</style>

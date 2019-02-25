<template>
  <div class="admin-info">
    <div class="admin-title">
      登录信息
      <span class="setting-btn" @click="$router.push('account-setting')">账户设置</span>
    </div>
    <p>
      本次登录：
      <span class="black-font">{{loginInfo.operateTime}}</span>
    </p>
    <p>
      登录地区：
      <span class="black-font">{{region+' (IP: '+loginInfo.ip+')'}}</span>
    </p>
    <p>
      上次登录：
      <span>{{lastTime}}</span>
    </p>
  </div>
</template>

<script>
import Qs from "qs";
import mixins from "@/util/mixin.js";

export default {
  mixins: [mixins],
  data() {
    return {
      loginInfo: "",
      lastTime: ""
    };
  },
  created() {
    this.getTableData();
  },
  computed: {
    region() {
      let re = {};
      if (this.loginInfo.description) {
        re = JSON.parse(this.loginInfo.description).data;
        return re.country + re.region + re.city;
      }else{
        return '未知地区'
      }
    },
    ip() {
      let re = {};
      if (this.loginInfo) {
        re = JSON.parse(this.loginInfo.description).data;
        return re.ip;
      }
    }
  },
  methods: {
    getTableData(page) {
      this.$axios({
        method: "post",
        url: "api/merchant/get_merchant_login_info_list",
        data: {
          currentPage: page || this.currentPage,
          pageSize: this.pageSize,
          orderBy: "operate_time desc"
        },
        type: "form",
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
          this.loginInfo = res.data.data.list[0];
          this.lastTime = res.data.data.list[1].operateTime;
        })
        .catch(err => {
          this.msg(err, "error");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.admin-info {
  padding: 0 18px 50px 18px;
  width: 416px;
  height: 240px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 6px 10px 0px rgba(4, 0, 0, 0.2);
  border-radius: 0px 0px 6px 6px;
  .admin-title {
    display: flex;
    justify-content: space-between;
    padding: 25px 20px;
    height: 68px;
    border-bottom: 1px solid rgba(210, 210, 210, 1);
    font-size: 18px;
    font-weight: bold;
    color: rgba(89, 87, 87, 1);
    margin-bottom: 35px;
    .setting-btn {
      font-weight: 400;
      color: rgba(91, 192, 191, 1);
      cursor: pointer;
    }
  }
  & > p {
    padding: 0 20px;
    margin-top: 20px;
    font-size: 16px;
    color: rgba(181, 181, 182, 1);
    .black-font {
      color: rgba(114, 113, 113, 1);
    }
  }
}
</style>

<template>
  <div class="index">
    <header>
      <!-- <div class="header-wrapper"> -->
      <div class="left">
        <div class="logo">
          <span class="bg-logo"></span>
        </div>
        <div class="menu-wrapper">
          <div
            v-for="(item,index) in indexMenu"
            :key="index"
            @click="selectIndex(index)"
            class="menuItem"
            :class="index == activeNav ? 'active' : ''"
          >{{item.title}}</div>
        </div>
      </div>
      <div class="avatar-status-wrapper">
        <div class="avatar-wrapper" @click="adminShow">
          <span class="icon-avatar"/>
          <span class="avatar-name">admin</span>
        </div>
        <div class="admin-info-wrapper" v-if="showAdmin">
          <admin-info/>
        </div>
        <div class="status-wrapper">
          <span class="icon-home" @click="$router.push('/index/sys-index')"/>
          <span class="icon-msg" @click="msgShow"/>
          <div class="msg-warn">50</div>
          <div class="new-message-wrapper" v-show="showMsg">
            <new-message/>
          </div>
          <span class="icon-close" @click="logout"/>
        </div>
      </div>
      <!-- </div> -->
    </header>
    <div class="main-wrapper">
      <div class="sidebar">
        <ul v-for="(child,index) in nowAside.child" :key="index">
          <li class="child-sub">{{child.sub}}</li>
          <li
            v-for="(menu,index) in child.menu"
            :key="index"
            class="menu"
            @click="selectMenu(menu)"
            :class="menu.name === activeMenu ? 'active':''"
          >{{menu.title}}</li>
        </ul>
      </div>
      <div class="content-wrapper">
        <div class="view-title">
          <i class="view-title-before"/>
          <span class="title">{{nowMenu.title}}</span>
          <div class="refresh-btn">
            <el-button icon="el-icon-refresh" @click="$router.go(0)">刷新</el-button>
          </div>
        </div>
        <div class="router-view-wrapper">
          <router-view/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import indexMenu from "@/assets/json/Indexmenu.json";
import newMessage from "@/components/index/new-message.vue";
import adminInfo from "@/components/index/admin.vue";

export default {
  components: {
    newMessage,
    adminInfo
  },
  data() {
    return {
      indexMenu,
      nowIndex: this.$store.getters.activeNav, //初始值
      nowMenu: { name: "sys-index" },
      showMsg: false,
      showAdmin: false
    };
  },
  computed: {
    //顶层active菜单
    activeNav() {
      return this.$store.getters.activeNav;
    },
    //侧边菜单列表
    nowAside() {
      return this.indexMenu[this.nowIndex];
    },
    //侧边active菜单
    activeMenu(){
      return this.$store.getters.activeMenu;
    }
  },
  methods: {
    //选择header菜单，转跳侧边菜单
    selectIndex(index) {
      //获取nav的index
      this.nowIndex = index;
      //转变router到2级menu的第一个
      this.nowMenu = this.nowAside.child[0].menu[0];
      //改变route
      this.changeRoute();
    },

    //选择侧菜单，转跳具体内容
    selectMenu(menu) {
      //获取menu的index
      this.nowMenu = menu;
      //传给vuex
      // this.$store.commit("CHANGE_STATE", {
      //   name: "nowMenu",
      //   data: index
      // });
      //改变route
      this.changeRoute();
    },

    //转跳
    changeRoute() {
      this.$router.push("/" + this.nowAside.name + "/" + this.nowMenu.name);
    },
    msgShow() {
      this.showMsg = !this.showMsg;
    },
    adminShow() {
      this.showAdmin = !this.showAdmin;
    },
    //登出
    logout() {
      this.$router.push("/");
      // this.$store.commit("CLEAR_USER");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/mixin.scss";
// @import "../assets/scss/font-index-menu.scss";

.index {
  // // width: 1920px;
  // min-width: 1024px;
  width: 100vw;
  min-width: 1240px;
}
.index > header {
  display: flex;
  height: 90px;
  // min-width: 1640px;
  width: 100%;
  // min-width: 1024px;
  background: rgba(91, 192, 191, 1);
  justify-content: space-between;
  border-bottom: 1px solid rgb(210, 210, 210);

  // .header-wrapper {
  //   display: flex;
  //   justify-content: space-between;
  //   position: relative;
  & div {
    display: inline-block;
    // height: 100%;
  }
  .left {
    display: flex;
    .logo {
      padding: 26px 0;
      margin-right: 40px;
      .bg-logo {
        display: inline-block;
        height: 37px;
        width: 116px;
        @include bg("../assets/img/index/LOGO.png");
      }
    }
    .menu-wrapper {
      display: flex;
      .menuItem {
        width: 80px;
        text-align: center;
        line-height: 90px;
        font-size: 20px;
        color: rgb(255, 255, 255);
        cursor: pointer;
      }
      .active {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }
  .avatar-status-wrapper {
    display: flex;
    // margin-left: 187px;
    padding: 30px 0;
    .avatar-wrapper {
      display: flex;
      color: rgb(255, 255, 255);
      border-right: 1px solid white;
      .icon-avatar {
        cursor: pointer;
        margin-right: 10px;
        @include bg-icon("../assets/img/index/avatar.png");
      }
      .avatar-name {
        display: inline-block;
        font-size: 18px;
        line-height: 30px;
        margin-right: 30px;
        cursor: pointer;
      }
    }
    .status-wrapper {
      display: flex;
      .icon-home {
        cursor: pointer;
        margin: 0 24px;
        @include bg-icon("../assets/img/index/home.png");
      }
      .icon-msg {
        cursor: pointer;
        margin: 0 24px;
        @include bg-icon("../assets/img/index/msg.png");
      }
      .icon-msg_on {
        cursor: pointer;
        margin: 0 24px;
        @include bg-icon("../assets/img/index/msg_on.png");
      }
      .icon-close {
        cursor: pointer;
        margin: 0 24px;
        @include bg-icon("../assets/img/index/close.png");
      }
      .msg-warn {
        position: absolute;
        width: 22px;
        height: 22px;
        background: rgba(210, 48, 41, 1);
        border-radius: 50%;
        font-size: 12px;
        color: rgba(255, 255, 255, 1);
        text-align: center;
        line-height: 22px;
        margin-left: 117px;
        margin-top: -5px;
      }
    }
  }
  // }
}
div.admin-info-wrapper {
  position: absolute;
  z-index: 2000;
  top: 90px;
  right: 0px;
}

div.new-message-wrapper {
  position: absolute;
  z-index: 2000;
  top: 90px;
  right: 0px;
}
div.main-wrapper {
  width: 100%;
  display: flex;
  // justify-content: center;
  // min-width: 1640px;
  .sidebar {
    // width: 260px;
    min-width: 200px;
    // & ul {
    //   // list-style: disc;
    //   // list-style-position: inside;
    // }
    & li {
      background: rgb(239, 239, 239);
      height: 60px;
      border-bottom: 1px solid rgb(229, 229, 229);
      padding-left: 50px;
      line-height: 60px;
      font-size: 18px;
      color: rgb(89, 87, 87);
    }
    .child-sub {
      color: rgba(185, 185, 186, 1);
    }
    .menu {
      cursor: pointer;
    }
    .menu.active {
      background: rgb(255, 255, 255);
      color: rgb(91, 192, 191);
      border-color: rgb(91, 192, 191);
    }
    .menu:before {
      content: "·";
      display: inline-block;
      margin-left: -20px;
      margin-right: 10px;
    }
  }

  .content-wrapper {
    width: 100%;
    min-width: 1040px;
    position: relative;
    // width: 1380px;
    .view-title {
      display: flex;
      height: 60px;
      background: rgba(239, 239, 239, 1);
      border-bottom: 1px solid rgb(229, 229, 229);
      .view-title-before {
        display: inline-block;
        margin: 16px 0;
        width: 14px;
        height: 28px;
        margin-right: 30px;
        background: rgba(91, 192, 191, 1);
      }
      .refresh-btn {
        margin: auto;
        margin-right: 45px;
      }
    }
    .router-view-wrapper {
      padding: 37px 45px 0 45px;
    }
  }
}
</style>


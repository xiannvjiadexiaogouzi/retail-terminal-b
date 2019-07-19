<template>
  <div class="rating-detail">
    <!-- 覆盖title -->
    <div class="view-title">
      <i class="view-title-before"/>
      <span class="title">评价详情</span>
      <div class="refresh-btn">
        <el-button icon="el-icon-close" @click="$router.push({name: 'rating'})">关闭</el-button>
        <!-- <i class="el-icon-close"/>
        <span>关闭</span>-->
      </div>
    </div>
    <div class="main-wrapper">
      <header>
        <div class="user-wrapper">
          <div class="user-info">
            <div class="user-img-wrapper"></div>
            <p>{{commentData.userName}}</p>
          </div>
          <div class="rating-info">
            <p>商品：{{commentData.goodsName}}</p>
            <!-- <p>购买：{{commentData.}}</p> -->
            <p>评价：
              <el-rate v-model="commentData.commentLevel" disabled></el-rate>
            </p>
            <p>日期：{{commentData.createTime}}</p>
            <p>IP地址：{{commentData.commentIp}}</p>
          </div>
        </div>
      </header>
      <div class="comment-wrapper">
        <header>
          <span>
            <i class="el-icon-star-on"/>
            收藏 1000
          </span>
          <span>
            <i class="el-icon-view"/>
            阅读 1000
          </span>
        </header>
        <div class="comment-content">{{commentData.commentContent}}</div>
        <footer>
          <div v-for="img in imgUrl" :key="img" class="img-wrapper">
            <img :src="img" alt="comment-img">
          </div>
        </footer>
      </div>
      <div class="comment-wrapper">
        <div class="comment-content">商家回复：{{commentData.commentReplyContent}}</div>
        <footer>
          <div v-for="img in imgUrl" :key="img" class="img-wrapper">
            <img :src="img" alt="comment-img">
          </div>
        </footer>
      </div>
      <div class="reply-wrapper">
        <p>回复评价</p>
        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" :rules="rules">
          <el-form-item label="用户名">
            <el-input v-model="account" disabled/>
          </el-form-item>
          <el-form-item label="回复内容" prop="commentReplyContent">
            <el-input type="textarea" v-model="ruleForm.commentReplyContent"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitRuleForm('ruleForm')">确定</el-button>
            <p>注意：管理员回复内容会在前台显示</p>
          </el-form-item>
        </el-form>
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
      commentData: {},
      account: "",
      ruleForm: {
        id: this.$route.params.userId,
        commentReplyContent: ""
      },
      rules: {
        commentReplyContent: [
          { required: true, message: "回复内容不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    //回复数据
    this.getTableData();
    //用户数据
    this.account = JSON.parse(this.$store.state.user).merchantName;
  },
  computed: {
    imgUrl() {
      if (this.commentData.imgUrl) {
        return this.commentData.imgUrl.split(",");
      }
    }
  },
  methods: {
    getTableData() {
      this.$axios({
        method: "post",
        url: this.$api.comment,
        data: {
          id: this.$route.params.userId
        }
      })
        .then(res => {
          console.log(res);
          this.commentData = res.data.data[0];
        })
        .catch(err => {
          // console.log(err);
          this.msg(err, "error");
        });
    },
    // 提交reply
    submitRuleForm(formName) {
      this.$refs[formName].validate(valid => {
        //先检验表单
        if (valid) {
          this.submitForm(
            this.$api.comment_reply,
            this.ruleForm
          );
          this.msg();
          this.push({name: 'rating'});
        } else {
          // console.log("error submit!!");
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

.rating-detail {
  @include title();

  .main-wrapper {
    padding: 37px 45px 0 45px;
    & > header {
      height: 170px;
      border-bottom: 1px solid rgba(220, 220, 220, 1);
      padding: 0 90px;
      .user-wrapper {
        display: flex;
        font-size: 16px;
        color: rgba(89, 87, 87, 1);
        .user-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-right: 93px;
          .user-img-wrapper {
            @include bg("../../assets/img/index/account-setting/avatar.png");
            width: 100px;
            height: 100px;
            border: 1px solid rgba(191, 191, 191, 1);
            border-radius: 50%;
            margin-bottom: 16px;
          }
          p {
            text-align: center;
          }
        }
        .rating-info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          p {
            display: flex;
          }
        }
      }
    }
    .comment-wrapper {
      padding: 20px 90px 40px 90px;
      border-bottom: 1px solid rgba(220, 220, 220, 1);
      & > header {
        display: flex;
        justify-content: flex-end;
        font-size: 14px;
        color: rgba(181, 181, 182, 1);
        line-height: 30px;
        & > span {
          margin: 0 10px;
        }
      }
      .comment-content {
        font-size: 16px;
        color: rgba(89, 87, 87, 1);
        line-height: 30px;
      }
      & > footer {
        display: flex;
        margin-top: 40px;
        .img-wrapper {
          width: 130px;
          height: 130px;
          border-radius: 4px;
          overflow: hidden;
          margin-right: 24px;
          &:last-child {
            margin: 0;
          }
          & > img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .reply-wrapper {
      padding: 38px 90px 40px 90px;
      & > p {
        font-size: 18px;
        font-weight: bold;
        color: rgba(89, 87, 87, 1);
        line-height: 30px;
      }
      .el-form-item {
        p {
          margin-top: 5px;
          font-size: 14px;
          color: rgba(159, 160, 160, 1);
          line-height: 22px;
        }
      }
    }
  }
}
</style>

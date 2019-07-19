<template>
  <div class="add-ad">
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
        label-width="200px"
        class="demo-ruleForm"
      >
        <el-form-item label="广告名称" prop="adName">
          <el-input v-model="ruleForm.adName" placeholder="请输入广告名称"/>
        </el-form-item>
        <el-form-item label="广告位置" prop="adPosition">
          <el-select v-model="ruleForm.adPosition" placeholder="请选择广告位置">
            <el-option
              v-for="item in typeList"
              :key="item.typeName"
              :label="item.typeName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否上线" prop="online">
          <el-radio-group v-model="ruleForm.online">
            <el-radio :label="true">上线</el-radio>
            <el-radio :label="false">下线</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="广告图片" prop="typeIcon">
          <img :src="ruleForm.adPicture" alt class="form-img" v-if="ruleForm.adPicture">
          <el-upload
            class="upload-demo"
            action="url"
            :http-request="uploadFile"
            accept="image/jpeg, image/png"
          >
            <el-button type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png格式文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="广告商品链接" prop="adLink">
          <el-autocomplete
            v-model="ruleForm.adLink"
            :fetch-suggestions="adLinkList"
            @select="handleAutocomplete"
            placeholder="请选择商品链接"
          />
        </el-form-item>
        <el-form-item label="广告备注" prop="remark">
          <el-input v-model="ruleForm.remark" type="textarea"/>
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
    return {
      isAdd: true,
      typeList: [
        { id: "1", typeName: "APP首页轮播" },
        { id: "2", typeName: "分类轮播" }
      ],
      inputVisible: false,
      inputValue: "",
      fileList: [],
      adLinkId: "",
      ruleForm: {
        adLink: "",
        adName: "",
        adPicture: "",
        adPosition: "",
        id: "",
        online: "",
        remark: ""
      },
      rules: {
        adName: [
          { required: true, message: "请输入广告名称", trigger: "blur" }
        ],
        adPosition: [
          { required: true, message: "请选择广告位置", trigger: "change" }
        ],
        online: [
          { required: true, message: "请选择是否上线", trigger: "change" }
        ],
        adLink: [
          { required: true, message: "请选择商品链接", trigger: "change" }
        ],
        remark: [{ required: true, message: "请输入广告备注", trigger: "blur" }]
      }
    };
  },
  created() {
    if (this.$route.query.adId) {
      this.isAdd = false;
      this.getFormData();
    } else {
      this.isAdd = true;
    }
  },
  computed: {
    titleTxt() {
      return this.isAdd ? "新增广告" : "修改广告";
    }
  },
  methods: {
    //获取data
    getFormData() {
      this.$axios({
        method: "post",
        url: this.$api.ad_detail,
        data: {
          id: this.$route.query.adId
        }
      })
        .then(res => {
          console.log(res);
          this.ruleForm = res.data.data;
          this.adLinkId2Name(res.data.data);
        })
        .catch(err => {
          this.msg(err, "error");
        });
    },
    // 上传图片 logo
    uploadFile(content) {
      this.uploadImg(content.file).then(res => {
        // console.log(res);
        this.ruleForm.adPicture = res.imgUrl;
      });
    },
    //广告链接(名称替换id)
    adLinkId2Name(data) {
      this.$axios({
        method: "post",
        url: this.$api.product_detail,
        data: {
          id: data.adLink
        }
      })
        .then(res => {
          // console.log(res);
          this.ruleForm.adLink = res.data.data.goodsName;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //广告商品链接
    adLinkList(queryStr, cb) {
      this.$axios({
        method: "post",
        url: this.$api.product_list,
        data: {
          currentPage: 1,
          pageSize: 100,
          goodsName: queryStr
        }
      }).then(res => {
        console.log(res);
        let arr = res.data.data;
        arr.forEach((val, index, arr) => {
          val.value = val.goodsName;
        });
        cb(arr);
      });
    },
    //广告链接选择
    handleAutocomplete($event) {
      // console.log($event);
      this.ruleForm.adLink = $event.goodsName;
      this.adLinkId = $event.id.toString();
    },

    //提交表单
    submitRuleForm(formName) {
      this.$refs[formName].validate(valid => {
        //先检验表单
        if (valid) {
          if (this.isAdd) {
            //判断是否新增
            this.submitForm(this.$api.ad_add, this.ruleForm, {
              adLink: this.adLinkId
            });
          } else {
            this.submitForm(this.$api.ad_update, this.ruleForm, {
              adLink: this.adLinkId
            });
          }
          this.msg("提交成功");
          setTimeout(() => {
            this.$router.back();
          }, 50);
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

.add-ad {
  @include title();

  .main-wrapper {
    padding: 37px 45px 0 45px;
    display: flex;
    justify-content: center;
    .el-form {
      .el-form-item {
        img {
          width: 200px;
        }
      }
    }
  }
}
</style>

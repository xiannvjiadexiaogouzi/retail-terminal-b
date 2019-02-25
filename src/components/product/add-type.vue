<template>
  <div class="add-property">
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
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="typeName">
          <el-input v-model="ruleForm.typeName" placeholder="请输入分类名称"/>
        </el-form-item>
        <el-form-item label="上级分类" prop="parentId">
          <el-select v-model="ruleForm.parentId" placeholder="请选择上级分类" :disabled="isAdd">
            <el-option
              v-for="item in typeList"
              :key="item.typeName"
              :label="item.typeName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数量单位" prop="goodsUnit">
          <el-input v-model="ruleForm.goodsUnit" placeholder="请输入数量单位"/>
        </el-form-item>
        <el-form-item label="排序" prop="goodsSort">
          <el-input v-model="ruleForm.goodsSort" type="number"/>
        </el-form-item>
        <el-form-item label="是否显示" prop="showStatus">
          <el-radio-group v-model="ruleForm.showStatus">
            <el-radio :label="0">显示</el-radio>
            <el-radio :label="1">不显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分类图标" prop="typeIcon">
          <img :src="ruleForm.typeIcon" alt v-if="ruleForm.typeIcon">
          <el-upload
            class="upload-demo"
            action="url"
            :http-request="uploadFile"
            accept="image/jpeg, image/png"
          >
            <el-button type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">图标尺寸为18*18比例，大小不能超过200KB，图片只能为jpg、png、gif格式</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="分类描述" prop="typeDesc">
          <el-input v-model="ruleForm.typeDesc" type="textarea"/>
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
      typeList: [{ id: 0, typeName: "顶级分类" }],
      inputVisible: false,
      inputValue: "",
      fileList: [],
      ruleForm: {
        id: "",
        parentId: "",
        goodsUnit: "",
        typeName: "",
        goodsSort: "",
        showStatus: 0,
        typeIcon: "",
        typeDesc: ""
      },
      rules: {
        typeName: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ],
        parentId: [
          { required: true, message: "请选择上级分类", trigger: "change" }
        ],
        showStatus: [
          { required: true, message: "请选择是否显示", trigger: "change" }
        ]
      }
    };
  },
  created() {
    if (this.$route.query.id) {
      this.isAdd = false;
      this.getFormData();
    } else {
      this.isAdd = true;
    }
    //分类数据
    this.ruleForm.parentId = this.$route.query.parentId;
    this.$axios("api/merchantGoodsType/query_goods_type_tree")
      .then(res => {
        // console.log(res);
        this.typeList = [...this.typeList, ...res.data.data];
      })
      .catch(err => {
        // console.log(err);
        this.msg(err, "error");
      });
  },
  computed: {
    titleTxt() {
      return this.isAdd ? "新增下级" : "修改该级";
    }
  },
  methods: {
    //获取data
    getFormData() {
      this.$axios({
        method: "post",
        url: "api/merchantGoodsType/merchant_goods_type_by_id",
        data: {
          id: this.$route.query.id
        }
      })
        .then(res => {
          // console.log(res);
          // this.ruleForm = res.data.data;
          this.ruleForm.id = res.data.data.id;
          this.ruleForm.typeName = res.data.data.typeName;
          this.ruleForm.parentId = res.data.data.parentId;
          this.ruleForm.goodsUnit = res.data.data.goodsUnit;
          this.ruleForm.goodsSort = res.data.data.goodsSort;
          this.ruleForm.showStatus = res.data.data.showStatus;
          this.ruleForm.typeIcon = res.data.data.typeIcon;
          this.ruleForm.typeDesc = res.data.data.typeDesc;
        })
        .catch(err => {
          // console.log(err);
          this.msg(err, "error");
        });
    },
    // 上传图片
    uploadFile(content) {
      this.uploadImg(content.file).then(res => {
        // console.log(res);
        this.ruleForm.typeIcon = res.imgUrl;
      });
    },
    //提交表单
    submitRuleForm(formName) {
      this.$refs[formName].validate(valid => {
        //先检验表单
        if (valid) {
          if (this.isAdd) {
            //判断是否新增
            this.submitForm(
              "api/merchantGoodsType/merchant_add_goods_type",
              this.ruleForm
            );
          } else {
            this.submitForm(
              "api/merchantGoodsType/merchant_goods_type_update",
              this.ruleForm
            );
          }
          this.msg();
          this.goBack();
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

.add-property {
  @include title();

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
    img {
      width: 180px;
      height: auto;
    }
  }
}
</style>

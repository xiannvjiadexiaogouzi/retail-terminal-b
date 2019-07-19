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
    <div class="main-wrapper">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="属性名称" prop="propertyName">
          <el-input v-model="ruleForm.propertyName" placeholder="请输入属性名称"/>
        </el-form-item>
        <el-form-item label="商品类型" prop="styleId">
          <el-select v-model="ruleForm.styleId" placeholder="请选择商品类型" :disabled="!isAdd">
            <el-option
              v-for="item in productTypes"
              :key="item.styleName"
              :label="item.styleName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="属性是否可选">
          <el-radio-group v-model="ruleForm.propertySelect" :disabled="!isAdd">
            <el-radio :label="0">唯一属性</el-radio>
            <el-radio :label="1">单选属性</el-radio>
            <el-radio :label="2">多选属性</el-radio>
          </el-radio-group>
          <p>选择"单选/复选属性"时，可以对商品该属性设置多个值，同时还能对不同属性值指定不同的价格加价，用户购买商品时需要选定具体的属性值。选择"唯一属性"时，商品的该属性值只能设置一个值，用户只能查看该值。</p>
        </el-form-item>
        <el-form-item label="属性值" prop="propertyList">
          <el-tag
            :key="tag"
            v-for="tag in propertyList"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >{{tag}}</el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新属性值</el-button>
        </el-form-item>
        <el-form-item label="属性排序" prop="proprtyOrder">
          <el-input v-model="ruleForm.propertyOrder" type="number"/>
          <p>排序级别最高的属性可单独上传属性图片</p>
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
    //校验this.propertyList
    let validPropertyList = (rule, value, callback) => {
      if (this.propertyList.length === 0) {
        callback(new Error("请添加属性值"));
      } else if (
        this.ruleForm.propertySelect == 0 &&
        this.propertyList.length > 1
      ) {
        callback(new Error("唯一属性只能添加一个属性值"));
      } else {
        callback();
      }
    };
    return {
      isAdd: true,
      productTypes: [],
      inputVisible: false,
      inputValue: "",
      propertyList: [], //先在this.propertyList里修改，再join()赋值给表单里的propertyList
      ruleForm: {
        id: 0,
        styleId: "",
        propertyName: "",
        propertyList: [],
        propertySelect: 0
      },
      rules: {
        propertyName: [
          { required: true, message: "请输入属性名称", trigger: "blur" }
        ],
        styleId: [
          { required: true, message: "请选择商品类型", trigger: "change" }
        ],
        propertyList: [
          {
            validator: validPropertyList,
            required: true,
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    if (this.$route.query.propertyId) {
      this.isAdd = false;
      this.getPropertyData();
    }
    //分类数据
    this.$axios(this.$api.style_list)
      .then(res => {
        console.log(res);
        this.productTypes = res.data;
      })
      .catch(err => {
        console.log(err);
      });
  },
  computed: {
    titleTxt() {
      return this.isAdd ? "添加属性" : "修改属性";
    }
  },
  methods: {
    //获取data
    getPropertyData() {
      this.$axios({
        method: "post",
        url: this.$api.property_detail,
        data: {
          id: this.$route.query.propertyId
        }
      })
        .then(res => {
          console.log(res);
          this.ruleForm.id = this.$route.query.propertyId;
          this.ruleForm.styleId = res.data.data.styleId;
          this.ruleForm.propertyName = res.data.data.propertyName;
          this.ruleForm.propertySelect = res.data.data.propertySelect;
          this.ruleForm.propertyOrder = res.data.data.propertyOrder;
          this.propertyList = res.data.data.propertyList;
        })
        .catch(err => {
          console.log(err);
        });
    },

    //关闭已有标签
    handleClose(tag) {
      this.propertyList.splice(this.propertyList.indexOf(tag), 1);
    },
    //显示新增标签input
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //新增标签
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.propertyList.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    //提交表单
    submitRuleForm(formName) {
      this.$refs[formName].validate(valid => {
        //先检验表单
        if (valid) {
          this.ruleForm.propertyList = this.propertyList.join();
          if (this.isAdd) {
            //判断是否新增属性
            this.submitForm(this.$api.property_add, this.ruleForm);
          } else {
            this.submitForm(this.$api.property_update, this.ruleForm);
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
    .el-tag + .el-tag {
      margin-left: 15px;
    }
    .button-new-tag {
      margin-left: 15px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      width: 90px;
      margin-left: 15px;
      vertical-align: bottom;
    }
  }
}
</style>

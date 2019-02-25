<template>
  <div class="add-property">
    <!-- 覆盖title -->
    <div class="view-title">
      <i class="view-title-before"/>
      <span class="title">{{titleTxt}}</span>
      <div class="refresh-btn" >
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
        <el-form-item label="参数名称" prop="paramName">
          <el-input v-model="ruleForm.paramName" placeholder="请输入参数名称"/>
        </el-form-item>
        <el-form-item label="商品类型" prop="styleId">
          <el-select v-model="ruleForm.styleId" placeholder="请选择商品类型">
            <el-option
              v-for="item in productTypes"
              :key="item.styleName"
              :label="item.styleName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="属性是否可选">
          <el-radio-group v-model="ruleForm.paramSelect" :disabled="!isAdd">
            <el-radio :label="0">唯一属性</el-radio>
            <el-radio :label="1">单选属性</el-radio>
            <el-radio :label="2">多选属性</el-radio>
          </el-radio-group>
          <p>选择"单选/复选属性"时，可以对商品该属性设置多个值，同时还能对不同属性值指定不同的价格加价，用户购买商品时需要选定具体的属性值。选择"唯一属性"时，商品的该属性值只能设置一个值，用户只能查看该值。</p>
        </el-form-item>
        <el-form-item label="属性值" prop="paramList">
          <el-tag
            :key="tag"
            v-for="tag in paramList"
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
        <el-form-item label="参数排序" prop="proprtySort">
          <el-input v-model="ruleForm.paramSort" type="number"/>
          <p>排序级别最高的参数可单独上传参数图片</p>
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
    //校验this.paramList
    let validParamList = (rule, value, callback) => {
      if (this.paramList.length === 0) {
        callback(new Error("请添加属性值"));
      } else if (this.ruleForm.paramSelect == 0 && this.paramList.length > 1) {
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
      paramList: [], //先在this.paramList里修改，再join()赋值给表单里的paramList
      ruleForm: {
        id: 0,
        styleId: "",
        paramName: "",
        paramList: [],
        paramSelect: 0
      },
      rules: {
        paramName: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ],
        styleId: [
          { required: true, message: "请选择商品类型", trigger: "change" }
        ],
        paramList: [
          {
            validator: validParamList,
            required: true,
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    if (this.$route.query.paramId) {
      this.isAdd = false;
      this.getparamData();
    }
    //分类数据
    this.$axios("api/merchantGoodsStyle/merchant_goods_type_list")
      .then(res => {
        // console.log(res);
        this.productTypes = res.data.data;
      })
      .catch(err => {
        this.msg(err, "error");
      });
  },
  computed: {
    titleTxt() {
      return this.isAdd ? "添加参数" : "修改参数";
    }
  },
  methods: {
    //获取data
    getparamData() {
      this.$axios({
        method: "post",
        url: "api/merchantGoodsParam/merchant_goods_type_by_id",
        data: {
          id: this.$route.query.paramId
        }
      })
        .then(res => {
          // console.log(res);
          this.ruleForm.id = this.$route.query.paramId;
          this.ruleForm.styleId = res.data.data.styleId;
          this.ruleForm.paramName = res.data.data.paramName;
          this.ruleForm.paramSelect = res.data.data.paramSelect;
          this.ruleForm.paramSort = res.data.data.paramSort;
          this.paramList = res.data.data.paramList.split(",");
        })
        .catch(err => {
          console.log(err);
        });
    },

    //关闭已有标签
    handleClose(tag) {
      this.paramList.splice(this.paramList.indexOf(tag), 1);
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
        this.paramList.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    //提交表单
    submitRuleForm(formName) {
      this.$refs[formName].validate(valid => {
        //先检验表单
        if (valid) {
          this.ruleForm.paramList = this.paramList.join();
          if (this.isAdd) {
            //判断是否新增参数
            this.submitForm(
              "api/merchantGoodsParam/merchant_goods_type_add",
              this.ruleForm
            );
          } else {
            this.submitForm(
              "api/merchantGoodsParam/merchant_goods_type_update",
              this.ruleForm
            );
          }
          this.msg();
          this.goBack();
        } else {
          this.msg('error submit!!','error')
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

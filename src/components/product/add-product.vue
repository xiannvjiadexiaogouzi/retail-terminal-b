<template>
  <div class="add-product">
    <header>
      <el-steps :active="step" align-center>
        <el-step title="步骤1" description="选择商品分类"/>
        <el-step title="步骤2" description="填写商品信息"/>
        <el-step title="步骤3" description="填写商品属性"/>
        <el-step title="步骤4" description="选择商品关联"/>
      </el-steps>
    </header>
    <div class="step" v-if="step==1">
      <div class="small-step">
        <div class="tag">基本信息</div>
        <div class="select-info-wrapper">
          <div class="select-info">
            <ul class="select-table">
              <div class="title">选择一级分类</div>
              <li
                v-for="item in firstTypeList"
                :key="item.id"
                :value="item.id"
                @click="selectFirstType(item.id, item.list, item.typeName)"
                :class="ruleForm.typeId == item.id ? 'active' : ''"
              >
                {{item.typeName}}
                <i class="el-icon-arrow-right"/>
              </li>
            </ul>
            <div class="arrow-png"/>
            <ul class="select-table">
              <div class="title">选择二级分类</div>
              <li
                v-for="(item,index) in secondTypeList"
                :key="index"
                @click="selectSecondType(item)"
                :class="ruleForm.childId == item.id ? 'active' : ''"
              >{{item.typeName}}</li>
            </ul>
          </div>
          <div class="confirm-info">
            您当前选择的商品是：
            <span v-if="!ruleForm.typeId">未选择一级分类</span>
            <span>{{ruleForm.typeName}}</span>
            <span v-if="ruleForm.childName">&nbsp;> {{ruleForm.childName}}</span>
          </div>
          <div class="btn-row">
            <el-button type="primary" @click="step1to2">下一步,选择商品关联</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="step" v-if="step==2">
      <div class="small-step">
        <div class="tag">基本信息</div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="商品分类" prop="type">
            <div>{{ruleForm.typeName}}>{{ruleForm.childName}}</div>
          </el-form-item>
          <el-form-item label="商品名称" prop="goodsName">
            <el-input v-model="ruleForm.goodsName"/>
          </el-form-item>
          <el-form-item label="副标题" prop="goodsSubtitle">
            <el-input v-model="ruleForm.goodsSubtitle"/>
          </el-form-item>
          <el-form-item label="商品品牌" prop="brandId">
            <el-select v-model="ruleForm.brandId" placeholder="请选择品牌">
              <el-option
                v-for="item in brandList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="商品介绍" prop="goodsDesc">
            <el-input type="textarea" v-model="ruleForm.goodsDesc"/>
          </el-form-item>
          <el-form-item label="商品货号" prop="goodsNo">
            <el-input v-model="ruleForm.goodsNo" placeholder/>
            <p class="form-tips">如果您不输入商品货号，系统将自动生成一个唯一的货号</p>
          </el-form-item>
          <el-form-item label="商品售价" prop="goodsPrice">
            <el-input v-model="ruleForm.goodsPrice" type="number"/>
          </el-form-item>
          <el-form-item label="市场价" prop="marketPrice">
            <el-input v-model="ruleForm.marketPrice" type="number"/>
          </el-form-item>
          <el-form-item label="商品库存" prop="goodsStock">
            <el-input v-model="ruleForm.goodsStock" type="number"/>
            <p class="form-tips">该设置只对单品有效，当商品存在多规格货品时为不可编辑状态，库存数值取决于货品数量</p>
          </el-form-item>
          <el-form-item label="库存预警值" prop="goodsWarning">
            <el-input v-model="ruleForm.goodsWarning" type="number"/>
          </el-form-item>
          <el-form-item label="计量单位" prop="goodsUnit">
            <el-input v-model="ruleForm.goodsUnit"/>
          </el-form-item>
          <el-form-item label="商品重量" prop="goodsWeight">
            <el-input v-model="ruleForm.goodsWeight"/>
          </el-form-item>
          <el-form-item>
            <el-button @click="step--">上一步,选择商品分类</el-button>
            <el-button type="primary" @click="step2to3('ruleForm')">下一步,填写商品属性</el-button>
          </el-form-item>
          <!-- <el-form-item label="运费模版" prop="expense">
            <el-select v-model="value" placeholder="请选择品牌">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="small-step">
        <div class="tag">库存规格</div>
        <el-form
          :model="basicInfo"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="商品货号" prop="type">
            <el-input v-model="basicInfo.name"/>
            <p>如果您不输入商品货号，系统将自动生成一个唯一的货号</p>
          </el-form-item>
          <el-form-item label="商品售价" prop="name">
            <el-input v-model="basicInfo.name"/>
          </el-form-item>
          <el-form-item label="市场价" prop="subName">
            <el-input v-model="basicInfo.subName"/>
          </el-form-item>
          <el-form-item label="商品库存" prop="brand">
            <el-input type="number" v-model="basicInfo.name"/>
            <p>该设置只对单品有效，当商品存在多规格货品时为不可编辑状态，库存数值取决于货品数量</p>
          </el-form-item>
          <el-form-item label="库存预警值" prop="introduction">
            <el-input type="number" v-model="basicInfo.name"/>
          </el-form-item>
          <el-form-item label="计量单位" prop="expense">
            <el-input v-model="basicInfo.name"/>
          </el-form-item>
          <el-form-item label="商品重量" prop="introduction">
            <el-input type="number" v-model="basicInfo.name"/>
          </el-form-item>-->
        </el-form>
      </div>
      <!-- <div class="small-step">
        <div class="tag">其他信息</div>
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="预告商品">
            <el-switch v-model="form.delivery"/>
            <p>如果设置为预告商品，商品上架和商品推荐不可用</p>
          </el-form-item>
          <el-form-item label="商品上架">
            <el-switch v-model="form.delivery"/>
          </el-form-item>
          <el-form-item label="商品推荐">
            <el-checkbox-group v-model="form.type">
              <el-checkbox label="新品" name="type"/>
              <el-checkbox label="推荐" name="type"/>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="服务保证">
            <el-checkbox-group v-model="form.type">
              <el-checkbox label="无忧退货" name="type"/>
              <el-checkbox label="快速退款" name="type"/>
              <el-checkbox label="包邮免费" name="type"/>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="详细页标题">
            <el-input v-model="basicInfo.name"/>
          </el-form-item>
          <el-form-item label="详细页描述">
            <el-input v-model="basicInfo.name"/>
          </el-form-item>
          <el-form-item label="商品关键词">
            <el-input v-model="basicInfo.name"/>
          </el-form-item>
          <el-form-item label="商品备注">
            <el-input type="textarea" v-model="basicInfo.name"/>
          </el-form-item>
        </el-form>
      </div>
      <div class="small-step">
        <div class="tag">特殊信息</div>
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="特惠促销">
            <el-radio-group v-model="form.resource">
              <el-radio label="是"/>
              <el-radio label="否"/>
            </el-radio-group>
            <div class="row">
              <el-date-picker
                type="date"
                placeholder="选择开时间"
                v-model="form.date1"
                style="width: 100%;"
              />
              <el-date-picker
                type="date"
                placeholder="选择结束时间"
                v-model="form.date1"
                style="width: 100%;"
              />
              <el-input v-model="basicInfo.name"/>
            </div>
          </el-form-item>
          <el-form-item label="商品限购">
            <el-radio-group v-model="form.resource">
              <el-radio label="是"/>
              <el-radio label="否"/>
            </el-radio-group>
            <div class="row">
              <el-date-picker
                type="date"
                placeholder="选择开时间"
                v-model="form.date1"
                style="width: 100%;"
              />
              <el-date-picker
                type="date"
                placeholder="选择结束时间"
                v-model="form.date1"
                style="width: 100%;"
              />
              <el-input v-model="basicInfo.name"/>
            </div>
          </el-form-item>
          <el-form-item label="阶梯价格">
            <el-radio-group v-model="form.resource">
              <el-radio label="是"/>
              <el-radio label="否"/>
            </el-radio-group>
            <table>
              <tr>
                <th>数量</th>
                <th>价格</th>
                <th>操作</th>
              </tr>
              <tr>
                <td>
                  <el-input type="number" v-model="basicInfo.name"/>
                </td>
                <td>
                  <el-input type="number" v-model="basicInfo.name"/>
                </td>
                <td>
                  <span>删除</span>
                  <span>添加</span>
                </td>
              </tr>
            </table>
          </el-form-item>
          <el-form-item label="满减价格">
            <el-radio-group v-model="form.resource">
              <el-radio label="是"/>
              <el-radio label="否"/>
            </el-radio-group>
            <table>
              <tr>
                <th>满</th>
                <th>立减</th>
                <th>操作</th>
              </tr>
              <tr>
                <td>
                  <el-input type="number" v-model="basicInfo.name"/>
                </td>
                <td>
                  <el-input type="number" v-model="basicInfo.name"/>
                </td>
                <td>
                  <span>删除</span>
                  <span>添加</span>
                </td>
              </tr>
            </table>
          </el-form-item>
        </el-form>
      </div>-->
      <!-- <div class="btn-row">
        <div class="btn" @click="step2to1">下一步，填写商品分类</div>
        <div class="nxt btn" @click="step1to2">下一步，填写商品属性</div>
      </div>-->
    </div>
    <div class="step" v-if="step==3">
      <div class="small-step">
        <div class="tag">商品属性</div>
        <el-form :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-form-item label="商品类型">
            <el-select
              v-model="ruleForm.styleId"
              :disabled="!isAdd"
              placeholder="请选择商品类型"
              @change="getProp"
            >
              <el-option
                v-for="item in styleList"
                :label="item.styleName"
                :value="item.id"
                :key="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="商品规格" v-if="propList.length > 0">
            <div class="prop-wrapper">
              <el-checkbox-group
                v-model="selectedProp"
                v-for="(item,index) in propList"
                :key="index"
              >
                <div class="prop-name">{{item.name}}</div>
                <el-checkbox
                  v-for="(subItem,index) in item.list"
                  :label="item.name + subItem"
                  :key="index"
                  :disabled="!isAdd"
                  @change="handleSelectedProp(item.name,subItem,$event)"
                >{{subItem}}</el-checkbox>
              </el-checkbox-group>
              <div>
                <el-button type="primary" @click="addProp">添加</el-button>
              </div>
            </div>
          </el-form-item>
          <table v-if="ruleForm.merchantGoodsTypePropertyList.length">
            <thead>
              <td v-for="item in selectedPropName" :key="item">{{item}}</td>
              <td>销售价格</td>
              <td>商品库存</td>
              <td>库存预警值</td>
            </thead>
            <tbody>
              <tr v-for="(item,index) in ruleForm.merchantGoodsTypePropertyList" :key="index">
                <td v-for="(el,index) in item.nameValue" :key="index">{{el.value}}</td>
                <td>
                  <el-input
                    v-model="item.goodsSalePrice"
                    size="mini"
                    type="number"
                    :max="99999"
                    :min="0"
                  />
                </td>
                <td>
                  <el-input
                    v-model="item.goodsStock"
                    size="mini"
                    type="number"
                    :max="99999"
                    :min="0"
                  />
                </td>
                <td>
                  <el-input
                    v-model="item.stockWarning"
                    size="mini"
                    type="number"
                    :max="99999"
                    :min="0"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </el-form>
      </div>
      <div class="small-step">
        <div class="tag">参数类型</div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item
            v-for="(item,index) in ruleForm.merchantParamDetailIds.merchantParamDetails"
            :label="item.paramDetailName"
            prop
            :key="index"
          >
            <el-select
              v-model="ruleForm.merchantParamDetailIds.merchantParamDetails[index].specificationsValue"
              placeholder="请选择商品参数"
            >
              <el-option
                v-for="el in handleParamList(paramSelectList[index].paramList)"
                :label="el"
                :value="el"
                :key="el"
                :disabled="el==='无参数'"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="主含材量" prop="mainMaterial">
            <el-input v-model="ruleForm.merchantParamDetailIds.mainMaterial"/>
          </el-form-item>
          <el-form-item label="使用对象" prop="paramObject">
            <el-input v-model="ruleForm.merchantParamDetailIds.paramObject"/>
          </el-form-item>
        </el-form>
      </div>
      <div class="small-step">
        <div class="tag">商品相册</div>
        <!-- <div class="upload-wrapper">
          <upload />
        </div>-->
        <div class="upload-wrapper">
          <dir class="pic-list">
            <div class="pic-wrapper" v-for="(pic,index) in imgList" :key="index">
              <img :src="pic" alt>
              <div>
                <span class="red" v-if="index == 0">商品主图</span>
                <span class="operation" v-if="index !== 0" @click="mainImg(pic,index)">设为主图</span>
                <span class="operation" @click="delImg(index)">删除图片</span>
              </div>
            </div>
          </dir>
          <el-upload
            class="upload-demo"
            action="url"
            :http-request="uploadFile"
            accept="image/jpeg, image/png"
          >
            <el-button type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">最多可以上传5张图片，建议尺寸800*800px</div>
          </el-upload>
          <div class="album-btn">
            <el-button type="primary" @click="dialogVisible=true" native-type="button">从图片库选择</el-button>
          </div>
        </div>
      </div>
      <div class="small-step">
        <div class="tag">商品详情</div>
        <!-- <div class="editor-wrapper"> -->
        <quill-editor ref="myTextEditor" v-model="ruleForm.goodsMobileImg"></quill-editor>
        <!-- </div> -->
      </div>
      <div class="btn-row">
        <el-button @click="step--">上一步,填写商品信息</el-button>
        <el-button type="primary" @click="step3to4">下一步,选择商品关联</el-button>
      </div>
    </div>
    <div class="step" v-if="step==4">
      <div class="small-step">
        <div class="tag">关联类目</div>
        <div class="select-info-wrapper">
          <div class="select-info">
            <ul class="select-table">
              <div class="title">选择一级类目</div>
              <li
                v-for="item in navList"
                :key="item.id"
                :value="item.id"
                @click="selectFirstNav(item.id, item.list, item.typeName)"
                :class="ruleForm.navId == item.id ? 'active' : ''"
              >
                {{item.navName}}
                <i class="el-icon-arrow-right"/>
              </li>
            </ul>
            <div class="arrow-png"/>
            <ul class="select-table">
              <div class="title">选择二级类目</div>
              <li
                v-for="(item,index) in childNavList"
                :key="index"
                @click="selectSecondNav(item)"
                :class="ruleForm.navChildId == item.id ? 'active' : ''"
              >{{item.navName}}</li>
            </ul>
          </div>
          <div class="confirm-info">* 类目非必选 | 选了一级类目必须选择二级类目</div>
          <div class="btn-row">
            <el-button @click="step--">上一步,填写商品属性</el-button>
            <el-button type="primary" @click="submitRuleForm('ruleForm')">完成,提交商品</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 从图片库选择 -->
    <el-dialog title="从图片库选择" :visible.sync="dialogVisible" width>
      <p class>
        <span>商品图库 > {{albumName}}</span>
        <el-select v-model="album" @change="getAlbum">
          <el-option
            v-for="item in galleries"
            :key="item.name"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </p>
      <div class="product-list-wrapper">
        <!-- 表格本体 -->
        <div class="main-table">
          <span v-if="tableData.length == 0">请先选择相册</span>
          <el-checkbox-group v-model="checkList">
            <div v-for="item in tableData" :key="item.id" class="check-item">
              <img :src="item.imgUrl" alt>
              <div class="item-operation">
                <el-checkbox :label="item.imgUrl"/>
              </div>
            </div>
          </el-checkbox-group>
        </div>
        <!-- 表格批量操作+页码 -->
        <footer>
          <div class="select-all-wrapper"/>
          <div class="pagination-wrapper">
            <pagination
              :totalPage="totalPage"
              :dataCount="dataCount"
              :pageSize="pageSize"
              :currentPage="currentPage"
              @pageChange="pageChange"
            />
          </div>
        </footer>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="selectAlbumImg">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixin from "@/util/mixin.js";
import Pagination from "../common/pagination";
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

export default {
  mixins: [mixin], //vue 混入
  components: {
    quillEditor,
    Pagination
  },
  data() {
    let checkNum = function(rule, value, callback) {
      // if(!value){
      //   return callback(new Error("请输入对应值"));
      // }else
      if (value < 0) {
        return callback(new Error("该值不能小于0"));
      } else if (value > 99999) {
        return callback(new Error("该值最大为99999"));
      }
      callback();
    };
    return {
      isAdd: true,
      step: 1,
      firstTypeList: [],
      secondTypeList: [],
      nowFirstType: "",
      nowSecondType: "",
      brandList: [],
      styleList: [],
      propList: [],
      selectedProp: [],
      selectedPropList: [],
      selectedPropName: [],
      tableProp: [],
      paramSelectList: [],
      galleries: [], //相册列表 selector
      checkList: [], //勾选的相册照片
      dialogVisible: false,
      album: "", //相册id selector
      albumName: "", //当前相册名
      imgList: [], //展示商品图片
      navList: [], //一级类目列表
      childNavList: [], //二级类目列表
      ruleForm: {
        //step1
        typeId: "", //一级分类
        typeName: "",
        childId: "", //二级分类
        childName: "",
        //step2
        goodsName: "",
        goodsSubtitle: "",
        brandId: "",
        goodsDesc: "",
        goodsNo: "",
        goodsImg: "",
        goodsPrice: "",
        marketPrice: "",
        goodsStock: "",
        goodsWarning: "",
        goodsUnit: "",
        goodsWeight: "",
        //step3
        styleId: "",
        styleName: "",
        navId: "", //一级类目
        navChildId: "", //二级类目
        merchantGoodsTypePropertyList: [], //prop 属性
        merchantParamDetailIds: {
          //param 参数
          merchantParamDetails: [],
          mainMaterial: "", //主含材料
          paramObject: "" //适用对象
        },
        merchantSpecifications: "",
        goodsMobileImg: "" //商品详情
      },
      rules: {
        //step2
        goodsName: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { max: 20, message: "长度必须小于20个字符", trigger: "blur" }
        ],
        goodsSubtitle: [
          { required: true, message: "请输入副标题", trigger: "blur" },
          { max: 20, message: "长度必须小于20个字符", trigger: "blur" }
        ],
        brandId: [{ required: true, message: "请选择品牌", trigger: "change" }],
        goodsDesc: [
          { required: true, message: "请输入商品介绍", trigger: "blur" }
        ],
        goodsPrice: [
          { required: true, message: "请输入商品售价", trigger: "blur" },
          { validator: checkNum, trigger: "blur" }
        ],
        goodsStock: [
          { required: true, message: "请输入商品库存", trigger: "blur" },
          { validator: checkNum, trigger: "blur" }
        ],
        goodsWarning: [
          { required: true, message: "请输入库存预警值", trigger: "blur" },
          { validator: checkNum, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.isAdd = this.$route.query.id ? false : true;
    this.getStep0Data();
    this.getStep1Data();
    this.getStep2Data();
    this.getStep4Data();
    if (!this.isAdd) {
      this.getProduct();
    }
  },
  computed: {},
  methods: {
    //编辑商品进入
    getProduct() {
      this.$axios({
        method: "post",
        url: "api//merchantGoods/merchant_goods_by_id",
        data: {
          id: this.$route.query.id
        }
      })
        .then(res => {
          // console.log(res);
          this.ruleForm = res.data.data;
          //调整step0 一级、二级分类
          this.$nextTick(() => {
            this.firstTypeList.forEach(item => {
              if (item.id === this.ruleForm.typeId) {
                this.secondTypeList = item.list;
                return;
              }
            });
            //调整step4 关联类目
            this.navList.forEach(item => {
              if (item.id === this.ruleForm.navId) {
                this.childNavList = item.list;
                return;
              }
            });
          });
          //调整selectedPropName
          res.data.data.merchantGoodsTypePropertyList[0].nameValue.forEach(
            item => {
              if (this.selectedPropName.indexOf(item.name) === -1) {
                this.selectedPropName.push(item.name);
              }
            }
          );
          //获取paramSelectList
          this.getParam(res.data.data.styleId);
          //获取goodsImg
          this.imgList = res.data.data.goodsImg.split(",");
        })
        .catch(err => {
          // console.log(err);
          this.msg(err, 'error');
        });
    },
    // 一级、二级分类（step0）
    getStep0Data() {
      this.$axios({
        method: "post",
        url: "api/merchantGoodsType/query_goods_type_tree"
      })
        .then(res => {
          // console.log(res);
          this.firstTypeList = res.data.data;
        })
        .catch(err => {
          this.msg(err, 'error');
        });
    },
    // 商品品牌（step1）
    getStep1Data() {
      this.$axios({
        method: "post",
        url: "api/merchant_goods_brand/query_list"
      })
        .then(res => {
          // console.log(res);
          this.brandList = res.data.data;
        })
        .catch(err => {
          this.msg(err, 'error');
        });
    },
    //step2
    getStep2Data() {
      //商品类型
      this.$axios({
        method: "post",
        url: "api/merchantGoodsStyle/merchant_goods_style_list_page",
        data: {
          currentPage: 1,
          pageSize: 100
        }
      })
        .then(res => {
          // console.log(res);
          this.styleList = res.data.data.list;
        })
        .catch(err => {
          this.msg(err, 'error');
        });
      //图片
      this.$axios({
        method: "post",
        url: "api/merchant_goods_galleries/query_for_page",
        data: {
          currentPage: 1,
          pageSize: 100
        }
      })
        .then(res => {
          // console.log(res);
          this.galleries = res.data.data.list;
        })
        .catch(err => {
          this.msg(err, 'error');
        });
    },
    //获取规格 & param
    getProp($val) {
      this.selectedProp = [];
      this.selectedPropList = [];
      this.ruleForm.merchantGoodsTypePropertyList = [];
      this.tableProp = [];
      this.paramSelectList = [];
      this.ruleForm.merchantParamDetailIds.merchantParamDetails = [];
      //获得规格
      this.$axios({
        method: "post",
        url: "api/merchantGoodsProperty/merchant_goods_property_list_page",
        data: {
          styleId: $val,
          currentPage: 1,
          pageSize: 100
        }
      })
        .then(res => {
          // console.log(res);
          let list = [];
          res.data.data.list.map(item => {
            list.push({
              name: item.propertyName,
              list: item.propertyList.split(",")
            });
          });
          this.propList = list;
        })
        .catch(err => {
          this.msg(err, 'error');
        });
      //获得param
      this.getParam($val);
    },
    //获得param
    getParam($val) {
      this.$axios({
        method: "post",
        url: "api/merchantGoodsParam/merchant_goods_property_list_page",
        data: {
          styleId: $val,
          currentPage: 1,
          pageSize: 100
        }
      })
        .then(res => {
          // console.log(res);
          if (this.isAdd) {
            this.handleParam(res.data.data.list);
          }
          //可能出现已有商品无对应参数列表
          if (res.data.data.list.length) {
            this.paramSelectList = res.data.data.list;
          } else {
            this.ruleForm.merchantParamDetailIds.merchantParamDetails.forEach(
              item => {
                this.paramSelectList.push({ paramList: "无参数" });
              }
            );
          }
        })
        .catch(err => {
          this.msg(err, 'error');
        });
    },
    //获取相册图片
    getAlbum($val) {
      this.checkList = [];
      this.galleries.forEach(item => {
        if (item.id == $val) {
          this.albumName = item.name;
          return;
        }
      });
      this.$axios({
        method: "post",
        url: "api/merchant_goods_galleries_detail/query_for_page",
        data: {
          galleriesId: $val,
          currentPage: this.currentPage,
          pageSize: this.pageSize
        }
      }).then(res => {
        // console.log(res);
        this.tableData = res.data.data.list;
        this.totalPage = res.data.data.totalPage;
        this.currentPage = res.data.data.currentPage;
        this.dataCount = res.data.data.totalCount;
      });
    },
    //获取关联类目 step4
    getStep4Data() {
      this.$axios({
        method: "post",
        url: "api/merchantNavigation/query_navigation_type_tree"
      })
        .then(res => {
          // console.log(res);
          this.navList = res.data.data;
        })
        .catch(err => {
          // console.log(err);
        });
    },
    //规格结果
    handleSelectedProp(prop, subprop, e) {
      if (e) {
        if (!this.selectedPropList.length) {
          this.selectedPropList.push({ name: prop, value: [subprop] });
        } else {
          let exist = false;
          this.selectedPropList.forEach(item => {
            if (item.name === prop) {
              item.value.push(subprop);
              exist = true;
            }
          });
          if (!exist) {
            this.selectedPropList.push({ name: prop, value: [subprop] });
          }
        }
      } else {
        this.selectedPropList.forEach(item => {
          if (item.name === prop) {
            item.value = item.value.filter(el => {
              return el !== subprop;
            });
          }
        });
      }
    },
    // 添加规格
    addProp() {
      this.ruleForm.merchantGoodsTypePropertyList = [];
      this.tableProp = [];
      this.selectedPropName = [];
      //先处理数据 -> [[1,2,...],[a,b,...],...]
      this.selectedPropList.forEach(item => {
        if (item.value.length) {
          this.tableProp.push(item.value);
          this.selectedPropName.push(item.name);
        }
      });
      //排序数据成表格横向
      // console.log(this.tableProp);
      let trProp = this.sortArr(this.tableProp);
      //构成nameValue -> [{name:'',value:''},...]
      let nameValueList = [];
      trProp = trProp.map(item => {
        return item instanceof Array ? item : [item];
      });
      trProp.forEach(item => {
        let nameValueItem = [];
        for (let i = 0, len = item.length; i < len; i++) {
          nameValueItem.push({
            name: this.selectedPropName[i],
            value: item[i]
          });
        }
        nameValueList.push(nameValueItem);
      });
      // console.log(nameValueList);
      nameValueList.forEach(item => {
        this.ruleForm.merchantGoodsTypePropertyList.push({
          nameValue: item instanceof Array ? item : [item],
          goodsSalePrice: "",
          goodsStock: "",
          stockWarning: ""
        });
      });
    },
    //排序成表格横向数据
    sortArr(arr) {
      // arr = [[1,2,...],[a,b,...],...]
      let len = arr.length;
      //判断是否len>=2
      if (len >= 2) {
        let len1 = arr[0].length;
        let len2 = arr[1].length;
        // let row = len1 * len2;
        let ary = [];
        let index = 0;
        for (let i = 0; i < len1; i++) {
          for (let j = 0; j < len2; j++) {
            //判断arr[0][i]是不是arr
            if (arr[0][i] instanceof Array) {
              //此时arr[0][i]是arr, arr[1][j]不是arr
              ary[index] = [...arr[0][i], arr[1][j]];
            } else {
              ary[index] = [arr[0][i], arr[1][j]];
            }
            index++;
          }
        }
        let nxtArr = [ary];
        for (let i = 1; i < len - 1; i++) {
          nxtArr[i] = arr[i + 1];
        }
        return this.sortArr(nxtArr);
      } else {
        return arr[0];
      }
    },
    //处理param
    handleParam(data) {
      let len = data.length;
      for (let i = 0; i < len; i++) {
        this.ruleForm.merchantParamDetailIds.merchantParamDetails.push({
          paramDetailName: data[i].paramName,
          specificationsValue: ""
        });
      }
    },
    handleParamList(val) {
      return val.split(",");
    },
    //选择一级分类
    selectFirstType(id, list, name) {
      this.ruleForm.typeId = id;
      this.ruleForm.typeName = name;
      this.ruleForm.childName = "";
      this.ruleForm.childId = "";
      this.secondTypeList = list;
    },
    selectSecondType(list) {
      this.ruleForm.childId = list.id;
      this.ruleForm.childName = list.typeName;
      this.nowSecondType = list;
    },
    // 上传图片
    uploadFile(content) {
      if (this.imgList.length >= 5) {
        this.msg("最多上传5张图片", "error");
      } else {
        this.uploadImg(content.file).then(res => {
          // console.log(res);
          this.imgList.push(res.imgUrl);
        });
      }
    },
    //选择相册图片
    selectAlbumImg() {
      if (this.imgList.length + this.checkList.length > 5) {
        this.msg("最多上传5张图片", "error");
      } else {
        this.checkList.forEach(url => {
          this.imgList.push(url);
        });
        this.dialogVisible = false;
      }
    },
    //设为主图
    mainImg(pic, index) {
      this.imgList.splice(index, 1);
      this.imgList.unshift(pic);
    },
    //删除图片
    delImg(index) {
      this.imgList.splice(index, 1);
    },
    //选择一级类目
    selectFirstNav(id, list, name) {
      this.ruleForm.navId = id;
      this.childNavList = list;
    },
    selectSecondNav(list) {
      this.ruleForm.navChildId = list.id;
    },
    //下一页
    step1to2() {
      if (!this.ruleForm.typeId) {
        this.msg("请选择分类", "error");
      } else {
        this.step++;
      }
    },
    step2to3() {
      if (this.ruleForm.goodsStock < this.ruleForm.goodsWarning) {
        this.msg("库存预警大于商品库存", "error");
        return;
      }
      this.$refs.ruleForm.validate(valid => {
        //先检验表单
        if (valid) {
          this.step++;
        }
      });
    },
    step3to4() {
      //先检验表单
      if (!this.ruleForm.styleId) {
        this.msg("请选择商品类型", "error");
        return;
      }
      if (!this.ruleForm.merchantGoodsTypePropertyList.length) {
        this.msg("请添加商品规格", "error");
        return;
      }
      let prop = this.ruleForm.merchantGoodsTypePropertyList;
      for (let i = 0, len = prop.length; i < len; i++) {
        if (
          !prop[i].goodsSalePrice ||
          !prop[i].goodsStock ||
          !prop[i].stockWarning
        ) {
          this.msg("请填写规格列表", "error");
          return;
        }
        if (
          prop[i].goodsSalePrice < 0 ||
          prop[i].goodsStock < 0 ||
          prop[i].stockWarning < 0
        ) {
          this.msg("规格列表数值不能小于0", "error");
          return;
        }
        if (
          prop[i].goodsSalePrice > 99999 ||
          prop[i].goodsStock > 99999 ||
          prop[i].stockWarning > 99999
        ) {
          this.msg("规格列表数值最大为99999", "error");
          return;
        }
        if (prop[i].goodsStock < prop[i].stockWarning) {
          this.msg("库存预警大于商品库存", "error");
          return;
        }
      }
      if (!this.ruleForm.merchantParamDetailIds.mainMaterial) {
        this.msg("请填写主含材料", "error");
        return;
      }
      if (!this.ruleForm.merchantParamDetailIds.paramObject) {
        this.msg("请填写适用对象", "error");
        return;
      }
      let param = this.ruleForm.merchantParamDetailIds.merchantParamDetails;
      for (let i = 0, len = param.length; i < len; i++) {
        if (!param[i].specificationsValue) {
          this.msg("请选择" + param[i].paramDetailName + "参数", "error");
          return;
        }
      }
      if (!this.imgList.length) {
        this.msg("请上传商品图片", "error");
        return;
      }
      this.step++;
    },
    //提交表单
    submitRuleForm(formName) {
      if (this.ruleForm.navId && !this.ruleForm.navChildId) {
        this.msg("选了一级类目必须选择二级类目", "error");
        return;
      }
      this.ruleForm.goodsImg = this.imgList.join(",");
      this.ruleForm.merchantSpecifications = this.selectedPropList;
      let data = JSON.parse(JSON.stringify(this.ruleForm));
      if (this.isAdd) {
        //判断是否新增
        this.submitForm("api/merchantGoods/merchant_goods_add", data);
      } else {
        this.submitForm("api/merchantGoods/merchant_goods_update", data);
      }
      this.msg();
      this.goBack();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/mixin.scss";

div.add-product {
  & > header {
    margin-bottom: 70px;
  }
  div.step {
    .small-step {
      display: flex;
      margin-top: 60px;
      &:first-child {
        margin: 0;
      }
      .tag {
        width: 100px;
        height: 50px;
        background: rgba(91, 192, 191, 1);
        line-height: 50px;
        color: white;
        padding-left: 20px;
        position: relative;
        margin-right: 30px;
        &:after {
          content: "";
          display: block;
          height: 0;
          width: 0;
          border-top: 25px solid transparent;
          border-left: 25px solid rgba(91, 192, 191, 1);
          border-right: 25px solid transparent;
          border-bottom: 25px solid transparent;
          position: absolute;
          top: 0;
          left: 100px;
        }
      }
      .select-info-wrapper {
        .select-info {
          display: flex;
          margin-bottom: 34px;
          .arrow-png {
            width: 50px;
            height: 36px;
            margin: auto 30px auto 35px;
            @include bg("../../assets/img/product/add-product/next.png");
          }
          .select-table {
            width: 350px;
            height: 387px;
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(220, 220, 220, 1);
            border-radius: 4px;
            .title {
              width: 100%;
              height: 48px;
              line-height: 48px;
              border-bottom: 1px solid rgba(220, 220, 220, 1);
              font-size: 18px;
              font-weight: bold;
              color: rgba(136, 136, 136, 1);
              padding: 0 24px;
            }
            & > li {
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 100%;
              height: 48px;
              line-height: 48px;
              border-bottom: 1px solid rgba(220, 220, 220, 1);
              padding: 0 24px;
              font-size: 16px;
              color: rgba(136, 136, 136, 1);
              & > i {
                display: inline-block;
              }
              &:hover {
                background: rgba(247, 247, 247, 1);
                color: $rule-blue;
              }
            }
            .active {
              background: rgba(247, 247, 247, 1);
              color: $rule-blue;
            }
          }
        }
        .confirm-info {
          font-size: 16px;
          color: rgba(136, 136, 136, 1);
          & span {
            color: $rule-blue;
          }
        }
        .nxt-btn {
          margin: 50px auto 0 auto;
          width: 204px;
          height: 38px;
          // line-height: 38px;
          // text-align: center;
          // background: rgba(91, 192, 191, 1);
          border-radius: 4px;
          font-size: 16px;
          color: rgba(255, 255, 255, 1);
        }
      }
      //step2-3
      .el-form {
        .prop-wrapper {
          padding: 0 20px;
          width: 364px;
          border-radius: 4px;
          border: 1px solid rgba(191, 191, 191, 1);
          .prop-name {
            font-weight: 900;
            color: #595757;
          }
          .el-button {
            width: 50px;
            height: 30px;
            line-height: 20px;
            padding: 0;
            font-size: 14px;
          }
        }
        p {
          font-size: 14px;
          color: rgba(159, 160, 160, 1);
        }
        table {
          border: 1px solid rgba(191, 191, 191, 1);
          margin-left: 30px;
          width: 100%;
          text-align: center;
          thead {
            background: rgba(239, 239, 239, 1);
            td {
              padding: 0 20px;
            }
          }
          td {
            padding: 0 5px;
            height: 50px;
            line-height: 50px;
            border: 1px solid rgba(191, 191, 191, 1);
          }
        }
      }
      //上传图片
      .upload-wrapper {
        margin-left: 20px;
        position: relative;
        .pic-list {
          margin: 0;
          padding: 0;
          display: flex;
          // flex-wrap: wrap;
          .pic-wrapper {
            margin-right: 20px;
            margin-bottom: 20px;
            display: flex;
            flex-direction: column;
            // justify-content: space-between;
            width: 140px;
            & > img {
              height: 140px;
              border-radius: 6px;
            }
            & > div {
              padding: 0 3px;
              margin-top: 5px;
              display: flex;
              justify-content: space-between;
              .red {
                color: red;
                font-weight: 900;
              }
              .operation {
                font-size: 15px;
                color: $blue;
                cursor: pointer;
                &:hover {
                  text-decoration: underline;
                }
              }
            }
          }
          &:last-child {
            margin: 0;
          }
        }
        .album-btn {
          position: absolute;
          bottom: 20px;
          left: 220px;
        }
      }

      div.quill-editor {
        width: 800px;
        height: 400px;
        margin-left: 20px;
        margin-bottom: 60px;
      }
      // }
    }
  }
  .btn-row {
    display: flex;
    justify-content: center;
    margin-top: 50px;
    margin: 50px auto 0 auto;
    .btn {
      width: 204px;
      height: 38px;
      line-height: 38px;
      text-align: center;
      border-radius: 4px;
      font-size: 16px;
      color: $rule-blue;
      border: 1px $rule-blue solid;
      margin: 0 25px;
      &.nxt {
        background: rgba(91, 192, 191, 1);
        color: rgba(255, 255, 255, 1);
      }
    }
  }
}
</style>

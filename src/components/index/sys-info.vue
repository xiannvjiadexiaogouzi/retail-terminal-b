<template>
  <div class="sys-info">
    <!-- <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="date" label="日期" width="180"></el-table-column>
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
    </el-table>-->
    <table>
      <tr>
        <td>服务器操作系统</td>
        <td>Linux(144.55.34.251)</td>
        <td>Web服务</td>
        <td>nginx/1.10.2</td>
      </tr>
      <tr>
        <td>PHP版本:</td>
        <td>5.6.30</td>
        <td>MySQL版本:</td>
        <td>否</td>
      </tr>
      <tr>
        <td>安全模式:</td>
        <td>否</td>
        <td>安全模式GID:</td>
        <td>否</td>
      </tr>
      <tr>
        <td>Socket支持:</td>
        <td>是</td>
        <td>时区设置:</td>
        <td>Asia/Shanghai</td>
      </tr>
      <tr>
        <td>GD版本:</td>
        <td>GD2(JPED GIF PNG)</td>
        <td>Zilb支持:</td>
        <td>是</td>
      </tr>
      <tr>
        <td>IP库版本:</td>
        <td>20071024</td>
        <td>文件上传的最大大小:</td>
        <td>40M</td>
      </tr>
      <tr>
        <td>程序版本:</td>
        <td>v2.2.2 RELEASE 20170629</td>
        <td>安装日期:</td>
        <td>2017-05-02</td>
      </tr>
      <tr>
        <td>编码:</td>
        <td>UTF-8</td>
        <td></td>
        <td></td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.sys-info table {
  border-collapse: collapse;
}
.sys-info tr {
  width: 100%;
  font-size: 16px;
  color: rgba(89, 87, 87, 1);
  line-height: 51px;
  height: 51px;
  text-align: center;
  & > td {
    border-top: 1px solid rgba(181, 181, 181, 1);
    border-bottom: 1px solid rgba(181, 181, 181, 1);
    border-left: 1px solid rgba(181, 181, 181, 1);
    &:last-child {
      border-right: 1px solid rgba(181, 181, 181, 1);
    }
    &:nth-child(odd) {
      background: rgba(239, 239, 239, 1);
      width: 201px;
    }
    &:nth-child(even) {
      width: 450px;
    }
  }
}
</style>

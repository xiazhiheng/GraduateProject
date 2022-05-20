<template>
  <div class="all">
    <el-button @click="n_add">添加</el-button>
    <el-table :data="pagination.data" border id="t_table">
      <el-table-column label="标题">
        <template v-slot="scope">
          <a id="new" :href="scope.row.newspaperUrl" target="_blank" >{{scope.row.newspaperName}}</a>
        </template>
      </el-table-column> 
      <el-table-column prop="newspaperTime" label="时间"></el-table-column>
      <el-table-column width="150" fixed="right">
        <template v-slot="scope">
          <el-button @click="n_delete(scope.row.newspaperId)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.current"
      :page-sizes="[6, 10]"
      :page-size="pagination.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      class="page">
  </el-pagination>
</template>
<script>
export default {
  data(){
    return{
      news:[],
      pagination: {
        //分页后的教师信息
        current: 1, //当前页
        total: null, //记录条数
        size: 6, //每页条数
        data:[]
      },
    }
  },
  created() {
    this.getNewsInfo();
  },
  methods:{
    getNewsInfo(){
      this.$axios.post('/admin/allnews').then(res =>{
        if(res.data.code == 200){
          this.news = res.data.data;
          this.getNewsInfoByPage();
        }else{
          console.log("error");
        }
      })
    },
    getNewsInfoByPage(){
      // 获取该分页的试题信息
      this.pagination.total = this.news.length;
      this.pagination.data = this.news.slice((this.pagination.current-1)*this.pagination.size,this.pagination.current*this.pagination.size);
      console.log(this.pagination.data);
    },
    n_add(){
      this.$axios.post('/admin/addnews').then(res =>{
        console.log(res.data);
        if(res.data.code == 200){
          this.$message.success("添加成功");
          this.getNewsInfo();
        }else{
          console.log("error");
        }
      })
    },
    n_delete(id){
      console.log(id);
      this.$axios.post('/admin/deleteOneNews?newspaperId='+id).then(res =>{
        if(res.data.code == 200){
          console.log("删除成功")
          this.getNewsInfo();
        }else{
          console.log("error");
        }
      })
    },
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getNewsInfoByPage();
    },
    // 改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.getNewsInfoByPage();
    },
  },
}
</script>
<style lang="scss" scoped>
.all {
  margin-top: 50px;
  padding: 0px 40px;
  .page {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .edit {
    margin-left: 20px;
  }
  .el-table tr {
    background-color: #dd5862 !important;
  }
}
.el-table .warning-row {
  background: #000 !important;
}

.el-table .success-row {
  background: #dd5862;
}
a{
  text-decoration:none;  
}
</style>
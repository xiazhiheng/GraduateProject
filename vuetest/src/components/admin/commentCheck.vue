// 学生管理页面
<template>
  <div class="all">
    <el-table :data="pagination.data" border id="t_table">
      <el-table-column prop="userId" label="用户ID" ></el-table-column>
      <el-table-column prop="commentContent" label="内容" ></el-table-column>
      <el-table-column width="150" fixed="right">
        <template v-slot="scope">
          <el-button @click="access(scope.row.commentId)" type="primary" size="small">通过</el-button>
          <el-button @click="deleteComment(scope.row.commentId)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      data:[
        // {
        //   userId:"001",
        //   userName:"夏志衡",
        //   comment:"车行直路",
        // }
      ],
      pagination: {
        //分页后的考试信息
        current: 1, //当前页
        total: null, //记录条数
        size: 6, //每页条数
        data:[],
      },
      dialogVisible: false, //对话框
      form: {}, //保存点击以后当前试卷的信息
    };
  },
  created() {
    this.getCommentInfo();
  },
  methods: {
    getCommentInfo() {
      this.getCommentInfoByPage();
      // 查询所有待审核评论
      this.$axios.post('/admin/showFalseComment').then((res)=>{
        if(res.data.code == 200){
          this.data = res.data.data;
          this.getCommentInfoByPage();
        }
				else{
          console.log("error");
        }
			})
    },
    getCommentInfoByPage(){
      // 获取该分页的评论信息
      this.pagination.total = this.data.length;
      this.pagination.data = this.data.slice((this.pagination.current-1)*this.pagination.size,this.pagination.current*this.pagination.size);
      console.log(this.pagination.data);
    },
    access(id){
      this.$axios.post('/admin/passComment?commentId='+id).then(res => {
        if(res.data.code == 200){
          this.getCommentInfo();
        }
        else{
          console.log("评论通过失败");
        }
      })
    },
    deleteComment(id) { //删除当前学生
      console.log(id);
      this.$axios.post('/admin/deleteComment?commentId='+id).then(res => {
        if(res.data.code == 200){
          this.getCommentInfo()
        }else{
          console.log("评论删除失败");
        }
      })
    },
    // 改变当前记录条数
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getCommentInfoByPage();
    },
    // 改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.getCommentInfoByPage();
    },
  }
};
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
</style>

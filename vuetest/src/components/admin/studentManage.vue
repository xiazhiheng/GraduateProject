// 学生管理页面
<template>
  <div class="all">
    <div id="top">
      <el-input v-model="input" id="search">
        <template #append>
          <el-button @click="search"><el-icon><search/></el-icon></el-button>
        </template>
      </el-input>
    </div>
    <el-table :data="pagination.data" border id="t_table">
      <el-table-column prop="userId" label="ID" ></el-table-column>
      <el-table-column prop="userName" label="姓名" ></el-table-column>
      <el-table-column prop="userSignature" label="签名" ></el-table-column>
      <el-table-column prop="userAge" label="年龄" ></el-table-column>
      <el-table-column prop="userSex" label="性别" ></el-table-column>
      <el-table-column prop="userPhone" label="电话号码" ></el-table-column>
      <el-table-column width="150" fixed="right">
        <template v-slot="scope">
          <el-button v-if="!scope.row.userPriviledge"   @click="s_ban(scope.row.userId,scope.$index)" type="danger" size="small">禁用</el-button>
          <el-button v-else   @click="s_ban(scope.row.userId,scope.$index)" type="primary" size="small">启用</el-button>
          <el-button @click="deleteById(scope.row.userId)" type="danger" size="small">删除</el-button>
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
      input:null,
      data:[],
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
    console.log("studentManger")
    this.getStudentInfo();
  },
  methods: {
    s_ban(userId,index){
      this.$axios.post('/admin/updatePriviledge',{"userId":userId}).then(res => {
        if(res.data.code == 200){
          this.pagination.data[index].userPriviledge = !this.pagination.data[index].userPriviledge;
          console.log(this.pagination.data[index].userPriviledge);
        }
        else{
          console.log("修改用户权限失败");
        }
      })
      
    },
     getStudentInfo() {
      // 查询所有学生信息
      this.$axios.post('/admin/findAllStudent').then((res)=>{
					this.data = res.data.data;
          this.getStudentInfoByPage();
			})
    },
    search(){
      this.$axios.post('/student/findUserByIdOrUserName?message='+this.input).then(res =>{
        if(res.data.code==200){
          this.data = res.data.data;
          this.getStudentInfoByPage();
        }else{
          this.$message.error("未搜索到结果");
        }
      })
    },
    getStudentInfoByPage(){
      // 获取该分页的学生信息
      this.pagination.total = this.data.length;
      this.pagination.data = this.data.splice((this.pagination.current-1)*this.pagination.size,this.pagination.current*this.pagination.size);
    },
    // 改变当前记录条数
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getStudentInfoByPage();
    },
    // 改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.getStudentInfoByPage();
    },
    deleteById(userId) { //删除当前学生
      this.$confirm("确定删除当前学生吗？删除后无法恢复","Warning",{
        confirmButtonText: '确定删除',
        cancelButtonText: '算了,留着吧',
        type: 'danger'
      }).then(()=> { //确认删除
        this.$axios.post('/admin/deleteUser',{"userId":userId}).then(res => {
          this.getStudentInfo()
        })
      }).catch(() => {

      })
    },
    submit() { //提交更改
      this.dialogVisible = false
      this.$axios({
        url: '/api/student',
        method: 'put',
        data: {
          ...this.form
        }
      }).then(res => {
        console.log(res)
        if(res.data.code ==200) {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
        }
        this.getStudentInfo()
      })
    },
    handleClose(done) { //关闭提醒
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        }).catch(_ => {});
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

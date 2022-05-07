// 学生管理页面
<template>
  <div class="all">
    <el-button type="text" size="small" @click="getStudentInfoAgree">已同意</el-button>
    <el-button type="text" size="small" @click="getStudentInfoUnAgree">待同意</el-button>
    <el-table :data="pagination.data" border id="t_table">
      <el-table-column prop="userId" label="ID" ></el-table-column>
      <el-table-column prop="userName" label="姓名" ></el-table-column>
      <el-table-column prop="userSignature" label="签名" ></el-table-column>
      <el-table-column prop="userAge" label="年龄" ></el-table-column>
      <el-table-column prop="userSex" label="性别" ></el-table-column>
      <el-table-column prop="userPhone" label="电话号码" ></el-table-column>
      <el-table-column width="100" fixed="right">
        <template v-slot="scope" v-if="flag">
          <el-button @click="deleteById(scope.row.userId)" type="danger" size="small">删除</el-button>
        </template>
        <template v-slot="scope" v-else>
          <el-button @click="agree(scope.row.userId)" type="danger" size="small">同意</el-button>
          <el-button @click="refuse(scope.row.userId)" type="danger" size="small">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.current"
      :page-sizes="[6, 10]"
      :page-size="pagination.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      class="page">
    </el-pagination> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      flag:true,
      data:[
        {
          userId:"001",
          userName:"夏志衡",
          userImageUrl:"图片地址",
          userSignature:"车行直路",
          userAge:22,
          userSex:"男",
          userPhone:"17513119728",
          userPriviledge:0,
        }
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
    console.log("studentManger")
    this.getStudentInfoAgree();
  },
  methods: {
     getStudentInfoAgree() {
      // 查询所有已同意学生信息
      console.log("已同意");
      this.$axios.post('/teacher/findAgreeStudent',{"teacherId":this.userId}).then((res)=>{
					this.data = res.data.data;
           this.getStudentInfoByPage();
			})
      this.flag = true;
    },
    getStudentInfoUnAgree() {
      // 查询所有未同意学生信息
      console.log("待同意");
      this.$axios.post('teacher/findNoAgreeStudent',{"teacherId":this.userId}).then((res)=>{
					this.data = res.data.data;
          this.getStudentInfoByPage();
			})
      this.flag = false;
    },
    getStudentInfoByPage(){
      // 获取该分页的学生信息
      this.pagination.data = this.data.slice((this.pagination.current-1)*this.pagination.size,this.pagination.current*this.pagination.size);
    },

    //改变当前记录条数
    // handleSizeChange(val) {
    //   this.pagination.size = val;
    //   this.getStudentInfo();
    // },
    //改变当前页码，重新发送请求
    // handleCurrentChange(val) {
    //   this.pagination.current = val;
    //   this.getStudentInfo();
    // },
    
    deleteById(studentId) { //删除当前学生
      this.$confirm("确定删除当前学生吗？删除后无法恢复","Warning",{
        confirmButtonText: '确定删除',
        cancelButtonText: '算了,留着吧',
        type: 'danger'
      }).then(()=> { //确认删除
        this.$axios.post('/teacher/deleteStudent',{"teacherId":this.userId,"studentId":studentId}).then(res => {
          this.getStudentInfoAgree()
        })
      }).catch(() => {

      })
    },
    agree(studentId){
      this.$axios.post('/teacher/agreeStudent',{"teacherId":this.userId,"studentId":studentId}).then(res => {
          this.getStudentInfoUnAgree()
        })
    },
    refuse(studentId){
      this.$axios.post('/teacher/deleteStudent',{"teacherId":this.userId,"studentId":studentId}).then(res => {
          this.getStudentInfoUnAgree()
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

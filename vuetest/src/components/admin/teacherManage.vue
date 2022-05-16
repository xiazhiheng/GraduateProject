// 教师管理页面
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
      <el-table-column prop="userId" label="ID"></el-table-column>
      <el-table-column prop="userName" label="姓名"></el-table-column>
      <el-table-column prop="userSignature" label="签名"></el-table-column>
      <el-table-column prop="userAge" label="年龄"></el-table-column>
      <el-table-column prop="sex" label="性别"></el-table-column>
      <el-table-column prop="userPhone" label="电话号码"></el-table-column>
      <el-table-column prop="userPassword" label="密码"></el-table-column>
      <el-table-column width="230" fixed="right">
        <template v-slot="scope">
          <el-button v-if="scope.row.userPriviledge == 0"  @click="t_ban(scope.row.userId,scope.$index)" type="danger" size="small">禁用</el-button>
          <el-button v-else   @click="t_ban(scope.row.userId,scope.$index)" type="primary" size="small">启用</el-button>
          <el-button @click="t_update(scope.$index)" type="primary" size="small">编辑</el-button>
          <el-button @click="t_delete(scope.row.userId)" type="danger" size="small">删除</el-button>
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

    <!-- 编辑教师信息-->
    <el-dialog
      title="编辑教师信息"
      v-model="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <section class="update">
        <el-form ref="form" v-model="form" label-width="80px">
          <el-form-item label="姓名">
            <el-input v-model="form.userName"></el-input>
          </el-form-item>
          <el-form-item label="签名">
            <el-input v-model="form.userSignature"></el-input>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input v-model="form.userAge"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-input v-model="form.userSex"></el-input>
          </el-form-item>
          <el-form-item label="电话号码">
            <el-input v-model="form.userPhone"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.userPassword"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  data() {
    return {
      input:null,
      data:[
        {
          userId:"001",
          userName:"夏志衡",
          userImageUrl:"图片地址",
          userSignature:"车行直路",
          userAge:22,
          userSex:"男",
          userPhone:"17513119728",
          userPriviledge:false,
        },
        {
          userId:"002",
          userName:"夏志衡",
          userImageUrl:"图片地址",
          userSignature:"车行直路",
          userAge:22,
          userSex:"男",
          userPhone:"17513119728",
          userPriviledge:0,
        },
        {
          userId:"003",
          userName:"夏志衡",
          userImageUrl:"图片地址",
          userSignature:"车行直路",
          userAge:22,
          userSex:"男",
          userPhone:"17513119728",
          userPriviledge:1,
        },
      ],
      pagination: {
        //分页后的教师信息
        current: 1, //当前页
        total: null, //记录条数
        size: 6, //每页条数
        data:[]
      },
      dialogVisible: false, //对话框
      form: {}, //保存点击以后当前试卷的信息
    };
  },
  // computed: mapState("url"),
  created() {
    this.getTeacherInfo();
  },
  methods: {
    t_ban(userId,index){
      this.$axios.post('/admin/updatePriviledge',{'userId':userId}).then(res => {
        if(res.data.code == 200){
          console.log(this.pagination.data[index].userPriviledge);
          if(this.pagination.data[index].userPriviledge==1){
            this.pagination.data[index].userPriviledge=0;
          }else{
            this.pagination.data[index].userPriviledge=1;
          }
          console.log(this.pagination.data[index].userPriviledge);
        }
        else{
          console.log("修改用户权限失败");
        }
      })
      
    },
    t_update(index) { //修改教师信息
      this.dialogVisible = true;
      this.form = this.pagination.data[index];
    },
    getTeacherInfo() {
      // 查询所有教师信息
      this.$axios.post('/admin/findAllTeacher').then((res)=>{
				this.data = res.data.data;
        this.getTeacherInfoBypage();
			})
    },
    search(){
      this.$axios.post('/student/findUserByIdOrUserName?message='+this.input).then(res =>{
        if(res.data.code==200){
          this.data = res.data.data;
          this.getTeacherInfoBypage();
        }else{
          this.$message.error("未搜索到结果");
        }
      })
    },
    getTeacherInfoBypage(){
      // 获取该分页的教师信息
      this.pagination.total = this.data.length;
      this.pagination.data = this.data.slice((this.pagination.current-1)*this.pagination.size,this.pagination.current*this.pagination.size);
      for(let i=0;i<this.pagination.data.length;i++){
        if(this.pagination.data[i].userSex == 1){
          this.pagination.data[i].sex = "男"
        }else if(this.pagination.data[i].userSex == 2){
          this.pagination.data[i].sex = "女"
        }
      }
    },
    //改变当前记录条数
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getTeacherInfoBypage();
    },
    //改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.getTeacherInfoBypage();
    },
    t_delete(teacherId) { //删除当前学生
      this.$confirm("确定删除当前教师吗？删除后无法恢复","Warning",{
        confirmButtonText: '确定删除',
        cancelButtonText: '算了,留着吧',
        type: 'danger'
      }).then(()=> { //确认删除
        this.$axios.post('/admin/deleteUser',{"userId":teacherId}).then(res => {
          console.log(res)
          if(res.data.code == 200){
            this.getTeacherInfo()
          }
          else{
            console.log("删除用户失败");
          }
        })
      }).catch(() => {

      })
    },
    submit() { //提交更改
      this.dialogVisible = false
      this.$axios.post(`/admin/updateUser`,{
        "userId":this.form.userId,
        "userName":this.form.userName,
        "userImageUrl":this.form.userImageUrl,
        "userSignature":this.form.userSignature,
        "userPassword":this.form.userPassword,
        "userIdentity":this.form.userIdentity,
        "userAge":this.form.userAge,
        "userSex":this.form.userSex,
        "userPhone":this.form.userPhone,
        "userPriviledge":this.form.userPriviledge,}).then(res => {
        if(res.data.code == 200) {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
        }else{
          console.log("修改失败");
        }
        this.getTeacherInfo()
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
// #t_table{
//   position: initial;
// }
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
.el-dialog{
  width: 200px;
}
</style>

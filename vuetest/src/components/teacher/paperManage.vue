// 试卷管理页面
<template>
  <div class="all">
    <div id="top">
      <el-input v-model="input" id="search">
        <template #append>
          <el-button @click="search"><el-icon><search/></el-icon></el-button>
        </template>
      </el-input>
      <el-button @click="" id="autoBtn">自动组卷</el-button>
    </div>
    
    <!-- <el-input
      placeholder=""
    >
    </el-input> -->
    <el-table :data="pagination.data" border id="t_table">
      <!-- <el-table-column prop="userPhone" label="出题人"></el-table-column> -->
      <el-table-column prop="testPaperName" label="名称"></el-table-column>
      <el-table-column prop="testPaperTime" label="时长"></el-table-column>
      <el-table-column prop="difficultyName" label="难度"></el-table-column>
      <el-table-column width="230" fixed="right">
        <template v-slot="scope">
          <el-button v-if="scope.row.testPaperStatus" @click="p_ban(scope.row.testPaperId)" type="primary" size="small">发布</el-button>
          <el-button v-else @click="p_ban(scope.row.testPaperId)" type="danger" size="small">禁用</el-button>
          <el-button @click="p_update(scope.$index)" type="primary" size="small">编辑</el-button>
          <el-button @click="p_delete(scope.row.testPaperId)" type="danger" size="small">删除</el-button>
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

    <!-- 编辑试卷信息-->
    <el-dialog
      title="编辑试卷信息"
      v-model="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <section class="update">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="form.testPaperName"></el-input>
          </el-form-item>
          <el-form-item label="时长">
            <el-input v-model="form.testPaperTime"></el-input>
          </el-form-item>
          <el-form-item label="难度">
            <el-radio v-model="form.testPaperDifficulty" label="1">简单</el-radio>
            <el-radio v-model="form.testPaperDifficulty" label="2">中等</el-radio>
            <el-radio v-model="form.testPaperDifficulty" label="3">困难</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button @click="p_manage(form.testPaperId)" type="primary" size="small">试题管理</el-button>
          </el-form-item>
        </el-form>
      </section>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑自动组卷信息 -->
    <el-dialog
      title="自动组卷试卷信息"
      v-model="auto_dialogVisible"
      width="30%"
      :before-close="handleClose">
      <section class="update">
        <el-form ref="form" :model="autoForm" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="form.testPaperName"></el-input>
          </el-form-item>
          <el-form-item label="时长">
            <el-input v-model="form.testPaperTime"></el-input>
          </el-form-item>
          <el-form-item label="难度">
            <el-radio v-model="form.testPaperDifficulty" label="1">简单</el-radio>
            <el-radio v-model="form.testPaperDifficulty" label="2">中等</el-radio>
            <el-radio v-model="form.testPaperDifficulty" label="3">困难</el-radio>
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.testpaperQuestionNums"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="auto_submit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  data() {
    return {
      data:[],
      pagination: {
        //分页后的教师信息
        current: 1, //当前页
        total: null, //记录条数
        size: 6, //每页条数
        data:[]
      },
      dialogVisible: false, //对话框
      auto_dialogVisible: false, //对话框
      form: {}, //保存点击以后当前试卷的信息
      autoForm:{},
      input:null,
    };
  },
  computed: mapState(["subject","difficulty",'userInfo']),
  created() {
    this.getPaperInfo();
  },
  methods: {
    p_ban(paperId){
      console.log(paperId);
      this.$axios.post('/teacher/updateTestPaperStatus',{"testPaperId":paperId}).then((res) => {
        this.getPaperInfo();
      })
    },
    p_update(index) { //修改试卷信息
      this.dialogVisible = true;
      this.form = this.pagination.data[index];
    },
    p_manage(paperId){
      this.$router.push({path:'/t_paperQuestionManage',query:{paperId:paperId}});
    },
    getPaperInfo(){
      // 查询所有试卷信息
      this.$axios.post('teacher/findTeacherTestPaper',{"testPaperMadeById":this.userInfo.id}).then((res)=>{
					this.data = res.data.data;
          this.getPaperInfoBypage();
			})
      
    },
    search(){
      this.$axios.post('student/findTestPaperByName',).then(res =>{
        if(res.data.code==200){
          this.data = res.data.data;
          this.getPaperInfoBypage();
        }else{
          console.log("error");
        }
      })
    },
    getPaperInfoBypage(){
      // 获取该分页的试卷信息
      this.pagination.total = this.data.length;
      this.pagination.data = this.data.slice((this.pagination.current-1)*this.pagination.size,this.pagination.current*this.pagination.size);
      for(let i=0;i<this.pagination.data.length;i++){
        this.pagination.data[i].difficultyName = this.difficulty[this.pagination.data[i].testPaperDifficulty-1];
      }
    },
    p_delete(paperId) { //删除当前试卷
      this.$confirm("确定删除当前试卷吗？删除后无法恢复","Warning",{
        confirmButtonText: '确定删除',
        cancelButtonText: '算了,留着吧',
        type: 'danger'
      }).then(()=> { //确认删除
        this.$axios.post('/teacher/deleteTestPaper',{"testPaperId":paperId}).then(res => {
          if(res.data.code == 200){
            this.getPaperInfo()
          }
          else{
            console.log("删除试卷失败");
          }
        })
      }).catch(() => {

      })
    },
    submit() { //提交更改
      if(this.form.testPaperName == null || this.form.testPaperName == ""){
        this.$message({
          message: '试卷名称不能为空',
          type: 'error'
        })
      }else if(this.form.testPaperTime == null || this.form.testPaperTime == ""){
        this.$message({
          message: '考试时间不能为空',
          type: 'error'
        })
      }
      else if(this.form.testPaperDifficulty == null){
        this.$message({
          message: '请选择难度',
          type: 'error'
        })
      }else{
        this.$axios.post('/teacher/updateTestPaper',this.form).then(res => {
          if(res.data.code == 200) {
            this.$message({
              message: '更新成功',
              type: 'success'
            })
          }else{
            console.log(res.data.code);
            console.log("修改失败");
          }
          this.getPaperInfo();
          this.dialogVisible = false;
        })
      }
    },
    auto_submit(){
      this.autoForm.testPaperMadeById = this.userInfo.id;
      this.$axios.post('/teacher/autoAddTestPaper',this.autoForm).then(res => {
        if(res.data.code == 200) {
          this.$message({
            message: '创建成功',
            type: 'success'
          })
        }else{
          console.log("创建失败");
        }
        this.getPaperInfo();
        this.dialogVisible = false;
      })
    },
    handleClose(done) { //关闭提醒
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        }).catch(_ => {});
    },
    //改变当前记录条数
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getPaperInfoBypage();
    },
    //改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.getPaperInfoBypage();
    },
  }
};
</script>
<style lang="scss" scoped>
#autoBtn{
  float: right;
}
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

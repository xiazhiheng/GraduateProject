<template>
  <div class="all"> 
    <el-select v-model="condition.courseId" clearable @change="courseChange" @clear="condition.courseId = null">
      <el-option
        v-for="item in subject"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-select v-model="condition.chapterId" clearable @clear="condition.chapterId = null">
      <el-option v-if="condition.courseId!=null"
        v-for="item in subject[condition.courseId-1].children"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-select v-model="condition.questionDifficulty" clearable @clear="condition.questionDifficulty = null">
      <el-option
        label="简单"
        :value="1">
      </el-option>
      <el-option
        label="中等"
        :value="2">
      </el-option>
      <el-option
        label="困难"
        :value="3">
      </el-option>
    </el-select>
    <el-select v-model="condition.questionType" clearable @clear="condition.questionType = null">
      <el-option
        label="单选"
        :value="1">
      </el-option>
      <el-option
        label="多选"
        :value="2">
      </el-option>
    </el-select>
    <el-select v-model="condition.questionLimition">
      <el-option
        label="私人题库"
        :value="0">
      </el-option>
      <el-option
        label="公共题库"
        :value="1">
      </el-option>
    </el-select>
    <el-button @click="search">检索</el-button>
    
    <el-checkbox-group v-model="checkList">
      <el-table :data="pagination.data" border id="t_table">
        <!-- <el-table-column prop="userPhone" label="出题人"></el-table-column> -->
        <el-table-column width="34px">
          <template v-slot="scope">
            <el-checkbox :label="scope.row.questionId" ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="subjectName" label="课程" width="170"></el-table-column>
        <el-table-column prop="chapterName" label="章节" width="170"></el-table-column>
        <el-table-column prop="difficultyName" label="难度" width="50"></el-table-column>
        <el-table-column prop="typeName" label="类型" width="50"></el-table-column>
        <el-table-column prop="questionContent" label="题干" :show-overflow-tooltip="true"></el-table-column>
        <!-- <el-table-column prop="questionOptionA" label="选项A" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="questionOptionB" label="选项B" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="questionOptionC" label="选项C" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="questionOptionD" label="选项D" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="questionAnswer" label="答案"></el-table-column>
        <el-table-column prop="questionAnalysis" label="解析" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="knowledge" label="知识点"></el-table-column>
        <el-table-column prop="authority" label="题目权限"></el-table-column> -->
        <el-table-column width="80" fixed="right">
          <template v-slot="scope">
            <el-button @click="q_display(scope.$index)" type="primary" size="small">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button v-if="addFlag" id="create" type="primary" @click="addQuestion">添加</el-button>
      <el-button v-else id="create" type="primary" @click="t_create">生成试卷</el-button>
    </el-checkbox-group>

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

     <!-- 试题详情 -->
    <el-dialog
      title="试题信息"
      v-model="display"
      width="50%">
      <section class="display">
        <el-form ref="form" :model="form" >
          <el-form-item label="课程:">
            <p>{{form.subjectName}}</p>
          </el-form-item>
          <el-form-item label="章节:">
            <p>{{form.chapterName}}</p>
          </el-form-item>
          <el-form-item label="难度:">
           <p>{{form.difficultyName}}</p>
          </el-form-item>
          <el-form-item label="类型:">
            <p>{{form.typeName}}</p>
          </el-form-item>
          <el-form-item label="题干:">
            <p id="content">{{form.questionContent}}</p>
          </el-form-item>
          <el-form-item label="A选项:">
            <p>{{form.questionOptionA}}</p>
          </el-form-item>
          <el-form-item label="B选项:">
            <p>{{form.questionOptionB}}</p>
          </el-form-item>
          <el-form-item label="C选项:">
            <p>{{form.questionOptionC}}</p>
          </el-form-item>
          <el-form-item label="D选项:">
            <p>{{form.questionOptionD}}</p>
          </el-form-item>
          <el-form-item label="答案:">
            <p>{{form.questionAnswer}}</p>
          </el-form-item>
          <el-form-item label="解析:">
            <p id="analysis">{{form.questionAnalysis}}</p>
          </el-form-item>
          <el-form-item label="知识点:">
            <p>{{form.knowledgeContent}}</p>
          </el-form-item>
        </el-form>
      </section>
    </el-dialog>

    <!-- 编辑对话框-->
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
            <el-input v-model="form.testPaperTime" type="number" placeholder="请输入时长/min" min="1"></el-input>
          </el-form-item>
          <el-form-item label="难度">
            <el-radio v-model="form.testPaperDifficulty" label="1">简单</el-radio>
            <el-radio v-model="form.testPaperDifficulty" label="2">中等</el-radio>
            <el-radio v-model="form.testPaperDifficulty" label="3">困难</el-radio>
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
import addQuestionVue from '../admin/addQuestion.vue';
export default {
  data() {
    return {
      addFlag:this.$route.query.type,
      paperId:this.$route.query.paperId,
      subordinate:0,//判断是私有题库还是公共题库，0为私有,1为公共
      data:[],
      condition: {
        courseId:null,
        chapterId:null,
        questionDifficulty:null,
        questionType:null,
        questionLimition:0,
      },
      checkList:[],
      // checkList2:[],
      pagination: {
        //分页后的教师信息
        current: 1, //当前页
        total: null, //记录条数
        size: 6, //每页条数
        data:[],
      },
      display:false,
      dialogVisible: false, //对话框
      form: {}, //保存点击以后当前试卷的信息
    };
  },
  computed: mapState(["subject","difficulty","type","authority",'userInfo']),
  created() {
    this.search();
  },
  methods: {
    //条件检索试题
    search(){
      if(this.addFlag==1){
        this.$axios.post('teacher/findAddElseQuestion/'+this.pagination.current+'/'+this.pagination.size+'?testPaperId='+this.paperId+'&teacherId='+this.userInfo.id,this.condition).then(res=>{
          console.log(res.data);
          if(res.data.code==200){
            this.pagination.total = res.data.data.totalSize;
            this.pagination.data = res.data.data.content;
            for(let i=0;i<this.pagination.data.length;i++){
              this.pagination.data[i].subjectName = this.subject[this.pagination.data[i].courseId-1].label;
              this.pagination.data[i].chapterName = this.subject[this.pagination.data[i].courseId-1].children[this.pagination.data[i].chapterId-this.subject[this.pagination.data[i].courseId-1].num-1].label;
              this.pagination.data[i].difficultyName = this.difficulty[this.pagination.data[i].questionDifficulty-1];
              this.pagination.data[i].typeName =  this.type[this.pagination.data[i].questionType-1];
              this.pagination.data[i].authority = this.authority[this.pagination.data[i].questionLimition];
            }
          }else{
            console.log("error");
          }
        })  
      }else{
        console.log("condition",this.condition);
        this.$axios.post('/admin/findQuestionByRequirements/'+this.pagination.current+'/'+this.pagination.size,this.condition).then(res=>{
          console.log(res.data);
          if(res.data.code==200){
            this.pagination.total = res.data.data.totalSize;
            this.pagination.data = res.data.data.content;
            for(let i=0;i<this.pagination.data.length;i++){
              this.pagination.data[i].subjectName = this.subject[this.pagination.data[i].courseId-1].label;
              this.pagination.data[i].chapterName = this.subject[this.pagination.data[i].courseId-1].children[this.pagination.data[i].chapterId-this.subject[this.pagination.data[i].courseId-1].num-1].label;
              this.pagination.data[i].difficultyName = this.difficulty[this.pagination.data[i].questionDifficulty-1];
              this.pagination.data[i].typeName =  this.type[this.pagination.data[i].questionType-1];
              this.pagination.data[i].authority = this.authority[this.pagination.data[i].questionLimition];
            }
          }else{
            console.log("error");
          }
        })
      }
    },
    //课程改变，章节清空
    courseChange(){
      this.condition.chapterId = null;
    },
    // getQuestionInfo() {
    //   // 查询试题信息
    //   if(this.addFlag==1){
    //     console.log(1);
    //     this.$axios.get('/teacher/findAddElseQuestion',{params:{"testPaperId":this.paperId,"teacherId":this.userInfo.id}}).then((res)=>{
    //       if(res.data.code == 200){
    //         this.data = res.data.data;
    //         this.getQuestionInfoBypage();
    //       }else{
    //         console.log("error");
    //       }
    //     })
    //   }else{
    //     console.log(2);
    //     this.$axios.post('/teacher/findAllPublicQuestion').then((res)=>{
    //       if(res.data.code==200){
    //         this.data = res.data.data;
    //         this.getQuestionInfoBypage();
    //       }else{
    //         console.log("error");
    //       }
		// 	  })
    //   }
    // },
    // getQuestionInfoBypage(){
    //   // 获取该分页的试题信息
    //   this.pagination.total = this.data.length;
    //   this.pagination.data = this.data.slice((this.pagination.current-1)*this.pagination.size,this.pagination.current*this.pagination.size);
    //   console.log(this.pagination.data);
    //   for(let i=0;i<this.pagination.data.length;i++){
    //     this.pagination.data[i].subjectName = this.subject[this.pagination.data[i].courseId-1].label;
    //     this.pagination.data[i].chapterName = this.subject[this.pagination.data[i].courseId-1].children[this.pagination.data[i].chapterId-this.subject[this.pagination.data[i].courseId-1].num-1].label;
    //     this.pagination.data[i].difficultyName = this.difficulty[this.pagination.data[i].questionDifficulty-1];
    //     this.pagination.data[i].typeName =  this.type[this.pagination.data[i].questionType-1];
    //     this.pagination.data[i].authority = this.authority[this.pagination.data[i].questionLimition];
    //   }
    // },
    q_display(index){
      this.form = this.pagination.data[index];
      this.display = true;
    },
    t_create(){
      if(this.checkList.length==0){
        this.$message({
          message: '请选择试题',
          type: 'error'
        })
      }else{
        this.dialogVisible = true;
      }
    },
    //改变当前记录条数
    handleSizeChange(val) {
      this.pagination.size = val;
      this.search();
    },
    //改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.search();
    },
    handleClose(done) { //关闭提醒
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        }).catch(_ => {});
    },
    submit(){
      this.form.testPaperQuestionNums = this.checkList.length;
      this.form.testPaperMadeById = this.userInfo.id;
      console.log(this.form);
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
        this.$axios.post('/teacher/addTestPaper?questionIds='+this.checkList,this.form).then(res => {
          if(res.data.code == 200) {
            this.$message({
              message: '创建成功',
              type: 'success'
            })
          }else{
            console.log("创建失败");
          }
          this.dialogVisible = false,
          this.$router.push("/t_paperManage");
        })
      }
    },
    addQuestion(){
      console.log(this.paperId);
      this.$axios.get('/teacher/addTestPaperQuestion?questionIds='+this.checkList+"&testPaperId="+this.paperId).then(res => {
        if(res.data.code == 200) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
        }else{
          console.log("添加失败");
        }
        this.$router.push("/t_paperManage")
      })
    }
  }
};
</script>
<style lang="scss" scoped>
#create{
  margin-top: 20px;
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
.display .el-form-item{
  margin-bottom: 0px;
  font-weight: bold;
  text-align: left;
  p{
    font-weight:normal;
  }
}
</style>

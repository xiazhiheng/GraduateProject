
<template>
  <div class="all">
    <div id="top">
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
      <el-button @click="search">检索</el-button>
    </div>
    <el-table :data="pagination.data" border id="t_table">
      <el-table-column prop="subjectName" label="课程" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="chapterName" label="章节" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="difficultyName" label="难度"></el-table-column>
      <el-table-column prop="typeName" label="类型"></el-table-column>
      <el-table-column prop="questionContent" label="题干" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="questionOptionA" label="选项A" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="questionOptionB" label="选项B" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="questionOptionC" label="选项C" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="questionOptionD" label="选项D" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="questionAnswer" label="答案"></el-table-column>
      <el-table-column prop="questionAnalysis" label="解析" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="knowledgeContent" label="知识点"></el-table-column>
      <el-table-column prop="authority" label="题目权限"></el-table-column>
      <el-table-column width="150" fixed="right">
        <template v-slot="scope">
          <el-button @click="q_update(scope.$index)" type="primary" size="small">编辑</el-button>
          <el-button @click="q_delete(scope.row.questionId)" type="danger" size="small">删除</el-button>
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

    <!-- 编辑试题信息-->
    <el-dialog
      title="编辑试题信息"
      v-model="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <section class="update">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="章节">
            <el-cascader v-model="value" :options="subject" @change="handleChange"></el-cascader>
          </el-form-item>
          <el-form-item label="难度">
            <el-radio v-model="form.questionDifficulty" label="1">简单</el-radio>
            <el-radio v-model="form.questionDifficulty" label="2">中等</el-radio>
            <el-radio v-model="form.questionDifficulty" label="3">困难</el-radio>
          </el-form-item>
          <el-form-item label="类型">
            <el-radio v-model="form.questionType" label="1">单选</el-radio>
            <el-radio v-model="form.questionType" label="2">多选</el-radio>
          </el-form-item>
          <el-form-item label="题干">
            <el-input v-model="form.questionContent" type="textarea" ></el-input>
          </el-form-item>
          <el-form-item label="A选项">
            <el-input v-model="form.questionOptionA"></el-input>
          </el-form-item>
          <el-form-item label="B选项">
            <el-input v-model="form.questionOptionB"></el-input>
          </el-form-item>
          <el-form-item label="C选项">
            <el-input v-model="form.questionOptionC"></el-input>
          </el-form-item>
          <el-form-item label="D选项">
            <el-input v-model="form.questionOptionD"></el-input>
          </el-form-item>
          <el-form-item label="答案">
            <el-radio-group v-if="form.questionType==1" v-model="form.questionAnswer">
              <el-radio label="A">A</el-radio>
              <el-radio label="B">B</el-radio>
              <el-radio label="C">C</el-radio>
              <el-radio label="D">D</el-radio>
            </el-radio-group>
            <el-checkbox-group v-if="form.questionType==2" v-model="checkValue">
              <el-checkbox label="A">A</el-checkbox>
              <el-checkbox label="B">B</el-checkbox>
              <el-checkbox label="C">C</el-checkbox>
              <el-checkbox label="D">D</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="解析">
            <el-input v-model="form.questionAnalysis" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="知识点">
            <el-button v-if="!form.knowledgeId && value[0]!=null" @click="getKnowledgeInfo">添加知识点</el-button>
            <el-tag v-else-if="form.knowledgeId!=null" class="ml-2" type="success" closable @close="tag_handleClose()">{{form.knowledgeContent}}</el-tag>
          </el-form-item>
        </el-form>
      </section>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 知识点列表 -->
    <el-dialog
      title="知识点列表"
      v-model="k_dialogVisible"
      width="60%"
      :before-close="k_handleClose">
      <el-table :data="k_pagination.data" border id="t_table">
      <!-- <el-table-column prop="userPhone" label="出题人"></el-table-column> -->
        <!-- <el-table-column prop="subjectName" label="课程"></el-table-column>
        <el-table-column prop="chapterName" label="章节"></el-table-column> -->
        <el-table-column prop="knowledgeContent" label="标签"></el-table-column>
        <el-table-column width="230" fixed="right">
          <template v-slot="scope">
            <el-button @click="select(scope.$index)" type="primary" size="small">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  data() {
    return {
      value:[],
      checkValue:[],
      data:[],
      condition: {//检索条件
        courseId:null,
        chapterId:null,
        questionDifficulty:null,
        questionType:null,
        questionLimition:1,
      },
      pagination: {
        //分页后的教师信息
        current: 1, //当前页
        total: null, //记录条数
        size: 6, //每页条数
        data:[]
      },
      k_pagination: {
        //分页后的教师信息
        current: 1, //当前页
        total: null, //记录条数
        size: 6, //每页条数
        data:[]
      },
      dialogVisible: false, //对话框
      k_dialogVisible:false,
      form: {}, //保存点击以后当前试题的信息
      knowledge:null,
      knowledgeList:[],
    };
  },
  computed: mapState(["subject","difficulty","type","authority","userInfo"]),
  created() {
    this.getQuestionInfo();
  },
  methods: {
    q_update(index) { //修改试题信息
      this.form = this.pagination.data[index];
      this.value[0] = this.form.courseId;
      this.value[1] = this.form.chapterId;
      if(this.form.questionType == 2){
        this.checkValue = this.form.questionAnswer.split("");
      }
      this.dialogVisible = true;
    },
    getKnowledgeInfo(){
      this.$axios.post('/admin/findKnowledgeByChapterIdAndCourseId',{"courseId":this.value[0],"chapterId":this.value[1]}).then(res => {
        console.log(res.data);
        if(res.data.code==200){
          this.knowledgeList = res.data.data;
          this.getKnowledgeInfoByPage();    
        }else{
          console.log("error");
        }
      })
    },
    getKnowledgeInfoByPage(){
      console.log("1");
      this.k_pagination.data = this.knowledgeList.slice((this.k_pagination.current-1)*this.k_pagination.size,this.k_pagination.current*this.k_pagination.size);
      for(let i=0;i<this.k_pagination.data.length;i++){
        this.k_pagination.data[i].subjectName = this.subject[this.k_pagination.data[i].courseId-1].label;
        this.k_pagination.data[i].chapterName = this.subject[this.k_pagination.data[i].courseId-1].children[this.k_pagination.data[i].chapterId-this.subject[this.k_pagination.data[i].courseId-1].num-1].label;
      }
      console.log("2");
      this.k_dialogVisible = true;
    },
    select(index){
      this.knowledge = this.k_pagination.data[index];
      this.form.knowledgeId = this.knowledge.knowledgeId;
      this.form.knowledgeContent = this.knowledge.knowledgeContent; 
      this.k_dialogVisible = false;
    },
    getQuestionInfo() {
      // 查询所有试题信息
      this.$axios.post('/admin/findAllQuestion').then((res)=>{
        if(res.data.code == 200){
          console.log(res.data.data);
					this.data = res.data.data;
        }
        this.getQuestionInfoBypage();
			})
    },
    search(){
      this.condition.questionMadeById=this.userInfo.id,
     
      this.$axios.post('/admin/findQuestionByRequirements',this.condition).then(res =>{
        console.log(res);
        if(res.data.code==200){
          this.data = res.data.data;
          this.getQuestionInfoBypage();
        }else{
          console.log("error");
        }
      })
    },
    getQuestionInfoBypage(){
      // 获取该分页的试题信息
      this.pagination.total = this.data.length;
      this.pagination.data = this.data.slice((this.pagination.current-1)*this.pagination.size,this.pagination.current*this.pagination.size);
      for(let i=0;i<this.pagination.data.length;i++){
        this.pagination.data[i].subjectName = this.subject[this.pagination.data[i].courseId-1].label;
        this.pagination.data[i].chapterName = this.subject[this.pagination.data[i].courseId-1].children[this.pagination.data[i].chapterId-this.subject[this.pagination.data[i].courseId-1].num-1].label;
        this.pagination.data[i].difficultyName = this.difficulty[this.pagination.data[i].questionDifficulty-1];
        this.pagination.data[i].typeName =  this.type[this.pagination.data[i].questionType-1];
        this.pagination.data[i].authority = this.authority[this.pagination.data[i].questionLimition];
      }
    },
    //改变当前记录条数
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getQuestionInfoBypage();
    },
    //改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.getQuestionInfoBypage();
    },
    q_delete(questionId) { //删除当前试题
      this.$confirm("确定删除当前试题吗？删除后无法恢复","Warning",{
        confirmButtonText: '确定删除',
        cancelButtonText: '算了,留着吧',
        type: 'danger'
      }).then(()=> { //确认删除
        this.$axios.post('/admin/deleteQuestion',{"questionId":questionId}).then(res => {
          if(res.data.code == 200){
            this.getQuestionInfo();
          }
          else{
            console.log("删除试题失败");
          }
        })
      }).catch(() => {

      })
    },
    submit() { //提交更改
      this.form.courseId = this.value[0];
      this.form.chapterId = this.value[1];
      if(this.form.questionType==2){
        this.form.questionAnswer = this.checkValue.sort().join("");
      }
      if(this.form.courseId==null){
        this.$message({
          message: '请选择章节',
          type: 'error'
        })
      }else if(this.form.questionDifficulty==null){
        this.$message({
          message: '请选择题目难度',
          type: 'error'
        })
      }else if(this.form.questionType==null){
        this.$message({
          message: '请选择试题类型',
          type: 'error'
        })
      }else if(this.form.questionContent==null || this.form.questionContent=="" ){
        this.$message({
          message: '题干不能为空',
          type: 'error'
        })
      }else if(this.form.questionOptionA==null || this.form.questionOptionB==null || this.form.questionOptionC==null || this.form.questionOptionD==null || this.form.questionOptionA=="" || this.form.questionOptionB=="" || this.form.questionOptionC=="" || this.form.questionOptionD==""){
        this.$message({
          message: '选项不能为空',
          type: 'error'
        })
      }else if(this.form.questionAnswer==null || this.form.questionAnswer==""){
        this.$message({
          message: '答案不能为空',
          type: 'error'
        })
      }else{
        if(this.form.knowledgeId==null){
          this.form.knowledgeId = 0;
        }
        
        this.$axios({
          url: 'admin/updateQuestion?knowledgeId='+this.form.knowledgeId,
          method: 'post',
          data: {
            ...this.form
          }}).then(res => {
          if(res.data.code == 200) {
            this.$message({
              message: '更新成功',
              type: 'success'
            })
          }else{
            console.log("修改失败");
          }
          this.getQuestionInfo();
          this.dialogVisible = false;
        })
      }
    },
    handleClose(done) { //关闭提醒
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        }).catch(_ => {});
    },
    k_handleClose(){
      this.k_dialogVisible = false;
    },
    tag_handleClose(){
      this.form.knowledgeId = null;
      this.knowledge = null;
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
.el-dialog{
  width: 200px;
}
</style>

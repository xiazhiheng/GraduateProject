<!-- 添加试题 -->
<template>
  <section class="add">
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
        <el-input v-model="form.questionContent" type="textarea" autosize></el-input>
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
        <el-input v-model="form.questionAnalysis" type="textarea" autosize></el-input>
      </el-form-item>
      <el-form-item label="知识点">
        <el-button v-if="!knowledge && value[0]!=null" @click="getKnowledgeInfo">添加知识点</el-button>
        <el-tag v-else-if="knowledge!=null" class="ml-2" type="success">{{knowledge.knowledgeContent}}</el-tag>
      </el-form-item>
      <el-form-item label="权限">
        <el-radio v-model="form.questionLimition" label="0">私有</el-radio>
        <el-radio v-model="form.questionLimition" label="1">公开</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()">立即创建</el-button>
        <el-button type="text" @click="cancel()">取消</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      title="知识点列表"
      v-model="dialogVisible"
      width="60%"
      :before-close="handleClose">
      <el-table :data="pagination.data" border id="t_table">
      <!-- <el-table-column prop="userPhone" label="出题人"></el-table-column> -->
        <el-table-column prop="subjectName" label="课程"></el-table-column>
        <el-table-column prop="chapterName" label="章节"></el-table-column>
        <el-table-column prop="knowledgeContent" label="标签"></el-table-column>
        <el-table-column width="230" fixed="right">
          <template v-slot="scope">
            <el-button @click="select(scope.$index)" type="primary" size="small">选择</el-button>
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
    </el-dialog>
  </section>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      dialogVisible:false,
      value:[],
      checkValue:[],
      knowledge:null,
      form: { //表单数据初始化
        questionContent:null,
        questionOptionA:null,
        questionOptionB:null,
        questionOptionC:null,
        questionOptionD:null,
        questionAnswer:null,
        questionDifficulty:null,
        questionType:null,
        questionAnalysis:null,
        questionMadeById:null,
        questionLimition:null,
        knowledgeId:0,
        courseId:null,
        chapterId:null,
      },
      knowledgeList:[],
      pagination: {
      //分页后的教师信息
        current: 1, //当前页
        total: null, //记录条数
        size: 6, //每页条数
        data:[]
      },
    };
  },
  computed:mapState(["subject",'userInfo']),
  methods: {
    getKnowledgeInfo(){
      this.$axios.post('/admin/findKnowledgeByChapterIdAndCourseId',{"courseId":this.value[0],"chapterId":this.value[1]}).then(res => {
        console.log(res.data);
        if(res.data.code==200){
          this.knowledgeList = res.data.data;
          this.getPaginationInfo();
        }else{
          console.log("error");
        }
      })
    },
    getPaginationInfo(){
      this.pagination.total = this.knowledgeList.length;
      this.pagination.data = this.knowledgeList.slice((this.pagination.current-1)*this.pagination.size,this.pagination.current*this.pagination.size);
      for(let i=0;i<this.pagination.data.length;i++){
        this.pagination.data[i].subjectName = this.subject[this.pagination.data[i].courseId-1].label;
        this.pagination.data[i].chapterName = this.subject[this.pagination.data[i].courseId-1].children[this.pagination.data[i].chapterId-this.subject[this.pagination.data[i].courseId-1].num-1].label;
      }
      this.dialogVisible = true;
    },
    select(index){
      this.knowledge = this.pagination.data[index];
      this.form.knowledgeId = this.knowledge.knowledgeId;
      this.dialogVisible = false;
    },
    onSubmit() { //数据提交
      this.form.questionMadeById = this.userInfo.id;
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
      }else if(this.form.questionOptionA==null || this.form.questionOptionB==null || this.form.questionOptionC==null || this.form.questionOptionD==null ){
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
          url: '/teacher/addQuestion?knowledgeId='+this.form.knowledgeId,
          method: 'post',
          data: {
            ...this.form
          }
        }).then(res => {
          if(res.data.code == 200) {
            this.$message({
              message: '数据添加成功',
              type: 'success'
            })
            this.$router.push({path: '/t_questionManage'})
          }
        })
      }
    },
    cancel() { //取消按钮
      this.value=[],
      this.form = {}
    },
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getPaginationInfo();
    },
    //改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.getPaginationInfo();
    },
  }
};
</script>
<style lang="scss" scoped>
.add {
  margin-top: 50px;
  padding: 0px 40px;
  width: 400px;
  overflow: auto;
}
</style>


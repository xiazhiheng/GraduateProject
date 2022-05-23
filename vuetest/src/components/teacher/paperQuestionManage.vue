<template>
  <div class="all">
    <el-button type="primary" @click="to_add">添加试题</el-button>
    <el-table :data="pagination.data" border id="t_table" v-if="flag">
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
      <el-table-column fixed="right">
          <template v-slot="scope">
            <el-button @click="t_delete(scope.row.questionId)" type="primary">删除</el-button>
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
import {mapState} from 'vuex'
export default {
  data() {
    return {
      flag:true,//管理已添加试题为true,添加试题为false 
      paperId: this.$route.query.paperId,
      data:[],
      // checkList:[],
      pagination: {
        //分页后的教师信息
        current: 1, //当前页
        total: null, //记录条数
        size: 6, //每页条数
        data:[]
      },

      form: {}, //保存点击以后当前试卷的信息
    };
  },
  computed: mapState(["subject","difficulty","type","authority",'userInfo']),
  created() {
    this.getPaperQuestionInfo();
  },
  methods: {
    getPaperQuestionInfo() {
      this.flag = true;
      // 查询已有试题信息
      this.$axios.post('teacher/findAllTestPaperQuestion',{"testPaperId":this.paperId}).then((res)=>{
					this.data = res.data.data;
          this.getQuestionInfoBypage();
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
      console.log(this.pagination.data);
    },
    //删除试卷中已添加的试题
    t_delete(questionId){
      this.$axios.post('/teacher/deleteTestPaperQuestion',{"testPaperId":this.paperId,"questionId":questionId}).then((res) => {
        this.getPaperQuestionInfo();
      });
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
    handleClose(done) { //关闭提醒
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        }).catch(_ => {});
    },
    to_add(){
      this.$router.push({path:"/t_addPaper",query:{"type":1,"paperId":this.paperId}})
    }
    // submit(){
    //   console.log(this.checkList);
    //   this.$axios.get('/teacher/addTestPaperQuestion?questionIds='+this.checkList+"&testPaperId="+this.paperId).then(res => {
    //     if(res.data.code == 200) {
    //       this.$message({
    //         message: '添加成功',
    //         type: 'success'
    //       })
    //     }else{
    //       console.log("添加失败");
    //     }
    //     this.getPaperQuestionInfo();
    //   })
    // }
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

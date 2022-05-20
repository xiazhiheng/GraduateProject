<template>
  <div class="all">
    <el-table :data="pagination.data" border id="k_table">
    <el-table-column prop="knowledgeMadeById" label="教师ID"></el-table-column>
    <el-table-column prop="subjectName" label="课程"></el-table-column>
    <el-table-column prop="chapterName" label="章节" width="200px"></el-table-column>
    <el-table-column prop="knowledgeContent" label="内容" width="150px"></el-table-column>
    <el-table-column label="视频" width="100px">
      <template v-slot="scope">
        <el-button @click="play(scope.$index)">播放</el-button>
      </template>
    </el-table-column>
    <el-table-column width="150px" fixed="right">
      <template v-slot="scope">
        <el-button @click="k_agree(scope.row.knowledgeId)" type="primary" size="small">通过</el-button>
        <el-button @click="k_delete(scope.row.knowledgeId)" type="danger" size="small">删除</el-button>
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
  <!-- 播放视频 -->
  <el-dialog
    v-model="dialogVisible"
    width="60%"
    :before-close="handleClose">
    <video height="400"
    controls
    autoplay 
    type="video/mp4"
    :src="videoUrl"
    >
    </video>
  </el-dialog>
</template>
<script>
import {mapState} from 'vuex'
export default{
  computed:mapState(["subject",'userInfo']),
  data(){
    return{
      videoUrl:null,
      value:[],
      data:[
        {
          id:null,
          courseId:1,
          chapterId:1,
          knowledgeContent:"邓小平理论",
          videoUrl:null,
          knowledgeStatus:0,
        }
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
    }
  },
  created(){
    // this.getPageInfo();
    this.getKnowledgeInfo();
  },
  methods:{
    getKnowledgeInfo(){
      this.$axios.post('/admin/findAllNoPassKnowledge').then(res => {
        if(res.data.code == 200){
          console.log(res.data.data);
          this.data = res.data.data
          this.getPageInfo();
        }
        else{
          this.data = [];
          this.getPageInfo();
        }
      })
    },
    getPageInfo(){
      this.pagination.total = this.data.length;
      this.pagination.data = this.data.slice((this.pagination.current-1)*this.pagination.size,this.pagination.current*this.pagination.size);
      console.log(this.pagination.data);
      for(let i=0;i<this.pagination.data.length;i++){
        this.pagination.data[i].subjectName = this.subject[this.pagination.data[i].courseId-1].label;
        this.pagination.data[i].chapterName = this.subject[this.pagination.data[i].courseId-1].children[this.pagination.data[i].chapterId-this.subject[this.pagination.data[i].courseId-1].num-1].label;
      }
    },
    // k_ban(id){
    //   this.$axios.post('');
    //   this.getKnowledgeInfo();
    // },
    // k_update(index){
    //   this.form = this.pagination.data[index];
    //   this.value[0] = this.form.courseId;
    //   this.value[1] = this.form.chapterId;
    //   this.dialogVisible = true;
    // },
    play(index){
      this.videoUrl = this.pagination.data[index].videoUrl;
      this.dialogVisible = true;
      console.log(this.videoFlag[index]); 
    },
    handleClose(){
      this.dialogVisible = false;
      this.videoUrl = null;
    },
    k_agree(id){
      console.log(id);
      this.$axios.post('/admin/updateKnowledgeVideoStatus',{"knowledgeId":id}).then(res => {
        if(res.data.code == 200){
          console.log("成功")
          this.getKnowledgeInfo();
        }else{
          console.log("error")
        }
      })
    },
    k_delete(id){
      this.$axios.post('/teacher/deleteKnowledge',{"knowledgeId":id}).then(res => {
        if(res.data.code == 200){
          console.log("删除成功")
          this.getKnowledgeInfo();
        }else{
          console.log("删除失败")
        }
      })
    },
    submit() { //提交更改
      this.dialogVisible = false,
      this.$axios('').then(res => {
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
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getPageInfo();
    },
    // 改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.getPageInfo();
    },
  },
}
</script>
<style>
  /* #k_table{
    margin: 50px;
  } */
  .all{
    margin-top: 50px;
    padding: 0px 40px;
  }
</style>
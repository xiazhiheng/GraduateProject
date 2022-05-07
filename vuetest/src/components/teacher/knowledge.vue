<template>
  <div class="all">
     <div id="top">
      <el-input v-model="input" id="search">
        <template #append>
          <el-button @click="search"><el-icon><search/></el-icon></el-button>
        </template>
      </el-input>
    </div>
    <el-table :data="pagination.data" border id="k_table">
    <!-- <el-table-column prop="userPhone" label="出题人"></el-table-column> -->
    <el-table-column prop="subjectName" label="课程"></el-table-column>
    <el-table-column prop="chapterName" label="章节" width="200px"></el-table-column>
    <el-table-column prop="knowledgeContent" label="内容" width="150px"></el-table-column>
    <el-table-column label="视频" width="100px">
      <template v-slot="scope">
        <el-button @click="play(scope.$index)">播放</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="state" label="状态"></el-table-column>
    <el-table-column width="100px" fixed="right">
      <template v-slot="scope">
        <!-- <el-button v-if="scope.row.knowledgeStatus" @click="k_ban(scope.row.id)" type="primary" size="small">公开</el-button>
        <el-button v-else @click="k_ban(scope.row.id)" type="danger" size="small">私有</el-button> -->
        <!-- <el-button @click="k_update(scope.$index)" type="primary" size="small">编辑</el-button> -->
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

  <!-- <el-dialog
      title="编辑知识点信息"
      v-model="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <section class="update">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="章节">
            <el-cascader v-model="value" :options="subject" @change="handleChange"></el-cascader>
          </el-form-item>
          <el-form-item label="内容">
            <el-input v-model="form.content"></el-input>
          </el-form-item>
          <el-form-item label="视频">
            <el-input v-model="form.videoUrl"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
    </el-dialog> -->

    <!-- 视频播放 -->
    <el-dialog
      v-model="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <video height="400"
      width="400"
      controls
      autoplay 
      type="video/mp4"
      :src="videoUrl">
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
      input:null,
      data:[],
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
      this.$axios.post('/teacher/findPersonalKnowledge',{"knowledgeMadeById":this.userInfo.id}).then(res => {
        if(res.data.code == 200){
          console.log(res.data.data);
          this.data = res.data.data
          this.getPageInfo();
        }
        else{
          console.log("查找知识点失败");
        }
      })
    },
    search(){
      this.$axios.post('').then(res =>{
        if(res.data.code==200){
          this.data = res.data.data;
          this.getPageInfo();
        }else{
          console.log("error");
        }
      })
    },
    getPageInfo(){
      this.pagination.total = this.data.length;
      this.pagination.data = this.data.slice((this.pagination.current-1)*this.pagination.size,this.pagination.current*this.pagination.size);
      for(let i=0;i<this.pagination.data.length;i++){
        this.pagination.data[i].subjectName = this.subject[this.pagination.data[i].courseId-1].label;
        this.pagination.data[i].chapterName = this.subject[this.pagination.data[i].courseId-1].children[this.pagination.data[i].chapterId-this.subject[this.pagination.data[i].courseId-1].num-1].label;
        this.pagination.data[i].state = this.pagination.data[i].videoStatus==1 ? "审核通过" : "未审核"
      }
       console.log(this.pagination.data);
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
    },
    handleClose(){
      this.dialogVisible = false;
      this.videoUrl = null;
    },
    k_delete(id){
      console.log(id);
      this.$axios.post('/teacher/deleteKnowledge',{"knowledgeId":id}).then(res => {
        if(res.data.code == 200){
          this.getKnowledgeInfo();
          console.log("删除成功")
        }else{
          console.log("删除失败")
        }
      })

    },
    // submit() { //提交更改
    //   this.dialogVisible = false,
    //   this.$axios('').then(res => {
    //     if(res.data.code == 200) {
    //       this.$message({
    //         message: '更新成功',
    //         type: 'success'
    //       })
    //     }else{
    //       console.log("修改失败");
    //     }
    //     this.getTeacherInfo()
    //   })
    // },
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getPageInfo();
    },
    //改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.getPageInfo();
    },
  },
}
</script>
<style>
  #top .el-input{
    float: left;
    width: 300px;
  }
  .all{
    margin-top: 50px;
    padding: 0px 40px;
  }
</style>
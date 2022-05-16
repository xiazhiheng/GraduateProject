<template>
  <div id="myExam">
    <!-- <div class="title">我的练习</div> -->
    <div class="wrapper" id="p_wrapper">
      <ul class="top">
        <li class="search-li"><div class="icon"><input type="text" placeholder="试卷名称" class="search" v-model="input"><i class="el-icon-search"></i></div></li>
        <li><el-button type="primary" @click="search()">搜索试卷</el-button></li>
      </ul>
      <ul class="paper" v-loading="loading">
        <li class="item" v-for="(item,index) in pagination.data" :key="index">
          <h4>{{item.testPaperName}}</h4>
          <!-- <p class="name">{{item.paperName}}</p>
          <p class="time">{{item.difficultyName}}</p> -->
          <!-- <p class="time">{{item.paperTime}}min</p> -->
          <el-button type="text" @click="answer(item.testPaperId,item.testPaperTime)" id="answer">开始答题</el-button>
          <!-- <div class="info">
            <i class="el-icon-loading"></i><span>{{item.examDate.substr(0,10)}}</span>
            <i class="iconfont icon-icon-time"></i><span v-if="item.totalTime != null">限时{{item.totalTime}}分钟</span>
            <i class="iconfont icon-fenshu"></i><span>满分{{item.totalScore}}分</span>
          </div> -->
        </li>
      </ul>
      <div id="foot">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.current"
          :page-sizes="[6, 10, 20, 40]"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total">
        </el-pagination>
      </div>
      
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  // name: 'myExam'
  data() {
    return {
      data:[],
      loading: false,
      input: null, //搜索关键字
      allExam: null, //所有考试信息
      pagination: { //分页后的考试信息
        current: 1, //当前页
        total: null, //记录条数
        size: 6, //每页条数
        data:[],
      }
    }
  },
  computed: mapState(["subject","difficulty",'userInfo']),
  created() {
    this.getExamInfo();
    this.loading = false;
  },
  // watch: {

  // },
  methods: {
    //获取当前所有考试信息
    getExamInfo() {
      this.$axios.post('/studentAnswer/findAllTestPaper',{"studentId":this.userInfo.id}).then(res => {
        console.log("paper",res);
        if(res.data.code==200){
          this.data = res.data.data
          this.loading = false
          this.getExamInfoByPage()
        }else{
          console.log("error");
        }
      }).catch(error => {
        console.log(error)
      })
      this.getExamInfoByPage();
    },
    getExamInfoByPage(){
      this.pagination.total = this.data.length;
      this.pagination.data = this.data.slice((this.pagination.current-1)*this.pagination.size,this.pagination.current*this.pagination.size)
      console.log(this.pagination.data);
      for(let i=0;i<this.pagination.data.length;i++){
        this.pagination.data[i].difficultyName = this.difficulty[this.pagination.data[i].paperDifficulty-1];
        this.pagination.data[i].chapterName = this.subject[this.pagination.data[i].courseId-1].children[this.pagination.data[i].chapterId-this.subject[this.pagination.data[i].courseId-1].num-1].label;
      }
    },
    answer(paperId,time){
      console.log(time);
      this.$router.push({path:"/exam",query:{paperId:paperId,time:time},})
    },
    //改变当前记录条数
    handleSizeChange(val) {
      this.pagination.size = val
      this.getExamInfoByPage();
    },
    //改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.current = val
      this.getExamInfoByPage();
    },
    //搜索试卷
    search() {
      this.$axios.post('/student/findTestPaperByName',{"testPaperName":this.input}).then(res => {
        if(res.data.code == 200) {
          this.data = res.data.data;
          this.getExamInfoByPage();
        }
      })
    },
  }
}
</script>


<style>
#answer{
  color: #000;
}
.wrapper::-webkit-scrollbar {/*滚动条整体样式*/
  width: 1px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.wrapper::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: #535353;
}
.wrapper1::-webkit-scrollbar-track {/*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  border-radius: 10px;
  background: #EDEDED;
}
.pagination{
  text-align:center;
}
.wrapper{
  /* height: 900px; */
  overflow: scroll;
}
.paper .item a {
  color: #000;
}
.wrapper .top .order {
  cursor: pointer;
}
.wrapper .top .order:hover {
  color: #0195ff;
  border-bottom: 2px solid #0195ff;
}
.wrapper .top .order:visited {
  color: #0195ff;
  border-bottom: 2px solid #0195ff;
}
.item .info i {
  margin-right: 5px;
  color: #0195ff;
}
.item .info span {
  margin-right: 14px;
}
.paper .item {
  width: 380px;
  border-radius: 4px;
  padding: 20px 30px;
  border: 1px solid #eee;
  box-shadow: 0 0 4px 2px rgba(217,222,234,0.3);
  transition: all 0.6s ease;
  margin: 20px;
}
.paper .item:hover {
  box-shadow: 0 0 4px 2px rgba(140, 193, 248, 0.45);
  transform: scale(1.03);
}
.paper .item .info {
  font-size: 14px;
  color: #88949b;
}
.paper * {
  margin: 20px 0;
}
.top .el-icon-search {
  position: absolute;
  right: 10px;
  top: 10px;
}
.top .icon {
  position: relative;
}
.wrapper .top {
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}
#myExam .search-li {
  margin-left: auto;
}
.top .search-li {
  margin-left: auto;
}
.top li {
  display: flex;
  align-items: center;
}
.top .search {
  margin-left: auto;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #eee;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
  transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
}
.top .search:hover {
  color: #0195ff;
  border-color: #0195ff;
}
.wrapper .top {
  display: flex;
}
.wrapper .top li {
  margin: 20px;
}
#myExam {
  width: 980px;
  margin: 0 auto;
}
#myExam .title {
  margin: 20px;
}
#myExam .wrapper {
  background-color: #fff;
}
.wrapper .top .order {
  cursor: pointer;
}
.wrapper .top .order:hover {
  color: #0195ff;
  border-bottom: 2px solid #0195ff;
}
.wrapper .top .order:visited {
  color: #0195ff;
  border-bottom: 2px solid #0195ff;
}
.item .info i {
  margin-right: 5px;
  color: #0195ff;
}
.item .info span {
  margin-right: 14px;
}
.paper .item {
  border-radius: 4px;
  padding: 20px 30px;
  border: 1px solid #eee;
  box-shadow: 0 0 4px 2px rgba(217,222,234,0.3);
  transition: all 0.6s ease;
}
.paper .item:hover {
  box-shadow: 0 0 4px 2px rgba(140, 193, 248, 0.45)
}
.paper .item .info {
  font-size: 14px;
  color: #88949b;
}
.paper .item .name {
  font-size: 14px;
  color: #0c0d0e;
}
.paper * {
  margin: 20px 0;
}
.wrapper .paper {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.top .el-icon-search {
  position: absolute;
  right: 10px;
  top: 10px;
}
.top .icon {
  position: relative;
}
.wrapper .top {
  border-bottom: 1px solid #eee;
}
#myExam .search-li {
  margin-left: auto;
}
.top .search-li {
  margin-left: auto;
}
.top li {
  display: flex;
  align-items: center;
}
.top .search {
  margin-left: auto;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #eee;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
  transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
}
.top .search:hover {
  color: #0195ff;
  border-color: #0195ff;
}
.wrapper .top {
  display: flex;
}
.wrapper .top li {
  margin: 20px;
}
#myExam {
  width: 980px;
  margin: 0 auto;
}
#myExam .title {
  margin: 20px;
}
#myExam .wrapper {
  background-color: #fff;
}
#foot{
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>

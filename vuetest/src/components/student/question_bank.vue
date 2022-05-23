<template>
  <div id="myExam">
    <!-- <div class="title">我的练习</div> -->
    <div class="wrapper" id="qb_wrapper">
      <ul class="paper">
        <li v-if="flag" class="item" id="book" v-for="(item,index) in list" :key="index" @click="to_chapter(index)">
          <el-image
          style="height: 100%"
          :src="require('@/assets/img/'+item.img+'.png')"
          :fit="scale-down"></el-image>
          <h1>{{item.label}}</h1>
        </li>
        <li v-else class="item" v-for="(item,index) in list" id="chapter">
          <h4>{{item.label}}</h4>
          <div v-if="!answerFlag[index]">
            <el-button @click="startPractice(item.value)">开始刷题</el-button>
          </div>
          <div v-else id="button">
            <el-button @click="to_continuePractice(item.value)">继续刷题</el-button>
            <el-button @click="to_fristPractice(item.value)">重新刷题</el-button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  // name: 'myExam'
  data() {
    return {
      flag:true,
      answerFlag:[],
      list:[],
    }
  },
  computed:mapState(["subject",'userInfo']),
  created() {
   this.list = this.subject;
   console.log(this.list);
  },
  methods: {
    to_chapter(index){
      this.list = this.subject[index].children;
      if(this.userInfo.id!=null){
        this.$axios.post('/studentAnswer/findStudentAnswerChapterId?userId='+this.userInfo.id+'&courseId='+(index+1)).then(res=>{
          console.log("test",res);
          if(res.data.code==200){
            console.log(res.data.data)
            for(let i=0;i<res.data.data.length;i++){
              let n = this.list.findIndex(item=>item.value == res.data.data[i])
              this.answerFlag[n] = true;    
            }
          }else{
            console.log("error");
          }
          this.flag = false;
        })
      }else{
        this.flag = false;
      }
    },
    startPractice(id){
      this.$router.push({path:'/practice',query:{paperId:id,isFrist:1}});
    },
    to_fristPractice(id){
      this.$axios.post('/studentAnswer/deleteStudentAnswer?userId='+this.userInfo.id+'&chapterId='+id).then(res=>{
        console.log(res.data);
      })
      this.$router.push({path:'/practice',query:{paperId:id,isFrist:1}})
    },
    to_continuePractice(id){
      this.$router.push({path:'/practice',query:{paperId:id,isFrist:0}})
    },
    getUrl(img){
      console.log(img);
      let url = require('@/assets/img/'+img+'.jpg');
      console.log(url);
      return url;
    }
  }
}
</script>


<style lang="scss">
.paper {
  height: auto;
  h1{
    max-width: 240px;
    color: rgb(74, 68, 68);
  }
  h4 {
    cursor: pointer;
  }

  .item a {
    color: #000;
  }
  .item {
    width: 380px;
    border-radius: 4px;
    padding: 20px 30px;
    border: 1px solid #eee;
    box-shadow: 0 0 4px 2px rgba(217,222,234,0.3);
    transition: all 0.6s ease;
  }
  .item:hover {
    box-shadow: 0 0 4px 2px rgba(140, 193, 248, 0.45);
    transform: scale(1.03);
  }
  .item .info {
    font-size: 14px;
    color: #88949b;
  }
  .item .name {
    font-size: 14px;
    color: #88949b;
  }
}
.item .info{
  i{
    margin-right: 5px;
    color: #0195ff;
  }
  span {
    margin-right: 14px;
  }
}
#myExam .search-li {
  margin-left: auto;
}
#myExam {
  width: 980px;
  margin: 0 auto;
}
#myExam .title {
  margin: 20px;
}
.item .info i {
  margin-right: 5px;
  color: #0195ff;
}
.item .info span {
  margin-right: 14px;
}
#myExam #qb_wrapper{
  background: whitesmoke;
  min-height: calc( 100vh - 80px);
  height: auto;
}
#qb_wrapper .paper .item {
  border-radius: 4px;
  padding: 20px 30px;
  border: 1px solid #eee;
  box-shadow: 0 0 4px 2px rgba(217,222,234,0.3);
  transition: all 0.6s ease;
  // width: 400px;
  height: 200px;
  margin-top: 20px;
  margin-left: 50px;
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
  color: #88949b;
}
.paper * {
  margin: 20px 0;
}
#qb_wrapper .paper {
  display: flex;
  // justify-content: space-between;
  flex-wrap: wrap;
}
#myExam .search-li {
  margin-left: auto;
}
#myExam {
  width: 980px;
  margin: 0 auto;
}
#myExam .title {
  margin: 20px;
}
#qb_wrapper .paper #chapter{
  background: white;
  color: #766a6a;
  margin: 20px;
  width: 28%;
}
#chapter *{
  margin: 20px;
}
#qb_wrapper .paper #book{
  width: auto;
  padding: 0;
  margin: 20px;
  display: flex;
  background: white;
}
#chapter #button{
  display: flex;
  margin: 0px;
  button{
    margin-left: 0px;
  }
}
.paper .el-image{
  margin-top: 0px;
  img{
    margin-top: 0px;
  }
}
</style>

<template>
  <div id="myExam">
    <!-- <div class="title">我的练习</div> -->
    <div class="wrapper" id="qb_wrapper">
      <ul class="paper">
        <li v-if="flag" class="item" v-for="(item,index) in list" :key="index" @click="to_chapter(index)">
          <h4>{{item.label}}</h4>
        </li>
        <li v-else class="item" v-for="(item,index) in list">
          <h4>{{item.label}}</h4>
          <div v-if="!answerFlag[index]">
            <el-button @click="startPractice(item.value)">开始刷题</el-button>
          </div>
          <div v-else>
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
   this.list = this.subject
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
    }
  }
}
</script>


<style lang="scss">
.paper {
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
  *{
    margin: 20px 0;
  }
}
// .wrapper {
//   height: auto;
//   overflow: auto;
// }
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
#myExam .wrapper {
  background-color: #fff;
}
.item .info i {
  margin-right: 5px;
  color: #0195ff;
}
.item .info span {
  margin-right: 14px;
}
#qb_wrapper{
  height: auto;
}
#qb_wrapper .paper .item {
  border-radius: 4px;
  padding: 20px 30px;
  border: 1px solid #eee;
  box-shadow: 0 0 4px 2px rgba(217,222,234,0.3);
  transition: all 0.6s ease;
  width: 40%;
  height: 200px;
  margin-top: 20px;
  margin-left: 50px;
  margin-right: 50px;
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
  justify-content: space-between;
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
#myExam .wrapper {
  background-color: #fff;
}
</style>

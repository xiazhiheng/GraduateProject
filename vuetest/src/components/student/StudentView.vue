<template>
  <div class="about">
    <!-- <el-container> -->
    <el-container>
      <el-header id="header">
        <div class="head">
          <el-row :gutter="10">
            <el-col :span="6" class="hidden-xs-only">
              <el-input v-model="input" placeholder="请输入内容"></el-input>
              <!-- <el-button>搜索</el-button> -->
            </el-col>
            <el-col :span="15">
              <el-menu class="el-menu-demo" mode="horizontal">
                <el-menu-item id="menu" index="1" @click="to_index">首页</el-menu-item>
                <el-menu-item id="menu" index="2" @click="to_qes">题库</el-menu-item>
                <el-menu-item id="menu" index="3" @click="to_paper">试卷</el-menu-item>
                <el-menu-item id="menu" index="4" @click="to_collect">收藏</el-menu-item>
                <el-menu-item id="menu" index="5" @click="to_battle">对战</el-menu-item>
                <el-menu-item id="menu" index="6" @click="to_memo">辅助功能</el-menu-item>
              </el-menu>
            </el-col>
            <!-- <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11"><div class="grid-content bg-purple"></div></el-col> -->
            <el-col :span="3">
              <component :is="display" :name="name" :circleUrl="circleUrl"></component>
            </el-col>
          </el-row>
        </div>
      
      </el-header>

      <el-main id="main">
        <router-view></router-view>
      </el-main>
    </el-container>
    
  </div>
</template>
<script>
import not_login from '../common/not_login.vue'
import is_login from '../common/is_login.vue'

export default {
  name: 'Login',
  data(){
    return{
      userInfo:{},
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      input:null,
      dialogVisible:false,
    }
  },
  components:{
    not_login,
    is_login,
  },
  created(){
    this.userInfo.id = localStorage.getItem("cId");
    this.userInfo.name = localStorage.getItem("cName");
    this.userInfo.imgUrl = localStorage.getItem("img");
    this.userInfo.role = localStorage.getItem("role");
    this.$store.commit("setUserInfo",this.userInfo);
    if(this.userInfo.role!='student'){
      this.$router.push({path:'/login'});
    }else{
      if(this.userInfo.id == null){
        this.display="not_login"
      }else{
        this.display="is_login"
      }
    }
  },
  methods:{
    to_index(){
      this.$router.push({path:'/'});
    },
    to_qes(){
      this.$router.push({path:'/question_bank'});
    },
    to_paper(){
      if(this.userInfo.id!=null){
        this.$router.push({path:'/paper'});
      }
    },
    to_collect(){
      if(this.userInfo.id!=null){
        this.$router.push({path:'/collect'});  
      }
    },
    to_memo(){
      if(this.userInfo.id!=null){
        this.$router.push({path:'/memo'});
      }
    },
    to_battle(){
      if(this.userInfo.id!=null){
        this.$router.push({path:'/competition'});
      }
    }
  }
}
</script>
<style>
  #menu{
    font-size: 16px;
    font-family: 微软雅黑, 'Microsoft YaHei';
  }
  #header{
    background-color: white;
  }
  .infinite-list-wrapper{
    height: 300px;
  }

  .list-item{
    margin: 5px;
    height: 40px;
  }
  .el-header{
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    /* line-height: 60px; */
  }
  .head{
    min-width: 760px;
    margin-top: 10px;
  }

  .hm{
    min-width: 450px;
  }

  .hr{
    min-width: 100px;
  }
   .el-aside {
    background-color: #D3DCE6;
    color: #333;
    /* text-align: center; */
    height: 350px;
    margin: 10px;
    border-radius: 10px;
    /* line-height: 200px; */
  }
  #main{
    background-color: white;
  }
  .el-main {
    background-color: #D3DCE6;
    margin: 10px;
    /* text-align: center; */
    /* line-height: 160px; */
  }

  .h-avatar{
    margin-top: 5px;
    margin-right: 10px;
  }

  .as-avatar{
    margin-top: 50px;
  }


  .ad{
    float: right;
    width: 500px;
  }
  
   .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }

  body > .el-container {
    margin-bottom: 40px;
  }
  
   .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  /* .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  } */
</style>

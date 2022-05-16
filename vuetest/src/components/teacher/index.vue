// 展示组件页面
<template>
  <div id="index">
    <div class="topbar">
      <header1></header1>
    </div>
    <div class="container" id="container">
      <div class="left_side">
        <mainLeft></mainLeft>
      </div>
      <div class="main_wrapper">
        <!-- <navigator class="nav"></navigator> -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import header from '@/components/common/header'
import mainLeft from '@/components/common/mainLeft'
import navigator from '@/components/common/navigator'
import {mapState} from 'vuex'
export default {
  data() {
    return {
      userInfo:{},
    }
  },
  created(){
    this.userInfo.id = localStorage.getItem("cId");
    this.userInfo.name = localStorage.getItem("cName");
    this.userInfo.imgUrl = localStorage.getItem("img");
    this.userInfo.role = localStorage.getItem("role");
    this.$store.commit("setUserInfo",this.userInfo);
    if(this.userInfo.id==null || this.userInfo.role!="teacher"){
      this.$router.push('/login');
    }
  },
  components:{
    header1: header,
    mainLeft: mainLeft,
    navigator:navigator,
  },
  methods: {
    
  },
}
</script>

<style lang="scss" scoped>
*{		/* CSS Reset */
	margin : 0;
	padding : 0;
}
#container{
  height: 100%;
  max-width: 100vw;
  min-height: calc( 100vh - 80px);
  padding: 0;
  // overflow: auto;
}
#index{
   height: 100%;
   .nav {
    box-shadow: 1px 0 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
  }
} 
.topbar{
 
}
.container {
  display: flex;
  background-color: #fff;
}
.left_side{
  
}
.main_wrapper {
  overflow: hidden;
  flex: 1;
  background-color: #fff;
}
</style>


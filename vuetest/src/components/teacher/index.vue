// 展示组件页面
<template>
  <div id="index">
    <header1 class="topbar"></header1>
    <section class="container" id="container">
      <div class="left_side">
        <mainLeft></mainLeft>
      </div>
      <div class="main_wrapper">
        <!-- <navigator class="nav"></navigator> -->
        <router-view></router-view>
      </div>
    </section>
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
#container{
  max-width: 2000px;
  width: 100%;
  margin: 0;
  padding: 0;
  height: 100%;
}
#index .nav {
  box-shadow: 1px 0 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}
.container {
  display: flex;
  background-color: #fff;
}
.main_wrapper {
  overflow: hidden;
  flex: 1;
  background-color: #fff;
}
</style>


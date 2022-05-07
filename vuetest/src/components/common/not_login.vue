<template>
  <div class="grid-content bg-purple-light hr" style="width:100%">
    <div style="display:inline;"><el-avatar :size="40" :src="circleUrl" class="h-avatar"></el-avatar></div>
    <div style="display:inline;position:relative;height:100%;"><el-button id="p_login" type="text" @click="to_login">请登录</el-button></div>
  </div>
</template>
<script>
  export default{
    name: 'not_login',
    data(){
      return {
        circleUr: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      }
    },
    methods:{
      to_login(){
        this.$router.push({path: '/login'});
      },
    }
  }
</script>
<style>
  #p_login{
    color: black;
  }
</style>

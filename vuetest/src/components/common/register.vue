<template>
  <div id="app">
    <div class="wrapper">
      <div class="container" id="regist">
        <div class="form">
           <el-alert v-show="play" :title="'注册成功 账号: '+account" type="success" effect="dark" @close="to_login"></el-alert>
          <table>
            <tr>
              <td>昵称:</td>
              <td><input type="text" v-model="name"></td>
            </tr>
            <tr>
              <td>密码:</td>
              <td><input type="password" v-model="password" onkeyup="this.value=this.value.replace(/[, ]/g,'')"></td>
            </tr>
            <tr>
              <td>重复密码:</td>
              <td><input type="password" v-model="re_password" onkeyup="this.value=this.value.replace(/[, ]/g,'')"></td>
            </tr>
             <tr>
               <td></td>
              <td v-if="play"><button id="login-button" @click="to_login">返回登录</button></td>
              <td v-else><button id="login-button" @click="register">注册</button></td>
            </tr>
          </table>
        </div>
      </div>

		<ul class="bg-bubbles">
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
		</ul>
	</div>
</div>
</template>
<script>
import axios from 'axios'
export default {
  name:'register',
  data(){
    return{
      name:null,
      password:null,
      re_password:null,
      account:null,
      play:false
    }
  },
  methods:{
    register(){
      console.log("test")
      if(this.password != this.re_password){
        this.$message({message:'两次密码不一致',type:'error'});
      }else{
        this.$axios.post('/login/signup?userName='+this.name+"&userPassword="+this.password).then((res)=>{
          if(res.data.code==200){
            this.account=res.data.data;
            this.play=true;
          }
          else{
            this.$message({message:'注册失败',type:'error'});
          }
        })
      }
    },
    to_login(){
      this.$router.push({path: '/login'});
    }
  }
}
</script>
<style>
  #regist{
    display: flex;
    justify-content: center;
  }
</style>

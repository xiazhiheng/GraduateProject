<template>
  <div id="app">
	<div class="wrapper">
		<div class="container">
			<h1>Welcome</h1>
			<!-- <div class="role">
				<button  @click="stu">学生</button>
				<button  @click="tea">教师</button>
				<button  @click="admin">管理员</button>
			</div> -->
			
			<div class="form" id="login">
				<el-button type="text">登录</el-button>/
				<el-button type="text" @click="to_register">注册</el-button>
				<input type="text" placeholder="Username" v-model="account">
				<input type="password" placeholder="Password" v-model="pass">
				<button id="login-button" @click="login">Login</button>
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
import {mapState} from 'vuex'
export default {
  name: 'Login',
  data(){
    return{
			url:"",
			role:0,
      account:'',
      pass:''
    }
  },
	computed: mapState(["user"]),
  methods:{
    login(){
			console.log("test");
			this.$axios.post('/login/userlogin',{"userId":this.account,"userPassword":this.pass}).then((res)=>{
					console.log(res.data);
					if(res.data.code == 200){
						localStorage.setItem("uToken",res.data.data.uToken);
						localStorage.setItem("cId",res.data.data.tokenUser.userId);
						localStorage.setItem("cName",res.data.data.tokenUser.userName);
						localStorage.setItem("img",res.data.data.tokenUser.userImageUrl);
						localStorage.setItem("role",res.data.data.tokenUser.userIdentity);
						if(res.data.data.tokenUser.userIdentity=="student"){
							this.$router.push({path: '/'});
						}
						else if(res.data.data.tokenUser.userIdentity=="admin"){
							this.$router.push({path: '/admin'});
						}
						else if(res.data.data.tokenUser.userIdentity=="teacher"){
							this.$router.push({path: '/teacher'});
						}
					}
					else if(res.data.code == 502){
						this.$message({message:'账号或密码不正确',type:'error'});
					}else if(res.data.code == 501){
						this.$message({message:res.data.data.userName+'您的账号已被封禁,如需解封请联系管理员'+'\n'+'管理员电话：17740419819',type:'error'});
					}
			})
    },
		to_register(){
			this.$router.push({path: '/register'});
		}
  }
}
</script>
<style lang="scss" scoped>
	#login .el-button{
		width: 80px;
		color: rgba(16, 14, 14, 0.692);
		background-color:rgba(249, 244, 244, 0);
	}
	#login .el-button :hover{
		font-size: 150%;
	}
</style>

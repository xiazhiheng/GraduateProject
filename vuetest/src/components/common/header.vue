<!-- 顶部信息栏 -->
<template>
  <header id="topbar">
    <el-row>
      <el-col :span="4" class="topbar-left">
        <span class="title" @click="index()">ZG-EXAM-SYSTEM</span>
      </el-col>
      <el-col :span="20" class="topbar-right">
        <i class="el-icon-menu" @click="toggle()"></i>
        <div class="user">
          <span>{{userInfo.name}}</span>
          <img :src="userInfo.imgUrl" class="user-img" ref="img" @click="showSetting()" />
          <transition name="fade">
            <div class="out" ref="out" v-show="login_flag">
              <ul v-if="userInfo.role == 'teacher'">
                <li @click="pInfor">
                  <el-icon><Avatar/></el-icon>
                  <a href="javascript:;">个人信息</a></li>
                <li @click="message">
                  <el-icon><ChatLineSquare /></el-icon>
                  <a href="javascript:;">消息</a>
                  <el-badge is-dot class="item" v-if="unReadFlag" id="dot"></el-badge>
                </li>
                <li @click="addressList">
                  <el-icon><List/></el-icon>
                  <a href="javascript:;">通讯录</a>
                </li>
                <li @click="up_dialogVisible = true">
                  <el-icon><Edit /></el-icon>
                  <a href="javascript:;">修改密码</a>
                </li>
                <li class="exit" @click="exit()"><a href="javascript:;">退出登录</a></li>
              </ul>
              <ul v-else>
                <li class="exit" @click="exit()"><a href="javascript:;">退出登录</a></li>
              </ul>
            </div>
          </transition>
        </div>
      </el-col>
    </el-row>
  </header>

  <!-- 个人信息 -->
  <el-dialog 
  v-model="p_dialogVisible"
  :before-close="p_handleClose">
    <pInfor></pInfor>
  </el-dialog>
  <!-- 消息 -->
  <el-dialog 
  v-model="m_dialogVisible"
  :before-close="m_handleClose">
    <message></message>
  </el-dialog>
  <!-- 通讯录 -->
  <el-dialog 
  title="通讯录"
  center
  top="20px"
  width="30%"
  v-model="a_dialogVisible"
  :before-close="a_handleClose">
    <addressList></addressList>
  </el-dialog>
  <!-- 修改密码 -->
  <el-dialog 
    title="修改密码"
    v-model="up_dialogVisible"
    width="30%"
    :before-close="s_handleClose">
      <el-form id="form">
        <el-form-item label="旧密码 :">
          <el-input v-model="form.oldPassword" show-password onkeyup="this.value=this.value.replace(/[, ]/g,'')" maxlength="18"></el-input>
        </el-form-item>
        <el-form-item label="新密码 :">
          <el-input v-model="form.newPassword" show-password onkeyup="this.value=this.value.replace(/[, ]/g,'')" maxlength="18"></el-input>
        </el-form-item>
        <el-form-item label="重复密码:">
          <el-input v-model="form.repeatPassword" show-password onkeyup="this.value=this.value.replace(/[, ]/g,'')" maxlength="18"></el-input>
        </el-form-item>
          <div id="footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submit()">确 定</el-button>
        </div>
      </el-form>
  </el-dialog>
</template>

<script>
// import store from '@/vuex/store'
import {mapState,mapMutations} from 'vuex'
import message from '../common/message.vue'
import addressList from '../common/addressList.vue'
import pInfor from '../common/pInfor.vue'

export default {
  data() {
    return {
      login_flag : false,
      p_dialogVisible: false,
      m_dialogVisible: false,
      a_dialogVisible: false,
      up_dialogVisible:false,
      unReadFlag:false,
      form:{},
    }
  },
  components:{
    message,
    addressList,
    pInfor,
  },
  created() {
    // this.$axios.post('/websocketChat/findIsHaveNoReadChat',{"userId":this.userInfo.id}).then(res=>{
    //   console.log(res.data);
    //   if(res.data.code==200){
    //     this.unReadFlag = true;
    //   }
    // })
  },
  computed: mapState(["flag","menu",'userInfo']),
  methods: {
    //显示、隐藏退出按钮
    showSetting() {
      this.login_flag = !this.login_flag
      this.getUnRead();
    },
    getUnRead(){
      this.$axios.post('/websocketChat/findIsHaveNoReadChat',{"userId":this.userInfo.id}).then(res=>{
        console.log(res.data);
        if(res.data.code==200){
          this.unReadFlag = true;
        }else{
          this.unReadFlag = false;
        }
        console.log(this.unReadFlag);
      })
    },
    //左侧栏放大缩小
    ...mapMutations(["toggle"]),
    index() {
      if(this.userInfo.role=="admin"){
        this.$router.push({path: '/static'})
      }else if(this.userInfo.role=="teacher"){
        this.$router.push({path: '/homePage'})
      }
    },
    pInfor(){
      this.p_dialogVisible = true;
    },
    message(){
      this.m_dialogVisible = true;
    },
    addressList(){
      this.a_dialogVisible = true;
    },
    p_handleClose(){
      this.p_dialogVisible = false;
    },
    m_handleClose(){
      this.m_dialogVisible = false;
    },
    a_handleClose(){
      this.a_dialogVisible = false;
    },
    exit() {
      localStorage.removeItem("cId");
      localStorage.removeItem("cName");
      localStorage.removeItem("img");
      localStorage.removeItem("role");
      localStorage.removeItem("uToken")
      this.$router.push({path:"/login"}) //跳转到登录页面
    },
    cancel(){
      this.up_dialogVisible = false;
      this.form = {};
    },
    submit(){
        this.$axios.post("/student/ourMessage",{'studentId':this.userInfo.id}).then(res =>{
          console.log(res.data);
          if(res.data.code==200){
            let password = res.data.data.userPassword;
            if(this.form.oldPassword!=password){
              this.$message.error('密码错误');
            }else if(this.form.newPassword == this.form.oldPassword){
              this.$message.error('新旧密码重复');
            }else if(this.form.newPassword==null || this.form.newPassword==""){
              this.$message.error('请输入新密码');
            }else if(this.form.newPassword!=this.form.repeatPassword){
              this.$message.error('两次密码不一致');
            }else{
              this.$axios.post('/student/updatePassword',{"userId":this.userInfo.id,"userPassword":this.form.newPassword,"userOldPassword":password}).then(res=>{
                console.log(res);
                if(res.data.code==200){
                  this.$message.success('修改成功');
                  this.up_dialogVisible = false;
                  this.form = {};
                }else{
                  console.log("error");
                }
              })
            }
          }else{
            console.log("error");
          }
        })
    },
    
  },
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
#topbar {
  position: relative;
  z-index: 10;
  background-color: #1E9FFF;
  height: 80px;
  line-height: 80px;
  color: #fff;
  box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.5);
}
#topbar .topbar-left {
  height: 80px;
  display: flex;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
  overflow: hidden;
}
.topbar-left .icon-kaoshi {
  font-size: 60px;
}
.topbar-left .title {
  font-size: 20px;
  cursor: pointer;
}
.topbar-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.topbar-right .user-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.topbar-right .el-icon-menu {
  font-size: 30px;
  margin-left: 20px;
}
.topbar-right .user {
  position: relative;
  margin-right: 40px;
  display: flex;
}
.topbar-right .user .user-img {
  margin-top: 15px;
  margin-left: 10px;
  cursor: pointer;
}
.user .out {
  width: 100px;
  font-size: 14px;
  position: absolute;
  top: 80px;
  right: 0px;
  background-color: #fff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 12px;
}
.user .out ul {
  list-style: none;
}
.user .out ul > li {
  display: flex;
  align-items: center;
  height: 26px;
  line-height: 26px;
}
.out a {
  text-decoration: none;
  color: #000;
}
.out .exit {
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px solid #ccc;
}
.out .el-icon{
  margin-right: 5px;
  color: #1E9FFF;
}
#dot{
  margin-right: 0px;
}
</style>

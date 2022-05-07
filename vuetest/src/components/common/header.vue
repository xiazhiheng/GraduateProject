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
                <li @click="pInfor"><a href="javascript:;">个人信息</a></li>
                <li @click="message"><a href="javascript:;">消息</a></li>
                <li @click="addressList"><a href="javascript:;">通讯录</a></li>
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

  <el-dialog 
  v-model="p_dialogVisible"
  :before-close="p_handleClose">
    <pInfor></pInfor>
  </el-dialog>
  <el-dialog 
  v-model="m_dialogVisible"
  :before-close="m_handleClose">
    <message></message>
  </el-dialog>
  <el-dialog 
  title="通讯录"
  center
  top="20px"
  v-model="a_dialogVisible"
  :before-close="a_handleClose">
    <addressList></addressList>
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
    }
  },
  components:{
    message,
    addressList,
    pInfor,
  },
  created() {
    
  },
  computed: mapState(["flag","menu",'userInfo']),
  methods: {
    //显示、隐藏退出按钮
    showSetting() {
      this.login_flag = !this.login_flag
    },
    //左侧栏放大缩小
    ...mapMutations(["toggle"]),
    index() {
      this.$router.push({path: '/static'})
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
    }
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
</style>

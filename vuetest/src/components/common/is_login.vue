<template>
  <div class="grid-content bg-purple-light hr">
    <el-dropdown>
      <div class="el-dropdown-link" id="login_head">
        <el-avatar :size="50" :src="userInfo.imgUrl" class="h-avatar" :fit="none"></el-avatar>
        <!-- <el-button type="text" id="login_name">{{userInfo.name}}</el-button> -->
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item><el-button @click="pInfo" type="text">个人信息</el-button></el-dropdown-item>
          <el-dropdown-item>
            <el-button type="text" @click="message">消息</el-button>
            <el-badge is-dot class="item" v-if="unReadFlag"></el-badge>
          </el-dropdown-item>
          <el-dropdown-item><el-button type="text" @click="addressList">通讯录</el-button></el-dropdown-item>
          <el-dropdown-item><el-button type="text" @click="up_dialogVisible = true">修改密码</el-button></el-dropdown-item>
          <el-dropdown-item><el-button type="text" @click="to_login">退出登录</el-button></el-dropdown-item>
        </el-dropdown-menu>
      </template>  
    </el-dropdown> 
    <!-- 消息 -->
    <el-dialog 
    top="20px"
    title="消息"
    v-model="m_dialogVisible"
    :before-close="m_handleClose">
      <message></message>
    </el-dialog>
    <!-- 通讯录 -->
    <el-dialog 
    title="通讯录"
    center
    top="20px"
    v-model="a_dialogVisible"
    :before-close="a_handleClose">
      <addressList></addressList>
    </el-dialog>
    <!-- 个人信息 -->
    <el-dialog 
    v-model="p_dialogVisible"
    :before-close="p_handleClose">
      <pInfo></pInfo>
    </el-dialog>

    <!-- 日常提醒 -->
    <el-dialog 
    title="今日消息提醒"
    v-model="s_dialogVisible"
    :before-close="s_handleClose">
      <p>{{memo.studentScheduleContent}}</p>
    </el-dialog>
    <!-- 修改密码 -->
    <el-dialog 
    title="修改密码"
    v-model="up_dialogVisible"
    :before-close="s_handleClose">
      <el-form id="form">
        <el-form-item label="旧密码 :">
          <el-input v-model="form.oldPassword" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码 :">
          <el-input v-model="form.newPassword" show-password></el-input>
        </el-form-item>
        <el-form-item label="重复密码:">
          <el-input v-model="form.repeatPassword" show-password></el-input>
        </el-form-item>
          <div id="footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submit()">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>

  </div>
</template>
<script>
  import message from '../common/message.vue'
  import addressList from '../common/addressList.vue'
  import pInfo from '../common/pInfor.vue'
  import {mapState} from 'vuex'
  export default{
    name:"is_login",
    components:{
      pInfo,
      message,
      addressList,
    },
    computed:mapState(['userInfo']),
    data(){
      return{
        circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
        p_dialogVisible:false,
        m_dialogVisible:false,
        a_dialogVisible:false,
        s_dialogVisible:false,
        up_dialogVisible:false,
        dialogVisible:true,
        display:false,
        unReadFlag:false,
        memo:{},
        form:{},
      }
    },
    created(){
      if(this.userInfo.id!=null){
        this.getSchedule();
        this.$axios.post('/websocketChat/findIsHaveNoReadChat',{"userId":this.userInfo.id}).then(res=>{
          console.log(res.data);
          if(res.data.code==200){
            this.unReadFlag = true;
          }
          console.log(this.unReadFlag);
        })
      }
    },
    methods:{
      getSchedule(){
        this.$axios.post('/student/selectNowadays?userId='+this.userInfo.id).then(res=>{
          console.log(res.data);
          if(res.data.code==200){
            this.memo = res.data.data[0];
            this.s_dialogVisible = true;
          }
        })
      },
      to_login(){
        localStorage.removeItem("cId");
        localStorage.removeItem("cName");
        localStorage.removeItem("img");
        localStorage.removeItem("role");
        localStorage.removeItem("uToken")
        this.$router.push({path: '/login'});
      },
      to_addressList(){
        this.$router.push('/s_addressList');
      },
      pInfo(){
        this.p_dialogVisible = true;
      },
      message(){
        this.m_dialogVisible = true;
        console.log("test");
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
      s_handleClose(){
        this.s_dialogVisible = false;
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
    }
  }
</script>
<style>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  #login_head{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

  }
  .h-avatar{
    display: inline-block;
  }
  #login_name{
    display: inline-block;
  }
  .item {
    margin-top: 10px;
    margin-right: 40px;
  }
  #form{
    max-width: 300px;
  }
</style>

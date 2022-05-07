<template>
  <div class="main" id="addressList_main">
    <el-collapse @change="handleChange" id="address">
        <!-- <div> -->
        <el-button v-if="userInfo.role == 'student'" type="text" @click="to_searchTeacher" id="searchTeacher"><el-icon><plus/></el-icon></el-button>
        <el-collapse-item v-if="userInfo.role == 'student'" title="老师">
          <div v-for="(item,index) in teacherList">{{item.userName}}</div>
        </el-collapse-item>
        <el-button v-if="userInfo.role == 'student'" type="text" @click="to_searchStudent" id="searchStudent"><el-icon><plus/></el-icon></el-button>
        <!-- </div> -->
        <el-collapse-item title="学生">
        <div v-for="(item,index) in studentList">{{item.userName}}</div>
        </el-collapse-item>
        <el-collapse-item title="待同意">
          <div v-for="(item,index) in waitAgreeList">
            <span id="name">{{item.userName}}</span>
            <el-button @click="agree(item.userId)">同意</el-button>
            <el-button @click="refuse(item.userId)">拒绝</el-button>
          </div>
        </el-collapse-item>
    </el-collapse>
    <!-- 添加教师 -->
    <el-dialog
      v-model="t_dialogVisible"
      width="30%"
      :before-close="t_handleClose">
      <el-input v-model="input">
        <template #append>
          <el-button @click="searchTeacher"><el-icon><search/></el-icon></el-button>
        </template>
      </el-input>
      
      <ul>
        <li v-for="item in userList" id="addList">
          <el-avatar :size="30" class="h-avatar" :src="item.userImageUrl"></el-avatar>
          <p>{{item.userName}}</p>
          <el-button @click="addTeacher(item.userId)">添加</el-button>
        </li>
      </ul>
    </el-dialog>
    <!-- 添加学生 -->
    <el-dialog
      v-model="s_dialogVisible"
      width="30%"
      :before-close="s_handleClose">
      <el-input v-model="input">
        <template #append>
          <el-button @click="searchStudent"><el-icon><search/></el-icon></el-button>
        </template>
      </el-input>
      <ul>
        <li v-for="item in userList" id="addList"> 
          <el-avatar :size="30" class="h-avatar" :src="item.userImageUrl"></el-avatar>
          <p>{{item.userName}}</p>
          <el-button @click="addStudent(item.userId)">添加</el-button>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  data(){
    return{
      flag:[false,false,false],
      t_dialogVisible:false,
      s_dialogVisible:false,
      input:null,
      teacherList:[],
      studentList:[],
      waitAgreeList:[],
      userList:[],
    }
  },
  created(){
    this.init();
  },
  computed:mapState(['userInfo']),
  methods:{
    init(){
      if(this.userInfo.role == "student"){
        this.$axios.post('/student/findAgreeTeacher',{"studentId":this.userInfo.id}).then(res =>{
          if(res.data.code == 200){
            this.teacherList = res.data.data;
          }else{
            console.log("请求老师列表失败");
          }
        });
      }
      if(this.userInfo.role == "student"){
        this.$axios.post('/student/findOurFriends?userId='+this.userInfo.id).then(res =>{
          if(res.data.code == 200){
            this.studentList = res.data.data;
          }else{
            console.log("请求好友列表失败");
          }
        });
      }else if(this.userInfo.role == "teacher"){
        this.$axios.post('/teacher/findNoAgreeStudent',{"teacherId":this.userInfo.id}).then(res =>{
          if(res.data.code == 200){
            this.studentList = res.data.data;
          }else{
            console.log("请求学生列表失败");
          }
        });
      }else{
        console.log("角色名异常")
      }

      if(this.userInfo.role == "student"){
        this.$axios.post('/student/findNewFriends?studentId='+this.userInfo.id).then(res =>{
          console.log(res.data);
          if(res.data.code == 200){
            this.waitAgreeList = res.data.data;
            console.log(this.waitAgreeList);
          }else{
            console.log("学生请求待同意列表失败");
          }
        });
      }else if(this.userInfo.role == "teacher"){
        this.$axios.post('/teacher/findNoAgreeStudent',{"teacherId":this.userInfo.id}).then(res =>{
          if(res.data.code == 200){
            this.waitAgreeList = res.data.data;
            console.log(this.waitAgreeList);
          }else{
            console.log("老师请求待同意列表失败");
          }
        });
      }else{
        console.log("角色名异常");
      }
      
    },
    agree(id){
     if(this.userInfo.role == "student"){
        this.$axios.post('/student/agreeNewFriends',{"myId":id,"friendId":this.userInfo.id}).then(res =>{
          if(res.data.code == 200){
            console.log("添加成功");
            this.init();
          }else{
            console.log("添加失败");
          }
        });
      }else if(this.userInfo.role == "teacher"){
        console.log("teacher");
        this.$axios.post('/teacher/agreeStudent',{"studentId":id,"teacherId":this.userInfo.id}).then(res =>{
          if(res.data.code == 200){
            console.log("添加成功");
            this.init();
          }else{
            console.log("添加失败");
          }
        });
      }else{
        console.log("error");
      }
    },
    refuse(id){
      if(this.userInfo.role == "student"){
        this.$axios.post('/student/refuseNewFriends',{"myId":id,"friendId":this.userInfo.id}).then(res =>{
          if(res.data.code == 200){
            console.log("拒绝成功");
            this.init();
          }else{
            console.log("拒绝失败");
          }
        });
      }else if(this.userInfo.role == "teacher"){
        this.$axios.post('/teacher/deleteStudent',{"studentId":id,"teacherId":this.userInfo.id}).then(res =>{
          if(res.data.code == 200){
            console.log("拒绝成功");
            this.init();
          }else{
            console.log("拒绝失败");
          }
        });
      }else{
        console.log("error");
      }
      
    },
    to_searchTeacher(){
      this.t_dialogVisible = true;
      this.$axios.post('/student/findNoAgreeTeacher',{"studentId":this.userInfo.id}).then((res) =>{
        if(res.data.code == 200){
          this.userList = res.data.data;
          console.log(this.userList);
        }else{
          console.log("查找教师失败");
        }
      })
    },
    to_searchStudent(){
      this.userList = [];
      this.s_dialogVisible = true;
    },
    searchTeacher(){
      this.$axios.post('/student/findUserByIdOrUserName?message='+this.input).then(res =>{
        console.log(res.data);
        if(res.data.code == 200){
          this.userList = res.data.data;
        }else{
          console.log("error");
        }
      });
    },
    addTeacher(id){
      this.$axios.post('/student/addTeacher',{"studentId":this.userInfo.id,"teacherId":id}).then(res =>{
        if(res.data.code == 200){
          this.userList = [];
          this.$message({
            message: '已发送请求',
            type: 'success'
          })
        }else{
          console.log("error");
        }
      });
    },
    searchStudent(){
      this.$axios.post('/student/findUserByIdOrUserName?message='+this.input).then(res =>{
        console.log(res.data);
        if(res.data.code == 200){
          this.userList = res.data.data;  
        }else{
          console.log("error");
        }
      });
    },
    addStudent(id){
      this.$axios.post('/student/addFriendById',{"myId":this.userInfo.id,"friendId":id}).then(res =>{
        if(res.data.code == 200){
          this.userList = [];
          this.$message({
            message: '已发送请求',
            type: 'success'
          })
        }else{
          console.log("error");
        }
      });
    },
    t_handleClose(){
      this.t_dialogVisible = false;
    },
    s_handleClose(){
      this.s_dialogVisible = false;
    } 
  },
}
</script>
<style>
  .el-collapse-item{
    display: inline;
  }
  #searchTeacher,#searchStudent{
    float: right;
  }
  #address .el-icon-arrow-right:before{
    content: "";
  }
  #addressList_main{
    text-align: left;
  }
  #tag{
    background-color: darkgray;
  }
  #name{
    margin-right: 20px;
    color: black;
  }
  #wa{
    display: inline;
  }
  #addList{
    display: flex;
    align-items: center;
  }
</style>

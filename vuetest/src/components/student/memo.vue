<template>
  <el-calendar v-if="load">
    <template #dateCell="{ data }">
        <p v-if="judge(data)" class='is-selected' @click="displayMemo(data.day)" id="aq">
          {{ data.day.split('-').slice(1).join('-') }}
          {{'✔️'}}
        </p>
        <p v-else @click="to_addMemo(data.day)" id="aq">
          {{ data.day.split('-').slice(1).join('-') }}
        </p>
    </template>
  </el-calendar>
  <!-- 添加 -->
  <el-dialog
  v-model="add_dialogVisible"
  width="30%"
  :before-close="add_handleClose">
  <el-input type="textarea" v-model="form.studentScheduleContent"></el-input>
  <el-button type="primary" @click="addMemo">确定</el-button>
  <el-button type="danger" @click="add_handleClose">取消</el-button>
  </el-dialog>
  <!-- 展示 -->
  <el-dialog
  v-model="display_dialogVisible"
  width="30%"
  :before-close="display_handleClose">
  <p>{{form.studentScheduleContent}}</p>
  <el-button type="primary" @click="to_updateMemo">编辑</el-button>
  <el-button type="danger" @click="deleteMemo">删除</el-button>
  </el-dialog>
  <!-- 修改 -->
  <el-dialog
  v-model="update_dialogVisible"
  width="30%"
  :before-close="update_handleClose">
  <el-input type="textarea" v-model="form.studentScheduleContent"></el-input>
  <el-button type="primary" @click="updateMemo">确定</el-button>
  <el-button type="danger" @click="update_handleClose">取消</el-button>
  </el-dialog>
</template>
<script>

import {mapState} from 'vuex'
export default {
  data(){
    return{
      load:false,
      add_dialogVisible:false,
      display_dialogVisible:false,
      update_dialogVisible:false,
      memo:[],
      form:{},
    }
  },
  computed:mapState(['userInfo']),
  created(){
    this.getMemoInfo();
  },
  methods:{
    getMemoInfo(){
      this.load = false;
      this.$axios.post('/student/allStudentSchedule?userId='+this.userInfo.id).then(res=>{
        console.log(res.data);
        if(res.data.code==200){
          this.memo = res.data.data;
          for(let i=0;i<this.memo.length;i++){
            this.memo[i].studentScheduleDate = this.format(this.memo[i].studentScheduleDate);
            console.log(this.memo[i].studentScheduleDate);
          }
          this.load = true;
        }else{
          this.memo = [];
          this.load = true;
          console.log("error");
        }
      })
    },
    format(time) {
      var d = time ? new Date(time) : new Date();
      var year = d.getFullYear();
      var month = d.getMonth() + 1;
      var day = d.getDate();
      if (month < 10) month = '0' + month;
      if (day < 10) day = '0' + day;
      return (year + '-' + month + '-' + day);
    },
    format2(time) {
      var d = time ? new Date(time) : new Date();
      var year = d.getFullYear();
      var month = d.getMonth() + 1;
      var day = d.getDate();
      if (month < 10) month = '0' + month;
      if (day < 10) day = '0' + day;
      return (year + '-' + month + '-' + day + ' ' + '00:00:00');
    },
    judge(data){
      if(this.memo.findIndex(item => item.studentScheduleDate==data.day) != -1){
        return true;
      }
      return false;
    },
    to_addMemo(day){
      this.form = {};
      this.form.studentScheduleDate = day;
      this.add_dialogVisible = true;
    },
    displayMemo(day){
      this.form.data = day;
      let n = this.memo.findIndex(item=>item.studentScheduleDate == day);
      this.form = JSON.parse(JSON.stringify(this.memo[n]));
      console.log(this.form);
      this.display_dialogVisible = true;
    },
    addMemo(){
      let date = new Date(this.form.studentScheduleDate);
      date = date.setDate(date.getDate() + 1);
      this.form.studentScheduleEndDate = this.format2(date);
      this.form.studentScheduleDate = this.format2(this.form.studentScheduleDate);
      this.form.userId = this.userInfo.id;
      console.log(this.form);
      if(this.form.studentScheduleContent==null){
        this.$message({
          message: '不能为空',
          type: 'error'
        })
      }else{
        this.$axios.post('/student/addStudentSchedule',this.form).then(res=>{
          if(res.data.code==200){
            this.$message({
              message: '添加成功',
              type: 'success'
            })
          }
          this.getMemoInfo();
          this.add_dialogVisible = false;
        });

      }

    },
    to_updateMemo(){
      this.update_dialogVisible = true
    },
    updateMemo(){
      if(this.form.studentScheduleDate==null || this.form.studentScheduleDate==''){
        this.$message({
          message: '不能为空',
          type: 'error'
        })
      }else{
        this.$axios.post('/student/updateStudentSchedule?studentScheduleId='+this.form.studentScheduleId+'&studentScheduleContent='+this.form.studentScheduleContent).then(res=>{
          if(res.data.code==200){
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.getMemoInfo();
            this.update_dialogVisible = false;
            this.display_dialogVisible = false;
            
          }
        })
      }
    },
    deleteMemo(){
      console.log(this.form);
      this.$axios.post('/student/deleteStudentSchedule?studentScheduleId='+this.form.studentScheduleId).then(res=>{
        if(res.data.code==200){
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getMemoInfo();
          this.display_dialogVisible = false;
        }else{
          console.log("error");
        }
      })
    },
    display_handleClose(){
      this.form = {};
      this.display_dialogVisible = false;
    },
    update_handleClose(){
      this.update_dialogVisible = false;
    },
    add_handleClose(){
      this.add_dialogVisible = false;
    },
  },
}
</script>
<style>
  .el-calendar{
    color: black;
  }
  .is-selected {
    color: #1989FA;
  }
  #aq{
    width: 100%;
    height: 100%;
  }
</style>
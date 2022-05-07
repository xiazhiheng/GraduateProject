<template>
  <section class="add">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="form.noticeTitle"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="form.noticeContent" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="form.noticeStartTime"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          @change="getStartTime"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="form.noticeEndTime"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          @change="getEndTime"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()">立即创建</el-button>
        <el-button type="text" @click="cancel()">取消</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>
<script>
export default {
  data(){
    return{
      form:{
        
      },
    }
  },
  methods:{
    getStartTime(data){
      this.form.noticeStartTime = data;
    },
    getEndTime(data){
      this.form.noticeEndTime = data;
    },
    onSubmit(){
      if(this.form.noticeTitle==null || this.form.noticeTitle==""){
        this.$message({
          message: '标题不能为空',
          type: 'error'
        })
      }else if(this.form.noticeContent==null || this.form.noticeContent==""){
        this.$message({
          message: '内容不能为空',
          type: 'error'
        })
      }else if(this.form.noticeStartTime==null){
        this.$message({
          message: '请选择开始时间',
          type: 'error'
        })
      }else if(this.form.noticeEndTime==null){
        this.$message({
          message: '请选择结束时间',
          type: 'error'
        })
      }else if(this.form.noticeStartTime>this.form.noticeEndTime){
        this.$message({
          message: '结束时间必须晚于开始时间',
          type: 'error'
        })
      }else{
        console.log(this.form);
        this.$axios({
        url: '/admin/addNotice',
          method: 'post',
          data: {
            ...this.form
          }
        }).then(res => {
          if(res.data.code == 200) {
            this.$message({
              message: '公告添加成功',
              type: 'success'
            })
            this.$router.push({path:'/noticeManage'})
          }else{
            console.log("error");
          }
        })
      }
    },
    cancel() { //取消按钮
      this.form = {};
    },
  },
}
</script>
<style>
.add {
  margin-top: 50px;
  padding: 0px 40px;
  width: 400px;
}
</style>
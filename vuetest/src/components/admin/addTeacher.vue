<!-- 添加教师 -->
<template>
  <section class="add">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="ID">
        <el-input v-model="form.userId"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.userPassword" onkeyup="this.value=this.value.replace(/[, ]/g,'')" maxlength="18"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.userName"></el-input>
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
  data() {
    return {
      form: {
        userPassword:123456,
      },
    };
  },
  methods: {
    onSubmit() { //数据提交
      if(this.form.userId==null || this.form.userId==""){
        this.$message({
          message: 'ID不能为空',
          type: 'error'
        })
      }else if(this.form.userName==null || this.form.userName==""){
        this.$message({
          message: '用户名不能为空',
          type: 'error'
        })
      }else if(this.form.userPassword==null || this.form.userPassword==""){
        this.$message({
          message: '密码不能为空',
          type: 'error'
        })
      }else{
        this.$axios({
        url: '/admin/addTeacher',
          method: 'post',
          data: {
            ...this.form
          }
        }).then(res => {
          if(res.data.code == 200) {
            this.$message({
              message: '数据添加成功',
              type: 'success'
            })
            this.$router.push({path: '/a_teacherManage'})
          }else if(res.data.code == 501){
            this.$message({
              message: 'ID已存在',
              type: 'error'
            })
          }
        })
      }
    },
    cancel() { //取消按钮
      this.form.userId=null;
      this.form.userPassword=123456;
      this.form.userName=null;
    },
  }
};
</script>
<style lang="scss" scoped>
.add {
  margin-top: 50px;
  padding: 0px 40px;
  width: 400px;
}
</style>


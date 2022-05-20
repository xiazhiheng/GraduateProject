<template>
  <el-button @click="update">编辑资料</el-button>
  <el-descriptions title="User Info">
    <el-descriptions-item label="用户名">{{Info.userName}}</el-descriptions-item>
    <el-descriptions-item label="签名">{{Info.userSignature}}</el-descriptions-item>
    <el-descriptions-item v-if="Info.userSex == 1" label="性别">男</el-descriptions-item>
    <el-descriptions-item v-else-if="Info.userSex == 2" label="性别">女</el-descriptions-item>
    <el-descriptions-item label="电话">{{Info.userPhone}}</el-descriptions-item>
  </el-descriptions>

  <el-dialog
  v-model="dialogVisible"
  :before-close="handleClose">
    <div id="upload">
      <el-avatar :size="150" :src="form.userImageUrl" class="h-avatar" :fit="none"></el-avatar>
      <el-upload
        class="upload-demo"
        :action="url+'/file/uploadImage'"
        :on-preview="handlePreview"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <el-button size="small" type="primary">更换封面</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg文件，且不超过500kb</div>
      </el-upload>
    </div>
    
    <el-form ref="form" :model="form" label-width="80px" id="info">
      <el-form-item label="用户名">
        <el-input v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="签名">
        <el-input maxlength="30" show-word-limit v-model="form.userSignature"></el-input>
      </el-form-item>
      <!-- <el-form-item label="年龄">
        <el-date-picker v-model="date" type="date" placeholder="Pick a day"/>
      </el-form-item> -->
      <el-form-item label="性别">
        <el-radio v-model="form.userSex" label="1">男</el-radio>
        <el-radio v-model="form.userSex" label="2">女</el-radio>
      </el-form-item>
      <el-form-item label="电话号码">
        <el-input v-model="form.userPhone"></el-input>
      </el-form-item>
      <div id="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </div>
    </el-form>
  </el-dialog>

</template>
<script>
import {mapState} from 'vuex'
export default {
  data(){
    return{
      dialogVisible:false,
      Info:{},
      form:{
        userId:null,
        userName:null,
        userImageUrl:null,
        userSignature:null,
        userPassword:null,
        userIdentity:null,
        userAge:null,
        userSex:null,
        userPhone:null,
        userPriviledge:null,
      }
    }
  },
  computed:mapState(["url",'userInfo']),
  created(){
    this.getUserInfo();
  },
  methods:{
    getUserInfo(){
      this.$axios.post("/student/ourMessage",{'studentId':this.userInfo.id}).then(res =>{
        console.log(res.data);
        if(res.data.code==200){
          this.Info = res.data.data;
        }else{
          console.log("error");
        }
      })
    },
    update(){
      this.form = JSON.parse(JSON.stringify(this.Info));
      this.dialogVisible = true;
    },
    handleClose(){
      this.dialogVisible = false;
    },
    handleAvatarSuccess(res, file) {
      if(res.code == 200){
        this.$message.success("上传成功");
        this.form.userImageUrl = res.data
      }
    },
    beforeAvatarUpload(file) {
      console.log("file",file)
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    submit(){
      if(this.form.userName==""){
        this.$message.error("用户名不能为空");
      }else{
        this.$axios.post('/teacher/updatePersonalInformation',this.form).then(res =>{
          if(res.data.code == 200){
            console.log(this.imageUrl);
            console.log("修改成功")
            this.Info = this.form;
            localStorage.setItem("cName",this.form.userName);
            localStorage.setItem("img",this.form.userImageUrl);
            this.userInfo.name = this.form.userName;
            this.userInfo.imgUrl = this.form.userImageUrl;
            this.$store.commit("setUserInfo",this.userInfo);
            console.log(this.userInfo);
            this.dialogVisible = false;
          }else{
            console.log("修改失败")
          }
        })
      }
    }
  },
}
</script>
<style>
/* #Plus .el-upload{
  width: 178px;
  height: 178px;
  display: flex;
} */
#info{
  text-align: left;
}
#upload{
  width: 100%;
  text-align: center;
}
#footer{
  width: 100%;
  text-align: center;
}
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  #plus_btn{
    display: flex;
    align-content: space-around;
    justify-content: center;
    align-items: center;
  }
</style>
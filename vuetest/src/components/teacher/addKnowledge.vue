<template>
  <section class="addKnowledge">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="章节">
        <el-cascader v-model="value" :options="subject" @change="handleChange"></el-cascader>
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="form.knowledgeContent"></el-input>
      </el-form-item>
      <!-- <el-form-item label="权限">
        <el-radio v-model="form.questionLimition" label="0">私有</el-radio>
        <el-radio v-model="form.questionLimition" label="1">公开</el-radio>
      </el-form-item> -->
      <el-form-item label="视频">
        <el-upload
          class="upload-demo"
          :action="url+'/file/uploadVideo'"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
          :file-list="fileList"
          :on-remove="remove"
          limit="1">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传mp4文件</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()">立即创建</el-button>
        <el-button type="text" @click="cancel()">取消</el-button>
      </el-form-item>
    </el-form>
  </section>  
</template>
<script >
import { mapState } from 'vuex';

export default {
  data(){
    return{
      fileList:[],
      form:{},
    }
  },
  computed:mapState(["subject","url",'userInfo']),
  methods: {
     beforeUpload(file) {
      console.log("file",file)
      const isMP4 = file.type === 'video/mp4';
      const isLt2M = file.size / 1024 / 1024 < 200;

      if (!isMP4) {
        this.$message.error('上传视频只能是 MP4 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传视频大小不能超过 200MB!');
      }
      return isMP4 && isLt2M;
    },
    handleSuccess(res, file) {
      if(res.code == 200){
        this.$message.success("上传成功");
        this.form.videoUrl = res.data
        console.log(this.form.videoUrl);
      }
    },
    remove(file,fileList){
      console.log("remove");
      this.form.videoUrl = null;
    },
    onSubmit() { //数据提交
      if(this.form.videoUrl == null){
        this.$message({
          message: '请上传视频',
          type: 'error'
        })
      }else if(this.value[0]==null){
        this.$message({
          message: '请选择章节',
          type: 'error'
        })
      }else if(this.form.knowledgeContent==null || this.form.knowledgeContent==""){
        this.$message({
          message: '知识点内容不能为空',
          type: 'error'
        })
      }else{
        this.form.knowledgeMadeById = this.userInfo.id;
        this.form.courseId = this.value[0];
        this.form.chapterId = this.value[1];
        
        this.$axios({
          url: '/teacher/addKnowledge',
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
            this.$router.push({path: '/t_knowledge'})
          }
        })
      }
    },
    cancel() { //取消按钮
      this.value=[],
      this.form = {}
    },
  }
}
</script>
<style>
.addKnowledge{
  width: 300px;
  text-align: left;
  margin: 50px;
}
</style>
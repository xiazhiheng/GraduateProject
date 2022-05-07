<template>
  <el-table :data="pagination.data">
    <el-table-column prop="noticeTitle" label="标题" :show-overflow-tooltip="true"></el-table-column>
    <el-table-column prop="noticeContent" label="内容" :show-overflow-tooltip="true"></el-table-column>
    <el-table-column prop="noticeStartTime" label="开始时间"></el-table-column>
    <el-table-column prop="noticeEndTime" label="结束时间"></el-table-column>
    <el-table-column width="150" fixed="right">
      <template v-slot="scope">
        <el-button @click="n_update(scope.$index)" type="primary" size="small">编辑</el-button>
        <el-button @click="n_delete(scope.row.noticeId)" type="danger" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pagination.current"
    :page-sizes="[6, 10]"
    :page-size="pagination.size"
    layout="total, sizes, prev, pager, next, jumper"
    :total="pagination.total"
    class="page">
  </el-pagination>

  //编辑公告信息
  <el-dialog
      title="编辑公告信息"
      v-model="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <section class="update">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="form.noticeTitle"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <el-input v-model="form.noticeContent"></el-input>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="form.noticeStartTime"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              v-model="form.noticeEndTime"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </section>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
  </el-dialog>
</template>
<script>
export default {
  data(){
    return{
      data:[],
      dialogVisible:false,
      pagination: {
        //分页后的新闻信息
        current: 1, //当前页
        total: null, //记录条数
        size: 6, //每页条数
        data:[]
      },
      form:{},
    }
  },
  created(){
    this.getNoticeInfo();
  },
  methods:{
    getNoticeInfo(){
      this.$axios.post('/admin/allNotice').then(res =>{
        console.log(res.data);
        if(res.data.code==200){
          this.data = res.data.data;
          this.getInfoBypage();
        }else{
          console.log("error");
        }
      })
    },
    getInfoBypage(){
      // 获取该分页的试题信息
      this.pagination.total = this.data.length;
      this.pagination.data = this.data.slice((this.pagination.current-1)*this.pagination.size,this.pagination.current*this.pagination.size);
    },
    n_update(index){
      this.form = this.pagination.data[index];
      this.dialogVisible = true;
    },
    n_delete(id){
      this.$axios.post('/admin/deleteNotice?noticeId='+id).then(res =>{
        console.log(res.data);
        if(res.data.code==200){
          this.getNoticeInfo();
        }else{
          console.log("error");
        }
      })
    },
    submit(){
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
        this.$axios({
          url: '/admin/updateNotice',
          method: 'post',
          data: {
            ...this.form
          }}).then(res => {
          if(res.data.code == 200) {
            this.dialogVisible = false;
            this.$message({
              message: '更新成功',
              type: 'success'
            })
          }else{
            console.log("修改失败");
          }
          this.getNoticeInfo();
        })
      }
    },
    handleClose(){
      this.getNoticeInfo();
      this.dialogVisible = false;
    },
  },
}
</script>
<style>

</style>
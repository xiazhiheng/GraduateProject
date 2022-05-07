<template>
  <section class="index">
    <div class="hello">
      <span>很高兴遇见你,{{userInfo.userName}}老师</span>
    </div>
    <div class="msg">
      <p class="title">教务公告：</p>
      <ul>
        <li v-for="(item,index) in noticeList" @click="displayNotice(index)">
          <span>{{item.noticeStartTime}}</span>
          <span>{{item.noticeTitle}}</span>
        </li>
      </ul>
    </div>
    <el-dialog
      title="公告"
      v-model="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <h2>{{notice.noticeTitle}}</h2>
      <p>{{notice.noticeStartTime}}</p>
      <p>{{notice.noticeContent}}</p>
    </el-dialog>
  </section>
</template>

<script>
import {mapState} from 'vuex'
export default {
  data() {
    return {
      noticeList:[],
      notice:{},
      dialogVisible:false,
    }
  },
  computed:mapState(['userInfo']),
  created() {
    this.getNoticeInfo();
  },
  methods: {
    getNoticeInfo(){
      this.$axios.post('/student/rightTimeNotice').then(res=>{
        console.log(res.data);
        if(res.data.code==200){
          this.noticeList = res.data.data;
        }else{
          console.log("error");
        }
      })
    },
    displayNotice(index){
      this.notice = this.noticeList[index];
      this.dialogVisible = true;
    },
  }
}
</script>


<style lang="scss" scoped>
.index {
  margin-left: 70px;
  .hello {
    font-size: 20px;
    color: #726f70;
    .icon-xihuan {
      font-size: 30px;
      color: #dd6572;
    }
  }
  .msg {
    .title {
      font-size: 16px;
      color: #000;
      margin-top: 20px;
      margin-left: 10px;
    }
    ul {
      display: flex;
      flex-direction: column;
      width: 200px;
      overflow: hidden;
    }
    li {
      margin-top: 10px;
      font-size: 14px;
      color: lightcoral;
      cursor: pointer;
      display: inline-block;
    }
  }
}
</style>


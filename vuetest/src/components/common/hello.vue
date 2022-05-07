<template>
  <section class="index">
    <div class="hello">
      <span>很高兴遇见你,{{user.userName}}老师。</span>
    </div>
    <div class="msg">
      <p class="title">教务公告：</p>
      <!-- <ul>
        <li @click="openMsg()"><i class="iconfont icon-flag"></i>端午节放假通知</li>
        <li @click="openMsg2()"><i class="iconfont icon-flag"></i>下周例行工作报告会</li>
        <li @click="openMsg3()"><i class="iconfont icon-flag"></i>关于毕业生答辩具体流程</li>
      </ul> -->
    </div>
  </section>
</template>

<script>
import {mapState} from 'vuex'
export default {
  data() {
    return {
    }
  },
  computed:mapState(['userInfo']),
  created() {
  },
  methods: {
    openMsg() {
      this.$alert('根据《国务院办公厅关于2021年部分节假日安排的通知》（国办发明电〔2020〕27号）精神，按照我校校历安排，6月12日（星期六）－6月14日（星期一）放假，共3天。其中，6月14日（星期一）课程调停。节假日期间，请各部门妥善安排好值班值守、安全保卫、疫情防控等工作，如遇有重大突发事件，按规定及时报告并妥善处置。特此通知。党政办公室-2021年6月7日',{
        confirmButtonText: '确定'
      })
    },
    openMsg2() {
      this.$alert('在周五举行',{
        confirmButtonText: '确定'
      })
    },
    openMsg3() {
      this.$alert('详情请查看官网',{
        confirmButtonText: '确定'
      })
    }
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


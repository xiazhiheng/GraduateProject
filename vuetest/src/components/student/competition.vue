<template>
  <el-container v-if="!battleFlag">
    <el-main id="chart">
      <h1>排行榜</h1>
      <ul>
        <li v-for="(item,index) in chartList">
          <span>{{index+1}}</span>
          <el-avatar :src="item.userImageUrl"></el-avatar>
          <span>{{item.userName}}</span>
          <span>{{item.studentScore}}</span>
        </li>
      </ul>
    </el-main>
    <el-main>
      <el-avatar :src="userInfo.imgUrl" id="myavatar"></el-avatar>
      <p v-if="matchFlag">匹配中</p>
      <el-button v-if="matchFlag" @click="cancelMatch">取消匹配</el-button>
      <el-button v-else @click="match">开始匹配</el-button>
    </el-main>
  </el-container>
  <el-container v-else>
    <el-aside id="competitionInfo">
      <div>
        <el-avatar :src="userInfo.imgUrl" :size="80"></el-avatar>
        <p>{{userInfo.name}}</p>
        <p>{{score}}</p>
      </div>
      vs
      <div>
        <el-avatar :src="rivalUserInfo.userImageUrl" :size="80"></el-avatar>
        <p>{{rivalUserInfo.userName}}</p>
        <p>{{rivalScore}}</p>
      </div>
    </el-aside>
    <el-main>
      <span>时间：</span>{{time}}
      <div class="content" v-if="questionList[Index].questionType==2">
        <el-tag type="info">多选</el-tag>
        <p class="topic"><span class="number">{{Index+1}}</span>{{questionList[Index].questionContent}}</p>
        <div >
          <el-checkbox-group v-model="check" :key="key">
            <el-checkbox :id="answer[0]" label="A" class="checkBox" :disabled="bg_flag">A:{{questionList[Index].questionOptionA}}</el-checkbox>
            <el-checkbox :id="answer[1]" label="B" class="checkBox" :disabled="bg_flag">B:{{questionList[Index].questionOptionB}}</el-checkbox>
            <el-checkbox :id="answer[2]" label="C" class="checkBox" :disabled="bg_flag">C:{{questionList[Index].questionOptionC}}</el-checkbox>
            <el-checkbox :id="answer[3]" label="D" class="checkBox" :disabled="bg_flag">D:{{questionList[Index].questionOptionD}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <div class="content" v-else>
        <el-tag type="info">单选</el-tag>
        <p class="topic"><span class="number">{{Index+1}}</span>{{questionList[Index].questionContent}}</p>
        <div >
          <el-radio-group v-model="radio" :key="key">
            <el-radio  :id="answer[0]" label="A" :disabled="bg_flag">A:{{questionList[Index].questionOptionA}}</el-radio>
            <el-radio  :id="answer[1]" label="B" :disabled="bg_flag">B:{{questionList[Index].questionOptionB}}</el-radio>
            <el-radio  :id="answer[2]" label="C" :disabled="bg_flag">C:{{questionList[Index].questionOptionC}}</el-radio>
            <el-radio  :id="answer[3]" label="D" :disabled="bg_flag">D:{{questionList[Index].questionOptionD}}</el-radio>
          </el-radio-group>
        </div>
      </div>
      <el-button @click="submit" :disabled="bg_flag">提交</el-button>
    </el-main>
  </el-container>
  <el-dialog
  v-model="dialogVisible"
  width="30%"
  :before-close="handleClose">
    <h1 v-if="WinFlag">Win</h1>
    <h1 v-else>Loser</h1>
    <el-button @click="handleClose">返回</el-button>
  </el-dialog>
</template>
<script>
import {mapState} from 'vuex'
export default {
  data(){
    return{
      dialogVisible:false,
      matchFlag:false,//是否开始匹配
      battleFlag:false,//是否开始对战
      WinFlag:null,//是否胜利
      submitFlag:false,
      chartList:[],//排行榜
      myRanking:null,//我的排名
      rivalUserInfo:{},
      score:0,//我的分数
      rivalScore:0,//对手分数
      questionList:[],//试题列表
      Index:0,//当前试题
      check:[],
      radio:null,
      answer:[],
      bg_flag:false,
      time:60,
    }
  }, 
  computed:mapState(['userInfo','url']),
  created(){
    this.getChart();
    this.getMyRanking();
  },
  methods:{
    //获取排行榜信息
    getChart(){
      this.$axios.post('/onlineBattle/topByStudentScore').then(res=>{
        console.log(res.data);
        if(res.data.code==200){
          this.chartList = res.data.data;
        }else{
          console.log("error");
        }
      })
    },
    //获取我的排名
    getMyRanking(){
      this.$axios.post('/onlineBattle/findUserRank',{"userId":this.userInfo.id}).then(res=>{
        console.log(res.data);
        if(res.data.code==200){
          this.myRanking = res.data.data;
        }else{
          console.log("error");
        }
      })
    },
    //匹配
    match(){
      this.initWebSocket();
      this.matchFlag = true;
    },
    //取消匹配
    cancelMatch(){
      console.log("取消匹配")
      this.websock.close();
      this.matchFlag = false;
    },
    //获取对战试题列表
    getQuestionList(){
      this.$axios.post('').then(res=>{
        console.log(res.data);
        if(res.data.code==200){
          this.questionList = res.data.data;
        }else{
          console.log("error");
        }
      })
    },
    initWebSocket () { 
        let Url = this.url.slice(7);
        console.log('ws://'+Url+'/battle/'+this.userInfo.id);
				this.websock = new WebSocket('ws://'+Url+'/battle/'+this.userInfo.id);
				this.websock.onmessage = this.websocketonmessage
				this.websock.onerror = this.websocketonerror
				this.websock.onopen = this.websocketonopen
				this.websock.onclose = this.websocketclose
		},
    websocketonopen () { // 连接建立之后执行send方法发送数据，这个和自己的后端沟通好需要传什么数据，我的是要进行token验证
      // this.websock.send("connection");
    },
    websocketonerror () { //连接错误
      console.log( 'WebSocket连接失败')
    },
    websocketonmessage (e) { // 数据接收
      let m = JSON.parse(e.data);
      console.log(m);
      //开始
      if(m.msgType==1){
        this.rivalUserInfo.id = m.message;
        this.$axios.post('/student/findUserByIdOrUserName?message='+m.message).then(res=>{
          console.log(res.data);
          if(res.data.code==200){
            this.rivalUserInfo = res.data.data[0];
            this.start();
          }else{
            console.log("error");
          }
        })
      }
      //对方得分
      if(m.msgType==2){
        this.rivalScore++;
      }
      //下一题
      if(m.msgType==3){
        this.next();
      }
    },
    websocketclose (e) {  // 关闭连接
      console.log('已关闭连接', e)
    },
    //开始比赛
    start(){
      this.$axios.post('/onlineBattle/updateUserChallengeTimes',{"userId":this.userInfo.id});
      this.$axios.post('/onlineBattle/findBattleQuestions').then(res=>{
        console.log(res.data);
        if(res.data.code==200){
          this.questionList = res.data.data;
          this.battleFlag = true;
          this.submitFlag = false;
          this.time=60;
          this.showTime();
          this.matchFlag = false;
        }else{
          console.log("error");
        }
      })
    },
    //提交
    submit(){
      this.submitFlag = true;
      this.bg_flag = true;
      if(this.questionList[this.Index].questionType==1){
        if(this.radio == this.questionList[this.Index].questionAnswer){
          let mess = {};
          mess.userId = this.userInfo.id;
          mess.isCorrect = true;
          this.score++;
          this.websock.send(JSON.stringify(mess));
        }else{
          let mess = {};
          mess.userId = this.userInfo.id;
          mess.isCorrect = false;
          this.websock.send(JSON.stringify(mess));
        }
      }else{
        let checkAnswer = this.check.join("")
        if(checkAnswer == this.questionList[this.Index].questionAnswer){
          let mess = {};
          mess.userId = this.userInfo.id;
          mess.isCorrect = true;
          this.score++;
          this.websock.send(JSON.stringify(mess));
        }else{
          let mess = {};
          mess.userId = this.userInfo.id;
          mess.isCorrect = false;
          this.websock.send(JSON.stringify(mess));
        }
      }
      this.judge();
    },
    //判题
    judge(){
      console.log("judge");
      let list = this.questionList[this.Index].questionType==1 ? this.radio : this.check;
      let c = ['A','B','C','D']
      let standardAnswer = [];
      let myAnswer = [];
      for(let i=0,j=0,k=0;i<4;i++){
        if(this.questionList[this.Index].questionAnswer.length<=j){
          standardAnswer[i] = 0;
        }else if(this.questionList[this.Index].questionAnswer[j] == c[i]){
          standardAnswer[i] = 1;
          j++;
        }else{
          standardAnswer[i] = 0;
        }
        if(list.length<=k){
          myAnswer[i] = 0;
        }else if(list[k] == c[i]){
          myAnswer[i] = 1;
          k++;
        }else{
          myAnswer[i] = 0;
        }
        if(standardAnswer[i] == 1){
          if(myAnswer[i] == 1){
            this.answer[i] = 'correct';
          }else{
            this.answer[i] = 'lack'
          }
        }else{
          if(myAnswer[i] == 1){
            this.answer[i] = 'false';
          }
        }
      }
      this.key = !this.key;
      console.log("answer",this.answer);
    },
    //下一题
    next(){
      this.bg_flag = false;
      this.answer = [];
      this.radio = null;
      this.check = [];
      if(this.Index<this.questionList.length-1){
        this.Index++;
        this.submitFlag = false;
        this.time=60;
        this.showTime();
      }
      else{
        this.end();  
      }
    },
    //比赛结束
    end(){
      if(this.score>=this.rivalScore){
        this.WinFlag = true;
        this.dialogVisible = true;
        this.$axios.post('/onlineBattle/updateUserWinTimes',{"userId":this.userInfo.id});
      }else{
        this.WinFlag = false;
        this.dialogVisible = true;
      }
    },
    handleClose(){
      this.dialogVisible = false;
      this.battleFlag = false;
    },
    showTime() { //倒计时
      let t = setInterval(() => {
        this.time -= 1
        if(this.time == 0) {
          clearInterval(t);
          // this.submit();
        }
        if(this.submitFlag==true){
          clearInterval(t);
        }
      },1000)
    }
  },
  beforeRouteLeave(){
    console.log("close");
    if(this.websock){
      this.websock.close();
    }
  },
}
</script>
<style  lang="scss" scoped>
#competitionInfo{
  display: flex;
  justify-content: space-between;
  align-items: center;
  div{
    margin: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
}
#chart{
  li{
    margin: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
#myavatar{
  display: block;
}
#correct {.el-checkbox__label,.el-radio__label{
  color: greenyellow;}
}
#false {.el-checkbox__label,.el-radio__label{
  color: red;}
}
#lack {.el-checkbox__label,.el-radio__label{
  color: #c8c811;}
}
</style>
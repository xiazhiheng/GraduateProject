<!--考生答题界面-->
<template>
  <div id="answer" v-if="load">
    <el-container >
      <!--顶部信息栏-->
     <!-- <div class="top">
       <ul class="item">
         <li><i class="iconfont icon-menufold icon20" ref="toggle" @click="slider_flag = !slider_flag"></i></li>
         <li @click="flag = !flag">
           <i class="iconfont icon-user icon20"></i>
           <div class="msg"  v-if="flag" @click="flag = !flag">
             <p>姓名：{{userInfo.name}}</p>
           </div>
         </li>
         <li><i class="iconfont icon-arrLeft icon20"></i></li>
       </ul>
     </div> -->

      <el-aside v-show="slider_flag">
        <div class="flexarea">
          <!--左边题目编号区-->
          <transition name="slider-fade">
            <div class="left" v-if="slider_flag">
              <div class="l-bottom">
                <div class="item">
                  <p>单选题部分</p>
                  <ul>
                    <li v-for="(list, index) in paperData.questionList[0]" :key="1">
                      <a href="javascript:;"
                        @click="change(index,0)"
                        :class="{'border': Index == index && type == 0,'bg': bg_flag[0][index]}">
                        <span :class="{'mark': mark_flag[0][index]}"></span>
                        {{index+1}}
                      </a>
                    </li>
                  </ul>
                </div>
                <div class="item">
                  <p>多选题部分</p>
                  <ul>
                    <li v-for="(list, index) in this.paperData.questionList[1]" :key="index">
                      <a href="javascript:;"
                        @click="change(index,1)"
                        :class="{'border': Index == index && type == 1,'bg': bg_flag[1][index]}">
                        <span :class="{'mark': mark_flag[1][index] == true}"></span>
                        {{index+1}}
                      </a>
                    </li>
                  </ul>
                </div>
                <div v-if="flag" class="final" @click="commitTest()">结束考试</div>
                <div v-else class="final" @click="exit">退出</div>
              </div>
            </div>
          </transition>
        </div>
      </el-aside>
      <el-main>
         <!--右边选择答题区-->
        <transition name="slider-fade">
          <div class="right">
            <div class="title">
              <el-button @click="() => slider_flag = !slider_flag">题目列表</el-button>
              <span id="time">倒计时：{{time}}min</span>
            </div>

            <div class="content" v-if="type">
              <p class="topic"><span class="number">{{Index+1}}</span>{{paperData.questionList[1][Index].questionContent}}</p>
              <div >
                <el-checkbox-group v-model="checkList[Index]" @change="checkChange" >
                  <el-checkbox :id="answer[1][Index][0]" label="A" class="checkBox" :disabled="!flag">A:{{paperData.questionList[1][Index].questionOptionA}}</el-checkbox>
                  <el-checkbox :id="answer[1][Index][1]" label="B" class="checkBox" :disabled="!flag">B:{{paperData.questionList[1][Index].questionOptionB}}</el-checkbox>
                  <el-checkbox :id="answer[1][Index][2]" label="C" class="checkBox" :disabled="!flag">C:{{paperData.questionList[1][Index].questionOptionC}}</el-checkbox>
                  <el-checkbox :id="answer[1][Index][3]" label="D" class="checkBox" :disabled="!flag">D:{{paperData.questionList[1][Index].questionOptionD}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>

            <div class="content" v-else>
              <p class="topic"><span class="number">{{Index+1}}</span>{{paperData.questionList[0][Index].questionContent}}</p>
              <div >
                <el-radio-group v-model="radio[Index]" @change="radioChange">
                  <el-radio :id="answer[0][Index][0]" label="A" :disabled="!flag">A:{{paperData.questionList[0][Index].questionOptionA}}</el-radio>
                  <el-radio :id="answer[0][Index][1]" label="B" :disabled="!flag">B:{{paperData.questionList[0][Index].questionOptionB}}</el-radio>
                  <el-radio :id="answer[0][Index][2]" label="C" :disabled="!flag">C:{{paperData.questionList[0][Index].questionOptionC}}</el-radio>
                  <el-radio :id="answer[0][Index][3]" label="D" :disabled="!flag">D:{{paperData.questionList[0][Index].questionOptionD}}</el-radio>
                </el-radio-group>
              </div>
            </div>

            <div class="operation">
              <ul class="end">
                <li @click="previous()"><i class="iconfont icon-previous"></i><span>上一题</span></li>
                <li v-if="mark_flag[type][Index] && flag" @click="mark()"><i class="iconfont icon-mark-o"></i><span>取消</span></li>
                <li v-else-if="!flag" @click="mark()"><i class="iconfont icon-mark-o"></i><span>收藏</span></li>
                <li v-else @click="mark()"><i class="iconfont icon-mark-o"></i><span>标记</span></li>
                <li @click="next()"><span>下一题</span><i class="iconfont icon-next"></i></li>
              </ul>
            </div>

            <div class="analysis" v-if="isPractice[type][Index]">
              <ul>
                <li> <el-tag type="success">正确答案：</el-tag><span class="right">{{paperData.questionList[type][Index].questionAnswer}}</span></li>
                <li v-if="paperData.questionList[type][Index].knowledgeId!=null"><el-tag>知识点：<el-button type="text" @click="play">{{paperData.questionList[type][Index].knowledgeContent}}</el-button></el-tag></li>
                <li><el-tag>题目解析：</el-tag></li>
                <li>{{paperData.questionList[type][Index].questionAnalysis == null ? '暂无解析': paperData.questionList[type][Index].questionAnalysis}}</li>
              </ul>
            </div>
          </div>
        </transition>
      </el-main>
    </el-container>
  </div>

  <el-dialog
    v-model="k_dialogVisible"
    width="50%"
    :before-close="handleClose">
    <video height="400"
    width="400"
    controls
    autoplay 
    type="video/mp4"
    :src="videoUrl">
    </video>
  </el-dialog>
</template>

<script>
import {mapState} from 'vuex'
export default {
  data() {
    return {
      load:false,
      k_dialogVisible:false,
      paperId:this.$route.query.paperId,
      answerScore: 0, //答题总分数
      type:0,
      bg_flag: [[],[]], //已答标识符,已答改变背景色
      mark_flag:[[],[]],//是否标记标识符
      slider_flag: true, //左侧显示隐藏标识符
      flag: true, //是否未提交
      time:this.$route.query.time,

      isPractice:[[],[]],//是否展示解析
      currentType: [], //当前题型类型  1--单选题  2--多选题 
      radioNum:0,
      checkListNum:0,
      number: 1, //题号
      radio: [], //保存考生所有单选题的选项
      checkList:[],//保存考生一道多选题的选项
      checkAnswer:[],//保存考生所有多选题的选项
      answer:[[],[]],//
      studentAnswer:[],
      

      // title: "请选择正确的选项",
      Index: 0, //全局index
      topicCount: [],//每种类型题目的总数
      score: [],  //每种类型分数的总数
      paperData: { //考试信息
        testPaperId:1,
        testPaperName:"test",
        testPaperDifficulty:1,
        testPaperTime:30,
        questionList:[
          [
            {
              questionId:1,
              questionType:1,
              questionContent:"这道题选A",
              questionOptionA:"1",
              questionOptionB:"2",
              questionOptionC:"3",
              questionOptionD:"4",
              questionAnswer:'A',
              questionAnalysis:"无",
            },
            {
              questionId:1,
              questionType:1,
              questionContent:"这道题选B",
              questionOptionA:"1",
              questionOptionB:"2",
              questionOptionC:"3",
              questionOptionD:"4",
              questionAnswer:'B',
              questionAnalysis:"无",
            },
          ],
          [
            {
              questionId:1,
              questionType:2,
              questionContent:"这道题选AB",
              questionOptionA:"1",
              questionOptionB:"2",
              questionOptionC:"3",
              questionOptionD:"4",
              questionAnswer:'AB',
              questionAnalysis:"无",
            },
            {
              questionId:2,
              questionType:2,
              questionContent:"这道题选BC",
              questionOptionA:"1",
              questionOptionB:"2",
              questionOptionC:"3",
              questionOptionD:"4",
              questionAnswer:'BC',
              questionAnalysis:"无",
            },
          ]
        ],
      },
      videoUrl:null,
    }
  },
  computed:mapState(['userInfo']),
  created() {
    this.getExamData()
  },
  methods: {
    // test(){
    //   this.radioNum = this.paperData.questionList[0].length;
    //   this.checkListNum = this.paperData.questionList[1].length;
    //   this.answer[0] = [];
    //   this.answer[1] = [];
    //   for(let i=0;i<this.paperData.questionList[0].length;i++){
    //     this.bg_flag[0][i] = 0;
    //     this.mark_flag[0][i] = 0;
    //     this.isPractice[0][i] = 0;
    //     this.radio[i] = null;
    //     this.answer[0][i] = [null,null,null,null];
    //   }
    //   for(let j=0;j<this.paperData.questionList[1].length;j++){
    //     this.bg_flag[1][j] = 0;
    //     this.mark_flag[1][j] = 0;
    //     this.isPractice[1][j] = 0;
    //     this.checkList[j] = [];
    //     this.answer[1][j] = [null,null,null,null];
    //   }
    // },
    getExamData() { //获取当前试卷所有信息
      this.$axios.post('/studentAnswer/findTestPaperQuestion',{"testPaperId":this.paperId}).then(res => {  //通过paperId获取试题题目信息
        console.log(res);
        this.paperData.questionList[0] = res.data.data.questionRadioList;
        this.paperData.questionList[1] = res.data.data.questionMultipleList;
        this.radioNum = this.paperData.questionList[0].length;
        if(this.radioNum==0){
          this.type = 1;
        }
        this.checkListNum = this.paperData.questionList[1].length;
        this.answer[0] = [];
        this.answer[1] = [];
        for(let i=0;i<this.paperData.questionList[0].length;i++){
          this.bg_flag[0][i] = 0;
          this.mark_flag[0][i] = 0;
          this.isPractice[0][i] = 0;
          this.radio[i] = null;
          this.answer[0][i] = [null,null,null,null];
        }
        for(let j=0;j<this.paperData.questionList[1].length;j++){
          this.bg_flag[1][j] = 0;
          this.mark_flag[1][j] = 0;
          this.isPractice[1][j] = 0;
          this.checkList[j] = [];
          this.answer[1][j] = [null,null,null,null];
        }
        this.showTime();
        this.load = true;
      })
    },
    change(index,type){
      this.Index = index;
      this.type = type;
      // if(this.type==1){
      //   this.checkList = this.checkAnswer[this.Index];
      // }
    },
    radioChange(){
      this.bg_flag[this.type][this.Index] = 1;
      if(this.radio[this.Index] == this.paperData.questionList[0][this.Index].questionAnswer){
        
      }else{
       
      }
    },
    checkChange(val) { //获取选择题作答选项
      this.checkAnswer[this.Index] = this.checkList[this.Index].sort().join("");
      this.bg_flag[this.type][this.Index] = 1;
    },
    previous() { //上一题
      if(this.Index == 0){
        if(this.type==1){
          this.Index = this.radioNum-1;
          this.type = 0;
        }
      }else{
        this.Index--;
      }
      
    },
    next() { //下一题
      if(this.Index == (this.radioNum-1) && this.type == 0){
        if(this.checkListNum==0){
          if(this.flag){
            this.commitTest();
          }
        }else{
          this.type = 1;
          this.Index = 0;
        }
      }else if(this.Index == this.checkListNum-1 && this.type == 1){
        if(this.flag){
          this.commitTest();
        }
      }else{
        this.Index++;
      } 
    },
    mark() { //标记功能
      this.mark_flag[this.type][this.Index] = !this.mark_flag[this.type][this.Index];  
    },
    commitTest(){
      this.$confirm("考试结束时间未到,是否提前交卷","友情提示",{
        confirmButtonText: '立即交卷',
        cancelButtonText: '再检查一下',
        type: 'warning'
      }).then(() => {
        for(let i=0;i<this.radioNum;i++){
          this.isPractice[0][i] = true;
          this.judgeAnswer(0,i)
        }
        for(let j=0;j<this.checkListNum;j++){
          this.isPractice[1][j] = true;
          this.judgeAnswer(1,j)
        }
        console.log(this.paperId);
        this.$axios.post('/studentAnswer/answerTestPaper?questionIds='+this.studentAnswer,{"testPaperId":this.paperId,"userId":this.userInfo.id});
        this.flag = false;
        if(this.radioNum==0){
          this.change(0,1)
        }else{
          this.change(0,0)
        }
      })
    },
    commit() { //答案提交计算分数
      this.$confirm("考试结束时间未到,是否提前交卷","友情提示",{
        confirmButtonText: '立即交卷',
        cancelButtonText: '再检查一下',
        type: 'warning'
      }).then(() => {
        console.log("交卷")
        let date = new Date()
        this.endTime = this.getTime(date)
        let answerDate = this.endTime.substr(0,10)
        //提交成绩信息
        this.$axios('',{}).then(res => {
          if(res.data.code == 200) {
            
          }else{
            console.log("提交失败")
          }
          for(let i=0;i<this.radioNum;i++){
            this.judgeAnswer(0,i)
          }
          for(let j=0;j<this.checkListNum;j++){
            this.judgeAnswer(1,j)
          }
          this.flag = false;
          this.change(0);
        })
      }).catch(() => {
        console.log("继续答题")
      })
    },
    timeOut(){
      this.$message.warning("时间到");
      for(let i=0;i<this.radioNum;i++){
          this.isPractice[0][i] = true;
          this.judgeAnswer(0,i)
        }
        for(let j=0;j<this.checkListNum;j++){
          this.isPractice[1][j] = true;
          this.judgeAnswer(1,j)
        }
        this.$axios.post('/studentAnswer/answerTestPaper?questionIds='+this.studentAnswer,{"testPaperId":this.paperId,"userId":this.userInfo.id});
        this.flag = false;
        if(this.radioNum==0){
          this.change(0,1)
        }else{
          this.change(0,0)
        }
    },
    judgeAnswer(type,Index){
      let list = type ? this.checkList[Index] : this.radio[Index];
      if(list==null){
        list = '';
      }
      let standardAnswer = [];
      let myAnswer = [];
      let c = ['A','B','C','D']
      //j为标准答案的index,k为我的答案的index
      for(let i=0,j=0,k=0;i<4;i++){
        if(this.paperData.questionList[type][Index].questionAnswer.length<=j){
          standardAnswer[i] = 0;
        }else if(this.paperData.questionList[type][Index].questionAnswer[j] == c[i]){
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
        console.log("type:"+type+" Index:"+Index)
        if(standardAnswer[i] == 1){
          if(myAnswer[i] == 1){
            this.answer[type][Index][i] = 'correct';
          }else{
            this.answer[type][Index][i] = 'lack'
          }
        }else{
          if(myAnswer[i] == 1){
            this.answer[type][Index][i] = 'false';
          }
        }
      }
      if(type==0){
        if(list == this.paperData.questionList[type][Index].questionAnswer){
          this.studentAnswer.push(this.paperData.questionList[type][Index].questionId);
        }
      }else{
        if(list.join("") == this.paperData.questionList[type][Index].questionAnswer){
          this.studentAnswer.push(this.paperData.questionList[type][Index].questionId);
        }
      }
    },
    exit(){
      this.$router.go(-1);
    },
    showTime() { //倒计时
      let t = setInterval(() => {
        this.time -= 1
        if(this.time == 10) {
          this.$message({
            showClose: true,
            type: 'error',
            message: '考生注意,考试时间还剩10分钟！！！'
          })}
        else if(this.time == 0) {
          clearInterval(t);
          this.timeOut();
        }
        if(this.flag==false){
          clearInterval(t);
        }
      },1000*60)
    },
    play(){
      this.$axios.post('admin/findKnowledgeIdById',{"knowledgeId":this.paperData.questionList[this.type][this.Index].knowledgeId}).then(res=>{
        console.log("knowledge",res);
        this.videoUrl = res.data.data.videoUrl;
        this.k_dialogVisible = true;
      })
    }
  },
}
</script>

<style lang="scss">
.title{
  display: flex;
  width: 100%;
}
#time{
  color: #000;
  float: right;
}
.iconfont.icon-time {
  color: #2776df;
  margin: 0px 6px 0px 20px;
}
.analysis {
  margin-top: 20px;
  .right {
    color: #2776df;
    font-size: 18px;
    border: 1px solid #2776df;
    padding: 0px 6px;
    border-radius: 4px;
    margin-left: 20px;
  }
  ul li:nth-child(2) {
    margin: 20px 0px;
  }
  ul li:nth-child(3) {
    padding: 10px;
    background-color: #d3c6c9;
    border-radius: 4px;
  }
}
.topic{
  color: #000;
}
.analysis span:nth-child(1) {
  font-size: 18px;
}
.mark {
  position: absolute;
  width: 4px;
  height: 4px;
  content: "";
  background-color: red;
  border-radius: 50%;
  top: 0px;
  left: 22px;
}
.border {
  position: relative;
  border: 1px solid #FF90AA !important;
}
.bg {
  background-color: #1abdef !important;
}
.fill .el-input {
  display: inline-flex;
  width: 150px;
  margin-left: 20px;
  .el-input__inner {
    border: 1px solid transparent;
    border-bottom: 1px solid #eee;
    padding-left: 20px;
  }
}
/* slider过渡效果 */
.slider-fade-enter-active {
  transition: all .3s ease;
}
.slider-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slider-fade-enter, .slider-fade-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}

.operation .end li:nth-child(2) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgb(39, 118, 223);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  color: #fff;
}
.operation .end li {
  cursor: pointer;
  margin: 0 100px;
}
.operation {
  background-color: #fff;
  border-radius: 4px;
  padding: 10px 0px;
  margin-right: 10px;
}
.operation .end {
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(39, 118, 223);
}
.content .number {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  // background-color: rgb(39, 118, 223);
  border-radius: 4px;
  margin-right: 4px;
}
.content {
  padding: 0px 20px;
}
.content .topic {
  padding: 20px 0px;
  padding-top: 30px;
}
.right .content {
  background-color: #fff;
  margin: 10px;
  margin-left: 0px;
  // height: 470px;
}
.content .el-radio-group label {
  color: #000;
  margin: 5px 0px;
}
.content .el-radio-group {
  display: flex;
  flex-direction:column;
}
.right .title p {
  margin-left: 20px;
}
.flexarea {
  display: flex;
}
.flexarea .right {
  flex: 1;
}
.auto-right {
  margin-left: auto;
  color: #2776df;
  margin-right: 10px;
}
.right .title {
  margin-right: 10px;
  padding-right: 30px;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  background-color: #fff;
  height: 50px;
  line-height: 50px;
}
.clearfix {
  clear: both;
}
.l-bottom .final {
  cursor: pointer;
  display: inline-block;
  text-align: center;
 background-color: rgb(39, 118, 223);
  width: 240px;
  margin: 20px 0px 20px 10px;
  border-radius: 4px;
  height: 30px;
  line-height: 30px;
  color: #fff;
  margin-top: 22px;
}
#answer .left .item {
  padding: 0px;
  font-size: 16px;
  height: 100%;
}
.l-bottom {
  border-radius: 4px;
  background-color: #fff;
}
.l-bottom .item p {
  margin-bottom: 15px;
  margin-top: 10px;
  color: #000;
  margin-left: 10px;
  letter-spacing: 2px;
}
.l-bottom .item li {
  width: 15%;
  margin-left: 5px;
  margin-bottom: 10px;
}
.l-bottom .item {
  display: flex;
  flex-direction: column;
}
.l-bottom .item ul {
  width: 100%;
  margin-bottom: -8px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.l-bottom .item ul li a {
  position: relative;
  justify-content: center;
  display: inline-flex;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #eee;
  text-align: center;
  color: #000;
  font-size: 16px;
}
.left .l-top {
  display: flex;
  justify-content: space-around;
  padding: 16px 0px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: #fff;
}
.left {
  width: 260px;
  height: 100%;
  margin: 10px 10px 0px 10px;
}
.left .l-top li:nth-child(2) a {
  border: 1px solid #eee;
}
.left .l-top li:nth-child(3) a {
  background-color: #5188b8;
  border: none;
}
.left .l-top li:nth-child(4) a {
  position: relative;
  border: 1px solid #eee;
}
.left .l-top li:nth-child(4) a::before {
  width: 4px;
  height: 4px;
  content: " ";
  position: absolute;
  background-color: red;
  border-radius: 50%;
  top: 0px;
  left: 16px;
}
.left .l-top li {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.left .l-top li a {
  display: inline-block;
  padding: 10px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #FF90AA;
}
#answer .top {
  background-color: rgb(39, 118, 223);
}
#answer .item {
  color: #fff;
  display: flex;
  padding: 20px;
  font-size: 20px;
}
#answer .top .item li:nth-child(1) {
  margin-right: 10px;
}
#answer .top .item li:nth-child(3) {
  position: relative;
  margin-left: auto;
}
#answer {
  padding-bottom: 30px;
}
.icon20 {
  font-size: 20px;
  font-weight: bold;
}
.item .msg {
  padding: 10px 15px;
  border-radius: 4px;
  top: 47px;
  right: -30px;
  color: #6c757d;
  position: absolute;
  border: 1px solid rgba(0,0,0,.15);
  background-color: #fff;
}
.item .msg p {
  font-size: 16px;
  width: 200px;
  text-align: left;
}
.checkBox{
  display: block;
  margin: 10px;
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

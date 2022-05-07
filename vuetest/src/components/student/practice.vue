<!--考生答题界面-->
<template>
  <div id="answer" v-if="load">
    <el-container>
      <!-- 编号区 -->
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
                        {{index+1}}
                      </a>
                    </li>
                  </ul>
                </div>
                <div class="final" @click="commit()">结束考试</div>
              </div>
            </div>
          </transition>
        </div>
      </el-aside>
      <!-- 答题区 -->
      <el-main>
         <!--右边选择答题区-->
        <transition name="slider-fade">
          <div class="right">
            <div class="title">
              <el-button @click="() => slider_flag = !slider_flag">题目列表</el-button>
            </div>

            <div class="content" v-if="type">
              <p class="topic"><span class="number">{{Index+1}}</span>{{paperData.questionList[1][Index].questionContent}}</p>
              <div >
                <el-checkbox-group v-model="checkList[Index]">
                  <el-checkbox :id="answer[1][Index][0]" label="A" class="checkBox" :disabled="bg_flag[type][Index]">A:{{paperData.questionList[1][Index].questionOptionA}}</el-checkbox>
                  <el-checkbox :id="answer[1][Index][1]" label="B" class="checkBox" :disabled="bg_flag[type][Index]">B:{{paperData.questionList[1][Index].questionOptionB}}</el-checkbox>
                  <el-checkbox :id="answer[1][Index][2]" label="C" class="checkBox" :disabled="bg_flag[type][Index]">C:{{paperData.questionList[1][Index].questionOptionC}}</el-checkbox>
                  <el-checkbox :id="answer[1][Index][3]" label="D" class="checkBox" :disabled="bg_flag[type][Index]">D:{{paperData.questionList[1][Index].questionOptionD}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>

            <div class="content" v-else>
              <p class="topic"><span class="number">{{Index+1}}</span>{{paperData.questionList[0][Index].questionContent}}</p>
              <div >
                <el-radio-group v-model="radio[Index]">
                  <el-radio  :id="answer[0][Index][0]" label="A" :disabled="bg_flag[type][Index]">A:{{paperData.questionList[0][Index].questionOptionA}}</el-radio>
                  <el-radio  :id="answer[0][Index][1]" label="B" :disabled="bg_flag[type][Index]">B:{{paperData.questionList[0][Index].questionOptionB}}</el-radio>
                  <el-radio  :id="answer[0][Index][2]" label="C" :disabled="bg_flag[type][Index]">C:{{paperData.questionList[0][Index].questionOptionC}}</el-radio>
                  <el-radio  :id="answer[0][Index][3]" label="D" :disabled="bg_flag[type][Index]">D:{{paperData.questionList[0][Index].questionOptionD}}</el-radio>
                </el-radio-group>
              </div>
            </div>

            <div class="operation">
              <ul class="end" v-if="bg_flag[type][Index]">
                <li @click="previous()"><i class="iconfont icon-previous"></i><span>上一题</span></li>
                <li v-if="collect_flag" @click="collect()"><span>取消</span></li>
                <li v-else @click="collect()"><span>收藏</span></li>
                <li @click="next()"><span>下一题</span><i class="iconfont icon-next"></i></li>
              </ul>
              <ul class="end" v-else>
                <el-button @click="submit">提交</el-button>
              </ul>
            </div>

            <div class="analysis" v-show="isPractice[type][Index]">
              <ul>
                <li> <el-tag type="success">正确答案：</el-tag><span class="right">{{paperData.questionList[type][Index].questionAnswer}}</span></li>
                <li v-if="paperData.questionList[type][Index].knowledge!=null"><el-tag>知识点：<a href="#" @click="play">{{paperData.questionList[type][Index].knowledge}}</a></el-tag></li>
                <li><el-tag>题目解析：</el-tag></li>
                <li>{{paperData.questionList[0][Index].questionAnalysis == null ? '暂无解析': paperData.questionList[type][Index].questionAnalysis}}</li>
              </ul>
              <div v-if="!commentFlag" id="pinglun">
                <el-button  @click="displayComment" type="text">评论</el-button>
              </div>
              
              <div v-else class="comments">
                <div class="comment-wrap">
                    <!-- <div class="photo">
                        <div class="avatar" style="background-image: url('#')"></div>
                    </div> -->
                    <div class="comment-block">
                        <form>
                          <el-input type="textarea" autosize maxlength="30" show-word-limit v-model="input"></el-input>
                          <div class="bottom-comment">
                            <div class="comment-date"></div>
                            <ul class="comment-actions">
                              <el-button size="small" @click="comment">评论</el-button>
                            </ul>
                          </div>
                        </form>
                    </div>
                </div>
                <div class="comment-wrap" v-for="(comment,index) in comments">
                    <!-- <div class="photo">
                        <div class="avatar" style="background-image: url('#')"></div>
                    </div> -->
                    <div class="comment-block">
                        <p class="comment-text">{{comment.commentContent}}</p>
                        <div class="bottom-comment">
                            <div class="comment-date"></div>
                            <ul class="comment-actions">
                                <!-- <li class="complain" th:value="${vidname}">Complain</li>
                                <li class="reply" th:value="${username}">Reply</li> -->
                                <el-button v-if="thumpFlag[index]">已点赞</el-button>
                                <el-button v-else @click="thumbUp(index)">赞</el-button>
                                <el-button v-if="stampFlag[index]">已踩</el-button>
                                <el-button v-else @click="stamp(index)">踩</el-button>
                            </ul>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  data() {
    return {
      load:false,
      paperId:this.$route.query.paperId,
      isFrist:Number(this.$route.query.isFrist),
      bg_flag: [[],[]], //已答标识符,已答改变背景色
      slider_flag: true, //左侧显示隐藏标识符
      isPractice:[[],[]],//是否展示解析
      commentFlag:false,//是否展示评论
      thumpFlag: [],//是否点赞
      stampFlag:[],//是否点踩
      type:0,//题目种类

      input:null,

      radioNum:0,
      checkListNum:0,
      radio: [], //保存考生所有单选题的选项
      checkList:[],//保存考生所有多选题的选项(字符数组形式)
      checkAnswer:[],//保存考生所有多选题的选项(字符串形式)
      answer:[[],[]],//每道题每个选项的对错
      studentQuestionAnswer:[],//学生的做题记录

      Index: 0, //全局index
      paperData: { //考试信息
        questionList:[[],[]],
      },
      comments:[
        // {
        //   commentId:null,
        //   userId:null,
        //   url:null,
        //   content:"这是一条评论",
        // }
      ],

    }
  },
  computed:mapState(['userInfo']),
  created() {
    // this.test();
    this.getExamData()
    // this.showTime()
  },
  
  methods: {
    test(){
      this.radioNum = this.paperData.questionList[0].length;
      this.checkListNum = this.paperData.questionList[1].length;
      this.answer[0] = [];
      this.answer[1] = [];
      for(let i=0;i<this.paperData.questionList[0].length;i++){
        this.bg_flag[0][i] = 0;
        this.isPractice[0][i] = 0;
        this.radio[i] = null;
        this.answer[0][i] = [null,null,null,null];
      }
      for(let j=0;j<this.paperData.questionList[1].length;j++){
        this.bg_flag[1][j] = 0;
        this.isPractice[1][j] = 0;
        this.checkList[j] = [];
        this.answer[1][j] = [null,null,null,null];
      }
    },
    getExamData() { //获取当前试卷所有信息
      // let date = new Date()
      // this.startTime = this.getTime(date)
      if(!this.isFrist){
        console.log("test1")
        this.$axios.post('/studentAnswer/answerPublicQuestionAgain?studentId='+this.userInfo.id+"&chapterId="+this.paperId).then(res=>{
          console.log(res.data);
          if(res.data.code==200){
            for(let i=0;i<res.data.data.questionRadioList.length;i++){
              this.paperData.questionList[0][i] = res.data.data.questionRadioList[i].question;
              this.studentQuestionAnswer[i] = {};
              this.studentQuestionAnswer[i].questionId = res.data.data.questionRadioList[i].question.questionId
              this.studentQuestionAnswer[i].studentAnswer = res.data.data.questionRadioList[i].studentAnswer;
            }
            let n = res.data.data.questionRadioList.length;
            for(let j=0;j<res.data.data.questionMultipleList.length;j++){
              this.paperData.questionList[1][j] = res.data.data.questionMultipleList[j].question;
              this.studentQuestionAnswer[n+j] = {};
              this.studentQuestionAnswer[n+j].questionId = res.data.data.questionMultipleList[j].question.questionId;
              this.studentQuestionAnswer[n+j].studentAnswer = res.data.data.questionMultipleList[j].studentAnswer;
            }
            console.log(this.studentQuestionAnswer);
            this.initpaper();
          }else{
            console.log("error");
          }
        })
      }
      else{
        console.log("test2")
        this.$axios.post('/studentAnswer/findPublicQuestion',{"chapterId":this.paperId}).then(res => {  //通过paperId获取试题题目信息
          console.log(res.data);
          if(res.data.code == 200){
            this.paperData.questionList[0] = res.data.data.questionRadioList;
            this.paperData.questionList[1] = res.data.data.questionMultipleList;
            this.initpaper();
          }else{
            console.log("error");
          }
        })
      }
    },
    initpaper(){
      this.radioNum = this.paperData.questionList[0].length;
      this.checkListNum = this.paperData.questionList[1].length;
      this.answer[0] = [];
      this.answer[1] = [];
      for(let i=0;i<this.paperData.questionList[0].length;i++){
        this.bg_flag[0][i] = 0;
        this.isPractice[0][i] = 0;
        this.radio[i] = null;
        this.answer[0][i] = [null,null,null,null];
        // this.studentQuestionAnswer[i] = {};
      }
      let n =this.paperData.questionList[0].length;
      for(let j=0;j<this.paperData.questionList[1].length;j++){
        this.bg_flag[1][j] = 0;
        this.isPractice[1][j] = 0;
        this.checkList[j] = [];
        this.answer[1][j] = [null,null,null,null];
        // this.studentQuestionAnswer[n+j] = {};
      }
      if(!this.isFrist){
        for(let i=0;i<this.radioNum;i++){
          this.radio[i] = this.studentQuestionAnswer[i].studentAnswer;
          if(this.studentQuestionAnswer[i].studentAnswer!=null){
            this.type = 0;
            this.Index = i;
            this.judgeAnswer();
          }
        }
        for(let j=0;j<this.checkListNum;j++){
          this.checkList = this.studentQuestionAnswer[this.radioNum+j].studentAnswer.split("");
          if(this.studentQuestionAnswer[this.radioNum+j].studentAnswer!=null){
            this.type = 1;
            this.Index = j;
            this.judgeAnswer();
          }
        }
      }else{
        for(let i=0;i<this.radioNum;i++){
          this.studentQuestionAnswer[i] = {};
          this.studentQuestionAnswer[i].questionId = this.paperData.questionList[0][i].questionId;
        }
        for(let j=0;j<this.checkListNum;j++){
          this.studentQuestionAnswer[this.radioNum+j] = {};
          this.studentQuestionAnswer[this.radioNum+j].questionId = this.paperData.questionList[1][j].questionId;
        }
      }
      this.load = true;
    },
    change(index,type){
      this.Index = index;
      this.type = type;
      this.commentFlag == false;
      this.thumpFlag = [];
      this.stampFlag = [];
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
      this.commentFlag == false;
      this.thumpFlag = [];
      this.stampFlag = [];
    },
    next() { //下一题
      if(this.Index == (this.radioNum-1) && this.type == 0){
        if(this.checkListNum==0){
          this.commit();  
        }else{
          this.type = 1;
          this.Index = 0;
        }
      }else if(this.Index == this.checkListNum-1 && this.type == 1){
        this.commitTest();
      }else{
        this.Index++;
      } 
      this.commentFlag == false;
      this.thumpFlag = [];
      this.stampFlag = [];
    },
    judgeAnswer(){
      this.bg_flag[this.type][this.Index] = 1;
      this.isPractice[this.type][this.Index] = 1;
      let list = this.type ? this.checkList[this.Index] : this.radio[this.Index];
      let standardAnswer = [];
      let myAnswer = [];
      let c = ['A','B','C','D']
      //j为标准答案的index,k为我的答案的index
      for(let i=0,j=0,k=0;i<4;i++){
        if(this.paperData.questionList[this.type][this.Index].questionAnswer.length<=j){
          standardAnswer[i] = 0;
        }else if(this.paperData.questionList[this.type][this.Index].questionAnswer[j] == c[i]){
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
            this.answer[this.type][this.Index][i] = 'correct';
          }else{
            this.answer[this.type][this.Index][i] = 'lack'
          }
        }else{
          if(myAnswer[i] == 1){
            this.answer[this.type][this.Index][i] = 'false';
          }
        }
      }
    },
    collect() {
      this.$axios.post('/studentAnswer/collectQuestion',{"questionId":this.paperData.questionList[0][this.Index].questionId,"userStudentId":this.userInfo.id}).then((res) => {
        if(res.data.code == 200){
           this.$message({
            message: '收藏成功',
            type: 'success'
          })
        }else{
          console.log("error");
        }
      })
    },
    submit(){
      let list = this.type ? this.checkList[this.Index] : this.radio[this.Index];
      if(list.length!=0){
        this.judgeAnswer();
        if(this.type){
          this.checkAnswer[this.Index] = this.checkList[this.Index].join("");
          // this.studentQuestionAnswer[this.radioNum+this.Index].questionId = this.paperData.questionList[1][this.Index].questionId;
          this.studentQuestionAnswer[this.radioNum+this.Index].studentAnswer = this.checkAnswer[this.Index];
          console.log("test");
          if(this.checkAnswer[this.Index] == this.paperData.questionList[1][this.Index].questionAnswer){
            this.next();
          }else{
            this.$axios.post('/studentAnswer/addWrongQuestion',{"userStudentId":this.userInfo.id,"questionId":this.paperData.questionList[1][this.Index].questionId})
          }
        }else{
          // this.studentQuestionAnswer[this.Index].questionId = this.paperData.questionList[0][this.Index].questionId;
          this.studentQuestionAnswer[this.Index].studentAnswer = this.radio[this.Index];
          console.log("test");
          if(this.radio[this.Index] == this.paperData.questionList[0][this.Index].questionAnswer){
            this.next();
          }else{
            this.$axios.post('/studentAnswer/addWrongQuestion',{"userStudentId":this.userInfo.id,"questionId":this.paperData.questionList[0][this.Index].questionId}).then(res =>{
              console.log(res.data.code);
            })
          }
        }
      }else{
        console.log("请选择试题")
      }
    },
    displayComment(){
      console.log("comment");
      this.$axios.post('/studentAnswer/showComment?questionId='+this.paperData.questionList[this.type][this.Index].questionId).then(res=>{
        if(res.data.code == 200){
          this.comments = res.data.data;
          console.log(this.comments);
        }else{
          console.log("error");
        }
        this.commentFlag = true;
      })
    },
    thumbUp(index){
      this.$axios.post('/studentAnswer/thumb?commentId='+this.comments[index].commentId).then(res =>{
        if(res.data.code == 200){
          this.thumpFlag[index] = true;
          console.log("点赞成功")
        }else{
          console.log("点赞失败")
        }
      })
    },
    stamp(index){
      this.$axios.post('/studentAnswer/tread?commentId='+this.comments[index].commentId).then(res =>{
        if(res.data.code == 200){
          this.stampFlag[index] = true;
          console.log("踩成功")
        }else{
          console.log("踩失败")
        }
      })
    },
    comment(){
      console.log("comment");
      if(this.input != null && this.input !=''){
        this.$axios.post('/studentAnswer/addComment',
        {"questionId":this.paperData.questionList[this.type][this.Index].questionId,
        "userId":this.userInfo.id,
        "commentContent":this.input}).then(res =>{
          if(res.data.code==200){
            this.$message({
              message: '评论成功',
              type: 'success'
            })
            this.$axios.post('/studentAnswer/showComment?questionId='+this.paperData.questionList[this.type][this.Index].questionId).then(res=>{
              console.log(res.data);
              if(res.data.code == 200){
                this.comments = res.data.data;
              }else{
                console.log("error");
              }
            })
            this.input = null;
          }
        })
      }else{
        console.log("输入为空");
      }
    },
    commit() { //答案提交计算分数
      this.$confirm("是否交卷",{
        confirmButtonText: '立即交卷',
        cancelButtonText: '再检查一下',
        type: 'warning'
      }).then(() => {
        console.log("交卷")
        //提交成绩信息
        this.$router.go(-1);
        this.$axios.post('/studentAnswer/recordQuestion?studentId='+this.userInfo.id+'&questionId='+this.paperData.questionList[this.type][this.Index].questionId+'&chapterId='+this.paperId);
        this.$axios.post("/studentAnswer/answerPublicQuestion/?userId="+this.userInfo.id+"&chapterId="+this.paperId,this.studentQuestionAnswer).then(res => {
          console.log("res",res.data);
          if(res.data.code == 200) {
            console.log("上传成功")
          }else{
            console.log("上传失败")
          }
        })
      }).catch(() => {
        console.log("继续答题")
      })
    },
  },
  beforeRouteLeave(){
    this.$axios.post('/studentAnswer/recordQuestion?studentId='+this.userInfo.id+'&questionId='+this.paperData.questionList[this.type][this.Index].questionId+'&chapterId='+this.paperId);
    this.$axios.post("/studentAnswer/answerPublicQuestion?userId="+this.userInfo.id+"&chapterId="+this.paperId,this.studentQuestionAnswer).then(res => {
      console.log("res",res.data);
      if(res.data.code == 200) {
        console.log("上传成功")
      }else{
        console.log("上传失败")
      }
    })
  }
}
</script>

<style lang="scss">
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
  color: yellow;}
}
// #avatar{
//   float: left;
//   height: 100%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }
.comments {
    width: 100%;
    margin: 2.5rem auto 0;
    max-width: 60.75rem;
    padding: 0 1.25rem;
}
.comment-wrap {
    margin-bottom: 1.25rem;
    display: table;
    width: 100%;
    min-height: 5.3125rem;
}
.comment-block {
    width: 100%;
    padding: 1rem;
    background-color: #fff;
    display: table-cell;
    vertical-align: top;
    border-radius: 0.1875rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08);
}
.comment-block textarea {
    width: 100%;
    max-width: 100%;
}
.comment-block p {
    color: #000;
}
.comment-text {
    margin-bottom: 1.25rem;
}
.bottom-comment {
    color: #acb4c2;
    font-size: 0.875rem;
}
.comment-date {
    float: left;
}
.comment-actions {
    float: right;
}
.comment-actions li {
    display: inline;
}
.comment-actions li.complain {
    padding-right: 0.625rem;
    border-right: 1px solid #e1e5eb;
}
.comment-actions li.reply {
    padding-left: 0.625rem;
}
#pinglun{
  width: 100%;
  margin-top: 10px;
  background-color: white;
}
</style>

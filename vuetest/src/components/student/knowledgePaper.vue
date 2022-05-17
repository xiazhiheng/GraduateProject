<!--考生答题界面-->
<template>
  <div v-if="flag">
    <div id="top">
      <el-select v-model="condition.courseId"  @change="courseChange">
      <el-option
        v-for="item in subject"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
      </el-select>
      <el-select v-model="condition.chapterId">
        <el-option v-if="condition.courseId!=null"
          v-for="item in subject[condition.courseId-1].children"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="search">检索</el-button>
    </div>
    <el-checkbox-group v-model="knowledgeIds">
      <el-table :data="pagination.data" border id="t_table">
        <el-table-column width="34px">
          <template v-slot="scope">
            <el-checkbox :label="scope.row.knowledgeId" ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="knowledgeContent" label="标签"></el-table-column>
      </el-table>
      <el-button id="create" type="primary" @click="start">开始答题</el-button>
    </el-checkbox-group>
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
  </div>
  <div id="answer" v-else>
    <el-container>
      <!-- 编号区 -->
      <el-aside v-show="slider_flag">
        <div class="flexarea">
          <!--左边题目编号区-->
          <transition name="slider-fade">
            <div class="left" v-if="slider_flag">
              <div class="l-bottom">
                <div class="item">
                  <p>题号</p>
                  <ul>
                    <li v-for="(list, index) in questionList" :key="1">
                      <a href="javascript:;"
                        @click="change(index)"
                        :class="{'border': Index == index ,'bg': bg_flag[index]}">
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

            <div class="content" v-if="questionList[Index].questionType == 2">
              <p class="topic"><span class="number">{{Index+1}}</span>{{questionList[Index].questionContent}}</p>
              <div >
                <el-checkbox-group v-model="check" @change="checkChange">
                  <el-checkbox :id="answer[Index][0]" label="A" class="checkBox" :disabled="bg_flag[Index]">A:{{questionList[Index].questionOptionA}}</el-checkbox>
                  <el-checkbox :id="answer[Index][1]" label="B" class="checkBox" :disabled="bg_flag[Index]">B:{{questionList[Index].questionOptionB}}</el-checkbox>
                  <el-checkbox :id="answer[Index][2]" label="C" class="checkBox" :disabled="bg_flag[Index]">C:{{questionList[Index].questionOptionC}}</el-checkbox>
                  <el-checkbox :id="answer[Index][3]" label="D" class="checkBox" :disabled="bg_flag[Index]">D:{{questionList[Index].questionOptionD}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>

            <div class="content" v-else>
              <p class="topic"><span class="number">{{Index+1}}</span>{{questionList[Index].questionContent}}</p>
              <div >
                <el-radio-group v-model="radio">
                  <el-radio  :id="answer[Index][0]" label="A" :disabled="bg_flag[Index]">A:{{questionList[Index].questionOptionA}}</el-radio>
                  <el-radio  :id="answer[Index][1]" label="B" :disabled="bg_flag[Index]">B:{{questionList[Index].questionOptionB}}</el-radio>
                  <el-radio  :id="answer[Index][2]" label="C" :disabled="bg_flag[Index]">C:{{questionList[Index].questionOptionC}}</el-radio>
                  <el-radio  :id="answer[Index][3]" label="D" :disabled="bg_flag[Index]">D:{{questionList[Index].questionOptionD}}</el-radio>
                </el-radio-group>
              </div>
            </div>

            <div class="operation">
              <ul class="end" v-if="bg_flag[Index]">
                <li @click="previous()"><i class="iconfont icon-previous"></i><span>上一题</span></li>
                <li v-if="collect_flag" @click="collect()"><span>取消</span></li>
                <li v-else @click="collect()"><span>收藏</span></li>
                <li @click="next()"><span>下一题</span><i class="iconfont icon-next"></i></li>
              </ul>
              <ul class="end" v-else>
                <el-button @click="submit">提交</el-button>
              </ul>
            </div>

            <div class="analysis" v-show="isPractice[Index]">
              <ul>
                <li> <el-tag type="success">正确答案：</el-tag><span class="right">{{questionList[Index].questionAnswer}}</span></li>
                <li v-if="questionList[Index].knowledgeId!=null"><el-tag>知识点：<el-button type="text" @click="play">{{questionList[Index].knowledgeContent}}</el-button></el-tag></li>
                <li><el-tag>题目解析：</el-tag></li>
                <li>{{questionList[Index].questionAnalysis == null ? '暂无解析': questionList[Index].questionAnalysis}}</li>
              </ul>
              <div v-if="!commentFlag" id="pinglun">
                <el-button  @click="displayComment" type="text">评论</el-button>
              </div>
              
              <div v-else class="comments">
                <div class="comment-wrap">
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
  <!-- 知识点视频播放 -->
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
      flag:true,
      knowledgeIds:[],
      condition:{
        courseId:null,
        chapterId:null,
      },
      pagination: {
        //分页后的教师信息
        current: 1, //当前页
        total: null, //记录条数
        size: 6, //每页条数
        data:[]
      },
      knowledgeList:[],

      load:false,
      k_dialogVisible:false,
      videoUrl:null,
      bg_flag: [], //已答标识符,已答改变背景色
      slider_flag: true, //左侧显示隐藏标识符
      isPractice:[],//是否展示解析
      commentFlag:false,//是否展示评论
      thumpFlag: [],//是否点赞
      stampFlag:[],//是否点踩
      type:0,//题目种类
      k_dialogVisible:false,
      videoUrl:null,
      input:null,
      radio: [], //保存考生所有单选题的选项
      check: [],//保存考生多选题的选项
      answer:[],//每道题每个选项的对错
      Index: 0, //全局index
      questionList:[],
      comments:[],
    }
  },
  computed:mapState(['userInfo','subject']),
  created() {
    // this.search();
  },
  
  methods: {
    search(){
      if(this.condition.courseId!=null && this.condition.chapterId!=null){
        this.$axios.post('/admin/findKnowledgeByChapterIdAndCourseId',{"courseId":this.condition.courseId,"chapterId":this.condition.chapterId}).then(res => {
          console.log(res.data);
          if(res.data.code==200){
            this.knowledgeList = res.data.data;
            this.getKnowledgeInfoByPage();    
          }else{
            console.log("error");
          }
        })
      }
      this.$axios.post('')
    },
    getKnowledgeInfoByPage(){
      this.pagination.data = this.knowledgeList.slice((this.pagination.current-1)*this.pagination.size,this.pagination.current*this.pagination.size);
    },
    courseChange(){
      this.condition.chapterId = null;
    },
    start(){
      if(this.knowledgeIds==0){
        this.$message.error("请选择知识点");
      }else{
        this.$axios.post('/studentAnswer/findQuestionsByKnowledgeIds',this.knowledgeIds).then(res=>{
        console.log(res);
        if(res.data.code==200){
          this.questionList = res.data.data;
          if(this.questionList.length==0){
            this.$message.error("所选知识点未匹配试题");
          }else{
            this.initpaper();
            this.flag = false;
          }
        }
      })
      }
    },
    initpaper(){
      for(let i=0;i<this.questionList.length;i++){
        this.bg_flag[i] = 0;
        this.isPractice[i] = 0;
        this.answer[i] = [null,null,null,null];
      }
    },
    change(index){
      this.Index = index;
      this.commentFlag == false;
      this.thumpFlag = [];
      this.stampFlag = [];
    },
    previous() { //上一题
      if(this.Index !=0){
        this.Index--;
        this.commentFlag == false;
        this.thumpFlag = [];
        this.stampFlag = [];
      }
    },
    next() { //下一题
      if(this.Index!=this.questionList.length-1){
        this.Index++;
        this.commentFlag == false;
        this.thumpFlag = [];
        this.stampFlag = [];
      }else{
        this.commit();
      }
    },
    judgeAnswer(){
      this.bg_flag[this.Index] = 1;
      this.isPractice[this.Index] = 1;
      let list = this.questionList[this.Index].questionType==2 ? this.checkList : this.radio;
      let standardAnswer = [];
      let myAnswer = [];
      let c = ['A','B','C','D']
      //j为标准答案的index,k为我的答案的index
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
            this.answer[this.Index][i] = 'correct';
          }else{
            this.answer[this.Index][i] = 'lack'
          }
        }else{
          if(myAnswer[i] == 1){
            this.answer[this.Index][i] = 'false';
          }
        }
      }
      console.log(this.answer);
    },
    collect() {
      this.$axios.post('/studentAnswer/collectQuestion',{"questionId":this.questionList[this.Index].questionId,"userStudentId":this.userInfo.id}).then((res) => {
        console.log(res.data);
        if(res.data.code == 200){
           this.$message({
            message: '收藏成功',
            type: 'success'
          })
        }else if(res.data.code==502){
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    submit(){
      let list = this.questionList[this.Index].questionType==2 ? this.check : this.radio;
      console.log(list);
      if(list.length!=0){
        this.judgeAnswer();
        if(this.questionList[this.Index].questionType==2){
          if(this.check.join("") == this.questionList[this.Index].questionAnswer){
            this.next();
          }else{
            this.$axios.post('/studentAnswer/addWrongQuestion',{"userStudentId":this.userInfo.id,"questionId":this.questionList[this.Index].questionId})
          }
        }else{
          if(this.radio == this.questionList[this.Index].questionAnswer){
            this.next();
          }else{
            this.$axios.post('/studentAnswer/addWrongQuestion',{"userStudentId":this.userInfo.id,"questionId":this.questionList[this.Index].questionId}).then(res =>{
              console.log(res.data.code);
            })
          }
        }
        this.check = [];
        this.radio = [];
      }else{
        console.log("请选择答案")
      }
    },
    displayComment(){
      console.log("comment");
      this.$axios.post('/studentAnswer/showComment?questionId='+this.questionList[this.Index].questionId).then(res=>{
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
        {"questionId":this.questionList[this.Index].questionId,
        "userId":this.userInfo.id,
        "commentContent":this.input}).then(res =>{
          if(res.data.code==200){
            this.$message({
              message: '评论成功',
              type: 'success'
            })
            this.$axios.post('/studentAnswer/showComment?questionId='+this.questionList[this.Index].questionId).then(res=>{
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
        this.flag = true;
      }).catch(() => {
        console.log("继续答题")
      })
    },
    checkChange(val) { 
      this.checkL.sort();
    },
    play(){
      this.$axios.post('admin/findKnowledgeIdById',{"knowledgeId":this.questionList[this.Index].knowledgeId}).then(res=>{
        console.log("knowledge",res);
        this.videoUrl = res.data.data.videoUrl;
        this.k_dialogVisible = true;
      })
    },
  },
  // beforeRouteLeave(){
  //   this.$axios.post('/studentAnswer/recordQuestion?studentId='+this.userInfo.id+'&questionId='+this.paperData.questionList[this.type][this.Index].questionId+'&chapterId='+this.paperId);
  //   this.$axios.post("/studentAnswer/answerPublicQuestion?userId="+this.userInfo.id+"&chapterId="+this.paperId,this.studentQuestionAnswer).then(res => {
  //     console.log("res",res.data);
  //     if(res.data.code == 200) {
  //       console.log("上传成功")
  //     }else{
  //       console.log("上传失败")
  //     }
  //   })
  // }
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
  margin-right: 0px;
}
.l-bottom .item ul {
  width: 100%;
  margin-bottom: -8px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
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

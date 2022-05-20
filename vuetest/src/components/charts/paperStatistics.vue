<template>
  <div id="main">
    <div id="charts">
      <div ref="NumBox" class="box"></div>
    </div>
    <div id="charts">
      <div ref="ScoreBox" class="box"></div>
    </div>
    <div id="charts" v-show="display">
      <div ref="QuestionBox" class="box"></div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: "grade",
  data() {
    return {
      display:false,
      paper:[],
      isNull: false, //原始数据
      X: [], //x轴数据 保存次数
      QuestionX:[],
      NumY:[],
      ScoreY:[],
      QuestionY:[],
    }
  },
  computed:mapState(['userInfo']),
  created() {
    this.visit();
  },
  methods: {
    visit() {
      this.$axios.post('teacher/findTeacherTestPaper',{"testPaperMadeById":this.userInfo.id}).then((res)=>{
        this.paper = res.data.data;
        console.log("paper",this.paper);
        this.$axios.post('/teacher/findTestPaperAvgScoreAndAnswerNums',{"userId":this.userInfo.id}).then(res => {
          console.log("score",res.data);
          if(res.data.code==200){
            let n;
            for(let i=0;i<res.data.data.length;i++){
              n = this.paper.findIndex(item=>item.testPaperId == res.data.data[i].testPaperId);
              this.X[i] = this.paper[n].testPaperName;
              if(res.data.data[i].testPaperAvgScore!=null){
                this.ScoreY[i] = res.data.data[i].testPaperAvgScore;
              }else{
                this.ScoreY[i] = 0;
              }
              if(res.data.data[i].testPaperAnswerNums!=null){
                this.NumY[i] = res.data.data[i].testPaperAnswerNums;
              }else{
                this.NumY[i] = 0;
              }
            }
            let NumBoxDom = this.$refs["NumBox"];
            let NumCharts = this.$echarts.init(NumBoxDom);
            console.log(this.X);
            let NumOption = {
              title : {
                    text: `作答次数`,
                    x:'center',
                    y:'bottom',
                },
              xAxis: {
                type: "category",
                data: this.X
              },
              yAxis: {
                type: "value"
              },
              series: [
                {
                  data: this.NumY,
                  type: "bar",
                  itemStyle: { normal: { label: { show: true } } }
                }
              ]
            };
            NumCharts.setOption(NumOption);
            NumCharts.on("click", params => {
              this.setQuestionChart(res.data.data[params.dataIndex].testPaperId)
            });

            let ScoreBoxDom = this.$refs["ScoreBox"];
            let ScoreCharts = this.$echarts.init(ScoreBoxDom);
            let ScoreOption = {
              title : {
                    text: `平均成绩`,
                    x:'center',
                    y:'bottom',
                },
              xAxis: {
                type: "category",
                data: this.X
              },
              yAxis: {
                type: "value"
              },
              series: [
                {
                  data: this.ScoreY,
                  type: "bar",
                  itemStyle: { normal: { label: { show: true } } }
                }
              ]
            };
            ScoreCharts.setOption(ScoreOption);
            ScoreCharts.on("click", params => {
              this.setQuestionChart(res.data.data[params.dataIndex].testPaperId)
            });
          }
        })
			})
    },
    setQuestionChart(paperId){
      // this.display = false;
      this.$axios.post('/teacher/findTestPaperAllQuestionsRate',{"testPaperId":paperId}).then(res=>{
        console.log(res.data);
        if(res.data.code==200){
          this.QuestionX = [];
          for(let i=0;i<res.data.data.length;i++){
            this.QuestionX[i] = '第'+(i+1)+'题';
            if(res.data.data[i].questionRate==null){
              this.QuestionY[i] = 0;  
            }else{
              this.QuestionY[i] = res.data.data[i].questionRate;
            }
          }
          let QuestionBoxDom = this.$refs["QuestionBox"];
          let QuestionCharts = this.$echarts.init(QuestionBoxDom);
          let QuestionOption = {
            title : {
                  text: `正确率`,
                  x:'center',
                  y:'bottom',
              },
            xAxis: {
              type: "category",
              data: this.QuestionX
            },
            yAxis: {
              type: "value"
            },
            series: [
              {
                data: this.QuestionY,
                type: "bar",
                itemStyle: { normal: { label: { show: true } } }
              }
            ]
          };
          QuestionCharts.setOption(QuestionOption);
          this.display = true;
        }
        else{
          this.$message.error("暂无做题记录");
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
#main{
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
#charts {
  position: relative;
  color: black;
  font-weight: bold;
  .box{
    width: 400px;
    height: 200px;
  }
  .notFound {
    position: absolute;
    top: 0px;
    left: 0px;
  }
}
</style>

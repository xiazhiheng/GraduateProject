<template>
  <div id="main">
    <div id="charts">
      <div ref="userBox" class="box"></div>
    </div>
    <div id="charts">
      <div ref="queBox" class="box"></div>
      
    </div>
    <div id="charts">
      <div ref="visitBox" class="box"></div>
    </div>
    <div id="charts">
      <div ref="questionBox" class="box"></div>
    </div>
    <div id="charts">
      <div ref="studentBox" class="box"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "grade",
  data() {
    return {
      isNull: false, //原始数据
      X: [], //x轴数据 保存次数
      visitY: [], //y轴数据 保存分数
      questionY:[],
      studentY:[],
    }
  },
  created() {
    this.visit();
  },
  methods: {
    visit() {
      this.$axios.post('/admin/findNumsByIdentity').then(res => {
        if(res.data.code==200){
          let userBoxDom = this.$refs["userBox"];
          let userCharts = this.$echarts.init(userBoxDom);
          let userOption = {
             title : {
                  text: `用户占比图`,
                  x:'center',
                  y:'bottom',
              },
            series: [
              {
                data: [
                  {value:res.data.data.teacherNums,name:"教师"},
                  {value:res.data.data.studentNums,name:"学生"},
                ],
                name: '分数段',
                type: "pie",
                radius: '55%',
                label: {
                  normal: {
                      show: true,
                      formatter: '{b}:{c}' + '\n\r' + '({d}%)'
                  }
                }
              }
            ]
          };
          userCharts.setOption(userOption);
        }
      })
      
      this.$axios.post('/admin/findNumsbyLimition').then(res => {
        console.log(res.data);
        if(res.data.code==200){
          let queBoxDom = this.$refs["queBox"];
          let queCharts = this.$echarts.init(queBoxDom);
          let queOption = {
            title : {
              text: `试题占比图`,
              x:'center',
              y:'bottom',
            },
            series: [
              {
                data: [
                  {value:res.data.data.privateNums,name:"私有试题"},
                  {value:res.data.data.openNums,name:"共有试题"},
                ],
                type: "pie",
                radius: '55%',
                label: {
                  normal: {
                      show: true,
                      formatter: '{b}:{c}' + '\n\r' + '({d}%)'
                  }
                }
              }
            ]
          };
          queCharts.setOption(queOption);
        }
      })

      this.$axios.post('/admin/findAllWebDataByMonth').then(res => { //根据学生Id查询成绩
        // console.log(res.data);
        if(res.data.code == 200) {
          for(let i=0;i<res.data.data.length;i++){
            this.X.push(res.data.data[i].theMonth+'月');
            this.visitY.push(res.data.data[i].webVisitedNums);
            this.questionY.push(res.data.data[i].newQuestionNums);
            this.studentY.push(res.data.data[i].newStudentNums);
          }
          let visitBoxDom = this.$refs["visitBox"];
          let visitCharts = this.$echarts.init(visitBoxDom);
          let visitOption = {
            title : {
              text: `每月访问人数`,
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
                data: this.visitY,
                type: "bar",
                itemStyle: { normal: { label: { show: true } } }
              }
            ]
          };
          visitCharts.setOption(visitOption);
          visitCharts.on("mouseover", params => {
            
          });

          let questionBoxDom = this.$refs["questionBox"];
          let questionCharts = this.$echarts.init(questionBoxDom);
          let questionOption = {
            title : {
              text: `每月新增题目数`,
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
                data: this.questionY,
                type: "bar",
                itemStyle: { normal: { label: { show: true } } }
              }
            ]
          };
          questionCharts.setOption(questionOption);
          questionCharts.on("mouseover", params => {
            
          });

          let studentBoxDom = this.$refs["studentBox"];
          let studentCharts = this.$echarts.init(studentBoxDom);
          let studentOption = {
            title : {
              text: `每月新增学生数`,
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
                data: this.studentY,
                type: "bar",
                itemStyle: { normal: { label: { show: true } } }
              }
            ]
          };
          studentCharts.setOption(studentOption);
          studentCharts.on("mouseover", params => {
            
          });
        }else {
          this.isNull = true
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

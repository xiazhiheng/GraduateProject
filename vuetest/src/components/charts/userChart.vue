<template>
  <div id="grade">
    <div ref="box" class="box"></div>
  </div>
</template>

<script>
export default {
  name: "grade",
  data() {
    return {
      isNull: false, //原始数据
      tableDataX: [1,2,3,4,5,6,7], //x轴数据 保存次数
      tableDataY: [10,20,15,12,14,30,18], //y轴数据 保存分数
    }
  },
  mounted() {
    this.score();
  },
  methods: {
    score() {
      let studentId = this.$route.query.studentId
      // this.$axios(`/api/score/${studentId}`).then(res => { //根据学生Id查询成绩
      //   console.log(res)
      //   if(res.data.code == 200) {
      //     let rootData = res.data.data
      //     rootData.forEach((element,index) => {
      //       this.tableDataX.push(`第${index + 1}月`)
      //       this.tableDataY.push(element.etScore)
      //     });
      //     let boxDom = this.$refs["box"];
      //     let scoreCharts = this.$echarts.init(boxDom);
      //     let option = {
      //       xAxis: {
      //         type: "category",
      //         data: this.tableDataX
      //       },
      //       yAxis: {
      //         type: "value"
      //       },
      //       series: [
      //         {
      //           data: this.tableDataY,
      //           type: "line",
      //           itemStyle: { normal: { label: { show: true } } }
      //         }
      //       ]
      //     };
      //     scoreCharts.setOption(option);
      //     scoreCharts.on("mouseover", params => {
      //       console.log(params.value);
      //     });
      //   }else {
      //     this.isNull = true
      //   }
      // })
      
      let boxDom = this.$refs["box"];
      let scoreCharts = this.$echarts.init(boxDom);
      let option = {
        series: [
          {
            data: [
              {value:10,name:"教师"},
              {value:50,name:"学生"},
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

      scoreCharts.setOption(option);
      // scoreCharts.on("mouseover", params => {
      //   console.log(params.value);
      // });

    }
  }
};
</script>

<style lang="scss" scoped>
#grade {
  position: relative;
  .box{
    width: 600px;
    height: 400px;
  }
  .notFound {
    position: absolute;
    top: 0px;
    left: 0px;
  }
}
</style>

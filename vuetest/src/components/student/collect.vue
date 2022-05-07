<template>
  <div id="myCollect">
    <!-- <div class="title">我的收藏</div> -->
    <div class="wrapper" id="c_wrapper">
      <ul class="paper" v-if="flag">
        <li  class="item" @click="">
          <h4>收藏夹</h4>
          <el-button @click="to_collect">开始答题</el-button>
        </li>
        <li  class="item" @click="">
          <h4>错题集</h4>
          <el-button @click="to_wrong">开始答题</el-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  // name: 'myCollect'
  data() {
    return {
      flag:true,
      list:[],
    }
  },
  computed:mapState(["subject"]),
  created() {
   this.list = this.subject
  },
  
  methods: {
    to_collect(){
      this.$router.push('/collectPractice');
    },
    to_wrong(){
      this.$router.push('/wrongPractice');
    }
  }
}
</script>


<style lang="scss">
.pagination {
  padding: 20px 0px 30px 0px;
  .el-pagination {
    display: flex;
    justify-content: center;
  }
}
.paper {
  h4 {
    cursor: pointer;
  }
  .item a {
    color: #000;
  }
  .item {
    width: 380px;
    border-radius: 4px;
    padding: 20px 30px;
    border: 1px solid #eee;
    box-shadow: 0 0 4px 2px rgba(217,222,234,0.3);
    transition: all 0.6s ease;
  }
  .item:hover {
    box-shadow: 0 0 4px 2px rgba(140, 193, 248, 0.45);
    transform: scale(1.03);
  }
  .item .info {
    font-size: 14px;
    color: #88949b;
  }
  .item .name {
    font-size: 14px;
    color: #88949b;
  }
  *{
    margin: 20px 0;
  }
}
// .wrapper {
//   height: auto;
//   overflow: auto;
// }
.item .info{
  i{
    margin-right: 5px;
    color: #0195ff;
  }
  span {
    margin-right: 14px;
  }
}
#myCollect .search-li {
  margin-left: auto;
}
#myCollect {
  width: 980px;
  margin: 0 auto;
}
#myCollect .title {
  margin: 20px;
}
#myCollect .wrapper {
  background-color: #fff;
}
.item .info i {
  margin-right: 5px;
  color: #0195ff;
}
.item .info span {
  margin-right: 14px;
}
#c_wrapper .paper .item {
  border-radius: 4px;
  padding: 20px 30px;
  border: 1px solid #eee;
  box-shadow: 0 0 4px 2px rgba(217,222,234,0.3);
  transition: all 0.6s ease;
  width: 40%;
  height: 200px;
  margin-top: 20px;
  margin-left: 50px;
  margin-right: 50px;
}
.paper .item:hover {
  box-shadow: 0 0 4px 2px rgba(140, 193, 248, 0.45)
}
.paper .item .info {
  font-size: 14px;
  color: #88949b;
}
.paper .item .name {
  font-size: 14px;
  color: #88949b;
}
.paper * {
  margin: 20px 0;
}
#c_wrapper .paper {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
#myCollect .search-li {
  margin-left: auto;
}
#myCollect {
  width: 980px;
  margin: 0 auto;
}
#myCollect .title {
  margin: 20px;
}
#myCollect .wrapper {
  background-color: #fff;
}
</style>

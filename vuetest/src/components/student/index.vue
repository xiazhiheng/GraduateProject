<template>
  <el-container>
        <el-main id="main">
         <el-row :gutter="20">
          <el-col :span="8">
            <div class="infinite-list-wrapper" id="news">
              <ul>
                <el-scrollbar v-infinite-scroll="load" infinite-scroll-disabled="disabled" infinite-scroll-distance="0px" class="infinite-list">
                  <li v-for="item in news" class="infinite-list-item"><a id="new" :href="item.newspaperUrl" target="_blank">{{item.newspaperName}}</a></li>
                  <p v-if="loading">加载中...</p>
                  <p v-if="noMore">没有更多了</p>
                </el-scrollbar>
              </ul>
            </div>
          </el-col>
          <el-col :span="16"> 
            <div class="ad">
              <el-carousel trigger="click" >
                <el-carousel-item v-for="(item,index) in ads">
                  <img :src="require('@/assets/img/'+item.name+'.jpg')"/>
                </el-carousel-item>
              </el-carousel>
            </div>
          </el-col>
        </el-row>
        </el-main>
        <el-aside width="200px" id="index_aside">
          <div class="demo-basic--circle" id="avatar">
            <el-avatar :size="130" :src="userInfo.imgUrl" class="as-avatar"></el-avatar>
          </div>
          <el-button id="answer_button">{{userInfo.name}}</el-button>
        </el-aside>
      </el-container>
</template>
<script>
import {mapState} from 'vuex'
export default{
  data(){
    return {
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      count: 5,
      loading: false,
      ads:[
        {
          name:'teacher1'
        },
        {
          name:'teacher2'
        }
      ],
      news:[]
    }
  },
  created(){
    this.getNews();
  },
  computed: {
    ...mapState(["userInfo"]),
    noMore () {
      return this.count >= 10
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  methods:{
    getNews(){
      this.$axios.post('/login/newsData').then(res =>{
        console.log(res);
        if(res.data.code == 200){
          this.news = res.data.data;
        }
      })
    },
    load () {
      this.loading = true
      setTimeout(() => {
        this.count += 2
        this.loading = false
      }, 2000)
    }
  }
}
</script>
<style>
  #main{
    background-color: white;
  }
  #news{
    border-width: 5px;
    border-color: black;
  }
  #news a{
    text-decoration:none;  
  }
  #new{
    color: black;
  }
  .infinite-list {
    height: 300px;
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .infinite-list .infinite-list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    background: var(--el-color-primary-light-9);
    margin: 10px;
    color: var(--el-color-primary);
  }
  .infinite-list .infinite-list-item + .list-item {
    margin-top: 10px;
  }
  #avater{
    text-align: center;
  }
  #answer_button{
    margin-top: 80px;
  }
  #index_aside{
    text-align: center;
  }
  .ad{
    width: 100%;
    height: 100%;
  }
  .ad img{
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
</style>
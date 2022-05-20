<!--左边下拉导航栏-->
<template>
  <div id="left">
    <el-menu
      active-text-color="#dd5862" 
      text-color="#000" 
      :default-active="this.$route.path"
      class="el-menu-vertical-demo" 
      @open="handleOpen" 
      @close="handleClose" 
      :collapse="flag"
      background-color="#0f6fed"  
      menu-trigger="click" router>
      <el-submenu v-for="(item,index) in menu" :index='item.index' :key="index" id="menu">
        <template v-slot:title>
          <div class="left-width" id="icon">
            <el-icon class="iconfont" >
              <component :is="item.icon"/>
            </el-icon>
            <span  class="title">{{item.title}}</span>
          </div>
        </template>
        <el-menu-item-group v-for="(list,index1) in item.content" :key="index1">
          <el-menu-item @click="handleTitle(item.index)" :index="list.path">{{list.item}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
// import store from '@/vuex/store'
import {mapState} from 'vuex'
export default {
  name: "mainLeft",
  data() {
    return {
      menu:null,
    }
  },
  computed: mapState(['flag','userInfo',"a_menu","t_menu"]),
  created() {
    if(this.userInfo.role=="admin"){
      this.menu = this.a_menu;
    }else if(this.userInfo.role=="teacher"){
      this.menu = this.t_menu;
    }else{
      console.log(this.userInfo);
      console.log("mainLeft error");
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    //点击标题传递参数给navigator组件
    handleTitle(index) {
      // this.bus.$emit('sendIndex',index)
    },
  }
}
</script>

<style>
.el-menu-vertical-demo .el-submenu__title {
  overflow: hidden;
}
.left-width{
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: flex-start;

}
/* .left-width .iconfont {
  font-size: 18px;
  color: rgb(143, 18, 18);
} */
.el-menu-vertical-demo:not(.el-menu--collapse) {
  /* min-height: 500px; */
}
#left {
  /* min-height: 500px; */
  height: 100%;
  background-color: #0f6fed;
  z-index: 0;
}
#left .el-menu-vertical-demo .title {
  color: rgb(22, 14, 14);
  font-size: 16px;
  font-weight: bold;
  margin-left: 14px;
}
.el-submenu {
  border-bottom: 1px solid #eeeeee0f !important;
}
.el-submenu__title:hover {
  background-color: rgb(72, 66, 95);
}
.el-submenu__title i {
  color:white !important;
}
#menu .el-menu-item{
  min-width: 150px;
}
</style>

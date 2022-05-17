// import axios from 'axios'
import { createApp } from 'vue'
import { store }  from './store'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import 'element-plus/lib/theme-chalk/display.css';
import './assets/css/styles.css'
import vuex from 'vuex';
import axios from 'axios'
import cookie from './plugins/cookie';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import * as echarts from 'echarts';

const app = createApp(App)
cookie(app)
// axios.defaults.baseURL="http://192.168.43.40:8088";
axios.defaults.baseURL="http://192.168.43.104:8088";
axios.defaults.withCredentials = true
axios.interceptors.request.use(config=>{
  //1.1 获取到浏览器里面一直存储的token，并将它放到
  let uToken =  localStorage.getItem("uToken");
  if(uToken){
  //1.2 注意：给请求头里面添加u-token（后台判断就是取的这个请求头）请求头，并把随机数的token值也设置进去
      config.headers['u-token']=uToken;
  }
  //1.3 必须要返回这个，才能执行后面代码
  return config;
},error => {
  Promise.reject(error);
});
app.config.globalProperties.$axios=axios
app.config.globalProperties.$echarts = echarts
app.use(router).use(ElementPlus).use(vuex).use(store).use(axios).mount('#app')
axios.interceptors.response.use(result=>{
  let data = result.data;
  //只要前台被拦截的请求里面含这两个参数，那么就跳转到登录界面
  if(!data.success && data.msg==="NoUser"){
    console.log("NoUser");
    router.push('/login');
  }  
  return result;
},error => {
  Promise.reject(error);
});
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

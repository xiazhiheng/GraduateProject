import { createApp } from 'vue'
import App from '../App.vue'
import * as echarts from 'echarts';
  
createApp(App).config.globalProperties.$echarts = echarts

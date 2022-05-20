<template>
  <el-container id="container1">
    <el-aside width="200px" id="message_aside">
      <el-container>
        <el-header>
          <el-input placeholder="请输入内容" v-model="searchInput">
            <template #append>
              <el-button @click="search"><el-icon><search/></el-icon></el-button>
            </template>
          </el-input>
        </el-header>
        <li @click="select(searchIndex)" v-if="searchIndex!=null">
          <p>搜索结果：</p>
          <el-avatar :size="30" :src="friends[searchIndex].userImageUrl" class="h-avatar" ></el-avatar>
          <p>{{friends[searchIndex].userName}}</p>
          <p v-if="onlineFlag[searchIndex]">       在线</p>
          <p v-else>       离线</p>
        </li>
        <el-main>
          <el-scrollbar>
             <ul>
              <div v-for="(item,index) in friends" id="message_avatar">
                <li @click="select(index)">
                  <el-avatar :size="30" :src="friends[index].userImageUrl" class="h-avatar" ></el-avatar>
                  <p>{{item.userName}}</p>
                  <p v-if="onlineFlag[index]">在线</p>
                  <p v-else>离线</p>
                  <el-badge is-dot class="item" v-if="UnreadFlag[index]"></el-badge>
                </li>
              </div>
            </ul>
          </el-scrollbar>
         
        </el-main>
      </el-container>    
    </el-aside>
    <el-main id="message_main" width="600px">
      <el-container v-if="Index!=null">
        <el-header>
           <h>{{friends[Index].userName}}</h>
        </el-header>
        <el-main>
          <el-scrollbar ref="myScrollbar" height="200px">
            <div id="historyBtn_div">
              <button @click="getAllMessage">查看历史消息</button>
            </div>
            <ul v-for="item in message">
              <div v-if="item.chatSentId == userInfo.id" id="m_right">
                <p>{{item.chatContent}}</p>
                <el-avatar :size="30" :src="userInfo.imgUrl"></el-avatar>
              </div>
              <div v-else id="m_left">
                <el-avatar :size="30" class="h-avatar" :src="friends[Index].userImageUrl"></el-avatar>
                <p>{{item.chatContent}}</p>
              </div>
            </ul>
          </el-scrollbar>
        </el-main>
        <el-footer id="m_foot">
          <el-input type="textarea" v-model="input"></el-input>
          <el-button type="primary" @click="sendMessage" id="sendButton">发送</el-button>
        </el-footer>
      </el-container>
    </el-main>
  </el-container>
</template>
<script>
import {mapState} from 'vuex'
export default{
  data(){
    return{
      Index:null,//选中的好友索引
      searchIndex:null,//搜索的好友索引
      searchInput:null,
      input:null,//输入框
      friends:[],//好友列表
      message:[],//消息
      onlineFlag:[],//是否在线
      UnreadFlag:[],//未读提醒
    }
  },
  computed:mapState(['url','userInfo']),
  created(){
    this.getFriends();
  },
  methods:{
    //获取好友列表
    getFriends(){
      if(this.userInfo.role=="teacher"){
        this.findAgreeStudent();
        // this.findAgreeStudent().then(
        //   this.initFrinends().then(
        //     this.initWebSocket()
        //   )
        // );
      }else if(this.userInfo.role=="student"){
        this.findAgreeTeacher();
        // this.findAgreeTeacher().then(()=>{
        //  console.log("2");
        //   this.findOurFriends().then(()=>{
        //     console.log("4");
        //     this.initFrinends().then(()=>{
        //       console.log("6");
        //       this.initWebSocket()
        //     })
        //   })
        // })
      }
    },
    async findAgreeStudent(){
      this.$axios.post('/teacher/findAgreeStudent',{"teacherId":this.userInfo.id}).then(res =>{
        if(res.data.code==200){
          this.friends = res.data.data;
          this.initFrinends();
        }else{
          console.log("error");
        }
      })
    },
    async findAgreeTeacher(){
      this.$axios.post('/student/findAgreeTeacher',{"studentId":this.userInfo.id}).then(res =>{
        console.log(res.data);
        if(res.data.code==200){
          // this.friends.push(...res,data.data);
          this.friends = res.data.data
          this.findOurFriends();
        }else{
          console.log("error")
        }
      })
    },
    async findOurFriends(){
      this.$axios.post('/student/findOurFriends?userId='+this.userInfo.id).then(res =>{
        console.log(res.data)
        if(res.data.code==200){
          this.friends.push(...res.data.data);
          this.initFrinends();
        }else{
          console.log("error");
        }
      })
    },
    async initFrinends(){
      this.$axios.post('/websocketChat/findNoReadChatSentId',{"userId":this.userInfo.id}).then(res =>{
        console.log(res.data)
        if(res.data.code==200){
          console.log(this.friends);
          for(let i=0;i<res.data.data.length;i++){
            let n = this.friends.findIndex(item => item.userId==res.data.data[i]); 
            if(n!=-1){
              this.UnreadFlag[n] = true;
            }
          }
          this.initWebSocket();
        }else{
          console.log("error");
        }
      })
    },
    //选择接收方
    select(index){
      this.Index = index;
      let m = {};
      m.fromId = this.userInfo.id;
      m.toId = this.friends[index].userId;
      let msg = JSON.stringify(m);
      this.websock.send(msg);
      this.getMessage();
    },
    //搜索好友
    search(){
      let n = this.friends.findIndex(item => item.userName = this.searchInput);
      if(n!=-1){
        this.searchIndex == n;
      }
    },
    //获取未读消息
    getMessage(){
      console.log("test");
      this.$axios.post('/websocketChat/findNoReadChatMsg',{"userId":this.userInfo.id,"friendId":this.friends[this.Index].userId}).then(res=>{
        console.log(res.data);
        if(res.data.code==200){
          this.message = res.data.data;
          this.UnreadFlag[this.Index] = false;
        }else{
          console.log("error");
        }
      })
    },
    //获取全部消息
    getAllMessage(){
      this.$axios.post('/websocketChat/findChatMsg',{"userId":this.userInfo.id,"friendId":this.friends[this.Index].userId}).then(res=>{
        console.log(res.data);
        if(res.data.code==200){
          this.message = res.data.data;
          this.scrollDown();
        }else{
          console.log("error");
        }
      })
    },
    scrollDown() {
      this.$nextTick(function (){
         this.$refs['myScrollbar'].wrap.scrollTop = this.$refs['myScrollbar'].wrap.scrollHeight;
      })
    },
    initWebSocket () { 
      let Url = this.url.slice(7);
      this.websock = new WebSocket('ws://'+Url+'/chat/'+this.userInfo.id);
      this.websock.onmessage = this.websocketonmessage
      this.websock.onerror = this.websocketonerror
      this.websock.onopen = this.websocketonopen
      this.websock.onclose = this.websocketclose
		},
    websocketonopen () { // 连接建立之后执行send方法发送数据，这个和自己的后端沟通好需要传什么数据，我的是要进行token验证
      // this.websock.send("connection");
    },
    websocketonerror () { //连接错误
      console.log( 'WebSocket连接失败')
    },
    websocketonmessage (e) { // 数据接收 
      let m = JSON.parse(e.data);
      console.log(m);
      //接收好友列表
      if(!m.isSystem && !m.isOnline && m.isCreateChat){
        for(let i=0;i<m.message.length;i++){
          console.log(m.message[i]);
          let n = this.friends.findIndex(item => item.userId==m.message[i]); 
          if(n!=-1){
            this.onlineFlag[n] = true;
          }
        }
      }
      //接收消息 
      else if(!m.isSystem && m.isOnline && !m.isCreateChat){
        let mess = {}
        mess.chatSentId = m.fromId;
        mess.chatContent = m.message
        this.message.push(mess);
        for(let i=0;i<this.message.length;i++){
          console.log(this.message[i].chatSentId == this.userInfo.id);
        }
        this.scrollDown();
      }
      //接收消息提醒
      else if(!m.isSystem && m.isOnline && m.isCreateChat){
        this.UnreadFlag[this.friends.findIndex(item => item.userId==m.fromId)] = true;
      }
      //广播离线
      else if(m.isSystem && !m.isOnline && !m.isCreateChat){
       let n = this.friends.findIndex(item => item.userId==m.message);
       if(n!=-1){
         this.onlineFlag[n] = false;
       }
      }
      //广播在线
      else if(m.isSystem && m.isOnline && !m.isCreateChat){
       let n = this.friends.findIndex(item => item.userId==m.message);
       if(n!=-1){
         this.onlineFlag[n] = true;
       }
      }
    },
    websocketclose (e) {  // 关闭连接
      console.log('已关闭连接', e)
    },
    //发送消息
    sendMessage(){
      let m = {};
      m.fromId = this.userInfo.id;
      m.toId = this.friends[this.Index].userId;
      m.message = this.input;
      let msg = JSON.stringify(m);
      this.websock.send(msg);
      let mess = {};
      mess.chatSentId = this.userInfo.id;
      mess.chatContent = this.input;
      this.message.push(mess);
      this.input = null;
      console.log(this.message);
      this.scrollDown();
    },
  },
  destroyed() {
    console.log("close");
		this.websock.close() // 页面销毁后断开websocket连接
	},
  // mounted: function () {
  //   this.$nextTick(function (){
  //     console.log("mounted");
  //     this.scrollDown();
  //   })
  // }
}
</script>

<style lang="scss">
#container1{
  height: 400px;
}
#message_aside{
  margin: 0;
  height: auto;
  border-radius: 0;
  margin-right: 10px;
}
#message_aside .el-header{
  height: auto;
  padding: 0;
}
#message_aside .el-main{
  text-align: left;
  padding: 0;
}
#message_main{
  height: auto;
  margin: 0;
  width: 600px;
  padding: 0;
}
#message_main .el-header{
  height: 45px;
}
#message_main .el-main{
  overflow: auto;
  padding: 0px;
}
#sendButton{
  float: right;
}
#message_p{
  width: 100%;
  float: left;
}

#message_avatar{
  height: 100%;
  text-align: left;
  li{
    display: flex;
    align-items: center;
  }
}
#m_right{
  margin-top: 10px;
  display: flex;
  flex-direction:row;
  justify-content: flex-end;
  align-items: center;
  text-align: right;
  p{
    max-width: 200px;
  }
}
#m_left{
  margin-top: 10px;
  display: flex;
  text-align: left;
  align-items:center;
  p{
    max-width: 200px;
  }
}
#m_foot{
  border: 5px;
}
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
.item {
  margin-top: 10px;
  margin-right: 40px;
}
#historyBtn_div{
  display: flex;
  text-align: center;
  justify-content: center;
}
</style>
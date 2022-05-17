import { createApp } from 'vue'
import { createStore } from 'vuex'

export const store = createStore({
  state() {
    return {
      // url:"http://192.168.43.40:8088",
      url:"http://192.168.43.104:8088",
      userInfo:{
        id:null,
        name:null,
        imgUrl:null,
        role:null,
      },
      a_menu: [
        {
          index: '1',
          title: '试题管理',
          icon: 'search',
          content:[{item:'试题管理',path:'/a_questionManage'},{item:'添加试题',path:'/a_addQuestion'},],
        },
        // {
        //   index: '2',
        //   title: '试卷管理',
        //   icon: 'icon-tiku',
        //   content:[{item:'试卷管理',path:''}],
        // },
        {
          index: '3',
          title: '新闻管理',
          icon: 'search',
          content:[{item:'新闻管理',path:'newsManage'}],
        },
        {
          index: '4',
          title: '学生管理',
          icon: 'search',
          content:[{item:'学生管理',path:'/a_studentManage'}],
        },
        {
          index: '5',
          title: '教师管理',
          icon: 'search',
          content:[{item:'教师管理',path:'/a_teacherManage'},{item: '添加教师',path: '/a_addTeacher'}],
        },
        {
          index: '6',
          title: '审核管理',
          icon: 'search',
          content:[{item:'视频审核',path:'a_knowledge'},{item: '评论审核',path: 'commentCheck'}],
        },
        {
          index: '7',
          title: '公告管理',
          icon: 'search',
          content:[{item:'公告管理',path:'/noticeManage'},{item: '发布公告',path: '/addNotice'}],
        },
        {
          index: '8',
          title: '知识点管理',
          icon: 'search',
          content:[{item:'知识点管理',path:'/a_knowledgeManage'},{item: '添加知识点',path: '/a_addKnowledge'}],
        }
      ],
      t_menu: [
        {
          index: '1',
          title: '试题管理',
          icon: 'search',
          content:[{item:'试题管理',path:'/t_questionManage'},{item:'添加试题',path:'/t_addQuestion'},],
        },
        {
          index: '2',
          title: '试卷管理',
          icon: 'search',
          content:[{item:'试卷管理',path:'/t_paperManage'},{item:'添加试卷',path:'/t_addPaper'},],
        },
        {
          index: '3',
          title: '知识点管理',
          icon: 'search',
          content:[{item:'知识点管理',path:'/t_knowledge'},{item:'添加知识点',path:'/addKnowledge'},],
        },
        {
          index: '4',
          title: '统计',
          icon: 'search',
          content:[{item:'做题情况',path:'/paperStatistics'}],
        },
      ],
      subject:[
        {
          num:0,
          value:1,
          label:'马克思主义基本原理概论',
          children:[
            {
              value:1,
              label:'马克思主义是关于无产阶级和人类解放的科学',
            },
            {
              value:2,
              label:'世界的物质性及其发展规律',
            },
            {
              value:3,
              label:'实践与认识及其发展规律',
            },
            {
              value:4,
              label:'人类社会及其发展规律',
            },
            {
              value:5,
              label:'资本主义的本质及规律',
            },
            {
              value:6,
              label:'资本主义的发展及其趋势',
            },
            {
              value:7,
              label:'社会主义的发展及其规律',
            },
            {
              value:8,
              label:'共产主义崇高理想及其最终实现',
            },
          ]
        },
        {
          num:8,
          value:2,
          label:'毛泽东思想和中国特色社会主义理论体系概论',
          children:[
            {
              value:9,
              label:'毛泽东思想及其历史地位',
            },
            {
              value:10,
              label:'新民主主义革命理论',
            },
            {
              value:11,
              label:'社会主义改造理论',
            },
            {
              value:12,
              label:'社会主义建设道路初步探索的理论成果',
            },
            {
              value:13,
              label:'邓小平理论',
            },
            {
              value:14,
              label:'三个代表重要思想',
            },
            {
              value:15,
              label:'科学发展观',
            },
            {
              value:16,
              label:'习近平新时代中国特色社会主义思想及其历史地位',
            },
            {
              value:17,
              label:'坚持和发展中国特色社会主义的总任务',
            },
            {
              value:18,
              label:'五位一体总体布局',
            },
            {
              value:19,
              label:'四个全面战略布局',
            },
            {
              value:20,
              label:'全面推进国防和军队现代化',
            },
            {
              value:21,
              label:'中国特色大国外交',
            },
            {
              value:22,
              label:'坚持和加强党的领导',
            },
          ]
        },
        {
          num:22,
          value:3,
          label:'中国近代史纲要',
          children:[
            {
              value:23,
              label:'反对外国侵略的战争',
            },
            {
              value:24,
              label:'对国家出路的早期探索',
            },
            {
              value:25,
              label:'辛亥革命与君主专制制度的终结',
            },
            {
              value:26,
              label:'开天辟地的大事变',
            },
            {
              value:27,
              label:'中国革命的新道路',
            },
            {
              value:28,
              label:'中华民族的抗日战争',
            },
            {
              value:29,
              label:'为新中国而奋斗',
            },
            {
              value:30,
              label:'社会主义基本制度在中国的确立',
            },
            {
              value:31,
              label:'社会主义建设在探索中曲折发展',
            },
            {
              value:32,
              label:'中国特色社会主义的开创与接续发展',
            },
            {
              value:33,
              label:'中国特色社会主义进入新时代',
            },
          ]
        },
        {
          num:33,
          value:4,
          label:'思想道德修养与法律基础',
          children:[
            {
              value:34,
              label:'人生的青春之问',
            },
            {
              value:35,
              label:'坚定理想信念',
            },
            {
              value:36,
              label:'弘扬中国精神',
            },
            {
              value:37,
              label:'践行社会主义核心价值观',
            },
            {
              value:38,
              label:'明大德守公德严私德',
            },
            {
              value:39,
              label:'尊法学法守法用法',
            },
          ]
        },
      ],
      difficulty:["简单","中等","困难"],
      type:["单选","多选"],
      authority:["私有","公开"],
    }
  },
  mutations: {
    practice(state,status) {
      state.isPractice = status
    },
    toggle(state) {
      state.flag = !state.flag
    },
    changeUserInfo(state,info) {
      state.userInfo = info
    },
    setUserInfo(state,userInfo){
      state.userInfo = userInfo;
    },
    setUserImg(state,ImageUrl){
      state.userInfo.ImgUrl = ImageUrl;
    },
  },
  getters:{

  },
  actions:{
    getUserInfo(context,info) {
      context.commit('changeUserInfo',info)
    },
    getPractice(context,status) {
      context.commit('practice',status)
    }
  }
})

// console.log(store.state);
import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../components/common/LoginView.vue'
import StudentView from '../components/student/StudentView.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/',
    name: 'student',
    component: StudentView,
    children:[
      {
        path: '/',
        component: () => import('../components/student/index.vue'),
      },
      {
        path: '/question_bank',
        component: () => import('../components/student/question_bank.vue'),
      },
      {
        path:'/paper',
        component: () => import('../components/student/paper.vue'),
      },
      {
        path:'/practice',
        component: () => import('../components/student/practice.vue'),
      },
      {
        path:'/exam',
        component: () => import('../components/student/exam.vue'),
      },
      {
        path:'/s_addressList',
        component: () => import('../components/common/addressList.vue'),
      },
      {
        path:'/collect',
        component: () => import('../components/student/collect.vue'),
      },
      {
        path:'/collectPractice',
        component: () => import('@/components/student/collectPractice')
      },
      {
        path:'/wrongPractice',
        component: () => import('@/components/student/wrongPractice')
      },
      {
        path:'/memo',
        component: () => import('@/components/student/memo')
      },
      {
        path:'/competition',
        component: () => import('@/components/student/competition')
      },
    ]
  },
  {
    path:'/register',
    name:'register',
    component: () => import('../components/common/register.vue')
  },
  {
    path:'/teacher',
    name:'teacher',
    component:() => import('../components/teacher/index'),
    redirect:'/homePage',
    children:[
      {
        path: '/homePage',
        component: () => import('../components/teacher/homePage'),
      },
      {
        path: '/t_questionManage',
        component: () => import('../components/teacher/questionManage'),
      },
      {
        path:'/t_addQuestion',
        component: () => import('../components/teacher/addQuestion'),
      },
      {
        path: '/t_paperManage',
        component: () => import('../components/teacher/paperManage'),
      },
      {
        path:'/t_addPaper',
        component: () => import('../components/teacher/addPaper'),
      },
      {
        path:'/t_paperQuestionManage',
        component: () => import('../components/teacher/paperQuestionManage'),
      },
      {
        path:'/t_studentManage',
        component: () => import('../components/teacher/studentManage'),
      },
      {
        path:'/t_addressList',
        component: () => import('../components/common/addressList.vue'),
      },
      {
        path:'/t_knowledge',
        component: () => import('../components/teacher/knowledge.vue'),
      },
      {
        path:'/addKnowledge',
        component: () => import('../components/teacher/addKnowledge.vue'),
      },
      {
        path:'/paperStatistics',
        component: () => import('../components/charts/paperStatistics.vue'),
      }
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../components/admin/index'),
    redirect:'/static',
    children:[
      // {
      //   path: '/hello',
      //   component: () => import('../components/common/hello'),
      // },
      {
        path: '/a_teacherManage',
        component: () => import('@/components/admin/teacherManage')
      },
      {
        path: '/a_addTeacher',
        component: () => import('@/components/admin/addTeacher')
      },
      {
        path: '/a_studentManage',
        component: () => import('@/components/admin/studentManage')
      },
      {
        path: '/a_questionManage',
        component: () => import('@/components/admin/questionManage')
      },
      {
        path: '/a_addQuestion',
        component: () => import('@/components/admin/addQuestion')
      },
      {
        path: '/commentCheck',
        component: () => import('@/components/admin/commentCheck')
      },
      {
        path:'/a_knowledge',
        component: () => import('@/components/admin/knowledge')
      },
      {
        path:'/newsManage',
        component: () => import('@/components/admin/newsManage')
      },
      {
        path:'/noticeManage',
        component: () => import('@/components/admin/noticeManage')
      },
      {
        path:'/addNotice',
        component: () => import('@/components/admin/addNotice')
      },
      {
        path:'/static',
        component: () => import('@/components/admin/static')
      },
      {
        path:'/a_knowledge',
        component: () => import('@/components/admin/knowledgeManage')
      },
      {
        path:'/a_knowledgeManage',
        component: () => import('@/components/admin/knowledgeManage')
      },
      {
        path:'/a_addKnowledge',
        component: () => import('@/components/admin/addKnowledge')
      },

    ]
  },
  
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  mode: history
})

export default router

import { RouteRecordRaw } from 'vue-router';
import RoutesPaths from './RoutesPaths';
const routes: RouteRecordRaw[] = [
  {
    path: RoutesPaths.ACCESS,
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/login/LoginPage.vue'),
      },
    ],
  },
  {
    path: RoutesPaths.HOME,
    component: () => import('layouts/UserLayout.vue'),
    children: [
      {
        path: RoutesPaths.HOME,
        component: () => import('pages/student/DashboardStudents.vue'),
        children: [
          {
            path: RoutesPaths.QUIZ,
            component: () => import('src/components/student/quiz/QuizComp.vue'),
          },
          {
            path: RoutesPaths.RESULTE,
            component: () =>
              import('src/components/student/result/ResulteComp.vue'),
          },
        ],
      },
      {
        path: RoutesPaths.QUESTION,
        component: () => import('src/pages/student/QuestionPage.vue'),
        props: true,
      },
      {
        path: RoutesPaths.SCORE,
        component: () => import('src/pages/student/ScoreResultPage.vue'),
        props: true,
      },
    ],
  },
  {
    path: RoutesPaths.TEACHER,
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      {
        path: RoutesPaths.TEACHER,
        component: () => import('pages/teacher/DashboardTeachers.vue'),
        children: [
          {
            path: RoutesPaths.QUIZ_TEACHER,
            component: () => import('src/components/teacher/quiz/QuizComp.vue'),
            children:[
              {
                path: RoutesPaths.CREATE_QUIZ,
                component: () => import('src/components/teacher/quiz/CreateQuizDialog.vue')
              }
            ]
          },
          {
            path: RoutesPaths.RESULT_TEACHER,
            component: () =>
              import('src/components/teacher/result/ResultComp.vue'),
          },
        ],
      },
      {
        path: RoutesPaths.STUDENT_GRADES,
        component: () => import('src/pages/teacher/StudentsGradesPage.vue'),
        name: 'student-grade',
        props: true,
      },
    ],
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.)',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

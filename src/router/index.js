import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Dashbord from '@/views/Dashbord'
import ProcessManagement from '@/views/ProcessManagement'
import SubProcessManagement from '@/views/SubProcessManagement'
import ResourceManagement from '@/views/ResourceManagement'
import RiskMonitoring from '@/views/RiskMonitoring.vue';
import NodeDetailView from '../views/NodeDetailView.vue'
import RefactorTimingView from '@/views/RefactorTimingView'
import ProcessOptimizationView from '@/views/ProcessOptimizationView'
import PlanningTimeView from '@/views/PlanningTimeView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Dashbord',
      component: Dashbord,
      children: [
        {
          path: 'process',
          name: 'ProcessManagement',
          component: ProcessManagement
        },
        {
          path: 'sub-process',
          name: 'SubProcessManagement',
          component: SubProcessManagement
        },
        {
          path: 'resource',
          name: 'ResourceManagement',
          component: ResourceManagement
        },
        {
          path: 'risk',
          name: 'RiskMonitoring',
          component: RiskMonitoring
        },
        {
          path: 'refactor-timing',
          name: 'RefactorTimingView',
          component: RefactorTimingView
        },
        {
          path: 'process-optimization',
          name: 'ProcessOptimizationView',
          component: ProcessOptimizationView
        },
        {
          path: 'planning-time',
          name: 'PlanningTimeView',
          component: PlanningTimeView
        }
      ]
    },
    {
      path: '/node-detail',
      name: 'NodeDetail',
      component: NodeDetailView
    },
    {
      path: '/resource-management',
      name: 'ResourceManagementPage',
      component: ResourceManagement
    }
  ]
})

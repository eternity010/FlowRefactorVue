import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Dashbord from '@/views/Dashbord'
import ProcessManagement from '@/views/ProcessManagement'
import SubProcessManagement from '@/views/SubProcessManagement'
import ResourceManagement from '@/views/ResourceManagement'
import RiskMonitoring from '@/views/RiskMonitoring.vue';
import HelloWorld from '@/components/HelloWorld.vue';
import NodeDetailView from '../views/NodeDetailView.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/hello',
      name: 'HelloWorld',
      component: HelloWorld
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
        }
      ]
    },
    {
      path: '/node-detail',
      name: 'NodeDetail',
      component: NodeDetailView
    }
  ]
})

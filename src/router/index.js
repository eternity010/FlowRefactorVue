import Vue from 'vue'
import Router from 'vue-router'
import Dashbord from '@/views/Dashbord'
import ProcessManagement from '@/views/ProcessManagement'
import SubProcessManagement from '@/views/SubProcessManagement'
import ResourceManagement from '@/views/ResourceManagement'
import RiskMonitoring from '@/views/RiskMonitoring.vue';
import NodeDetailView from '../views/NodeDetailView.vue'
import RefactorTimingView from '@/views/RefactorTimingView'
import ProcessOptimizationView from '@/views/ProcessOptimizationView'
import PlanningTimeView from '@/views/PlanningTimeView'
import AIDataCollectionView from '@/views/AIDataCollectionView'
import NeuralNetworkSettingsView from '@/views/NeuralNetworkSettingsView'
import RAGConfigView from '@/views/RAGConfigView'
import LLMChatView from '@/views/LLMChatView'
import TaskAssignmentView from '@/views/TaskAssignmentView'
import ProductionRefactor from '@/views/ProductionRefactor'
import MaintenancePlanView from '@/views/MaintenancePlanView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
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
        },
        {
          path: 'ai-data-collection',
          name: 'AIDataCollectionView',
          component: AIDataCollectionView
        },
        {
          path: 'neural-network-settings',
          name: 'NeuralNetworkSettingsView',
          component: NeuralNetworkSettingsView
        },
        {
          path: 'rag-config',
          name: 'RAGConfigView',
          component: RAGConfigView
        },
        {
          path: 'llm-chat',
          name: 'LLMChatView',
          component: LLMChatView
        },
        {
          path: 'task-assignment',
          name: 'TaskAssignmentView',
          component: TaskAssignmentView
        },
        {
          path: 'production-refactor',
          name: 'ProductionRefactor',
          component: ProductionRefactor
        },
        {
          path: 'maintenance-plan',
          name: 'MaintenancePlanView',
          component: MaintenancePlanView
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

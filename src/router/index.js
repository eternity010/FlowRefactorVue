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
import TaskAssignmentView from '@/views/TaskAssignmentView'
import ProductionRefactor from '@/views/ProductionRefactor'
import ProductionRefactor2 from '@/views/ProductionRefactor2'
import ProductionRefactor3 from '@/views/ProductionRefactor3'
import MarketingRefactor from '@/views/MarketingRefactor'
import PurchaseRefactor from '@/views/PurchaseRefactor'
import OperationRefactor from '@/views/OperationRefactor'
import OperationRefactor2 from '@/views/OperationRefactor2'
import OperationRefactor3 from '@/views/OperationRefactor3'
import RiskReassessment from '@/views/RiskReassessment'
import OperationManagement from '@/views/OperationManagement'

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
          path: 'task-assignment',
          name: 'TaskAssignmentView',
          component: TaskAssignmentView
        },
        {
          path: 'operation-management',
          name: 'OperationManagement',
          component: OperationManagement
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
    },
    {
      path: '/refactor-marketing',
      name: 'MarketingRefactor',
      component: MarketingRefactor
    },
    {
      path: '/refactor-purchase',
      name: 'PurchaseRefactor',
      component: PurchaseRefactor
    },
    {
      path: '/production-refactor',
      name: 'ProductionRefactor',
      component: ProductionRefactor
    },
    {
      path: '/production-refactor2',
      name: 'ProductionRefactor2',
      component: ProductionRefactor2
    },
    {
      path: '/production-refactor3',
      name: 'ProductionRefactor3',
      component: ProductionRefactor3
    },
    {
      path: '/refactor-operation',
      name: 'OperationRefactor',
      component: OperationRefactor
    },
    {
      path: '/refactor-operation2',
      name: 'OperationRefactor2',
      component: OperationRefactor2
    },
    {
      path: '/refactor-operation3',
      name: 'OperationRefactor3',
      component: OperationRefactor3
    },
    {
      path: '/risk-reassessment',
      name: 'RiskReassessment',
      component: RiskReassessment
    }
  ]
})

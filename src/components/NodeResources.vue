<template>
  <div class="node-resources">
    <h3 class="resources-title">节点资源</h3>
    
    <!-- 资源概览卡片 -->
    <el-row :gutter="20" class="resource-overview">
      <el-col :span="6" v-if="hasResource('documents')">
        <el-card shadow="hover" class="overview-card documents-card">
          <div class="card-icon"><i class="el-icon-document"></i></div>
          <div class="card-content">
            <div class="card-title">文档资源</div>
            <div class="card-value">{{ resources.documents.count }}个</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6" v-if="hasResource('personnel')">
        <el-card shadow="hover" class="overview-card personnel-card">
          <div class="card-icon"><i class="el-icon-user"></i></div>
          <div class="card-content">
            <div class="card-title">人力资源</div>
            <div class="card-value">{{ resources.personnel.count }}人</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6" v-if="hasResource('systems')">
        <el-card shadow="hover" class="overview-card systems-card">
          <div class="card-icon"><i class="el-icon-monitor"></i></div>
          <div class="card-content">
            <div class="card-title">系统资源</div>
            <div class="card-value">{{ resources.systems.count }}个</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6" v-if="hasResource('equipment')">
        <el-card shadow="hover" class="overview-card equipment-card">
          <div class="card-icon"><i class="el-icon-cpu"></i></div>
          <div class="card-content">
            <div class="card-title">设备资源</div>
            <div class="card-value">{{ resources.equipment.count }}台</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 资源详情展示 -->
    <div class="resource-details" v-if="resources">
      <!-- 文档资源 -->
      <el-collapse v-if="hasResource('documents')">
        <el-collapse-item title="文档资源详情" name="documents">
          <div class="resource-detail-item">
            <div class="detail-label">数量:</div>
            <div class="detail-value">{{ resources.documents.count }}</div>
          </div>
          <div class="resource-detail-item">
            <div class="detail-label">类型:</div>
            <div class="detail-value">
              <el-tag 
                v-for="(type, index) in resources.documents.types" 
                :key="'doc-type-'+index"
                type="primary"
                size="small"
                effect="light"
                class="resource-tag">
                {{ type }}
              </el-tag>
            </div>
          </div>
          <div class="resource-detail-item">
            <div class="detail-label">格式:</div>
            <div class="detail-value">
              <el-tag 
                v-for="(format, index) in resources.documents.formats" 
                :key="'doc-format-'+index"
                type="info"
                size="small"
                effect="plain"
                class="resource-tag">
                {{ format }}
              </el-tag>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      
      <!-- 人力资源 -->
      <el-collapse v-if="hasResource('personnel')">
        <el-collapse-item title="人力资源详情" name="personnel">
          <div class="resource-detail-item">
            <div class="detail-label">人数:</div>
            <div class="detail-value">{{ resources.personnel.count }}</div>
          </div>
          <div class="resource-detail-item">
            <div class="detail-label">角色:</div>
            <div class="detail-value">
              <el-tag 
                v-for="(role, index) in resources.personnel.roles" 
                :key="'role-'+index"
                type="success"
                size="small"
                effect="light"
                class="resource-tag">
                {{ role }}
              </el-tag>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      
      <!-- 系统资源 -->
      <el-collapse v-if="hasResource('systems')">
        <el-collapse-item title="系统资源详情" name="systems">
          <div class="resource-detail-item">
            <div class="detail-label">数量:</div>
            <div class="detail-value">{{ resources.systems.count }}</div>
          </div>
          <div class="resource-detail-item">
            <div class="detail-label">类型:</div>
            <div class="detail-value">
              <el-tag 
                v-for="(system, index) in resources.systems.types" 
                :key="'system-'+index"
                type="warning"
                size="small"
                effect="light"
                class="resource-tag">
                {{ system }}
              </el-tag>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      
      <!-- 设备资源 -->
      <el-collapse v-if="hasResource('equipment')">
        <el-collapse-item title="设备资源详情" name="equipment">
          <div class="resource-detail-item">
            <div class="detail-label">数量:</div>
            <div class="detail-value">{{ resources.equipment.count }}</div>
          </div>
          <div class="resource-detail-item">
            <div class="detail-label">类型:</div>
            <div class="detail-value">
              <el-tag 
                v-for="(equipment, index) in resources.equipment.types" 
                :key="'equip-'+index"
                type="danger"
                size="small"
                effect="light"
                class="resource-tag">
                {{ equipment }}
              </el-tag>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      
      <!-- 其他资源 -->
      <el-collapse v-if="hasResource('others')">
        <el-collapse-item title="其他资源详情" name="others">
          <div class="resource-detail-item" v-for="(value, key) in resources.others" :key="key">
            <div class="detail-label">{{ formatLabel(key) }}:</div>
            <div class="detail-value">{{ value }}</div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    
    <!-- 无资源数据时显示 -->
    <div class="no-resources" v-if="!resources">
      <el-empty description="暂无资源数据"></el-empty>
    </div>
  </div>
</template>

<script>
import { getNodeResources } from '@/data/resource';

export default {
  name: 'NodeResources',
  props: {
    type: {
      type: String,
      required: true,
      default: 'purchase'
    },
    nodeId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      resources: null
    }
  },
  created() {
    // 获取节点资源数据
    this.resources = getNodeResources(this.type, this.nodeId);
  },
  methods: {
    // 检查是否有特定类型的资源
    hasResource(resourceType) {
      return this.resources && this.resources[resourceType];
    },
    // 格式化标签
    formatLabel(key) {
      // 将驼峰命名转换为可读文本
      return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace(/([A-Z])/g, match => match.toLowerCase());
    }
  }
}
</script>

<style scoped>
.node-resources {
  margin: 20px 0;
}

.resources-title {
  font-size: 18px;
  margin-bottom: 20px;
  color: #303133;
}

.resource-overview {
  margin-bottom: 20px;
}

.overview-card {
  height: 100px;
  display: flex;
  align-items: center;
  border-radius: 8px;
}

.card-icon {
  font-size: 24px;
  margin-right: 15px;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
}

.card-value {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

/* 卡片类型颜色 */
.documents-card .card-icon {
  color: #409EFF;
}

.personnel-card .card-icon {
  color: #67C23A;
}

.systems-card .card-icon {
  color: #E6A23C;
}

.equipment-card .card-icon {
  color: #F56C6C;
}

.resource-details {
  margin-top: 20px;
}

.el-collapse {
  margin-bottom: 15px;
  border-radius: 4px;
  overflow: hidden;
}

.resource-detail-item {
  display: flex;
  margin-bottom: 10px;
  align-items: flex-start;
}

.detail-label {
  width: 80px;
  color: #606266;
  font-weight: 500;
}

.detail-value {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
}

.resource-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.no-resources {
  margin-top: 40px;
}
</style> 
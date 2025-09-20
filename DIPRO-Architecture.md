# DIPRO平台架构图

## 精简架构图

```mermaid
graph TB
    subgraph "🧠 智能决策层"
        LLM[大模型服务]
        AI[智能分析]
        OPT[流程优化]
    end

    subgraph "⚙️ 流程管理层"
        UI[Vue.js前端]
        API[API网关]
        SERVICE[业务服务]
    end

    subgraph "💾 数据资源层"
        MONGO[(MongoDB<br/>流程数据)]
        MYSQL[(MySQL<br/>业务数据)]
        EXT[外部API]
    end

    %% 数据流向
    UI <--> API
    API <--> SERVICE
    SERVICE <--> MONGO
    SERVICE <--> MYSQL
    SERVICE <--> EXT
    
    LLM --> SERVICE
    AI --> SERVICE
    OPT --> SERVICE

    %% 样式
    classDef intelligence fill:#e1f5fe,stroke:#01579b,stroke-width:3px
    classDef process fill:#f3e5f5,stroke:#4a148c,stroke-width:3px
    classDef data fill:#e8f5e8,stroke:#1b5e20,stroke-width:3px
    
    class LLM,AI,OPT intelligence
    class UI,API,SERVICE process
    class MONGO,MYSQL,EXT data
```

## 核心特点

### 🧠 智能决策层
- 大模型服务 (火山引擎API)
- 智能分析与流程优化

### ⚙️ 流程管理层  
- Vue.js前端界面
- Express API网关
- Node.js业务服务

### 💾 数据资源层
- MongoDB (流程数据)
- MySQL (业务数据) 
- 外部API接口

## 技术栈
- **前端**: Vue.js + Element UI
- **后端**: Node.js + Express  
- **数据库**: MongoDB + MySQL
- **AI服务**: 火山引擎API

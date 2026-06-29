# 🦞 徐书和个人主页

<div align="center">

**[www.xushuhe.com](https://www.xushuhe.com)** — 徐书和的个人网站

一个集**留言板**、**AI 智能对话**、**文件分析**和**后台管理**于一体的全栈个人网站。

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)](LICENSE)

</div>

---

## ✨ 功能特性

### 💬 朋友留言板
- 公开留言发布（昵称 + 内容 + 密码保护）
- 支持编辑/删除（密码验证）
- 长留言自动折叠展开
- 脏话自动过滤
- 速率限制：5 次/分钟

### 🦞 龙虾 AI 公开对话
- 类 ChatGPT 的 AI 对话界面
- 服务端会话记忆（SQLite 持久化，刷新不丢失）
- 支持文件上传分析（`.txt` `.csv` `.json` `.pdf` `.docx` `.xlsx` 等）
- AI 自动分析文件内容并回复
- 无需登录，公开访问
- 速率限制：聊天 30 次/分钟，上传 10 次/分钟

### 🛡️ 多层安全防护
- **提示词注入检测**：拦截 20+ 种攻击模式（指令覆盖、角色劫持、越狱、分隔符注入、资源耗尽攻击等）
- **输入清洗**：去除零宽字符、Unicode 方向覆盖字符、长度截断
- **XML 标签隔离**：用户输入包裹在 `<user_chat>` / `<user_file>` 标签中
- **系统提示词加固**：含 8 条防注入安全规则
- **响应过滤**：检测并清除 AI 回复中的敏感信息泄露（token/密钥/密码）
- **文件上传白名单**：仅允许安全 MIME 类型，拦截可执行文件（`.exe` `.py` `.sh` `.bat` 等）
- **文件名乱码修复**：UTF-8 优先 → GBK 回退解码
- **脏话过滤**：中英文 100+ 词汇库

### 👑 管理员系统
- JWT 认证（7 天有效期）
- 管理面板弹窗登录
- 添加/管理管理员账号
- 修改密码
- **管理员 AI 对话面板**：专属网站管理助手
- API 配置管理（支持 DeepSeek / StepFun / OpenClaw 等 OpenAI 兼容接口）

### 🎨 精美 UI
- 龙虾主题温暖美学设计
- 响应式布局（桌面/平板/手机）
- CSS 动画过渡效果
- 粘性侧边栏布局

---

## 🏗️ 技术栈

| 层级 | 技术 |
|------|------|
| **后端** | Node.js + Express 4.18 |
| **数据库** | SQLite3 |
| **认证** | JWT (jsonwebtoken) + bcrypt |
| **文件上传** | Multer (内存存储) |
| **AI 集成** | OpenAI 兼容 API (axios) |
| **前端** | 原生 HTML / CSS / JavaScript（零框架） |
| **字体** | Inter + Noto Serif SC (Google Fonts) |

---

## 📁 项目结构

```
project-root/
├── backend/
│   ├── server.js          # Express 主服务器（80 端口）
│   ├── database.js        # SQLite 数据库操作（4 张表）
│   ├── auth.js            # JWT 认证中间件
│   ├── security.js        # 安全模块（注入检测/清洗/速率限制/脏话过滤）
│   ├── lobsterProxy.js    # 龙虾 AI 公开对话代理
│   ├── claudeProxy.js     # 管理员 AI 对话代理
│   ├── messages_v2.db     # SQLite 数据库文件
│   └── package.json
├── frontend/
│   ├── index.html         # 主页面
│   ├── css/
│   │   └── style.css      # 全局样式（龙虾美学）
│   └── js/
│       ├── common.js      # 公共工具（API 请求/JWT 管理/脏话预检）
│       ├── main.js        # 留言板模块
│       ├── lobster.js     # 龙虾 AI 对话模块
│       └── admin.js       # 管理员面板模块
└── README.md
```

### 数据库表结构

| 表名 | 用途 |
|------|------|
| `messages` | 留言板数据（id, nickname, content, password, created_at）|
| `admin_users` | 管理员账号（id, username, password_hash, created_at）|
| `sys_config` | 系统配置键值对（key, value）|
| `chat_history` | AI 对话历史（id, session_id, role, content, created_at）|

---

## 👤 关于作者

**徐书和** — 安徽理工大学大一（即将大二）本科生

- 🎓 **技能**：C语言 / Java / Python / 嵌入式开发 / SolidWorks / Web 全栈
- 🏆 **竞赛**：CCF CSP 180 分 | ACM 校赛三等奖 | 国家级大创 | 挑战杯
- 💻 **作品**：校园网自动登录脚本、学习通自动答题脚本、个人主页
- 🎯 **爱好**：羽毛球 / 游泳 / 滑雪 / 象棋 · 🦞 龙虾爱好者

---

## 🚀 快速启动

### 前置条件

- Node.js 18+
- OpenClaw Gateway（或其他 OpenAI 兼容 API 服务）

### 1. 克隆项目

```bash
git clone https://github.com/xushuhe/personal-website.git
cd personal-website/project-root
```

### 2. 安装依赖

```bash
cd backend
npm install
```

### 3. 启动 OpenClaw Gateway

```bash
openclaw gateway --port 18789 --bind loopback &
```

### 4. 启动服务器

```bash
# Windows (需管理员权限，监听 80 端口)
PORT=80 node server.js

# 或使用自定义端口
PORT=3000 node server.js
```

### 5. 访问网站

打开浏览器访问 `http://localhost`（或你设置的端口）

### 默认管理员

| 用户名 | 密码 |
|--------|------|
| `admin` | `admin123` |

> ⚠️ **安全提示**：首次部署后请立即修改默认管理员密码！

---

## 📡 API 文档

### 留言板

| 方法 | 端点 | 说明 | 认证 |
|------|------|------|------|
| `GET` | `/api/messages` | 获取所有留言 | 无 |
| `POST` | `/api/messages` | 发布留言 | 密码 |
| `PUT` | `/api/messages/:id` | 编辑留言 | 密码 |
| `DELETE` | `/api/messages/:id` | 删除留言 | 密码 |

### 龙虾 AI

| 方法 | 端点 | 说明 | 认证 |
|------|------|------|------|
| `POST` | `/api/lobster/chat` | 发送对话消息 | 无 |
| `POST` | `/api/lobster/upload` | 上传文件分析 | 无 |
| `GET` | `/api/lobster/config` | 获取 AI 配置 | 无 |

### 管理员

| 方法 | 端点 | 说明 | 认证 |
|------|------|------|------|
| `POST` | `/api/admin/login` | 管理员登录 | 密码 |
| `POST` | `/api/admin/register` | 添加管理员 | JWT |
| `POST` | `/api/admin/change-password` | 修改密码 | JWT |
| `POST` | `/api/admin/claude-chat` | AI 管理助手对话 | JWT |
| `POST` | `/api/lobster/config` | 保存 AI 配置 | JWT |

---

## ⚙️ 配置说明

### AI 后端配置

项目默认使用本地 OpenClaw Gateway (`http://127.0.0.1:18789/v1`)。你也可以通过管理面板配置任何 OpenAI 兼容的 API：

- **DeepSeek**: `https://api.deepseek.com/v1`
- **StepFun**: `https://api.stepfun.com/v1`
- **OpenAI**: `https://api.openai.com/v1`
- **OpenClaw Gateway**: `http://127.0.0.1:18789/v1`（默认）

配置通过管理面板保存到 `sys_config` 表中，支持热更新无需重启。

### 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | `3000` | 服务器端口 |
| `JWT_SECRET` | 内置默认值 | JWT 签名密钥 |
| `OPENCLAW_GATEWAY_TOKEN` | 内置默认值 | OpenClaw Gateway Token |

---

## 🔒 安全清单

- [x] 提示词注入检测（20+ 攻击模式）
- [x] 输入清洗（零宽字符/Unicode 方向覆盖）
- [x] XML 标签用户输入隔离
- [x] AI 回复敏感信息过滤
- [x] 文件类型白名单 + 危险扩展名拦截
- [x] 多级速率限制
- [x] 请求体大小限制（1MB JSON / 10MB 文件）
- [x] 密码 bcrypt 哈希存储
- [x] JWT 令牌认证
- [x] 脏话过滤（中英文 100+ 词汇）
- [x] 文件名编码乱码修复

---

## 📝 部署注意事项

1. **端口冲突**：如果服务器上有 IIS，确保 W3SVC 服务已停止且设为手动启动，否则会抢占 80 端口
   ```powershell
   Stop-Service W3SVC -Force
   Set-Service W3SVC -StartupType Manual
   ```

2. **AI 服务依赖**：龙虾 AI 和管理员 AI 共用同一 API 配置，确保 AI 后端服务正常运行

3. **数据库备份**：定期备份 `messages_v2.db` 文件

4. **HTTPS**：生产环境建议使用 Nginx/Caddy 反向代理并配置 SSL 证书

5. **进程管理**：推荐使用 PM2 管理 Node 进程
   ```bash
   npm install -g pm2
   pm2 start server.js --name xushuhe -- --port 80
   pm2 save
   pm2 startup
   ```

---

## 🛠️ 开发

```bash
# 安装开发依赖
cd backend && npm install

# 启动开发服务器（带自动重启）
npx nodemon server.js

# 前端文件修改后直接刷新浏览器即可
```

---

## 📄 许可证

MIT License · Copyright © 2025 徐书和

---

<div align="center">

🦞 **咕咕嘎嘎 · 热爱技术与龙虾哲学 · 探索代码的无限可能**

</div>

# Task Pro Plugin (定时任务Pro)

<div align="center">

![Yunzai-Bot-V3](https://img.shields.io/badge/Yunzai--Bot-V3-red?style=flat&logo=github)
![Nodejs](https://img.shields.io/badge/Node.js-v16+-green?style=flat&logo=node.js)
![Guoba](https://img.shields.io/badge/Guoba--Plugin-Support-cyan?style=flat)

**一个为 Yunzai-Bot 设计的全能定时任务管理插件**
<br>
支持 自动签到 / 点赞 / 群发消息 / 好友续火
<br>
**无需改代码，全中文/英文界面配置**

[安装方法](#安装) | [使用说明](#使用) | [配置详解](#配置)

</div>

---

## ✨ 特性 (Features)

* **⚡️ 零代码配置**：完全适配 **[锅巴插件 (Guoba-Plugin)](https://github.com/guoba-yunzai/guoba-plugin)**，在网页端点点鼠标即可设置。
* **🌍 多语言支持**：支持 **简体中文 (CN)** 与 **English (EN)** 界面一键切换。
* **👥 智能列表**：配置时自动读取并展示你的群聊和好友列表，支持下拉多选，告别手动输入 QQ 号。
* **📅 Cron 定时**：基于 Cron 表达式，精确控制任务执行时间（秒级控制）。
* **🛡 防风控机制**：内置随机延迟与防风控休眠，保护你的账号安全。
* **🐞 调试模式**：可开关的调试日志，方便排查任务执行情况。
* **📁 动态路径**：支持任意重命名插件文件夹，不影响功能使用。

## 📦 安装 (Installation)

1.  进入 Yunzai-Bot 根目录：
    ```bash
    cd Yunzai-Bot
    ```

2.  克隆插件到 `plugins` 目录：
    ```bash
    git clone [https://github.com/yuhold/task-pro-plugin.git](https://github.com/yuhold/task-pro-plugin.git) ./plugins/task-pro-plugin
    ```

3.  安装依赖（本插件无第三方依赖，跳过此步）。

4.  **重启云崽**：
    ```bash
    node app
    ```

## ⚙️ 配置 (Configuration)

推荐使用 **锅巴插件** 进行可视化配置：

1.  发送 `#锅巴登录` 获取配置地址。
2.  在网页中找到 **Task Pro (定时任务Pro)**。
3.  根据需求开启对应的功能模块。

> **提示**：如果修改了 **Cron 表达式** (执行时间)，建议重启机器人或发送 `#更新任务` 以确保定时器重新加载。

### 功能模块

| 模块 | 描述 | 配置项 |
| :--- | :--- | :--- |
| **自动群签到** | 每天定时在指定群发送签到内容 | 目标群(多选)、签到内容 |
| **自动点赞** | 每天定时给指定好友点赞 | 目标好友(多选)、点赞次数(1-20) |
| **自动群消息** | 定时给不同群发送不同内容 | 列表形式：`群A -> 内容A`, `群B -> 内容B` |
| **好友续火** | 定时给好友发消息维持火花 | 列表形式：`好友A -> 晚安`, `好友B -> 早点睡` |

## 🕹 指令 (Commands)

通常情况下不需要使用指令，任务会自动后台运行。

| 指令 | 权限 | 说明 |
| :--- | :--- | :--- |
| `#测试任务` | 主人 | 立即手动运行一遍所有开启的任务（用于测试配置是否生效） |
| `#更新任务` | 主人 | 重新加载配置文件和定时任务 |

## 📝 更新日志

### v1.0.0
* 发布首个版本。
* 集成锅巴面板，支持动态群友列表选择。
* 新增中英文切换功能。

## ⚠️ 免责声明

* 本插件仅供学习交流使用，请勿用于发送广告或骚扰信息。
* 使用本插件产生的任何后果（包括但不限于账号被封禁）由使用者自行承担。

---
<div align="center">
Made with ❤️ by <a href="https://github.com/yuhold">yuhold</a>
</div>
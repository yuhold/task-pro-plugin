import cfg from './lib/config.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const configPath = path.join(__dirname, 'config', 'config.json')

// --- 辅助函数：获取群列表 ---
function getGroupList () {
  if (!global.Bot || !Bot.gl) return []
  return Array.from(Bot.gl.values()).map(g => {
    return { label: `${g.name} (${g.group_id})`, value: g.group_id }
  })
}

// --- 辅助函数：获取好友列表 ---
function getFriendList () {
  if (!global.Bot || !Bot.fl) return []
  return Array.from(Bot.fl.values()).map(f => {
    return { label: `${f.nickname} (${f.user_id})`, value: f.user_id }
  })
}

export function supportGuoba () {
  return {
    pluginInfo: {
      name: 'Task Pro',
      title: '定时任务Pro',
      author: '@yuhold',
      authorLink: 'https://github.com/yuhold',
      link: 'https://github.com/yuhold/task-pro-plugin',
      isV3: true,
      isCaricature: true,
      description: '全能定时任务：群签到、点赞、群发、续火',
      icon: 'mdi:robot-clock',
      iconColor: '#FF9800'
    },
    configInfo: {
      schemas: [
        // ================= 全局设置 =================
        { component: 'Divider', label: '全局设置' },
        { 
          field: 'debug', 
          label: '调试日志', 
          component: 'Switch',
          helpMessage: '开启后，控制台会输出详细的执行过程（如：正在发送、休息时间等）。'
        },

        // ================= 群签到 =================
        { component: 'Divider', label: '① 自动群签到' },
        { field: 'sign.enable', label: '开启功能', component: 'Switch' },
        { field: 'sign.cron', label: 'Cron表达式', component: 'Input', helpMessage: '格式：秒 分 时 日 月 星期' },
        { 
          field: 'sign.list', 
          label: '选择群聊', 
          component: 'Select', 
          componentProps: { mode: 'multiple', placeholder: '请选择群聊', options: getGroupList() }
        },
        { field: 'sign.msg', label: '签到内容', component: 'Input' },

        // ================= 好友点赞 =================
        { component: 'Divider', label: '② 自动点赞' },
        { field: 'like.enable', label: '开启功能', component: 'Switch' },
        { field: 'like.cron', label: 'Cron表达式', component: 'Input' },
        { 
          field: 'like.list', 
          label: '选择好友', 
          component: 'Select', 
          componentProps: { mode: 'multiple', placeholder: '请选择好友', options: getFriendList() }
        },
        { field: 'like.times', label: '点赞次数', component: 'InputNumber', componentProps: { min: 1, max: 20 } },

        // ================= 群定时消息 =================
        { component: 'Divider', label: '③ 自动群消息' },
        { field: 'groupMsg.enable', label: '开启功能', component: 'Switch' },
        { field: 'groupMsg.cron', label: 'Cron表达式', component: 'Input' },
        {
          field: 'groupMsg.list',
          label: '消息列表',
          component: 'GTable',
          helpMessage: '点击“+”添加任务',
          componentProps: {
            columns: [
              { title: '选择群聊', dataIndex: 'id', component: 'Select', componentProps: { options: getGroupList(), style: { width: '180px' } } },
              { title: '发送内容', dataIndex: 'msg', component: 'Input' }
            ]
          }
        },

        // ================= 好友续火/私聊 =================
        { component: 'Divider', label: '④ 好友续火/私聊' },
        { field: 'friendMsg.enable', label: '开启功能', component: 'Switch' },
        { field: 'friendMsg.cron', label: 'Cron表达式', component: 'Input' },
        {
          field: 'friendMsg.list',
          label: '私聊列表',
          component: 'GTable',
          componentProps: {
            columns: [
              { title: '选择好友', dataIndex: 'id', component: 'Select', componentProps: { options: getFriendList(), style: { width: '180px' } } },
              { title: '发送内容', dataIndex: 'msg', component: 'Input' }
            ]
          }
        }
      ],

      getConfigData () {
        return cfg.getDef()
      },
      
      setConfigData (data, { Result }) {
        fs.writeFileSync(configPath, JSON.stringify(data, null, 2))
        return Result.ok({}, '保存成功！如果修改了时间请重启Bot或发送 #更新任务')
      }
    }
  }
}
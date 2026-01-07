import cfg from './lib/config.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// --- 动态路径获取 ---
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const configPath = path.join(__dirname, 'config', 'config.json')

// --- 多语言字典 (I18n) ---
const i18n = {
  zh: {
    global: '全局设置',
    debug: '调试日志',
    debugHelp: '开启后，控制台会输出详细的执行过程（如：正在给谁发消息、防风控等待时间）。',
    lang: '界面语言 (Language)',
    langHelp: '切换语言后，请点击保存并刷新网页生效。',
    
    signSection: '① 自动群签到',
    enable: '开启功能',
    cron: 'Cron表达式',
    cronHelp: '格式：秒 分 时 日 月 星期 (例如: 0 1 0 * * * 表示每天凌晨0点1分)',
    selectGroup: '选择群聊',
    signMsg: '签到内容',
    
    likeSection: '② 自动好友点赞',
    selectFriend: '选择好友',
    likeTimes: '每次点赞数',
    
    gMsgSection: '③ 自动群消息',
    msgList: '消息列表',
    addHelp: '点击下方 “+” 号添加任务',
    sendContent: '发送内容',
    
    fMsgSection: '④ 好友续火/私聊',
    privateList: '私聊列表',
    
    saveSuccess: '保存成功！如果修改了执行时间(Cron)，请重启 Bot 或发送 #更新任务。'
  },
  en: {
    global: 'Global Settings',
    debug: 'Debug Log',
    debugHelp: 'Enable detailed logs in the console (e.g., sending status, sleep time).',
    lang: 'Language / 界面语言',
    langHelp: 'Save and refresh the page to apply language changes.',
    
    signSection: '① Auto Group Sign',
    enable: 'Enable',
    cron: 'Cron Expression',
    cronHelp: 'Format: Sec Min Hour Day Mon Week (Ex: 0 1 0 * * *)',
    selectGroup: 'Select Groups',
    signMsg: 'Sign Message',
    
    likeSection: '② Auto Like',
    selectFriend: 'Select Friends',
    likeTimes: 'Like Count',
    
    gMsgSection: '③ Auto Group Msg',
    msgList: 'Message List',
    addHelp: 'Click "+" to add tasks',
    sendContent: 'Message Content',
    
    fMsgSection: '④ Auto Private Msg',
    privateList: 'Private List',
    
    saveSuccess: 'Saved! Please restart Bot or send #reloadtask if you changed Cron time.'
  }
}

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
  // 1. 获取当前配置
  const config = cfg.getDef()
  // 2. 确定语言 (默认 zh)
  const lang = config.lang === 'en' ? 'en' : 'zh'
  const text = i18n[lang]

  return {
    pluginInfo: {
      name: 'Task Pro',
      title: 'Task Pro (定时任务)',
      author: '@yuhold',
      authorLink: 'https://github.com/yuhold',
      link: 'https://github.com/yuhold/task-pro-plugin',
      isV3: true,
      isCaricature: true,
      description: 'Advanced Schedule Task Plugin / 全能定时任务插件',
      icon: 'mdi:robot-clock',
      iconColor: '#FF9800'
    },
    configInfo: {
      schemas: [
        // ================= 全局设置 =================
        { component: 'Divider', label: text.global },
        { 
          field: 'lang', 
          label: text.lang, 
          component: 'Select',
          helpMessage: text.langHelp,
          componentProps: {
            options: [
              { label: '简体中文', value: 'zh' },
              { label: 'English', value: 'en' }
            ]
          }
        },
        { 
          field: 'debug', 
          label: text.debug, 
          component: 'Switch',
          helpMessage: text.debugHelp
        },

        // ================= 群签到 =================
        { component: 'Divider', label: text.signSection },
        { field: 'sign.enable', label: text.enable, component: 'Switch' },
        { field: 'sign.cron', label: text.cron, component: 'Input', helpMessage: text.cronHelp },
        { 
          field: 'sign.list', 
          label: text.selectGroup, 
          component: 'Select', 
          componentProps: { 
            mode: 'multiple', 
            placeholder: text.selectGroup,
            options: getGroupList() 
          }
        },
        { field: 'sign.msg', label: text.signMsg, component: 'Input' },

        // ================= 点赞 =================
        { component: 'Divider', label: text.likeSection },
        { field: 'like.enable', label: text.enable, component: 'Switch' },
        { field: 'like.cron', label: text.cron, component: 'Input' },
        { 
          field: 'like.list', 
          label: text.selectFriend, 
          component: 'Select', 
          componentProps: { 
            mode: 'multiple', 
            placeholder: text.selectFriend,
            options: getFriendList() 
          }
        },
        { field: 'like.times', label: text.likeTimes, component: 'InputNumber', componentProps: { min: 1, max: 20 } },

        // ================= 群消息 (表格) =================
        { component: 'Divider', label: text.gMsgSection },
        { field: 'groupMsg.enable', label: text.enable, component: 'Switch' },
        { field: 'groupMsg.cron', label: text.cron, component: 'Input' },
        {
          field: 'groupMsg.list',
          label: text.msgList,
          component: 'GTable',
          helpMessage: text.addHelp,
          componentProps: {
            columns: [
              {
                title: text.selectGroup,
                dataIndex: 'id',
                component: 'Select',
                componentProps: { 
                    options: getGroupList(),
                    style: { width: '180px' } 
                }
              },
              {
                title: text.sendContent,
                dataIndex: 'msg',
                component: 'Input',
              }
            ]
          }
        },

        // ================= 私聊消息 (表格) =================
        { component: 'Divider', label: text.fMsgSection },
        { field: 'friendMsg.enable', label: text.enable, component: 'Switch' },
        { field: 'friendMsg.cron', label: text.cron, component: 'Input' },
        {
          field: 'friendMsg.list',
          label: text.privateList,
          component: 'GTable',
          helpMessage: text.addHelp,
          componentProps: {
            columns: [
              {
                title: text.selectFriend,
                dataIndex: 'id',
                component: 'Select',
                componentProps: { 
                    options: getFriendList(),
                    style: { width: '180px' } 
                }
              },
              {
                title: text.sendContent,
                dataIndex: 'msg',
                component: 'Input',
              }
            ]
          }
        }
      ],

      // 获取数据
      getConfigData () {
        return cfg.getDef()
      },
      
      // 保存数据
      setConfigData (data, { Result }) {
        fs.writeFileSync(configPath, JSON.stringify(data, null, 2))
        return Result.ok({}, text.saveSuccess)
      }
    }
  }
}
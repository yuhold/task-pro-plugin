import cfg from './lib/config.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// --- 动态路径获取 ---
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const configPath = path.join(__dirname, 'config', 'config.json')

// --- 多语言字典 ---
const i18n = {
  zh: {
    global: '全局设置',
    debug: '调试日志',
    debugHelp: '开启后控制台输出详细执行过程。',
    lang: '界面语言 (Language)',
    langHelp: '切换后请保存并刷新页面生效。',
    
    // 提示信息
    refreshTip: '⚠️ 如果列表为空或不全，说明Bot尚未完全连接QQ。请等待Bot上线后，刷新此网页即可。',

    signSection: '① 自动群签到',
    enable: '开启功能',
    cron: 'Cron表达式',
    cronHelp: '格式: 秒 分 时 日 月 星期 (例: 0 1 0 * * *)',
    selectGroup: '选择群聊',
    signMsg: '签到内容',
    
    likeSection: '② 自动点赞',
    selectFriend: '选择好友',
    likeTimes: '点赞次数',
    
    gMsgSection: '③ 自动群消息',
    msgList: '消息列表',
    addHelp: '点击下方 + 添加任务 (若列表为空请刷新网页)',
    sendContent: '发送内容',
    
    fMsgSection: '④ 好友续火/私聊',
    privateList: '私聊列表',
    
    saveSuccess: '保存成功！如果修改了时间请重启Bot或发送 #更新任务'
  },
  en: {
    global: 'Global Settings',
    debug: 'Debug Log',
    debugHelp: 'Enable to show detailed logs.',
    lang: 'Language / 界面语言',
    langHelp: 'Save and refresh to apply changes.',
    
    refreshTip: '⚠️ If the list is empty, Bot is not fully connected. Please refresh this page after Bot is online.',

    signSection: '① Auto Group Sign',
    enable: 'Enable',
    cron: 'Cron Expression',
    cronHelp: 'Format: Sec Min Hour Day Mon Week',
    selectGroup: 'Select Groups',
    signMsg: 'Sign Message',
    
    likeSection: '② Auto Like',
    selectFriend: 'Select Friends',
    likeTimes: 'Like Count',
    
    gMsgSection: '③ Auto Group Msg',
    msgList: 'Message List',
    addHelp: 'Click + to add tasks',
    sendContent: 'Content',
    
    fMsgSection: '④ Auto Private Msg',
    privateList: 'Private List',
    
    saveSuccess: 'Saved!'
  }
}

// --- 辅助函数：获取列表 (带异常处理) ---
function getGroupList () {
  try {
    if (!global.Bot || !Bot.gl) return []
    return Array.from(Bot.gl.values()).map(g => {
      return { label: `${g.name} (${g.group_id})`, value: g.group_id }
    })
  } catch (err) { return [] }
}

function getFriendList () {
  try {
    if (!global.Bot || !Bot.fl) return []
    return Array.from(Bot.fl.values()).map(f => {
      return { label: `${f.nickname} (${f.user_id})`, value: f.user_id }
    })
  } catch (err) { return [] }
}

export function supportGuoba () {
  const config = cfg.getDef()
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
      description: 'Advanced Schedule Task Plugin',
      icon: 'mdi:robot-clock',
      iconColor: '#FF9800'
    },
    configInfo: {
      schemas: [
        // ================= 全局 =================
        { component: 'Divider', label: text.global },
        { field: 'lang', label: text.lang, component: 'Select', helpMessage: text.langHelp, componentProps: { options: [{ label: '简体中文', value: 'zh' }, { label: 'English', value: 'en' }] } },
        { field: 'debug', label: text.debug, component: 'Switch', helpMessage: text.debugHelp },

        // ================= 签到 =================
        { component: 'Divider', label: text.signSection },
        { component: 'Title', title: text.refreshTip, style: { fontSize: '12px', color: '#ff5252' } }, // 红色提示文字
        { field: 'sign.enable', label: text.enable, component: 'Switch' },
        { field: 'sign.cron', label: text.cron, component: 'Input', helpMessage: text.cronHelp },
        { 
          field: 'sign.list', label: text.selectGroup, component: 'Select', 
          componentProps: { mode: 'multiple', placeholder: text.refreshTip, options: getGroupList() }
        },
        { field: 'sign.msg', label: text.signMsg, component: 'Input' },

        // ================= 点赞 =================
        { component: 'Divider', label: text.likeSection },
        { field: 'like.enable', label: text.enable, component: 'Switch' },
        { field: 'like.cron', label: text.cron, component: 'Input' },
        { 
          field: 'like.list', label: text.selectFriend, component: 'Select', 
          componentProps: { mode: 'multiple', placeholder: text.refreshTip, options: getFriendList() }
        },
        { field: 'like.times', label: text.likeTimes, component: 'InputNumber', componentProps: { min: 1, max: 20 } },

        // ================= 群消息 (修复 GTables) =================
        { component: 'Divider', label: text.gMsgSection },
        { field: 'groupMsg.enable', label: text.enable, component: 'Switch' },
        { field: 'groupMsg.cron', label: text.cron, component: 'Input' },
        {
          field: 'groupMsg.list',
          label: text.msgList,
          component: 'GTables', // <--- 关键修复：加了 's'
          helpMessage: text.addHelp,
          componentProps: {
            columns: [
              {
                title: text.selectGroup,
                dataIndex: 'id',
                component: 'Select',
                componentProps: { 
                    options: getGroupList(),
                    style: { width: '180px' },
                    placeholder: '请选择'
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

        // ================= 私聊消息 (修复 GTables) =================
        { component: 'Divider', label: text.fMsgSection },
        { field: 'friendMsg.enable', label: text.enable, component: 'Switch' },
        { field: 'friendMsg.cron', label: text.cron, component: 'Input' },
        {
          field: 'friendMsg.list',
          label: text.privateList,
          component: 'GTables', // <--- 关键修复：加了 's'
          helpMessage: text.addHelp,
          componentProps: {
            columns: [
              {
                title: text.selectFriend,
                dataIndex: 'id',
                component: 'Select',
                componentProps: { 
                    options: getFriendList(),
                    style: { width: '180px' },
                    placeholder: '请选择'
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

      getConfigData () {
        return cfg.getDef()
      },
      
      setConfigData (data, { Result }) {
        fs.writeFileSync(configPath, JSON.stringify(data, null, 2))
        return Result.ok({}, text.saveSuccess)
      }
    }
  }
}
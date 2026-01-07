import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// --- 1. 动态获取插件根目录 ---
// 防止用户修改文件夹名称导致路径错误
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// 回退一级到插件根目录 (plugins/task-pro-plugin/)
const pluginPath = path.resolve(__dirname, '..')
const configPath = path.join(pluginPath, 'config', 'config.json')

// --- 2. 默认配置 ---
const defaultConfig = {
  // 全局设置
  debug: false,
  lang: 'zh', // 默认为中文 'zh' 或 'en'

  // ① 自动群签到
  sign: {
    enable: false,
    cron: '0 1 0 * * *',
    list: [], // 存放群号数组
    msg: '签到'
  },

  // ② 自动好友点赞
  like: {
    enable: false,
    cron: '0 30 8 * * *',
    list: [], // 存放QQ号数组
    times: 10
  },

  // ③ 自动群消息
  groupMsg: {
    enable: false,
    cron: '0 0 12 * * *',
    list: [] // 存放对象数组 [{id: 123, msg: 'xxx'}]
  },

  // ④ 好友续火/私聊
  friendMsg: {
    enable: false,
    cron: '0 0 22 * * *',
    list: [] // 存放对象数组 [{id: 123, msg: 'xxx'}]
  }
}

class Config {
  constructor () {
    this.config = {}
    this.init()
  }

  /** 初始化配置 */
  init () {
    const configDir = path.join(pluginPath, 'config')
    // 如果 config 文件夹不存在，则创建
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true })
    }
    // 如果 config.json 不存在，则写入默认配置
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2))
    }
  }

  /** 获取配置对象 */
  getDef () {
    try {
      // 每次读取文件，保证热更新
      return JSON.parse(fs.readFileSync(configPath, 'utf8'))
    } catch {
      return defaultConfig
    }
  }
}

export default new Config()
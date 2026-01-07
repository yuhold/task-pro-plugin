import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 动态获取路径，防止文件夹重命名导致找不到文件
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pluginPath = path.resolve(__dirname, '..')
const configPath = path.join(pluginPath, 'config', 'config.json')

// 默认配置
const defaultConfig = {
  // 全局调试开关
  debug: false,
  
  // 1. 群签到
  sign: {
    enable: false,
    cron: '0 1 0 * * *',
    list: [], 
    msg: '签到'
  },
  // 2. 好友点赞
  like: {
    enable: false,
    cron: '0 30 8 * * *',
    list: [], 
    times: 10
  },
  // 3. 群消息
  groupMsg: {
    enable: false,
    cron: '0 0 12 * * *',
    list: [] 
  },
  // 4. 好友消息/续火
  friendMsg: {
    enable: false,
    cron: '0 0 22 * * *',
    list: [] 
  }
}

class Config {
  constructor () {
    this.config = {}
    this.init()
  }

  init () {
    const configDir = path.join(pluginPath, 'config')
    // 递归创建目录
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true })
    }
    // 创建文件
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2))
    }
  }

  /** 获取配置 */
  getDef () {
    try {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'))
    } catch {
      return defaultConfig
    }
  }
}

export default new Config()
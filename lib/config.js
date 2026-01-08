import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// --- 1. 动态获取插件根目录 ---
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pluginPath = path.resolve(__dirname, '..')
const configPath = path.join(pluginPath, 'config', 'config.json')

// --- 2. 默认配置 ---
const defaultConfig = {
  debug: false,
  lang: 'zh',
  sign: { enable: false, cron: '0 1 0 * * *', list: [], msg: '签到' },
  like: { enable: false, cron: '0 30 8 * * *', list: [], times: 10 },
  groupMsg: { enable: false, cron: '0 0 12 * * *', list: [] },
  friendMsg: { enable: false, cron: '0 0 22 * * *', list: [] }
}

class Config {
  constructor () {
    this.config = {}
    this.init()
  }

  /** 初始化配置 */
  init () {
    const configDir = path.join(pluginPath, 'config')
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true })
    }
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2))
    }
  }

  /** 获取配置对象 (修复版：自动合并默认值) */
  getDef () {
    let fileConfig = {}
    try {
      if (fs.existsSync(configPath)) {
        fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'))
      }
    } catch (err) {
      // 如果读取出错，就忽略文件内容，使用空对象
    }

    // ★★★ 核心修复：将读取到的配置覆盖在默认配置之上 ★★★
    // 这样即使 config.json 里没有 'sign' 字段，也会使用 defaultConfig 里的 'sign'
    // 防止出现 "Cannot read properties of undefined"
    return { ...defaultConfig, ...fileConfig }
  }
}

export default new Config()
import plugin from '../../../lib/plugins/plugin.js'
import common from '../../../lib/common/common.js'
import cfg from '../lib/config.js'

export class TaskPro extends plugin {
  constructor () {
    super({
      name: 'TaskPro定时任务',
      dsc: 'TaskPro核心逻辑',
      event: 'message',
      priority: 5000,
      rule: [
        { reg: '^#更新(定时)?任务$', fnc: 'reloadTask', permission: 'master' },
        { reg: '^#测试(定时)?任务$', fnc: 'testTask', permission: 'master' }
      ]
    })

    this.task = []
    this.initTask()
  }

  /** 输出调试日志 */
  debugLog (msg) {
    const config = cfg.getDef()
    if (config.debug) {
      logger.mark(`[TaskPro调试] ${msg}`)
    }
  }

  initTask () {
    const config = cfg.getDef()
    this.task = [] 

    if (config.sign.enable) {
      this.task.push({ name: 'TaskPro_签到', cron: config.sign.cron, fnc: () => this.runSign() })
    }
    if (config.like.enable) {
      this.task.push({ name: 'TaskPro_点赞', cron: config.like.cron, fnc: () => this.runLike() })
    }
    if (config.groupMsg.enable) {
      this.task.push({ name: 'TaskPro_群发', cron: config.groupMsg.cron, fnc: () => this.runGroupMsg() })
    }
    if (config.friendMsg.enable) {
      this.task.push({ name: 'TaskPro_私聊', cron: config.friendMsg.cron, fnc: () => this.runFriendMsg() })
    }
  }

  async reloadTask (e) {
    this.initTask()
    e.reply('配置已重载！注意：Cron时间变更需要重启Bot才能完全生效。')
  }

  async testTask (e) {
    e.reply('开始测试所有任务，请关注控制台日志...')
    await this.runSign()
    await this.runLike()
    await this.runGroupMsg()
    await this.runFriendMsg()
    e.reply('测试结束。')
  }

  // --- 具体的执行逻辑 ---

  async runSign () {
    const conf = cfg.getDef().sign
    const list = conf.list || [] 
    
    logger.mark(`[TaskPro] 开始群签到，任务数: ${list.length}`)
    
    for (let gid of list) {
      let group = Bot.pickGroup(gid)
      if (group) {
        this.debugLog(`正在签到群: ${group.name}(${gid})`)
        await group.sendMsg(conf.msg)
        
        let sleepTime = 2000 + Math.random() * 3000
        this.debugLog(`等待 ${sleepTime.toFixed(0)}ms 防风控...`)
        await common.sleep(sleepTime)
      } else {
        logger.warn(`[TaskPro] 找不到群: ${gid}`)
      }
    }
    this.debugLog('群签到任务结束')
  }

  async runLike () {
    const conf = cfg.getDef().like
    const list = conf.list || []
    
    logger.mark(`[TaskPro] 开始点赞，任务数: ${list.length}`)

    for (let uid of list) {
      try {
        this.debugLog(`正在点赞用户: ${uid}，次数: ${conf.times}`)
        await Bot.sendLike(uid, Number(conf.times))
        await common.sleep(2000)
      } catch (err) { 
        logger.error(`[TaskPro] 点赞失败 ${uid}: ${err}`) 
      }
    }
    this.debugLog('点赞任务结束')
  }

  async runGroupMsg () {
    const conf = cfg.getDef().groupMsg
    const list = conf.list || []

    logger.mark(`[TaskPro] 开始群消息推送，任务数: ${list.length}`)

    for (let item of list) {
      if (!item.id || !item.msg) continue
      let group = Bot.pickGroup(item.id)
      if (group) {
        this.debugLog(`发送群消息 -> ${group.name}(${item.id}): ${item.msg}`)
        await group.sendMsg(item.msg)
        await common.sleep(5000)
      }
    }
    this.debugLog('群消息推送结束')
  }

  async runFriendMsg () {
    const conf = cfg.getDef().friendMsg
    const list = conf.list || []

    logger.mark(`[TaskPro] 开始好友续火/私聊，任务数: ${list.length}`)

    for (let item of list) {
      if (!item.id || !item.msg) continue
      let friend = Bot.pickFriend(item.id)
      if (friend) {
        this.debugLog(`发送私聊 -> ${friend.nickname}(${item.id}): ${item.msg}`)
        await friend.sendMsg(item.msg)
        await common.sleep(5000)
      }
    }
    this.debugLog('好友消息任务结束')
  }
}
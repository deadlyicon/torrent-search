const chalk = require('chalk')


class Logger {
  error(...args){
    console.log(chalk.red(`[ERROR]`), ...args)
  }

  verbose(...args){
    if (!process.env.verbose) return
    console.log(chalk.white(`[VERBOSE]`), ...args)
  }

  debug(...args){
    if (!process.env.debug) return
    console.log(chalk.grey(`[DEBUG]`), ...args)
  }
}

class LoggerWithPrefix {
  constructor(prefix, logger = new Logger){
    this._prefix = prefix
    this._logger = logger
  }

  prefix(newPrefix){
    return new this.constructor(newPrefix, this)
  }

  error(...args){
    this._logger.error(`[${this._prefix}]`, ...args)
  }

  verbose(...args){
    this._logger.verbose(`[${this._prefix}]`, ...args)
  }

  debug(...args){
    this._logger.debug(`[${this._prefix}]`, ...args)
  }

}

module.exports = prefix => new LoggerWithPrefix(prefix)

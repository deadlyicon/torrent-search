const chalk = require('chalk')

const logger = function(...args){
  console.log(...args)
}

logger.info = function(...args){
  if (!process.env.verbose) return
  console.log(chalk.blue(args[0]), ...args.slice(1))
}

logger.debug = function(...args){
  if (!process.env.debug) return
  console.log(chalk.yellow(args[0]), ...args.slice(1))
}

module.exports = logger

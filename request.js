const logger = require('./logger')
const { request } = require('cloudscraper')

let openRequests = 0

module.exports = function(method, url){
  let aborted = false

  openRequests++
  logger.debug('REQUEST:', ` ${method.toUpperCase()} ${url}`)

  return new Promise(function(resolve, reject){
    request({method, url}, function(error, response, body) {
      openRequests--
      logger.debug('RESPONSE:', ` ${response.statusCode} ${method.toUpperCase()} ${url}`)
      if (error) return reject(error)
      resolve(body)
    })
  })
}

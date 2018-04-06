const logger = require('./logger')('request')
const { request } = require('cloudscraper')

let openRequests = 0

module.exports = function(method, url){
  let aborted = false

  openRequests++
  logger.debug('REQUEST:', ` ${method.toUpperCase()} ${url}`)

  return new Promise(function(resolve, reject){
    request({method, url}, function(error, response, body) {
      openRequests--
      if (error) {
        logger.error('RESPONSE ERROR:', error)
        reject(error)
      }else{
        logger.debug('RESPONSE:', ` ${response.statusCode} ${method.toUpperCase()} ${url}`)
        resolve(body)
      }
    })
  })
}

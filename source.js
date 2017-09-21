const moment = require('moment')
const chrono = require('chrono-node')
const cloudscraper = require('cloudscraper')
const cheerio = require('cheerio')
const chalk = require('chalk')

module.exports = {

  extend(object){
    return Object.assign(Object.create(this), object)
  },

  request(method, url){
    return request(method, url)
  },

  /*
    query: String
    sortBy: 'best' || date' || 'size' || 'seeders' || 'leechers'
    desc: Boolean
    page: Number
  */
  search({query, page, sort, desc}){
    const url = this.queryToURL({query, page, sort, desc})
    return this.request('get', url)
      .then(($) => {
        return this.extractTorrentDOMNodes($)
          .toArray()
          .map($)
          .map(this.extractTorrentFromDOMNode)
          .map(this.polishTorrent)
      })
  },

  torrentDOMNodeSelector: '.torrent',

  extractTorrentDOMNodes($){
    return $(this.torrentDOMNodeSelector)
  },

  polishTorrent(torrent){
    torrent.seeders = Number(torrent.seeders)
    torrent.leechers = Number(torrent.leechers)
    torrent.size = sizeStringToMBInteger(torrent.size)
    torrent.created_at = parseDate(torrent.created_at || torrent.age)
    if (torrent.created_at)
      torrent.age = moment(torrent.created_at).fromNow()
    return torrent
  },

  // queryToURL(query, page=0){
  //   throw new Error('override `queryToURL` in your source')
  // }

  // extractTorrentDOMNodes($){
  //   throw new Error('override `extractTorrentDOMNodes` in your source')
  // },

  // extractTorrentFromDOMNode(DOMNode){
  //   throw new Error('override `extractTorrentFromDOMNode` in your source')
  // },

  // torrentToMagnetLinkURL(torrent){
  //   throw new Error('override `torrentToMagnetLinkURL` in your source')
  // },

  torrentToMagnetLinkURL(torrent){
    return torrent.href
  },

  magnetLinkForTorrent(torrent){
    const url = this.torrentToMagnetLinkURL(torrent)
    return this.request('get', url)
      .then(($) => {
        return $('a[href^="magnet:"]').attr('href')
      })
  },


}

function sizeStringToMBInteger(size){
  const matches = size.match(/(\d+(\.\d+)?)\s*mb/i)
  return matches ? parseFloat(matches[1], 10) : 0
}

function parseDate(age){
  if (age instanceof Date) return age
  age = (age || '').replace(/\'(\d\d(?:\D|$))/, "20$1")
  const results = chrono.parse(age)
  return results && results[0] ? results[0].start.date() : undefined
}

request.openRequests = 0
function request(method, url){
  request.openRequests++
  if (process.env.verbose)
    console.log(chalk.blue('REQUEST'), `(${request.openRequests})`, `${method} ${url}`)
  return new Promise(function(resolve, reject){
      [method.toLowerCase()](url, function(error, response, body) {
      request.openRequests--
      if (process.env.verbose)
        console.log(chalk.green('RESPONSE'), `(${request.openRequests})`, response.statusCode)
      if (error) return reject(error)
      resolve(cheerio.load(body))
    })
  })
}

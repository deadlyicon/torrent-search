import cloudscraper from 'cloudscraper'
import cheerio from 'cheerio'

export default {

  extend(object){
    return Object.assign(Object.create(this), object)
  },

  request(method, url){
    console.log(`REQUEST ${method} ${url}`)
    return new Promise(function(resolve, reject){
      cloudscraper[method.toLowerCase()](url, function(error, response, body) {
        if (error) return reject(error)
        resolve(cheerio.load(body))
      })
    })
  },

  search(query, page=1){
    const url = this.queryToURL(query, page)
    // console.log(`searching for ${query} at ${url}`)
    return this.request('get', url)
      .then(($) => {
        return this.extractTorrentDOMNodes($)
          .toArray()
          .map(DOMNode =>
            this.extractTorrentFromDOMNode($(DOMNode))
          )
      })
  },

  torrentDOMNodeSelector: '.torrent',

  extractTorrentDOMNodes($){
    return $(this.torrentDOMNodeSelector)
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

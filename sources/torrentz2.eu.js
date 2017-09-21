const source = require('../source')
const URL = require('url')

module.exports = source.extend({

  // 'best' || date' || 'size' || 'seeders'
  queryToURL({query, sort, desc, page}){
    return `https://torrentz2.eu/search?f=${encodeURIComponent(query)}`
  },

  torrentDOMNodeSelector: '.results > dl',

  extractTorrentFromDOMNode(DOMNode){
    const link = DOMNode.find('> dt > a[href]')
    const torrent = {
      name:       link.text(),
      href:       link.attr('href').replace(/^\//, 'http://torrentz2.eu/'),
      verified:   DOMNode.find('> dd > span:nth-child(1)').text() === "✓",
      created_at: DOMNode.find('> dd > span:nth-child(2)').attr('title'),
      age:        DOMNode.find('> dd > span:nth-child(2)').text(),
      size:       DOMNode.find('> dd > span:nth-child(3)').text(),
      seeders:    DOMNode.find('> dd > span:nth-child(4)').text(),
      leechers:   DOMNode.find('> dd > span:nth-child(5)').text(),
    }
    if (torrent.created_at)
      torrent.created_at = new Date(Number(torrent.created_at))
    return torrent;
  },

  magnetLinkForTorrent(torrent){
    console.log('torrentz2.magnetLinkForTorrent', torrent.href)
    return this.request('get', torrent.href)
      .then( $ =>
        $('.downlinks > dl, .download > dl')
          .toArray()
          .map(DOMNode => {
            const href = $(DOMNode).find('dt > a').attr('href')
            return {
              href,
              extractor: extractors[URL.parse(href).host],
            }
          })
          .filter(tracker => !!tracker.extractor)
      )
      .then(trackers =>
        Promise.race(
          trackers.map(tracker => {
            return this.request('get', tracker.href)
              .then($ => {
                const magnetLink = tracker.extractor($)
                console.log('torrentz2. found magnet link', magnetLink)
                return magnetLink
              })
          })
        )
      )
  },

})



const firstMagnetLink = $ => $('a[href^="magnet"]').attr('href')

const extractors = {
  'glodls.to': firstMagnetLink,
  'www.ahashare.com': firstMagnetLink,
  'monova.org': firstMagnetLink,
  'zooqle.com': firstMagnetLink,
  'yourbittorrent.com': false,
  'www.torrentfunk.com': false,
  'torrentproject.se': firstMagnetLink,
  'thepiratebay.org': firstMagnetLink,
  'www.idope.se': firstMagnetLink,
  'www.torlock.com': firstMagnetLink,
  'www.torrentdownloads.me': firstMagnetLink,
  'www.btsone.cc': firstMagnetLink,
  'www.limetorrents.cc': firstMagnetLink,
  'www.torlock.com': firstMagnetLink,
  'bitsnoop.com': firstMagnetLink,
  'pirateiro.com': firstMagnetLink,
}

import source from './source'
const sources = {}

export default sources

const defineSource = function(sourceName, definition){
  definition.sourceName = sourceName
  sources[sourceName] = source.extend(definition)
}

defineSource('torrentproject.se', {

  queryToURL(query, page=0){
    return `https://torrentproject.se/?hl=en&num=2000&start=0&filter=2000&safe=off&orderby=best&s=${encodeURIComponent(query)}`
  },

  torrentDOMNodeSelector: 'li > .torrent',

  extractTorrentFromDOMNode(DOMNode){
    const link = DOMNode.find('> h3 > a')
    const torrent = {
      name: link.text(),
      href: link.attr('href'),
      seeders: DOMNode.find('.seeders b').text(),
      size: DOMNode.find('.torrent-size').text(),
      age: DOMNode.find('.cated').text(),
      verified: DOMNode.find('.verified').length > 0,
    }
    if (torrent.seeders)
      torrent.seeders = Number(torrent.seeders)
    else
      delete torrent.seeders
    return torrent
  },

  magnetLinkForTorrent(torrent){
    const url = torrent.href.replace(/^\//, 'https://torrentproject.se/')
    return this.request('get', url)
      .then(($) => {
        return $('a[href^="magnet:"]').attr('href')
      })
  },

})


defineSource('rarbg.to', {

  queryToURL(query, page=1){
    return `http://rarbg.to/torrents.php?search=${encodeURIComponent(query)}`
  },

  torrentDOMNodeSelector: 'tr.lista2',

  extractTorrentFromDOMNode(DOMNode){
    const link = DOMNode.find('a[href^="/torrent/"]')
    const torrent = {
      name: link.text(),
      href: link.attr('href'),
      created_at: DOMNode.find('td:nth-child(3)').text(),
      size:       DOMNode.find('td:nth-child(4)').text(),
      seeders:    DOMNode.find('td:nth-child(5)').text(),
      leechers:   DOMNode.find('td:nth-child(6)').text(),
    }
    return torrent;
  },

  magnetLinkForTorrent(torrent){
    const url = torrent.href.replace(/^\//, 'http://rarbg.to/')
    return this.request('get', url)
      .then(($) => {
        return $('a[href^="magnet:"]').attr('href')
      })
  }

})

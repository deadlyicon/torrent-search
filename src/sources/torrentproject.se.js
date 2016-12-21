import source from '../source'

export default source.extend({

  queryToURL(query, page=0){
    return `https://torrentproject.se/?hl=en&num=2000&start=0&filter=2000&safe=off&orderby=best&s=${encodeURIComponent(query)}`
  },

  torrentDOMNodeSelector: 'li > .torrent',

  extractTorrentFromDOMNode(DOMNode){
    const link = DOMNode.find('> h3 > a')
    const torrent = {
      name: link.text(),
      href: link.attr('href').replace(/^\//, 'https://torrentproject.se/'),
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
    const url = torrent.href
    return this.request('get', url)
      .then(($) => {
        return $('a[href^="magnet:"]').attr('href')
      })
  },

})

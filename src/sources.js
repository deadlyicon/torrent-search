import source from './source'
const sources = {}

export default sources

sources['torrentproject.se'] = source.extend({

  queryToURL(query, page=0){
    return `https://torrentproject.se/?hl=en&num=2000&start=0&filter=2000&safe=off&orderby=best&s=${encodeURIComponent(query)}`
  },

  torrentDOMNodeSelector: 'li > .torrent',

  extractTorrentFromDOMNode(DOMNode){
    const link = DOMNode.find('> h3 > a')
    const torrent = {
      name: link.text(),
      href: link.attr('href'),
      // getMagnetLink: this.getMagnetLink.bind(torrent),
    }
    return torrent
  },

  torrentToMagnetLinkURL(torrent){
    return torrent.href.replace(/^\//, 'https://torrentproject.se/')
  },

})

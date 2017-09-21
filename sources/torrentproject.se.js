const source = require('../source')

module.exports = source.extend({

  // 'best' || date' || 'size' || 'seeders' || 'leechers'
  queryToURL({query, page, sort, desc}){
    const orderBy = (
      sort === 'date'? desc ? 'latest' : 'oldest' :
      sort === 'size'? desc ? 'sizeD' : 'sizeA':
      // sort === 'best' ? 'best' :
      // sort === 'seeders' ? 'seeders' :
      sort
    )

    return `https://torrentproject.se/?hl=en&num=2000&start=0&filter=2000&safe=off&orderby=${orderBy}&s=${encodeURIComponent(query)}`
  },

  torrentDOMNodeSelector: 'li > .torrent',

  extractTorrentFromDOMNode(DOMNode){
    const link = DOMNode.find('> h3 > a')
    const torrent = {
      name: link.text(),
      href: link.attr('href').replace(/^\//, 'https://torrentproject.se/'),
      seeders: DOMNode.find('.seeders b').text(),
      leechers: DOMNode.find('.leechers b').text(),
      size: DOMNode.find('.torrent-size').text(),
      age: DOMNode.find('.cated').text(),
      verified: DOMNode.find('.verified').length > 0,
    }
    return torrent
  },

})

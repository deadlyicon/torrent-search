const source = require('../source')

module.exports = source.extend({

  host: 'https://thepiratebay.org',

  // 'best' || date' || 'size' || 'seeders' || 'leechers'
  queryToURL({query, page, sort, desc}){
    const order = (
      sort === 'date'     ? desc ? 3 :  4 :
      sort === 'size'     ? desc ? 5 :  6 :
      sort === 'seeders'  ? desc ? 7 :  8 :
      sort === 'leechers' ? desc ? 9 : 10 :
      99 // best
    )
    return `${this.host}/search/${encodeURIComponent(query)}/0/${order}/0`
  },

  torrentDOMNodeSelector: '#searchResult > tbody > tr',

  extractTorrentDOMNodes($){
    console.log('---> ', '#searchResult', $('#searchResult').length)
    console.log('---> ', '#searchResult tr ', $('#searchResult tr ').length)
    console.log('---> ', '#searchResult > tbody', $('#searchResult > tbody').length)
    console.log('---> ', '#searchResult > tbody > tr', $('#searchResult > tbody > tr').length)
    return $(this.torrentDOMNodeSelector)
  },

  extractTorrentFromDOMNode(DOMNode){
    const link = DOMNode.find('a[href^="/torrent/"]')
    const magnetLink = DOMNode.find('a[href^="magnet:"]').attr('href')
    const desc = DOMNode.find('.detDesc').text()
    desc.match(/Uploaded (\d\d)-(\d\d) (\d\d\d\d)/)
    const createdAt = extractCreatedAtFromDesc(desc)

    const torrent = {
      name: link.text(),
      href: link.attr('href').replace(/^\//, `${this.host}/`),
      magnetLink: magnetLink,
      created_at: createdAt,
      // size:       DOMNode.find('td:nth-child(4)').text(),
      // seeders:    DOMNode.find('td:nth-child(5)').text(),
      // leechers:   DOMNode.find('td:nth-child(6)').text(),
    }
    return torrent;
  },

})


const extractCreatedAtFromDesc = desc => {
  const matches = desc.match(/Uploaded\s+(\d\d)-(\d\d)\s+(\d\d\d\d)/)
  if (!matches) return
  [_, month, day, year] = matches
  return `${year}/${month}/${day}`
  // return new Date(year, month, day)
}

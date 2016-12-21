import source from '../source'

export default source.extend({

  // 'best' || date' || 'size' || 'seeders' || 'leechers'

  queryToURL({query, sort, desc, page}){
    if (sort === 'best')
      return `http://1337x.to/search/${encodeURIComponent(query)}/${page}/`
    if (sort === 'date') sort = 'time'
    const direction = desc ? 'desc' : 'asc'
    return `http://1337x.to/sort-search/${encodeURIComponent(query)}/${sort}/${direction}/${page}/`
  },

  torrentDOMNodeSelector: '.box-info-detail.inner-table table > tbody > tr',

  extractTorrentFromDOMNode(DOMNode){
    const link = DOMNode.find('a[href^="/torrent/"]')
    const torrent = {
      name: link.text(),
      href: link.attr('href').replace(/^\//, 'http://1337x.to/'),
      created_at: DOMNode.find('.coll-date').text(),
      size:       DOMNode.find('.size').text().split('MB')[0]+' MB',
      seeders:    DOMNode.find('.seeds').text(),
      leechers:   DOMNode.find('.leeches').text(),
    }
    return torrent;
  },

})

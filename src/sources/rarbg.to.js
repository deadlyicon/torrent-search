import source from '../source'

export default source.extend({

  // 'best' || date' || 'size' || 'seeders' || 'leechers'
  queryToURL({query, page, sort, desc}){
    const order = sort === 'best'
      ? 'data'
      : sort === 'date'
        ? 'data'
        : sort

    const by = desc ? 'DESC' : 'ASC'
    return `http://rarbg.to/torrents.php?search=${encodeURIComponent(query)}&order=${order}&by=${by}`
  },

  torrentDOMNodeSelector: 'tr.lista2',

  extractTorrentFromDOMNode(DOMNode){
    const link = DOMNode.find('a[href^="/torrent/"]')
    const torrent = {
      name: link.text(),
      href: link.attr('href').replace(/^\//, 'https://rarbg.to/'),
      created_at: DOMNode.find('td:nth-child(3)').text(),
      size:       DOMNode.find('td:nth-child(4)').text(),
      seeders:    DOMNode.find('td:nth-child(5)').text(),
      leechers:   DOMNode.find('td:nth-child(6)').text(),
    }
    return torrent;
  },

})

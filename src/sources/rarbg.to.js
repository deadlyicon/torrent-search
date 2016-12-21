import source from '../source'

export default source.extend({

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
    const url = torrent.href.replace(/^\//, 'https://rarbg.to/')
    return this.request('get', url)
      .then(($) => {
        return $('a[href^="magnet:"]').attr('href')
      })
  }

})

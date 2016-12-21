import source from '../source'

export default source.extend({

  queryToURL(query, page=1){
    return `http://1337x.to/search/${encodeURIComponent(query)}/${page}/`
  },

  torrentDOMNodeSelector: '.box-info-detail.inner-table table > tbody > tr',

  extractTorrentFromDOMNode(DOMNode){
    const link = DOMNode.find('a[href^="/torrent/"]')
    const torrent = {
      name: link.text(),
      href: link.attr('href').replace(/^\//, 'http://1337x.to/'),
      created_at: DOMNode.find('.coll-date').text(),
      size:       DOMNode.find('.size').text(),
      seeders:    DOMNode.find('.seeds').text(),
      leechers:   DOMNode.find('.leeches').text(),
    }
    return torrent;
  },

})

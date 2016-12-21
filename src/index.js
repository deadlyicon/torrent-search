import cloudscraper from 'cloudscraper'
import cheerio from 'cheerio'

export default function torrentSeach({query, page=0}){
  return Promise.all(
    Object.keys(sources).map(source =>
      sources[source]({query, page})
    )
  ).then(results => {
    let torrents = []
    while(results.length > 0)
      torrents = torrents.concat(results.shift())
    return torrents
  })
}

const request = function(method, url, params, postbody){
  return new Promise(function(resolve, reject){
    cloudscraper[method.toLowerCase()](url, function(error, response, body) {
      if (error) return reject(error)
      resolve({
        response,
        body,
        $: cheerio.load(body),
      })
    })
  })
}

const sources = {}

sources['torrentproject.se'] = (function(){

  const getMagnetLink = function(){

  }

  const extractTorrent = function(_, div){
    const link = $(div).find('> h3 > a')
    const torrent = {
      name: link.text(),
      href: link.attr('href').replace(/^\//, 'https://torrentproject.se/'),
      getMagnetLink: getMagnetLink.bind(torrent),
    }
    return torrent
  }

  return function({query, page=0}){
    const url = `https://torrentproject.se/?hl=en&num=20&start=0&filter=2000&safe=off&orderby=best&s=${query}`
    return request('get', url)
      .then(({response, body, $}) =>
        $('li > .torrent').map(extractTorrent)
      )
  }

})();

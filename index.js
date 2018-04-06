const sources = require('./sources')
const logger = require('./logger')('search')

const torrentSearch = function(options){
  options = Object.assign({
    query: '',
    verbose: false,
    page: 1,
    sort: 'best', // best | date | size | seeders
    desc: true,
  }, options || {})

  return Promise.all(
    Object.keys(sources).map(source =>
      sources[source].search(options)
        .then(torrents => {
          torrents.forEach(torrent => {
            torrent.source = source
          })
          logger.debug(`${source} found ${torrents.length} torrents`)
          return torrents
        })
    )
  ).then(results => {
    let torrents = []
    while (results.length) torrents = torrents.concat(results.shift())
    return torrents
  })
  .then(torrents =>
    /*
      A torrent should look like this
    {
      name: String,
      href: String,
      leechers: Number,
      seeders: Number,
      size: Number, // in megabytes
      age: Number,
      verified: Boolean,
      created_at: String,
    }
    */

    torrents
      .filter(torrents => typeof torrents === 'object')
      .sort(sortBy[options.sort])
  )
}

module.exports = torrentSearch

torrentSearch.magnetLinksForTorrents = function(torrents){
  return Promise.all(
    torrents.map(magnetLinkForTorrent)
  )
  .then(magnetLinks => {
    logger.debug('Found', `${magnetLinks.length} magnet links`)
    return magnetLinks.filter(magnetLink => typeof magnetLink === 'string')
  })
}

function magnetLinkForTorrent(torrent){
  return sources[torrent.source].magnetLinkForTorrent(torrent)
}

const sortBy = {
  best: (a,b) => (
    (a.verified && !b.verified) ? -1 :
    (!a.verified && b.verified) ? 1 :
    (a.verified === b.verified) ? b.seeders - a.seeders : 0
  ),
  date: (a,b) => (
    b.created_at - a.created_at
  ),
  size: (a,b) => (
    b.size - a.size
  ),
  seeders: (a,b) => (
    b.seeders - a.seeders
  ),
}

import sources from './sources'


export default function torrentSearch({query, page=1}){
  return Promise.all(
    Object.keys(sources).map(source =>
      sources[source].search({query, page})
        .then(torrents => {
          torrents.forEach(torrent => {
            torrent.source = source
          })
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
      size: String,
      age: Number,
      verified: Boolean,
      created_at: String,
    }
    */

    torrents.filter(torrents => typeof torrents === 'object')
  )
}


torrentSearch.magnetLinksForTorrents = function(torrents){
  return Promise.all(
    torrents.map(magnetLinkForTorrent)
  )
  .then(magnetLinks =>
    magnetLinks.filter(magnetLink => typeof magnetLink === 'string')
  )
}

function magnetLinkForTorrent(torrent){
  return sources[torrent.source].magnetLinkForTorrent(torrent)
}

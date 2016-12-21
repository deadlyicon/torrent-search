import sources from './sources'

export default function torrentSearch({
  query='',
  verbose=false,
  page=1,
  sort='best', // best | date | size | seeders
  desc=true,
}){
  return Promise.all(
    Object.keys(sources).map(source =>
      sources[source].search({query, verbose, page, sort, desc})
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
      size: Number, // in megabytes
      age: Number,
      verified: Boolean,
      created_at: String,
    }
    */

    torrents
      .filter(torrents => typeof torrents === 'object')
      .sort(sortBy[sort])
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

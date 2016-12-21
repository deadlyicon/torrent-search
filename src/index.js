import sources from './sources'

export default function torrentSearch(query, page=1){
  return Promise.all(
    Object.keys(sources).map(source =>
      sources[source].search(query, page)
    )
  ).then(results => {
    let torrents = []
    while (results.length) torrents = torrents.concat(results.shift())
    console.log(torrents.length)
    return torrents
  })
}

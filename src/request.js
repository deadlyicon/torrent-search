import cloudscraper from 'cloudscraper'

export default function request(method, url){
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

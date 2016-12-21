describe('torrent-search', function(){
  it('should be a function', function(){
    expect(torrentSearch).to.be.a('function')
  })

  it('should return a Promise', function(){
    expect(torrentSearch({query: 'foo'})).to.be.an.instanceOf(Promise)
  })
})

var Analytics = class {
  constructor(socketHost, fruitQuantity, shoppers, divId) {
    this.socket = io.connect(socketHost)
    this.divId = divId
    this.fruitCount = fruitQuantity;
    this.shopperCount = shoppers;
  }

  openStream(){
    this.socket.emit('ready', 'groceries')
    this.listenStream()
  }

  listenStream(){
    this.socket.on("recvData", (data) => {
      this.saveData(JSON.parse(data).cart)
      this.upDateView()
    })
  }

  saveData(cart){
    this.shopperCount++
    cart.map(item => {
      if(item.type === 'fruit') this.fruitCount += item.quantity
    })
  }

  analytics() {
    var analytics = {
      aveFruitPerShopper: this.fruitCount/this.shopperCount
    }
    return analytics
  }

  upDateView() {
    var analytics = this.analytics()
    document.getElementById(this.divId).innerHTML = '<h1>' + analytics.aveFruitPerShopper + ' fruit per shopper </h1>'
  }

};

var cart = new Analytics('http://brand.nioinstances.com',0,0, 'mean')
cart.openStream()

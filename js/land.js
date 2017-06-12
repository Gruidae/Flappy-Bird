(function (Fly) {
  'use strict';

  // 构造函数
  var Land = function(config) {
    this.img = config.img;
    this.ctx = config.ctx;

    this.imgW = this.img.width;
    this.x = config.x;
    this.y = config.y;
    this.speed = 0.15;
  };

  // 原型对象
  Land.prototype = {
    constructor: Land,

    draw: function( delta ) {
      this.x -= this.speed * delta;

      if(this.x <= -this.imgW) {
        this.x += this.imgW * 4;
      }

      this.ctx.drawImage(this.img, this.x, this.y);
    }
  };

  Fly.Land = Land;

})(Fly);
(function (Fly) {
  'use strict';
  var Game = function (config) {
    this.ctx = config.ctx;
    this.imgsArr = ['birds', 'land', 'pipe1', 'pipe2', 'sky'];
    this.isStart = true;
    this.delta = 0;
    this.hero = null;
    this.roles = [];
    this.lastFrameTime = new Date();
    this.curFrameTime = 0;

    this.hero = null;
  }
  Game.prototype = {
    constructor: Game,

    start: function () {
      var that = this;
      Fly.loadImages(that.imgsArr, function (imgList) {
        that.initRoles(imgList);
        that.render(imgList);
        that.bindEvent();
      })
    },
    initRoles: function (imgList) {
      // 创建小鸟对象
      var context = this.ctx,
        i,
        imgSky = imgList.sky,
        imgLand = imgList.land;

      this.hero = Fly.JYK('Bird',{
        img: imgList.birds,
        ctx: context
      });
      // 创建两个图片对象
      for (i = 0; i < 2; i++) {
        var sky = Fly.JYK('Sky',{
          img: imgSky,
          ctx: context,
          x: i * imgSky.width
        });
        this.roles.push(sky);
      }
      for (i = 0; i < 6; i++) {
        var pipe = Fly.JYK('Pipe',{
          imgTop: imgList.pipe2,
          imgBottom: imgList.pipe1,
          ctx: context,
          x: 300 + i * imgList.pipe1.width * 3,
          pipeSpace: 150
        });
        this.roles.push(pipe);
      }
      for (i = 0; i < 4; i++) {
        var land = Fly.JYK('Land',{
          img: imgLand,
          ctx: context,
          x: i * imgLand.width,
          y: imgSky.height - imgLand.height
        });
        this.roles.push(land);

      };
    },
    bindEvent: function () {
      var that = this;
      that.ctx.canvas.addEventListener('click', function () {
        // 将来如果让小鸟跳动的代码逻辑发生了变化，
        // 此时，调用代码是不需要改变的，只需要改变对应的 changeSpeed 方法
        // 中的代码逻辑就可以了！
        that.hero.changeSpeed(-0.3);
      });
    },
    render: function (imgList) {
      var that = this,
        context = that.ctx,
        bird = that.hero,
        cvW = context.canvas.width,
        cvH = context.canvas.height,
        imgLand = imgList.land,
        imgSky = imgList.sky;

      (function renderGame() {
        // 保存绘制状态
        context.save();
        context.clearRect(0, 0, cvW, cvH);
        context.beginPath(); //忘了 必须是新路径才可以判定!!!
        that.curFrameTime = new Date();
        that.delta = that.curFrameTime - that.lastFrameTime;
        that.lastFrameTime = that.curFrameTime;

        that.roles.forEach(function (role) {
          role.draw(that.delta)
        })

        // 绘制小鸟
        bird.draw(that.delta);

        //碰撞检测
        //1超出顶端
        //2接触陆地
        //3接触管道
        if (bird.y < -10 || bird.y >= (imgSky.height - imgLand.height) || context.isPointInPath(bird.x, bird.y)) {
          that.isStart = false;
        }
        // 恢复状态
        context.restore();
        if (that.isStart) {

          requestAnimationFrame(renderGame);
        };
      })()
    }

  }
  
  var instance = null;
  Fly.getGame = function (config) {
    if (instance === null) {
      return new Game(config);
    }
    return instance;
  }
  Fly.Game = Game;
})(Fly);
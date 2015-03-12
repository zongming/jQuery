(function($) {
    $.widget('qbao.baseAuction', {
        options: {
            totalTime: 10800000,
            currentTime: 0,
            interval: 1000,
            started: true,
            
            start: 1000.00,
            
            numbers: {
                // rootClass: "numbers",
                // numberH: 50,
                // totalSize: 15, 
                // numberSize: 10
                // value: "￥56,789.12"        
            }
        },
        
        _createDefaults: $.noop,
        _getPriceByTime: $.noop,
        _getTimeByPrice: $.noop,
        
        setTime: function(time) {
            if(time < 0) {
                time = 0;
            }
            
            time = parseInt(time / this.options.interval) * this.options.interval;
            this.currentTime = time;
            
            this._refresh();
        },
        
        _init: function() {
            this.currentTime = this.options.currentTime;
            this._refresh();
        },
        
        setPrice: function(price) {
            if(price > this.options.start) {
                price = this.options.start;
            } else if(price < this.end) {
                price = this.end;
            }
            
            this.price = price;
            if(this.price >= 0) {
                this._showPrice();
            }
            this.currentTime = this._getTimeByPrice(price);
            
            this._refresh();
        },
        
        start: function(currentTime) {
            if(!isNaN(currentTime)) {
                this.currentTime = Number(currentTime);
            } else {
                this.currentTime = 0;
            }
            this._refresh();
        },
        
        stop: function(price) {
            clearTimeout(this.timeout);
            
            if(price && !isNaN(price)) {
                this.price = price;
            }
            this._showPrice();
        },
        
        _showPrice: function() {
            var x = this.price.toFixed(0);
            x = String(x).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
            this.$number.numbers("setValue", x);
        },
            
        _create: function() {
            this.$number = this.widget().numbers(
                this.options.numbers
            );
            this._createDefaults();
        },
        
        _refresh: function() {
            clearTimeout(this.timeout);
            
            if(this.currentTime >= this.options.totalTime) {
                if(!isNaN(this.end)) {
                    this.price = this.end;
                    this._showPrice();
                    return;
                }
            }
            
            this.price = this._getPriceByTime();
            if(this.price < 0) {
                this.price = 0;
            }
            // if(this.price >= 0) {
                this._showPrice();
                
                if(this.options.started) {
                    if(this.currentTime < this.options.totalTime) {
                        this.timeout = setTimeout($.proxy(this._next, this), this.options.interval);
                    }
                }
            // }
        },
        
        _next: function() {
            this.currentTime += this.options.interval;
            this.times = parseInt(this.currentTime / this.options.interval);
            var temp = this.price;
            this.price = this._getPriceByTime();
            
            if(this.price >= 0) {
                this._showPrice();
                
                console.log("当前时间：  " + this.currentTime + " ms");
                console.log("第 " + this.times + " 次降价: " + (temp - this.price).toFixed(2) + " 元");
                console.log("价格降为: " + this.price);
                console.log("........................");
                
                if(this.currentTime < this.options.totalTime) {
                    this.timeout = setTimeout($.proxy(this._next, this), this.options.interval);
                }
                this._trigger('refresh');
            }
        }
    });
    
    $.widget('qbao.auctionA', $.qbao.baseAuction, { //价格匀速下降
        options: {
            cutDown: 0
        },
        
        _createDefaults: function() {
            this.total = this.options.totalTime / this.options.interval; // how many time should the price goes down?
            this.total = parseInt(this.total);
            
            this.end = this.options.start - this.total * this.options.cutDown;
        },
        
        _getTimeByPrice: function(price) {
            var t = (this.options.start - price) / this.options.cutDown;
            t = Number(t.toFixed(0));
            
            return  t * this.options.interval;
        },
        
        _getPriceByTime: function() {
            var times = parseInt(this.currentTime / this.options.interval);
            var price = this.options.start - times * this.options.cutDown;
            return Number(price.toFixed(2));
        }
    });
    
    $.widget('qbao.auctionB', $.qbao.baseAuction, { //加速、减速降价
        options: {
            type: 1, // 1 is increase, -1 is decrease
            CDchangeTimes: 10, // cut down change times 竞拍下跌价格递增、减次数
            maxCutDown: 10, //最大降幅
            minCutDown: 1 // 最小降幅
        },
        
        _getPriceByTime: function() {
            var time = this.currentTime;
            time = time / this.options.interval;
            time = parseInt(time);
            
            var stage = parseInt(time / this.stageSize);
            var start = this.prices[stage];
            var steps = time % this.stageSize;
            
            var d = this._getDeltaByStage(stage);
            var price = start - steps * d;
            
            return Number(price.toFixed(2));
        },
        
        _getTimeByPrice: function(price) {
            var stage = this.prices.length;
            $.each(this.prices, function(index, p) {
                if(p < price) {
                    stage = index;
                    return false;
                }
            });
            stage = stage - 1;
            
            var start = this.prices[stage];
            var d = this._getDeltaByStage(stage);
            var k = (start - price) / d;
            k = Number(k.toFixed(0));
            
            var time = stage * this.stageSize + k;
            return time * this.options.interval;
        },
        
        _getDeltaByStage: function(i) { // 得到本次降价的数量，参数i表示第i次改变下降幅度
            var n = 0;
            if(this.options.type == 1) {
                n = this.options.minCutDown + i * this.stageDelta;
            } else if(this.options.type == -1) {
                //减速下降需要一开始就把  下降数值 减一次
                n = this.options.maxCutDown - (i + 1) * this.stageDelta;
            }
            return n;
        },
        
        _createDefaults: function() {
            this.total = this.options.totalTime / this.options.interval; // how many time should the price goes down?
            this.total = parseInt(this.total);
            
            this.stageSize = this.total / this.options.CDchangeTimes; // after how many times should the value of cut donw price goes increase
            this.stageSize = parseInt(this.stageSize);
            
            this.stageDelta = (this.options.maxCutDown - this.options.minCutDown) / this.options.CDchangeTimes;// for cut down price, how many should be increased each time
            this.stageDelta = Number(this.stageDelta.toFixed(2));
            
            this.prices = []; // cache for each stage
            
            var n = this.options.start;
            var i = 0;
            while(i < this.total) {
                this.prices.push(Number(n.toFixed(2)));
                
                var m = parseInt(i / this.stageSize); 
                n -= this._getDeltaByStage(m) * this.stageSize;
                
                i += this.stageSize;
            }
            this.end = Number(n.toFixed(2));
            this.prices.push(this.end); 
        }
    });

    $.widget('qbao.auctionC', $.qbao.baseAuction, { // 按步下跌，后端设置好每步降幅
        _createDefaults: function() {
            this.steps = [];
        },
        
        _getPriceByTime: function() {
            var price = this.options.start;
            var s = parseInt(this.currentTime / this.options.interval);
            if(this.steps[s]) {
                price = this.steps[s].price;
            } else {
                console.log('no data for currentTime');
                for(var i = s; i > -1; i--) {
                    if(this.steps[i]) {
                        price = this.steps[i].price;
                        break;
                    }
                }
            }
            return Number(price.toFixed(2));
        },
        
        _getTimeByPrice: function(price) {
            for(var i = this.steps.length - 1; i > -1; i--) {
                if(this.steps[i] && this.steps[i].price >= price) {
                    break;
                }
            }
            return i * this.options.interval;
        },
        
        // [
            // {time: 0, price: 2500}, 
            // {time: 1000, price: 2499},
            // {time: 2000, price: 2497},
            // {time: 3000, price: 2492},
        // ];
        updateSteps: function(steps) {
            for(var i = 0; i < steps.length; i++) {
                var t = steps[i].time;
                var s = parseInt(t / this.options.interval);
                
                this.steps[s] = this.steps[s] || steps[i];
            }
        },
        
        getLeftStepsCount: function() {
            var step = parseInt(this.currentTime / this.options.interval);
            var max = this._getMaxStepInCache();
            return max - step;
        },
        
        _getMaxStepInCache: function() {
            var max = 0;
            for(var i = this.steps.length -1; i > -1; i--) {
                if(this.steps[i] && max <= i) {
                    max = i;
                    break;
                }
            }
            return max;
        }
    });
})(jQuery);

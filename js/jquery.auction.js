(function($) {
    $.widget('qbao.baseAuction', {
        options: {
            totalTime: 10800000,
            currentTime: 0,
            interval: 1000,
            started: true,
            
            start: 1000.00,
            
            numbers: {
                rootClass: "numbers",
                size: 15, 
                numberH: 50,
                maxNumbers: 10
                // value: "￥56,789.12"        
            }
        },
        
        _createDefaults: $.noop,
        _getNextValue: $.noop,
        setPrice: $.noop,
        setTime: $.noop,
        
        setStarted: function(b) {
            if(this.options.started != b) {
                this.options.started = b;
                if(b) {
                    this._init();
                } else {
                    clearTimeout(this.timeout);
                    this.options.currentTime = 0;
                    this.price = this.end;
                    this.$number.numbers({
                        value: this._formatCurrent()
                    });
                }
            }
        },
        
        _formatCurrent: function() {
            var x = this.price.toFixed(2);
            return "￥" + String(x).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
        },
            
        _create: function() {
            this.$number = this.widget().numbers(
                this.options.numbers
            );
            this._createDefaults();
        },
        
        _init: function() {
            clearTimeout(this.timeout);
            
            if(this.options.currentTime >= this.options.totalTime) {
                this.price = this.end;
                this.$number.numbers({
                    value: this._formatCurrent()
                });
                return;
            }
            
            this.price = this._getNextValue();
            
            if(this.price >= 0) {
                this.$number.numbers({
                    value: this._formatCurrent()
                });
                
                if(this.options.started) {
                    if(this.options.currentTime < this.options.totalTime) {
                        this.timeout = this._delay(this._next, this.options.interval);
                    }
                }
            }
        },
        
        _next: function() {
            this.options.currentTime += this.options.interval;
            this.times = parseInt(this.options.currentTime / this.options.interval);
            this.price = this._getNextValue();
            console.log("价格降为: " + this.price);
            
            if(this.price >= 0) {
                this.$number.numbers({
                    value: this._formatCurrent()
                });
                
                console.log("这是第 " + this.times + " 次降价");
                console.log("当前时间：  " + this.options.currentTime);
                console.log("........................");
                
                if(this.options.currentTime < this.options.totalTime) {
                    this.timeout = this._delay(this._next, this.options.interval);
                }
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
        
        setPrice: function(price) {
            clearTimeout(this.timeout);
            
            if(price > this.options.start) {
                price = this.options.start;
            } else if(price < this.end) {
                price = this.end;
            }
            
            // this.price = price;
            // if(this.price >= 0) {
                // this.$number.numbers({
                    // value: this._formatCurrent()
                // });
            // }
            
            this.options.currentTime = (this.options.start - price) / this.options.cutDown * this.options.interval;
            this._init();
        },
        
        setTime: function(time) {
            clearTimeout(this.timeout);
            
            if(time < 0) {
                time = 0;
            }
            
            time = parseInt(time / this.options.interval) * this.options.interval;
            this.options.currentTime = time;
            this._init();
        },
        
        _getNextValue: function() {
            var times = parseInt(this.options.currentTime / this.options.interval);
            return this.options.start - times * this.options.cutDown;
        }
    });
    
    $.widget('qbao.auctionB', $.qbao.baseAuction, { //加速、减速降价
        options: {
            type: 1, // 1 is increse, -1 is decease
            CDchangeTimes: 10, // cut down change times 竞拍下跌价格递增、减次数
            maxCutDown: 10, //最大降幅
            minCutDown: 1 // 最小降幅
        },
        
        _getPriceByTime: function(time) {
            time = time / this.options.interval;
            time = parseInt(time);
            
            var stage = parseInt(time / this.stageSize);
            var start = this.prices[stage];
            var steps = time % this.stageSize;
            
            var d = this._getDeltaByStage(stage);
            console.log("降价: " + d);
            var price = start - steps * d;
            
            return price;
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
            var k = parseInt((start - price) / d);
            var time = stage * this.stageSize + k;
            return time * this.options.interval;
        },
        
        _getDeltaByStage: function(i) {
            var n = 0;
            if(this.options.type == 1) {
                n = this.options.minCutDown + i * this.stageDelta;
            } else if(this.options.type == -1) {
                //减速下降需要一开始就把  下降数值 减一次
                n = this.options.maxCutDown - (i + 1) * this.stageDelta;
            }
            return n;
        },
        
        setPrice: function(price) {
            clearTimeout(this.timeout);
            
            if(price > this.options.start) {
                price = this.options.start;
            } else if(price < this.end) {
                price = this.end;
            }
            
            // this.price = price;
            // if(this.price >= 0) {
                // this.$number.numbers({
                    // value: this._formatCurrent()
                // });
            // }
            
            this.options.currentTime = this._getTimeByPrice(price);
            
            this._init();
        },
        
        setTime: function(time) {
            clearTimeout(this.timeout);
            
            if(time < 0) {
                time = 0;
            }
            
            time = parseInt(time / this.options.interval) * this.options.interval;
            this.options.currentTime = time;
            this._init();
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
            for(var i = 0; i < this.total; i++) {
                if(i % this.stageSize == 0) {
                    this.prices.push(n);
                }
                var m = parseInt(i / this.stageSize); 
                n -= this._getDeltaByStage(m);
            }
            this.prices.push(n); 
            this.end = Number(n.toFixed(2));
        },
        
        _getNextValue: function() {
            return this._getPriceByTime(this.options.currentTime);
        }
    });
})(jQuery);

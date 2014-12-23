(function($) {
    $.extend({
       numberUp: function(n, factor) {
           factor = factor || 2;
           
           n = Number(n);
           var s = n.toString();
           var i = s.indexOf(".");
           s = s + "00";
           
           if(i > -1) {
               
           } else {
               
           }
           s = s.replace('.', "");
           return Math.round(Number(s)).toFixed(0);  
       },
       numberDown: function(n, factor) {
           factor = factor || 2;
           n = Number(n);
           var s = n.toString();
           s = "00" + s;
           var i = s.indexOf(".");
           if(i > -1) {
               s = s.replace(".", "");
           } else {
               i = s.length - factor;
           }
           s = s.slice(0, i) + '.' + s.slice(i);
           return Math.round(Number(s)).toFixed(2); 
       }
    });
    
    $.widget('qbao.baseaction', {
        options: {
            // status: 0, 
            totalTime: 10800000,
            currentTime: 0,
            // interval: 10000,
            interval: 1000,
            
            // type: 0,
            start: 1000.00,
            // price: 1000.00,
            
            numbers: {
                rootClass: "numbers",
                size: 15, 
                numberH: 50,
                maxNumbers: 10
                // value: "￥56,789.12"        
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
        },
        _getInitialValue: $.noop,
        _getNextValue: $.noop,
        setPrice: $.noop,
        
        _init: function() {
            clearTimeout(this.timeout);
            
            if(this.options.currentTime > this.options.totalTime) {
                return;
            }
            
            this.price = this._getInitialValue();
            
            if(this.price >= 0) {
                this.$number.numbers({
                    value: this._formatCurrent()
                });
                if(this.options.currentTime < this.options.totalTime) {
                    this.timeout = this._delay(this._next, this.options.interval);
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
    
    $.widget('qbao.auctionA', $.qbao.baseaction, {
        options: {
            cutDown: 0
        },
        
        setPrice: function(price) {
            clearTimeout(this.timeout);
            
            this.price = price;
            if(this.price >= 0) {
                this.$number.numbers({
                    value: this._formatCurrent()
                });
            }
            
            this.options.currentTime = (this.options.start - price) / this.options.cutDown * this.options.interval;
            this._init();
        },
        
        _getInitialValue: function() {
            var times = parseInt(this.options.currentTime / this.options.interval);
            return this.options.start - times * this.options.cutDown;
        },
        
        _getNextValue: function() {
            return this.price - this.options.cutDown;
        }
    });
    
    $.widget('qbao.auctionB', $.qbao.baseaction, {
        options: {
            type: 1, // 1 is increse, -1 is decease
            CDchangeTimes: 10, // cut down change times 竞拍递增次数
            maxCutDown: 10,
            minCutDown: 1
        },
        
        _create: function() {
            this._superApply(arguments);
            
            this.prices = [];
            
            this._refreshDefaults();
            
            var n = this.options.start;
            for(var i = 0; i < this.total; i++) {
                if(i % this.stageSize == 0) {
                    this.prices.push(n);
                }
                
                var m = parseInt(i / this.stageSize); 
                if(this.options.type == 1) {
                    n -= this.options.minCutDown + m * this.stageDelta;
                } else if(this.options.type == -1) {
                    m += 1;//减速下降需要一开始就把  下降数值 减一次
                    n -= this.options.maxCutDown - m * this.stageDelta;
                }
            }
            this.prices.push(n);// cache for each stage
            this.end = n;
        },
        
        _getPriceByTime: function(time) {
            var t = time / this.options.interval;
            t = parseInt(t);
            
            var j = parseInt(t / this.stageSize);
            var start = this.prices[j];
            var k = t % this.stageSize;
            
            var n = this._getDeltaByStage(j);
            var price = start - k * n;
            
            return price;
        },
        
        _getTimeByPrice: function(price) {
            if(price > this.options.start) {
                price = this.options.start;
            } else if(price < this.end) {
                price = this.end;
            }
            var j = this.prices.length;
            $.each(this.prices, function(index, p) {
                if(p < price) {
                    j = index;
                    return false;
                }
            });
            j = j - 1;
            
            var start = this.prices[j];
            var n = this._getDeltaByStage(j);
            var k = parseInt((start - price) / n);
            var time = j * this.stageSize + k;
            return parseInt(time) * this.options.interval;
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
            
            time = parseInt(time / this.options.interval) * this.options.interval;
            this.options.currentTime = time;
            this._init();
        },
        
        _refreshDefaults: function() {
            this.total = this.options.totalTime / this.options.interval; // how many time should the price goes down?
            this.total = parseInt(this.total);
            
            this.stageSize = this.total / this.options.CDchangeTimes; // after how many times should the value of cut donw price goes increase
            this.stageSize = parseInt(this.stageSize);
            
            this.stageDelta = (this.options.maxCutDown - this.options.minCutDown) / this.options.CDchangeTimes;// for cut down price, how many should be increased each time
            this.stageDelta = Number(this.stageDelta.toFixed(2));
        },
        
        _getInitialValue: function() {
            this.times = parseInt(this.options.currentTime / this.options.interval);
            
            this._refreshDefaults();
            return this._getPriceByTime(this.options.currentTime);
        },
        
        _getNextValue: function() {
            return this._getPriceByTime(this.options.currentTime);
        }
    });
})(jQuery);

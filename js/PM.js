$.widget('qbao.auction', {
    options: {
        // status: 0, 
        totalTime: 10800000,
        currentTime: 0,
        // interval: 10000,
        interval: 1000,
        
        // type: 0,
        start: 1000.00,
        // current: 1000.00,
        
        numbers: {
            rootClass: "numbers",
            size: 15, 
            numberH: 50,
            maxNumbers: 10
            // value: "￥56,789.12"        
        }
    },
    
    _formatCurrent: function() {
        var x = this.current;
        console.log(x);
        return "￥" + String(x).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    },
        
    _create: function() {
        this.$number = this.widget().numbers(
            this.options.numbers
        );
    },
    _getInitialValue: $.noop,
    _getNextValue: $.noop,
    
    _init: function() {
        clearTimeout(this.timeout);
        
        if(this.options.currentTime > this.options.totalTime) {
            return;
        }
        
        this.current = this._getInitialValue();
        if(this.current >= 0) {
            this.$number.numbers({
                value: this._formatCurrent()
            });
            this.timeout = this._delay(this._next, this.options.interval);
        }
    },
    
    _next: function() {
        this.current = this._getNextValue();
        
        if(this.current >= 0) {
            this.$number.numbers({
                value: this._formatCurrent()
            });
            
            this.times = this.options.currentTime / this.options.interval;
            //console.log("第 " + (this.times + 1) + " 次降价");
            
            this.options.currentTime += this.options.interval;
            
            if(this.options.currentTime < this.options.totalTime) {
                this.timeout = this._delay(this._next, this.options.interval);
            }
            
        }
    }
});

$.widget('qbao.auctionA', $.qbao.auction, {
    options: {
        cutDown: 0
    },
    
    _getInitialValue: function() {
        var times = this.options.currentTime / this.options.interval;
        return this.options.start - times * this.options.cutDown;
    },
    
    _getNextValue: function() {
        return this.current - this.options.cutDown;
    },
});

$.widget('qbao.auctionB', $.qbao.auction, {
    options: {
        type: 1, // 1 is increse, -1 is decease
        CDchangeTimes: 10, // cut down change times 竞拍递增次数
        maxCutDown: 10,
        minCutDown: 1
    },
    
    _getInitialValue: function() {
        this.total = this.options.totalTime / this.options.interval; // how many time should the price goes down?
        this.x = this.total / this.options.CDchangeTimes; // after how many times should the value of cut donw price goes increase
        this.y = (this.options.maxCutDown - this.options.minCutDown) / this.options.CDchangeTimes;// for cut down price, how many should be increased each time
        this.times = this.options.currentTime / this.options.interval; // how many times since the price goes down
        
        var n = 0;
        for(var i = 0; i < this.times; i++) { // get the total price since it goes down
            var m = parseInt(i / this.x); 
            if(this.options.type == 1) {
                n += this.options.minCutDown + m * this.y;
            } else if(this.options.type == -1) {
                m += 1;//减速下降需要一开始就把  下降数值 减一次
                n += this.options.maxCutDown - m * this.y;
            }
        }
        return this.options.start - n;
    },
    
    _getNextValue: function() {
        this.times = this.options.currentTime / this.options.interval;
        console.log("第 " + (this.times + 1) + " 次降价");
        var z = 0;
        var m = parseInt(this.times / this.x);
        if(this.options.type == 1) {
            z = this.options.minCutDown + m * this.y; 
        } else if(this.options.type == -1) {
            z = this.options.maxCutDown - (m + 1) * this.y; 
        }
        console.log("降价 " +　z　+ " 元");
        return this.current - z;
    },
});

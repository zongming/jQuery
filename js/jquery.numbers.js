(function($) {
    $.widget("qbao.number", {
        options: {
            number: -1,
            symbol: ",",
            numberH: 50,
            speed: 300
        },
        
        _setOption : function(key, value) {
            this._superApply(arguments);
            if(key == "number") {
                this._refresh();
            }
        },
        
        _create : function() {
            this.$number = $('<i class="num"></i>').appendTo(this.widget());
            this.$symbol = $('<em class="symbol"></em>').appendTo(this.widget());
            this._refresh();
        },
        
        showSymbol: function(s) {
            this._showSymbol = true;
            this.options.symbol = s;
            this._refresh();
        },
        
        showNumber: function(n) {
            this._showSymbol = false;
            this.widget().show().removeClass('symbol');
            this.options.number = n;
            this._refresh();
        },
        
        _restoreTo0: function() {
            this._setBackgroundPosition(0);
            
            this._currentNumber = 0;
            this.forAnimate = {n: 0};
        },
        
        // set background-position without animating
        _setBackgroundPosition: function(position) {
            if(this.forAnimate) {
                $(this.forAnimate).stop();
            }
            this.$number.css({
                "background-position" : "0px " + position + "px"
            });
        },
        
        _refresh : function() {
            if(this._showSymbol) {
                this.widget().show().addClass('symbol');
                this.$symbol.text(this.options.symbol);
                
                this._restoreTo0();
            } else {
                this.$number.css({
                    "visibility": this.options.number == -1 ? "hidden": "visible"
                });
                if(this._currentNumber == this.options.number) {
                    return;
                }
                if(this.options.number == 10) { //￥ no need to automate
                    this._setBackgroundPosition(this.options.numberH * -10);
                } else if(this.options.number != -1){ //numbers
                    if(this._currentNumber == -1 || this._currentNumber == 10) {
                        this._restoreTo0();
                    }
                    // var gaps = Math.abs(this.options.number - this._currentNumber);
                    var y0 = this._currentNumber * -this.options.numberH;
                    var y = this.options.number * -this.options.numberH;
                    
                    this.forAnimate = this.forAnimate || { n : y0 };
                    
                    var me = this;
                    $(this.forAnimate).stop()
                        .animate({
                            n : y
                        }, {
                            // duration : gaps * speed,
                            duration : this.options.speed,
                            step : function(now, tween) {
                                me.$number.css({
                                    "background-position" : "0px " + now + "px"
                                });
                            }
                        });
                }
                this._currentNumber = this.options.number;
            }
        }
    });
    
    $.widget("qbao.numbers", {
        options: {
            value: "",
            
            size: 10,
            maxNumbers: 8,
            numberH: 50,
            
            rootClass: "numbers",
            speed: 300
        },
        
        _create: function() {
            this.widget().addClass(this.options.rootClass);
            this._cache = [];
            this._size = this.options.size;
            
            for(var i = 0; i < this._size; i++) {
                this._cache[i] = $('<span></span>').number({
                    numberH: this.options.numberH,
                    speed: this.options.speed
                }).appendTo(this.widget());
            }
            
            this._refresh();
        },
        
        _setOption : function(key, value) {
            this._superApply(arguments);
            if(key == "value") {
                this._refresh();
            }
        },
        
        _refresh: function() {
            var v = this.options.value;
            
            var array = v.split("");
            
            var numbers = 0;
            for(var i = this._cache.length - 1, j = array.length - 1; i >= 0 && j >= 0 ; i--, j--) {
                var n = array[j];
                if(n == "￥") {
                    n = 10;
                }
                if(isNaN(n)) {
                    this._cache[i].number("showSymbol", n);
                    continue;
                } else {
                    n = Number(n);
                    if(this._cache[i]) {
                        this._cache[i].number("showNumber", n);
                    }
                    numbers++;
                }
            }
            
            for(var k = i; k >=0; k--) {
                this._cache[k].number("showNumber", -1);
                if(numbers < this.options.maxNumbers) {
                    numbers++;
                    this._cache[k].show();
                } else {
                    this._cache[k].hide();
                }
            }
        } 
    });
})(jQuery);
(function($) {
    $.widget("qbao.number", {
        current: 0,
        options: {
            number: 0,
            numberH: 50,
            speed: 300
        },
        
        _showSymbol: false,
        
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
            
            this.widget().addClass('symbol');
            this.$symbol.text(s);
            
            this.$number.css({
                "background-position" : "0px 0px"
            });
            this.current = 0;
        },
        
        showNumber: function(n) {
            this._showSymbol = false;
            this.widget().removeClass('symbol');
            this.options.number = n;
            this._refresh();
        },
        
        _refresh : function() {
            if(this._showSymbol) {
                
            } else if(this.current != this.options.number) {
                if(this.options.number == -1) { // nothing
                    this.$number.css({
                        "background-position" : "0px 0px",
                        "visibility": "hidden"
                    });
                } else if(this.options.number == 10) { //￥ no need to automate
                    this.$number.css({
                        "background-position" : "0px " + this.options.numberH * -10 + "px",
                        "visibility": "visible"
                    });
                } else { //numbers
                    if(this.current == -1) {
                        this.current = 0;
                    }
                    this.$number.css({
                        "visibility": "visible"
                    });
                    // var gaps = Math.abs(this.options.number - this.current);
                    var y0 = this.current * -this.options.numberH;
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
            }
                
            this.current = this.options.number;
        }
    });
    
    $.widget("qbao.numbers", {
        options: {
            value: "1234567",
            
            rootClass: "numbers",
            numberH: 50,
            speed: 300
        },
        
        _create: function() {
            this.widget().addClass("numbers");
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
            
            for(var i = this._cache.length - 1, j = array.length - 1; i >= 0 && j >= 0 ; i--, j--) {
                var n = array[j];
                if(typeof(n) == "string") {
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
                    }
                }
                
            }
            
            for(var k = i; k >=0; k--) {
                this._cache[k].number("showNumber", -1);
            }
        } 
    });
})(jQuery);
(function($) {
    $.widget("qbao.number", {
        current: 0,
        options: {
            number: 0
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
            this.$symbol = $('<em class="comma"></em>').appendTo(this.widget());
            this._refresh();
        },
        
        showSymbol: function(s) {
            this._showSymbol = true;
            
            this.widget().addClass('comma');
            this.$symbol.text(s);
            
            this.$number.css({
                "background-position" : "0px 0px"
            });
            this.current = 0;
        },
        
        showNumber: function(n) {
            this._showSymbol = false;
            this.widget().removeClass('comma');
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
                        "background-position" : "0px -500px",
                        "visibility": "visible"
                    });
                } else { //numbers
                    if(this.current == -1) {
                        this.current = 0;
                    }
                    this.$number.css({
                        "visibility": "visible"
                    });
                    var gaps = Math.abs(this.options.number - this.current);
                    var speed = 100;
                    var y0 = this.current * -50;
                    var y = this.options.number * -50;
                    
                    this.forAnimate = this.forAnimate || { n : y0 };
                    
                    var me = this;
                    $(this.forAnimate).stop()
                        .animate({
                            n : y
                        }, {
                            duration : gaps * speed,
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
            value: "1234567"
        },
        cache: [],
        _size: 0,
        
        _create: function() {
            this._size = this.options.size;
            
            for(var i = 0; i < this._size; i++) {
                this.cache[i] = $('<span></span>').number().appendTo(this.widget());
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
            
            for(var i = this.cache.length - 1, j = array.length - 1; i >= 0 && j >= 0 ; i--, j--) {
                var n = array[j];
                if(typeof(n) == "string") {
                    if(n == "￥") {
                        n = 10;
                    }
                    if(isNaN(n)) {
                        this.cache[i].number("showSymbol", n);
                        continue;
                    } else {
                        n = Number(n);
                        if(this.cache[i]) {
                            this.cache[i].number("showNumber", n);
                        }
                    }
                }
                
            }
            
            for(var k = i; k >=0; k--) {
                this.cache[k].number("showNumber", -1);
            }
        } 
    });
})(jQuery);
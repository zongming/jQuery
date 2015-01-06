(function($) {
    $.widget("qbao.number", {
        options: {
            number: -1,
            numberH: 10,
            speed: 300,
            offset: 0
        },
        
        _create : function() {
            this.widget().addClass("number");
            this.$number = $('<span class="num"></span>').appendTo(this.widget());
            var str = "";
            for(var i = 0; i < 10; i++) {
                str += "<span class='item'>" + i + "</span>";
            }
            $(str).appendTo(this.$number);
            
            this.$symbol = $('<span class="symbol"></span>').appendTo(this.widget());
            
            this.widget().find('.num').height(this.options.numberH);
            this.widget().find('.item').height(this.options.numberH);
            this._refresh();
        },
        
        showSymbol: function(s) {
            this._showSymbol = true;
            this.symbol = s;
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
            this.$number.find('span:first').css({
                "margin-top" : this.options.offset
            });
        },
        
        _refresh : function() {
            if(this._showSymbol) {
                this.widget().show().addClass('symbol');
                this.$symbol.text(this.symbol);
                
                this._restoreTo0();
            } else {
                if(this._currentNumber == this.options.number) {
                    return;
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
                            me.$number.find('span:first').css({
                                "margin-top" : me.options.offset + now + "px"
                            });
                        }
                    });
            }
            this._currentNumber = this.options.number;
    }
    });
    
    $.widget("qbao.numbers", {
        options: {
            value: "",
            numberH: 50,
            speed: 300,
            numberOffset: 1
        },
        
        _create: function() {
            this.widget().addClass(this.options.rootClass);
            this._cache = [];
            this._refresh();
        },
        
        _createNumber: function() {
            return $('<span></span>').number({
                numberH: this.options.numberH,
                speed: this.options.speed,
                offset: this.options.numberOffset
            }).prependTo(this.widget());
        },
        
        setValue: function(v) {
            this.options.value = v;
            this._refresh();
        },
        
        _refresh: function() {
            var v = this.options.value;
            
            var array = v.split("");
            
            if(this._cache.length <= array.length) {
                var x = array.length - this._cache.length;
                for(var i = 0; i < x; i++) {
                    var n = this._createNumber();
                    this._cache.splice(0, 0, n);
                }
            } else {
                var y = this._cache.length - array.length;
                var items = this._cache.splice(0, y);
                $.each(items, function(i, it) {
                    it.remove();
                });
            }
        
            for(var i = this._cache.length - 1; i >= 0; i--) {
                var n = array[i];
                if(isNaN(n)) {
                    this._cache[i].number("showSymbol", n);
                } else {
                    n = Number(n);
                    if(this._cache[i]) {
                        this._cache[i].number("showNumber", n);
                    }
                }
            }
        } 
    });
})(jQuery);
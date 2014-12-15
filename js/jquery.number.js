(function($) {
    $.widget("qbao.number", {
        current : 0,
        options : {
            number : 0
        },
        
        _setOption : function(key, value) {
            this._superApply(arguments);
            if(key == "number") {
                this._refresh();
            }
        },
        
        _create : function() {
            this.widget().addClass("num");
            this._refresh();
        },
        
        _refresh : function() {
            if(this.current != this.options.number) {
                var gaps = Math.abs(this.options.number - this.current);
                var speed = 400;
                var y0 = this.current * -68 + 2;
                var y = this.options.number * -68 + 2;
                
                var widget = this.widget();
                
                this.forAnimate = this.forAnimate || { n : y0 };
                $(this.forAnimate).stop().animate({
                        n : y
                    }, {
                        duration : gaps * speed,
                        step : function(now, tween) {
                            widget.css({
                                "background-position" : "0px " + now + "px"
                            });                        }
                    });
                
                // these are not working in firefox, 
                // "background-position" can't be animated, "background-position-y" can be animated but not work in firefox
                
                // this.widget().stop().animate({                    // "background-position-y" : y + "px"                // }, {                    // duration : n * speed,
                    // done : function() {
                        // this.widget() 
                            // .css({
                                // "background-position" : "0px " + y + "px" 
                            // });
                    // }                // });                this.current = this.options.number;
            }
        }
    });
    
    $.widget("qbao.numbers", {
        options: {
            size: 7,
            value: "1234567",
        },
        cache: [],
        
        _create: function() {
            for(var i = 0; i < this.options.size; i++) {
                console.log(i);
                this.cache[i] = $('<i></i>').number().appendTo(this.widget());
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
            
            var me = this;
            $.each(v.split(""), function(i, n) {
                if(me.cache[i]) {
                    me.cache[i].number({number: Number(n)});
                }
            });
        } 
    });
})(jQuery);
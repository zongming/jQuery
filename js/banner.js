(function($) {
    $.widget('qbao.banner', {
        options: {
            imgSelector: 'img',
            width: 1000,
            height: 200,
            autoPlay: {
                enabled: true,
                interval: 5000
            },
            fadeDuration: 1000
        },
        
        current: 0,
        size: 0,
        items: undefined,
        
        getItems: function() {
            this.items = this.items || this.widget().find('li');
            return this.items;
        },
        
        _create: function() {
            this.items = this.getItems();
            this.size = this.items.size();
            this.widget().css({
                position: "relative",
                width: this.options.width,
                height: this.options.height
            });
            this.items.css({
                position: "absolute",
                top: 0,
                left: 0
            });
            this.items.find(this.options.imgSelector).css({
                width: this.options.width,
                height: this.options.height
            });
            this.items.filter(':gt(0)').hide();
            this.items.eq(0).show();
            
            
            if(this.options.autoPlay.enabled) {
                var me = this;
                setInterval(function() {
                    me.next();
                }, this.options.autoPlay.interval);
            }
        },
        
        next: function() {
            var c = this.current;
            var t = (c + 1) % this.size;
            
            this._swap(c, t);
        },
        
        prev: function() {
            var c = this.current;
            var t = (c - 1) % this.size;
            
            this._swap(c, t);
        },
        
        _swap: function(c, t) {
            var me = this;
            
            me.items.eq(t).show();
            
            $({ n : 0 }).stop().animate({
                n : 1
            }, {
                duration : me.options.fadeDuration,
                step : function(now, tween) {
                    me.items.eq(c).css({
                        opacity: 1 - now
                    });
                    me.items.eq(t).css({
                        opacity: now
                    });
                },
                complete: function() {
                    me.current = t;
                    me.items.eq(c).hide();
                }
            });
        }
        
    });
})(jQuery);

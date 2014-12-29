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
            fadeDuration: 500
        },
        
        getItems: function() {
            this.items = this.items || this.widget().find('li');
            return this.items;
        },
        
        _create: function() {
            this.current = 0;
            
            
            this.items = this.getItems();
            this.size = this.items.size();
            this.widget().addClass('q-banner').css({
                width: this.options.width,
                height: this.options.height
            });
            this.items.addClass('q-banner-item');
            
            this.items.find(this.options.imgSelector).addClass('q-banner-img');
            this.items.eq(0).show();
            this.items.filter(':gt(0)').hide();
            
            var me = this;
            this.widget().find('.next').on('click', function() {
                me.next();
            });
            
            this.widget().find('.prev').on('click', function() {
                me.prev();
            });
            
            this._refreshAutoPlay();
        },
        
        next: function() {
            if(!this._animating) {
                var c = this.current;
                var t = (c + 1) % this.size;
                
                this._swap(c, t);
                
                this._refreshAutoPlay();
            }
        },
        
        prev: function() {
            if(!this._animating) {
                var c = this.current;
                var t = (c - 1) % this.size;
                
                this._swap(c, t);
                this._refreshAutoPlay();
            }
        },
        
        _refreshAutoPlay: function() {
            if(this.options.autoPlay.enabled) {
                clearTimeout(this.f);
                var me = this;
                this.f = setTimeout(function() {
                    me.next();
                }, this.options.autoPlay.interval);
            }
        },
        
        _swap: function(c, t) {
            var me = this;
            
            me.items.eq(t).show();
            me._animating = true;
            
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
                    me._animating = false;
                }
            });
        }
        
    });
})(jQuery);

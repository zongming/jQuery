(function($) {
    $.widget('qbao.timeline', {
        options: {
            max: 8,
            data: []
        },
        
        _create: function() {
            this.size = this.options.data.length;
            this.current = 0;
            
            this.element.addClass('timeline');
            this.$prev = $('<a href="javascript:void(0)" class="nav nav-prev"></a>').appendTo(this.element);
            this.$next = $('<a href="javascript:void(0)" class="nav nav-next"></a>').appendTo(this.element);
            this.$list = $('<ul class="list"></ul>');
            $('<div class="scroll"></div>').append(this.$list).appendTo(this.element);
            
            var me = this;
            this.$prev.on('click', function() {
                me._prev();
            });
            this.$next.on('click', function() {
                me._next();
            });
            
            $.each(this.options.data, function(index, item) {
                var $li = $('<li class="item"><a class="link" href="' + item.url + '"><em class="time">' 
                    + item.title + '</em><span class="label">'
                    + item.label + '</span></a><i></i></li>');
                $li.toggleClass('item-new', !!item.isNew);
                $li.appendTo(me.$list);
            });
        },
        
        _init: function() {
            this.$items = this.element.find('.item');
        },
        
        _prev: function() {
            var i = this.current - 1;
            if(i >= 0 && i + this.options.max - 1 < this.size) {
                this.current = i;
                this._scrollToIndex(i);
            }
        },
        
        _next: function() {
            var i = this.current + 1;
            if(i >= 0 && i + this.options.max - 1 < this.size) {
                this.current = i;
                this._scrollToIndex(i);
            }
        },
        
        _scrollToIndex: function(index) {
            var p = this.$items.eq(index).position();
            if(p) {
                this.$list.animate({left: -p.left + 'px'}, 400);
            }
            this.$prev.toggle(index != 0);
            this.$next.toggle(index != this.size - this.options.max);
        }
    });
})(jQuery);

(function($) {
    $.widget('qbao.timeline', {
        options: {
            dateType: 0, //0: today, -1: before today, 1: after today
            data: [],
            selectedTime: '',
            currentTime: ''
        },
        
        _create: function() {
            this.dateDisplayed = 8;
            this.size = this.options.data.length;
            
            this.element.addClass('timeline');
            this.$prev = $('<a href="javascript:;" class="nav nav-prev"></a>').appendTo(this.element);
            this.$next = $('<a href="javascript:;" class="nav nav-next"></a>').appendTo(this.element);
            this.$list = $('<ul class="list"></ul>');
            $('<div class="scroll"></div>').append(this.$list).appendTo(this.element);
            
            var me = this;
            this.$prev.on('click', function() {
                me._prev();
            });
            this.$next.on('click', function() {
                me._next();
            });
            
            this.element.on('click', '.link', function(e) {
                me.element.find('.link').removeClass('link-selected');
                var $li = $(e.currentTarget).parents('li');
                $li.find('.link').addClass('link-selected');
            });
        },
        
        _init: function() {
            this.currentIndex = 0;
            
            var me = this;
            this.$list.empty();
            $.each(this.options.data, function(index, item) {
                var $li = $('<li class="item"><a class="link" href="' + item.url + '"><em class="time">' 
                    + item.time + '</em><span class="label">'
                    + item.label + '</span></a><i></i></li>');
                $li.data('data', item);
                $li.appendTo(me.$list);
            });
            
            this.$items = this.element.find('.item');
            
            $.each(this.options.data, function(i, item) {
                if(me.options.selectedTime && item.time === me.options.selectedTime) {
                    me.selectedIndex = i;
                }
                if(me.options.currentTime && item.time === me.options.currentTime) {
                    me.currentTimeIndex = i;
                }
            });
            if(this.options.dateType == -1) {
                me.currentTimeIndex = 1000;
            } else if(this.options.dateType == 1) {
                me.currentTimeIndex = -1;
            }
            
            if(this.currentTimeIndex) {
                this.$items.each(function(index, li) {
                    var $li = $(li);
                    if(index > me.currentTimeIndex) {
                        $li.addClass('item-next');
                    } else if(me.currentTimeIndex == index) {
                        $li.addClass('item-now');
                    } else {
                        $li.addClass('item-prev');
                    }
                });
            }
            if(!isNaN(this.selectedIndex)) {
                var a = this.selectedIndex - 4;
                var b = this.selectedIndex + 3;
                if(a < 0) {
                    this.currentIndex = 0;
                } else {
                    this.currentIndex = a;
                }
                if(b > this.size - 1) {
                    this.currentIndex = this.size - this.dateDisplayed;
                }
                this.$items.eq(this.selectedIndex).find('.link').addClass('link-selected');
            }

            this._scrollToIndex(this.currentIndex, true);
        },
        
        _prev: function() {
            var i = this.currentIndex - 1;
            if(i >= 0 && i + this.dateDisplayed - 1 < this.size) {
                this.currentIndex = i;
                this._scrollToIndex(i);
            }
        },
        
        _next: function() {
            var i = this.currentIndex + 1;
            if(i >= 0 && i + this.dateDisplayed - 1 < this.size) {
                this.currentIndex = i;
                this._scrollToIndex(i);
            }
        },
        
        _scrollToIndex: function(index, noAnimation) {
            var p = this.$items.eq(index).position();
            if(p) {
                this.$list.animate({left: -p.left + 'px'}, noAnimation ? 0: 400);
            }
            this.$prev.toggle(index != 0);
            this.$next.toggle(index + this.dateDisplayed < this.size);
        }
    });
})(jQuery);

(function($) {
    $.widget('qbao.timelineitem', {
        options: {
            time: "",
            selected: false
        },
        
        _create : function() {
            var options = this.options;
            
            this.element.addClass('default');
            
            this.$item = $('<div class="default"><p class="tag"><span class="time">' + options.time + '</span><span class="label">' 
                             + options.label + '</span></p><span class="circle"></span></div>')
                             .appendTo(this.element);
            this.$selected = $('<div class="selected"><p class="tag"><span class="time">' + options.time + '</span><span class="label">' 
                             + options.label + '</span><span class="pointer"></span></p><span class="circle"></span></div>')
                             .appendTo(this.element);
            this.$hover = $('<div class="hover"><p class="tag"><span class="time">' + options.time 
                             + '</span><span class="pointer"></span></p><span class="circle"></span><span class="label">' 
                             + options.label + '</span></div>')
                             .appendTo(this.element);
        },
        
        _init: function() {
            this.selected = this.options.selected;    
        },
        
        setSelected: function(b) {
            this.selected = b;
            this.element.removeClass('hover').toggleClass('selected', b);      
        },
        
        isSelected: function() {
            return !!this.selected;
        }
    });

    $.widget('qbao.timeline1', {
        options : {
            data : [],
            currentTime : ''
        },

        _create : function() {
            this.$ul = $('<ul></ul>').appendTo(this.element);
            
            var me = this;
            $.each(this.options.data, function(index, item) {
                $('<li></li>').timelineitem(item).appendTo(me.$ul);
            });

            this.$lists = this.element.find('li');
            
            this.element.on('mouseenter', ':qbao-timelineitem', function(e) {
                var $this = $(this);
                if(!$this.timelineitem('isSelected')) {
                    $(this).addClass('hover');
                }
            })
            .on('mouseleave', ':qbao-timelineitem', function(e) {
                var $this = $(this);
                if(!$this.timelineitem('isSelected')) {
                    $(this).removeClass('hover');
                }
            });
            
            this.element.on('click', ':qbao-timelineitem', function(e) {
                me._trigger('clickitem', e, $(this).timelineitem('option'));
                var index = me.$lists.index(this);
                me.setSelectedIndex(index);
            });
            
            this._createEnd();
        },
        
        _createEnd: function() {
            var end = this.options.end;
            if(end) {
                var me = this;
                this.$end = $('<p class="end">' + end.label + '</p>').appendTo(this.element)
                    .on('click', function() {
                        me._trigger('clickitem', null, end);
                    });
            }
        },
        
        _init: function() {
            this.size = this.options.data.length;
        },
        
        // only show 8 items if more than 8
        refresh: function(noAnimate) {
            var index = 0;
            
            if(this.size > 8) {
                if(!isNaN(this.selectedIndex)) {// 3 before, 4 after
                    var s = this.selectedIndex - 3;
                    s = Math.max(s, 0);
                    
                    var e = s + 7;
                    while(s + 7 > this.size - 1) {
                        s--;                       
                    }
                    
                    index = s;
                }
                
                var me = this;
                this.$lists.each(function(i) {
                    var show = i >= index && i < index + 8;
                    if(noAnimate) {
                       $(this).toggle(show);                 
                    } else {
                        if(show) {
                            $(this).show(400);
                        } else {
                            $(this).hide(400);
                        }
                    }
                });
            }
        },

        setSelectedIndex : function(index) {
            if(index === -1) {
                index = this.size.length - 1;
            }
            if(this.selectedIndex === index) {
                return;
            }
            this.$lists.each(function(i) {
                $(this).timelineitem('setSelected', index === i);
            });
            
            this.selectedIndex = index;
        },
        
        setSelectedTime: function(time) {
            var me = this;
            this.$lists.each(function(i) {
                if($(this).timelineitem('option', 'time') === time) {
                    me.setSelectedIndex(i);
                    return false;
                }
            });
        }
    });
})(jQuery);

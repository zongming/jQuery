(function($) {
    $.widget('qbao.timelineitem', {
        options: {
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
                me.setCurrent(index);
            });
        },

        setCurrent : function(index) {
            this.$lists.each(function(i, item) {
                $(item).timelineitem('setSelected', index === i);
            });
        }
    });
})(jQuery);

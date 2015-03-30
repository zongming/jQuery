(function($) {
    function format(number) {
        return number;
    }
    
    $.widget('qbao.timecounter', {
        options : {
            time : 10000,   // second
            interval : 1000, // ms
            started : true,
            trim: true,
            unit: {
                d: "天",
                h: "小时",
                m: "分",
                s: "秒"
            },
            format: {
                d: format,
                h: format,
                m: format,
                s: format
            },
            isAdd: false
        },

        _create : function() {
            this.element.addClass('timecounter');
            
            this.element.append(
                $('<span class="d"><em></em>' + this.options.unit.d + '</span><span class="h"><em></em>' + this.options.unit.h + '</span>' 
                + '<span class="m"><em></em>' + this.options.unit.m + '</span><span class="s"><em></em>' + this.options.unit.s + '</span>')
            );

            this.$d = this.element.find('.d');
            this.$h = this.element.find('.h');
            this.$m = this.element.find('.m');
            this.$s = this.element.find('.s');
        },

        _init : function() {
            clearTimeout(this.timeout);
            
            this.time = this.options.time;
            this.started = this.options.started;

            if (this.started) {
                this._refresh();
            }
        },

        _refresh : function() {
            if(this.time < 0) {
                this.time = 0;
                return;
            }
            
            var day = Math.floor(this.time / 86400);
            var hour = Math.floor(this.time % 86400 / 3600);
            var minute = Math.floor(this.time % 3600 / 60);
            var second = this.time % 60;
            
            if(this.options.trim) {
                this.$d.toggle(day > 0);
                // this.$h.toggle(hour > 0);
                // this.$m.toggle(minute > 0);
            }
            
            this.$d.find('em').text(this.options.format.d(day));
            this.$h.find('em').text(this.options.format.h(hour));
            this.$m.find('em').text(this.options.format.m(minute));
            this.$s.find('em').text(this.options.format.s(second));
            
            if(this.started) {
                this.timeout = setTimeout($.proxy(this._refresh, this), this.options.interval);
                if(this.options.isAdd) {
                    this.time += this.options.interval / 1000;
                } else {
                    this.time -= this.options.interval / 1000;
                }
            }
        },

        start : function() {
            if(!this.started) {
                this.started = true;
                this._refresh();
            }
        },

        stop : function() {
            if(this.started) {
                this.started = false;
                clearTimeout(this.timeout);
            }
        },

        setTime : function(time) {
            clearTimeout(this.timeout);
            this.time = time;
            
            this._refresh();
        },
        
        destroy: function() {
            this.stop();
        }
    });
})(jQuery); 
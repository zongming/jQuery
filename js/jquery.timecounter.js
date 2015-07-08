(function($) {
    function format(number) {
        var ret = String(number);
        if(number < 10) {
            ret = "0" + number;
        }
        return ret;
    }
    
    $.widget('qbao.timecounter', {
        options : {
            time : 10000000,   // millisecond
            interval : 1000, // ms
            started : true,
            trim: false,
            unit: {
                d: "天",
                h: "时",
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
            }
            if (this.time == 0) {
                this._trigger('timeout');
                this.stop();
            }
            
            var t = (this.time / 1000).toFixed(0),
                day = Math.floor(t / 86400),
                hour = Math.floor(t % 86400 / 3600),
                minute = Math.floor(t % 3600 / 60),
                second = t % 60;
            
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
                    this.time += this.options.interval;
                } else {
                    this.time -= this.options.interval;
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
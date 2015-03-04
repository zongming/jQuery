(function($) {
    $.widget('qbao.timecounter', {
        options : {
            time : 10000,   // second
            interval : 1000, // ms
            started : true,
            trim: true
        },

        _create : function() {
            this.element.addClass('timecounter');
            
            this.$p = $('<span><span class="d"><em></em>天</span><span class="h"><em></em>小时</span>' 
                      + '<span class="m"><em></em>分</span><span class="s"><em></em>秒</span></span>');

            this.$d = this.$p.find('.d');
            this.$h = this.$p.find('.h');
            this.$m = this.$p.find('.m');
            this.$s = this.$p.find('.s');

            this.element.append(this.$p);
        },

        _init : function() {
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
            
            this.$d.find('em').text(day);
            this.$h.find('em').text(hour);
            this.$m.find('em').text(minute);
            this.$s.find('em').text(second);
            
            if(this.started) {
                this.timeout = setTimeout($.proxy(this._refresh, this), this.options.interval);
                this.time -= this.options.interval / 1000;
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
        }
    });
})(jQuery); 
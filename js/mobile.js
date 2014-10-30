$.fn.progress = function(total, interval) {
    var $p = this.find('.progress');
    var $l = this.find('.label');
    
    var d = $.Deferred();
    
    interval = interval || 1000;
    var current = total;
    
    var stepFunction = function() {
        $l.text(current / 1000 + " 秒");
        var w;
        if(total == 0) {
            w = 1;
        } else {
            w = (total - current) / total;
        }
        $p.css("width", w * 100 + "%");
        current -= interval;
        if(current < 0) {
            d.resolve();
            if(!a) {
                return;
            }
            clearInterval(a);
        }
        return stepFunction;
    };
    
    var a = setInterval(stepFunction(), interval);
    return d.promise();
};

$.fn.center = function() {
    var windowWidth = document.documentElement.clientWidth;
    var windowHeight = document.documentElement.clientHeight;
    var popupHeight = this.height();
    var popupWidth = this.width();
    this.css({
        "position" : "absolute",
        "top" : (windowHeight - popupHeight) / 2 + $(document).scrollTop(),
        "left" : (windowWidth - popupWidth) / 2
    });
    return this;
};

$.fn.popup = function() {
    this.show().center();
    this.data("showing", true);
    var me = this;
    $(window).scroll(function() {
        if(me.data("showing")) {
            me.center();
        }
    });
    $(window).resize(function() {
        if(me.data("showing")) {
            me.center();
        }
    });
    var shadow = $('.user_shadow');
    if(shadow.length == 0) {
        shadow = $("<div class='user_shadow'></div>").appendTo(this.parent());
    }
    shadow.show();
    
    return this;
};

$.fn.close = function() {
    this.data("showing", false);
    this.hide();
    $('.user_shadow').hide();
    return this;
};

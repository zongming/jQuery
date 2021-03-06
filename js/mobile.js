$.fn.extend({
    progress : function(total, interval) {
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
    },
    
    center : function() {
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
    },
    
    popup : function() {
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
    },
    
    close : function() {
        this.data("showing", false);
        this.hide();
        $('.user_shadow').hide();
        return this;
    }
});

// 签到排序
(function() {
    var orders = [], $c, $t, topLeftX, topLeftY, startX, startY, currentX, currentY, startPosX, startPosY, cols, boxW, boxH, margin, getAbsolutePosition,
    
    handlers = {
        touchstart : function(e) {
            getAbsolutePosition();
            
            $c = $(this);
            
            if(e.type == "touchstart") {
                var ts = e.originalEvent.touches[0];
                
                startX = ts.pageX;
                startY = ts.pageY;
            } else if(e.type == "mousedown") {
                startX = e.pageX;
                startY = e.pageY;
            }
            
            var p = $c.position();
            startPosX = p.left;
            startPosY = p.top;
        },
        touchmove : function(e) {
            if(e.type == "touchmove") {
                var ts = e.originalEvent.touches[0];
                
                currentX = ts.pageX;
                currentY = ts.pageY;
            } else if(e.type == "mousemove") {
                if(!$c) {
                    return;
                } else {
                    currentX = e.pageX;
                    currentY = e.pageY;
                }
            }
            var offsetX = currentX - startX;
            var offsetY = currentY - startY;

            $c.css({
                position : "absolute",
                left : startPosX + offsetX,
                top : startPosY + offsetY,
                opacity: 0.5,
                zIndex : 1
            });
        },
        
        touchend : function(e) {
            if(!$c) {
                return;
            }
            $c.css({
                opacity: 1,
                zIndex : 0
            });
            
            if(e.type == "mouseup" && !$c) {
                return;
            }
            var x = currentX - topLeftX, y = currentY - topLeftY;
            
            $(".ddBox").each(function(index, element) {
                var p = $(element).data("position");
                if(x > p.left && x < p.left + boxW && y > p.top && y < p.top + boxH) {
                    $t = $(element);
                    return false;
                }
            });
            
            swap();
            
            $c = null;
            $t = null;
            
            $(".ddBox").each(function(index, element) {
                var p = $(element).data("position");
                $(element).css({
                    top: p.top,
                    left: p.left
                });
            });
        }
    };

    function swap() {
        var n1 = $c.data("number");
        var n2;
        if (!$t || n1 == (n2 = $t.data("number"))) {
            $c.css({
                left: startPosX,
                top: startPosY
            });
            return;
        }
        
        var i = $.inArray(n1, orders);
        var j = $.inArray(n2, orders);
        
        orders[i] = n2;
        orders[j] = n1;
                
        // orders
        var p1 = $c.data("position");
        var p2 = $t.data("position");
        
        $c.data("position", p2);
        $t.data("position", p1);
    }
    
    function findRelativePosition(index) {
        var i = Math.floor(index / cols);
        var j = index % cols;
        return {
            top : i * boxH + (i + 1) * margin,
            left : j * boxW + j * margin
        };
    }
    
    window.mbox = 
        function(rowNumber, colNumber, boxWidth, boxHeight, boxMargin) {
            margin = boxMargin || 10;
            cols = colNumber || 3;
            boxW = boxWidth || 100;
            boxH = boxHeight || 100;
            this.css({
                position : "relative",
                width: cols * boxW + rowNumber * margin,
                height: rowNumber * boxH + (rowNumber + 1) * margin,
                margin: "0 auto"
            });
            
            this.find(".ddBox").each(function(index, element) {
                $(element).data("number", index + 1);
                orders.push(index + 1);
                
                var p = findRelativePosition(index);
                $(element).css({
                    width: boxWidth + "px",
                    height: boxHeight + "px",
                    position : "absolute",
                    top : p.top,
                    left : p.left
                });
                
                $(element).data("position", p);
                $(element).on("touchstart mousedown", handlers.touchstart);
                $(element).on("touchmove mousemove", handlers.touchmove);
                $(element).on("touchend mouseup", handlers.touchend);
            });
            
            var that = this;
            getAbsolutePosition = function() {
                var child = that.find('.ddBox').filter(function(index, element) {
                    return $(element).data("number") == orders[0];
                });
                topLeftX = child.offset().left;
                topLeftY = child.offset().top;
            };
            
            this.data("orders", orders);
        };
})();



$(function() {
    var x = 0, y = 0;
    var $imgs = $('img');
    $imgs.each(function(index, element) {
        $(element).data('number', index);

        if (index == 0) {

        } else if (index < 4) {
            x += 170;
        } else if (index == 4) {
            y += 170;
        } else if (index == 5) {
            y += 170;
        } else if (index < 9) {
            x -= 170;
        } else if (index == 9) {
            y -= 170;
        }
        $(element).css({
            top : y,
            left : x
        });
    });
});

$(function() {
    var d;
    var $imgs = $('img');
    var loopFun, now, loop, ending, target, 
        loops = [{
            start : 0,
            end : 4,
            interval : 500
        }, {
            start : 5,
            end : 29,
            interval : 100
        }];
    
    function start(t) {
        d = new $.Deferred();
        
        target = t % 10;
        ending = false;
        loop = 0;
        now = 0;
        
        clearInterval(loopFun);
        // loopFun = setInterval(next, loops[loop].interval, loops[loop].start, loops[loop].end); not work in IE789
        // loopFun = setInterval(next.bind(null, loops[loop].start, loops[loop].end), loops[loop].interval); not work in IE78
        loopFun = setInterval($.proxy(next, null, loops[loop].start, loops[loop].end), loops[loop].interval);
        
        return d.promise();
    }
    
    function end() {
        return d.resolve();
    }

    function next(x, y) {
        if ((now >= x && now <= y) || ending) {
            $imgs.removeClass('curr');

            current = now % 10;
            now++;
            $imgs.eq(current).addClass('curr');

            if (ending && current == target) {
                ending = false;
                clearInterval(loopFun);
                end();
            }
        } else {
            loop++;
            clearInterval(loopFun);
            if (loop < loops.length) {
                loopFun = setInterval($.proxy(next, null, loops[loop].start, loops[loop].end), loops[loop].interval);
            } else {
                ending = true;
                clearInterval(loopFun);
                loopFun = setInterval($.proxy(next, null, -1, -1), 500);
            }
        }
    }
    
    window.start = start;

    start(5).done(function() {
        console.log("done!!! " + current);
    });
    
    $.error("please call start(5) to start the game");
});


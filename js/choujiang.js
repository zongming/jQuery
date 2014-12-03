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
    var $imgs = $('img'), count = $imgs.size();
    var deffer, loopFun, step, loop, ending, target, running,
        loops = [
                    // { start : 0, end : 4, interval : 400 }, 
                    // { start : 5, end : 29, interval : 100 }
                ];
        // loops = [
            // { start : 0, end : 0, interval : 1000 }, 
            // { start : 1, end : 1, interval : 800 },
            // { start : 2, end : 2, interval : 600 },
            // { start : 3, end : 3, interval : 400 },
            // { start : 4, end : 4, interval : 200 },
            // { start : 5, end : 29, interval : 100 }
        // ];
    
    function start(t) {
        if(running) {
            return $.Deferred().reject("not ready");
        }
        deffer = $.Deferred();
        running = true;
        
        target = t;
        
        step = -1;
        loop = -1;
        next(0, 0);
        
        return deffer.promise();
    }
    
    function stop() {
        running = false;
        ending = false;
        clearInterval(loopFun);
        return deffer.resolve(current);
    }

    function next(start, end) {
        if (ending || (step >= start && step <= end)) {
            $imgs.removeClass('curr');

            current = step % count;
            $imgs.eq(current).addClass('curr');
            step++;

            if (ending && current == target) {
                stop();
            }
        } else {
            loop++;
            if(step == -1) {
                step = 0;
            }
            clearInterval(loopFun);
            if (loop < loops.length) {
                // loopFun = setInterval(next, loops[loop].interval, loops[loop].start, loops[loop].end); not work in IE789
                // loopFun = setInterval(next.bind(null, loops[loop].start, loops[loop].end), loops[loop].interval); not work in IE78
                loopFun = setInterval($.proxy(next(loops[loop].start, loops[loop].end), null, loops[loop].start, loops[loop].end), loops[loop].interval);
            } else {
                ending = true;
                loopFun = setInterval($.proxy(next(), null), 400);
            }
        }
        return next;
    }
    
    window.startCJ = function(t) {
        start(t)
            .done(function(a) {
                var n = 0;
                var loop = setInterval(function() {
                    n++;
                    if(n < 7) {
                        $imgs.eq(a).toggleClass('curr');
                    } else {
                        clearInterval(loop);
                    }
                }, 300);
            })
            .fail(function(error) {
                alert(error);
            });
    };
    
    window.startCJ(8);
});


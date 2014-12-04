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
    var deffer, running, current,
        endingPoint = 0, 
        middle = 100,
        starts = [400, 300, 200, 100],
        ends = [100, 200, 300, 400],
        minSteps = 30;
    
    function start() {
        if(running) {
            return $.Deferred().reject("not ready");
        }
        deffer = $.Deferred();
        running = true;
        ending = false;
        
        next(0);
        
        return deffer.promise();
    }
    
    function stop(t) {
        endingPoint = (t + count - ends.length) % count; 
        ending = true;
        return deffer.resolve(current);
    }

    function next(step) {
        $imgs.removeClass('curr');

        current = step % count;
        $imgs.eq(current).addClass('curr');
        
        if(step < starts.length) {
            setTimeout($.proxy(next, null, step + 1), starts[step]);
        } else if(ending) {
            if(step % count == endingPoint ) {
                var i = step % count - endingPoint;
                if(i < ends.length) {
                    interval = ends[i];
                } else {
                    return;
                }
            } else {
                interval = middle;
            }
            setTimeout($.proxy(next, null, step + 1), interval);
        } else {
            setTimeout($.proxy(next, null, step + 1), middle);
        }
    }
    
    window.stopCJ = function(t) {
        stop(t);
    };
    
    window.startCJ = function() {
        start()
            .done(function(a) {
                var n = 0;
                var loop = setInterval(function() {
                    n++;
                    if(n < 7) {
                        $imgs.eq(a).toggleClass('curr');
                    } else {
                        clearInterval(loop);
                        alert(a);
                    }
                }, 300);
            })
            .fail(function(error) {
                alert(error);
            });
    };
    
    window.startCJ();
});


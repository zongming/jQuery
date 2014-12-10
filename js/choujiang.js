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
    var deffer, running, current, target,
        ending = false,
        endingPoint = -1, 
        starts = [500, 400, 300, 200, 100],
        middle = 100,
        ends = [100, 200, 300, 400, 500],
        minSteps = 30;
    
    function start() {
        if(running) {
            return $.Deferred().reject("not ready");
        }
        deffer = $.Deferred();
        running = true;
        ending = false;
        endingPoint = -1;
        target = -1;
        
        next(0);
        
        return deffer.promise();
    }
    
    function stop(t) {
        target = t;
        endingPoint = (t + count - ends.length - 1) % count; 
    }

    var endingIndex = 0;
    function next(step) {
        $imgs.removeClass('curr');

        current = step % count;
        $imgs.eq(current).addClass('curr');
        
        var interval; // next step interval
        
        if(step < starts.length) {
            interval = starts[step];
        } else if(endingPoint >= 0) {
            if(step < minSteps) {
                interval = middle;
            } else {
                var i, interval;
                if(!ending && current == endingPoint) {
                    ending = true;
                    endingIndex = 0;
                    interval = ends[endingIndex];
                } else if(ending){
                    if(endingIndex < ends.length) {
                        interval = ends[endingIndex++];
                    } else {
                        running = false;
                        deffer.resolve(current);
                        return; 
                    }
                } else {
                    interval = middle;
                }
            }
        } else {
            interval = middle;
        }
        setTimeout($.proxy(next, null, step + 1), interval);
    }
    
    window.stopCJ = function(t) {
        stop(t);
    };
    
    window.qunitStart = start; // for qunit
    window.startCJ = function() {
        start()
            .done(function(a) {
                if(target % count != a) {
                    alert("This should never happen!");
                    a = target;
                }
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
    
        
});


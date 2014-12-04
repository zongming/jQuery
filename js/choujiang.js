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
    var deffer, steps, target, running,
        loops = {
            0: 400,
            1: 300,
            2: 200,
            3: 100,
            
            30: 100,
            "-1": 200,
            "-2": 300,
            "-3": 400
        };
    
    function start(t) {
        if(running) {
            return $.Deferred().reject("not ready");
        }
        deffer = $.Deferred();
        running = true;
        
        target = t;
        
        loops = {
            0: 400,
            1: 300,
            2: 200,
            3: 100,
        };
        
        var total = t + 30;
        var m = (total - 4);
        loops[m] = 100;
        loops["-1"] = 200;
        loops["-2"] = 300;
        loops["-3"] = 400;
        
        console.log(loops);
        
        steps = [];
        
        var n = 0, last;
        $.each(loops, function(index, interval) {
            var i = Number(index);
            if(n == i){
                steps[i] = interval;
                n++;
            } else if(n < i) {
                for(var j = n; j <= i; j++) {
                    steps[j] = last;
                    n++;
                }
            } else if(i < 0) {
                var x = -i + (n - 1); 
                steps[x] = interval;
            }
            last = interval;
        });
        
        next(0);
        
        return deffer.promise();
    }
    
    function stop() {
        running = false;
        return deffer.resolve(current);
    }

    function next(step) {
        if(step > steps.length) {
            stop();
            return;
        }
        $imgs.removeClass('curr');

        current = step % count;
        $imgs.eq(current).addClass('curr');
        
        var interval = steps[step];
        setTimeout($.proxy(next, null, step + 1), interval);
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
                        alert(a);
                    }
                }, 300);
            })
            .fail(function(error) {
                alert(error);
            });
    };
    
    window.startCJ(8);
});


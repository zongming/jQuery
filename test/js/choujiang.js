var i = 0;
QUnit.asyncTest("test", function(assert) {
    a(assert);
});

var i = 0, max = 100;
function a(assert) {
    var t = Math.floor(Math.random() * 10);
    qunitStart().done(function(x) {
        setTimeout(function() {
            assert.equal(x, t, t + " passed, timeout: " + timeout);
            if(i == max) {
                QUnit.start();
                return;
            } else {
                i++;
                return a(assert);
            }
        }, 300);
    });
    
    var timeout = Math.random() * 10000;
    setTimeout(function() {
        stopCJ(t); 
    }, timeout);
}

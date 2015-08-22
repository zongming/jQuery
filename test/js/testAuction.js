'use strict';

QUnit.module( "匀速降价测试", {
    beforeEach: function() {
        this.div = $('<div id="auctionA"></div>').appendTo('#qunit-fixture');
        
        var config = {
            start: 2500.00,
            totalTime: 1080000,
            currentTime: 0,
            interval: 1000, 
            cutDown: 1.00,
        };
        this.widget = this.div.auctionA(config);

        this.tests = [
            {time: 0, price: 2500},
            {time: 1000, price: 2499},
            {time: 107000, price: 2393},
            {time: 1080000, price: 1420}
        ];
    },
    afterEach: function() {
        this.tests = null;
        this.widget.auctionA('destroy');
        
        this.div.remove();
    }
});

QUnit.test("设置时间测试价格", function(assert) {
    var w = this.widget;
    var instance = w.auctionA('instance');
    
    $.each(this.tests, function(i, t) {
        w.auctionA('setTime', t.time);
        assert.equal(t.price, instance.price, "时间: " + t.time + " ; 价格: " + t.price + " ;实际：" + instance.price);
    });
});

QUnit.test("设置价格测试时间", function(assert) {
    var w = this.widget;
    var instance = w.auctionA('instance');
    
    $.each(this.tests, function(i, t) {
        w.auctionA('setPrice', t.price);
        assert.equal(t.time, instance.currentTime, "价格: " + t.price + " ; 时间: " + t.time + " ;实际：" + instance.currentTime);
    });
    
    w.auctionA("setTime", 0);
});


QUnit.module( "加速降价测试", {
    beforeEach: function() {
        this.div = $('<div id="auctionB"></div>').appendTo('#qunit-fixture');
        var config = {
            start: 2500.00,
            totalTime: 1080000,
            currentTime: 0,
            interval: 1000, 
            cutDown: 1.00,
            
            minCutDown: 0.30,
            maxCutDown: 2.70,
            CDchangeTimes: 10
        };
        
        this.widget = this.div.auctionB(config);
        
        this.tests = [
            {time: 0, price: 2500},
            {time: 1000, price: 2499.7},
            {time: 61000, price: 2481.7},
            {time: 108000, price: 2467.6},
            
            {time: 109000, price: 2467.06},
            {time: 159000, price: 2440.06},
            {time: 191000, price: 2422.78},
            
            {time: 217000, price: 2408.5},
            {time: 218000, price: 2407.72},
            {time: 222000, price: 2404.6},
            
            {time: 324000, price: 2325.04},
            {time: 342000, price: 2306.68},
            {time: 399000, price: 2248.54},
            
            {time: 432000, price: 2214.88},
            {time: 433000, price: 2213.62},
            
            {time: 540000, price: 2078.8},
            {time: 578000, price: 2021.8},
            {time: 594000, price: 1997.8},
            
            {time: 648000, price: 1916.8},
            
            {time: 1080000, price: 1009.6}
        ];
    },
    
    afterEach: function() {
        
        this.tests = null;
        this.widget.auctionB('destroy');
        
        this.div.remove();
    }
});

QUnit.test("设置时间测试价格", function(assert) {
    var w = this.widget;
    var instance = w.auctionB('instance');
    
    $.each(this.tests, function(i, t) {
        w.auctionB('setTime', t.time);
        assert.equal(t.price, instance.price, "时间: " + t.time + " ; 价格: " + t.price + " ;实际：" + instance.price);
    });
});

QUnit.test("设置价格测试时间", function(assert) {
    var w = this.widget;
    var instance = w.auctionB('instance');
    
    var x = [ // 容错性测试
        {time: 0, price: 2500.1},
        {time: 0, price: 2499.9},
        {time: 1000, price: 2499.8},
        
        {time: 1000, price: 2499.6},
        {time: 2000, price: 2499.5},
        
        {time: 2000, price: 2499.3},
        {time: 3000, price: 2499.2},
        
        {time: 1080000, price: 1009.60},
        
        {time: 1080000, price: 1009.59}
    ];
    
    x = x.concat(this.tests);
    $.each(x, function(i, t) {
        w.auctionB('setPrice', t.price);
        assert.equal(t.time, instance.currentTime, "价格: " + t.price + " ; 时间: " + t.time + " ;实际：" + instance.currentTime);
    });
    
    // w.auctionB("setTime", 0);
});

QUnit.module( "减速降价测试", {
    beforeEach: function() {
        this.div = $('<div id="auctionB1"></div>').appendTo('#qunit-fixture');
        var config = {
            start: 2500.00,
            totalTime: 1080000,
            currentTime: 0,
            interval: 1000, 
            cutDown: 1.00,
            
            minCutDown: 0.30,
            maxCutDown: 2.70,
            CDchangeTimes: 10
        };
        config.type = -1;
        
        this.widget = this.div.auctionB(config);
        
        this.tests = [
            {time: 0, price: 2500},
            {time: 5000 , price: 2487.7},
            {time: 12000 , price: 2470.48},
            {time: 28000 , price: 2431.12},
            {time: 43000 , price: 2394.22},
            {time: 107000 , price: 2236.78},
            
            {time: 108000 , price: 2234.32},
            {time: 109000 , price: 2232.1},
            {time: 110000 , price: 2229.88},
            {time: 123000 , price: 2201.02},
            {time: 125000 , price: 2196.58},
            
            {time: 263000 , price: 1901.5},
            
            {time: 329000, price: 1772.02},
            {time: 1080000, price: 1009.60}
        ];
    },
    
    afterEach: function() {
        this.tests = null;
        this.widget.auctionB('destroy');
        
        this.div.remove();
    }
});

QUnit.test("设置时间测试价格", function(assert) {
    var w = this.widget;
    var instance = w.auctionB('instance');
    
    $.each(this.tests, function(i, t) {
        w.auctionB('setTime', t.time);
        assert.equal(t.price, instance.price, "时间: " + t.time + " ; 价格: " + t.price + " ;实际：" + instance.price);
    });
});

QUnit.test("设置价格测试时间", function(assert) {
    
    var x = [ // 容错性测试
        {time: 0, price: 2500},
        {time: 5000 , price: 2487.1},
        {time: 12000 , price: 2470.6},
        {time: 28000 , price: 2431.14},
        {time: 43000 , price: 2394.68},
        {time: 107000 , price: 2236.18},
        
        {time: 108000 , price: 2234.92},
        {time: 109000 , price: 2232.13},
        {time: 110000 , price: 2229.448},
        {time: 123000 , price: 2201.02},
        {time: 125000 , price: 2196.58},
        
        {time: 263000 , price: 1901.5},
        
        {time: 329000, price: 1772.02},
        {time: 1080000, price: 1009.59}
    ];
    
    x = x.concat(this.tests);
    
    var w = this.widget;
    var instance = w.auctionB('instance');
    
    $.each(x, function(i, t) {
        w.auctionB('setPrice', t.price);
        assert.equal(t.time, instance.currentTime, "价格: " + t.price + " ; 时间: " + t.time + " ;实际：" + instance.currentTime);
    });
    
});

QUnit.module( "按步下跌测试", {
    beforeEach: function() {
        this.div = $('<div id="auctionC"></div>').appendTo('#qunit-fixture');
        
        var interval = 1000;
        var start = 2500000;
        
        var config = {
            start: start,
            // totalTime: 1080000,
            currentTime: 0,
            interval: interval, 
        };
        var n = start;
        var steps = [{t: 0, p: n}]; // steps comes from backend
        for(var i = 0; i < 1080; i++) {
            var c = -(i + 1);
            n += c;
            steps[i+1] = {t: (i + 1) * interval, p: n};
        }
        this.widget = this.div.auctionC(config).auctionC('updateSteps', steps);
        
        this.tests = steps.filter(function(item, i) {
            return i % 50 === 0;
        });
    },
    
    afterEach: function() {
        this.tests = null;
        this.widget.auctionC('destroy');
        
        this.div.remove();
    }
});

QUnit.test("设置时间测试价格", function(assert) {
    var w = this.widget;
    var instance = w.auctionC('instance');
    
    $.each(this.tests, function(i, t) {
        w.auctionC('setTime', t.t);
        assert.equal(t.p, instance.price, "时间: " + t.t + " ; 价格: " + t.p + " ;实际：" + instance.price);
    });
});

QUnit.test("设置价格测试时间", function(assert) {
    var w = this.widget;
    var instance = w.auctionC('instance');
    
    $.each(this.tests, function(i, t) {
        w.auctionC('setPrice', t.p);
        assert.equal(t.t, instance.currentTime, "价格: " + t.p + " ; 时间: " + t.t + " ;实际：" + instance.currentTime);
    });
    // w.auctionC("setTime", 0);
});

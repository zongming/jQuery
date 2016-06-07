/**
 * Created by zongmingz on 6/7/2016.
 */
'use strict';

var sudoku = (function() {
    var n, total, items;
    var times = 0;

    function getAnswer() {
        var b = find(0);
        if(b) {
            console.log('try times: ' + times);
        }
        return b;
    }

    function find(step) {
        var row = Math.floor(step / n);
        var col = step % n;

        if(items[row][col]) { // if it has value, skip it to the next item
            if(step < total - 1) {
                return find(step + 1);
            } else {
                return true;
            }
        }

        times++;
        var mask = 0;
        for(var j = 0; j < n; j++) {
            mask |= 1 << (items[row][j]);
            mask |= 1 << (items[j][col]);
        }

        for(var i = 1; i <= n; i++) {
            if(!(1 << i & mask)) {     // i is an option
                items[row][col] = i;   // try i

                if(step === total - 1) {
                    return true;
                } else {
                    if(find(step + 1)) {
                        return true;
                    } else {
                        items[row][col] = 0; //revert i
                    }
                }
            }
        }

        return items[row][col];
    }

    function generate(number) {
        n = number, items = [];

        for (var i = 0; i < n; i++) {
            items[i] = [];
            var x = 0;
            for (var k = i; k < n;) {
                if (items[i][k]) {
                    break;
                }
                items[i][k] = ++x;
                k++;
                if (k == n) {
                    k = 0;
                }
            }
        }

        exchange();
        setBlank();

        return items;
    }

    function exchange() {
        for (var i = 0; i < 10; i++) {
            var x = Math.floor(Math.random() * n);
            var y = Math.floor(Math.random() * n);
            if (x != y) {
                exchangeRow(x, y);
            }
        }
        for (var i = 0; i < 10; i++) {
            var x = Math.floor(Math.random() * n);
            var y = Math.floor(Math.random() * n);
            if (x != y) {
                exchangeColumn(x, y);
            }
        }
    }

    function setBlank(total) {
        var total = total || n * n * .9;

        for(var i = 0; i < total; i++) {
            var x = Math.floor(Math.random() * n);
            var y = Math.floor(Math.random() * n);

            items[x][y] = 0;
        }
    }

    function exchangeRow(x, y) {
        var t = 0;
        for (var i = 0; i < n; i++) {
            t = items[x][i];
            items[x][i] = items[y][i];
            items[y][i] = t;
        }
    }

    function exchangeColumn(x, y)
    {
        var t = 0;
        for (var i = 0; i < n; i++) {
            t = items[i][x];
            items[i][x] = items[i][y];
            items[i][y] = t;
        }
    }

    function print() {
        console.log('=================================');
        for(var i = 0; i < n; i++) {
            var str = '';
            for(var j = 0; j < n; j++) {
                str += (items[i][j] || ' ' ) + ' ';
            }
            console.log(str);
        }
        console.log('=================================');
    }

    return {
        setQuestion: function(arr) {
            n = arr.length;
            total = n * n;
            items = arr;
        },
        print: print,
        getAnswer: getAnswer,
        generateQuestion: generate
    };
})();

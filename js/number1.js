(function() {
    $.widget("qbao.num1", {
        current : 0,
        options : {
            number : 0
        },
        
        _setOption : function(key, value) {
            this._superApply(arguments);
            if(key == "number") {
                this._refresh();
            }
        },
        
        _create : function() {
            this.widget().addClass("num");
            this._refresh();
        },
        
        _refresh : function() {
            if(this.current != this.options.number) {
                clearInterval(a);
                
                var speed = 100;
                
                var me = this;
                this.flag = this.current < this.options.number;
                var i = this.current;
                var a = setInterval(function() {
                    me.flag ? ++i : --i;
                	var y = i * -68 + 2;
                	me.widget().css({
                        "background-position" : "0px " + y + "px"
                    });
                    me.current = i;
                	if(i == me.options.number) {
                		clearInterval(a);
                		return;
                	}
                }, speed);
                
            }
        }
    });
})();
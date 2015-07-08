$.widget('qbao.stepper', {
    options: {
        // n: 0,
        // min: 1,
        // max: 1
    }, 
    _create: function() {
        var html = '<span class="subtract">-</span>' 
                    + '<div class="input"><input type="input"/></div>'
                    + '<span class="add">+</span>';
        this.element.html(html).addClass('stepper');
        
        this.$subtract = this.element.find('.subtract');
        this.$add = this.element.find('.add');
        this.$input = this.element.find('input');
        
        var me = this;
        this.element.find('.subtract').on('click', function() {
            if($(this).hasClass("disabled")) {
                return;
            }
            me.n--;
            me._refresh();
        });
        
        this.element.find('.add').on('click', function() {
            if($(this).hasClass("disabled")) {
                return;
            }
            me.n++;
            me._refresh();
        });
        
        this.$input.on("propertychange input", function() {
            var a = $(this).val();
          
            if(a) {
                a = a.replace(/\D/g, '');
                $(this).val(a);
            }
            
            me.n = Number(a);
            
            me._refresh();
        });
    },
    
    _init: function() {
        this.n = this.options.n;
        this._refresh();
    },
    
    _refresh: function() {
        this.$subtract.toggleClass('disabled', this.n <= this.options.min);
        this.$add.toggleClass('disabled', this.n >=  this.options.max);
        
        if(this.n < this.options.min) {
            this.n = this.options.min;
        }
        if(this.n >  this.options.max) {
            this.n = this.options.max;
        }
        this.$input.val(this.n);
    },
    
    value: function(n) {
        if(!isNaN(n)) {
            n = Number(n);
            this.n = n;
            this._refresh();
        }
        return this.n;
    }
});

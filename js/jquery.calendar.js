(function($) {
    $.widget('qbao.cItem', {
        _init: function() {
            this.date = this.options.date;
            this.element.text(this.options.test);
        },
        
        clear: function() {
            this.date = undefined;
            this.element.empty();
        }
    });
    
    $.widget('qbao.calendar', {
        options : {
            row : 1,
            col : 7,
            
            time: new Date(),

            days : {
                0: "周日",
                1: "周一",
                2: "周二",
                3: "周三",
                4: "周四",
                5: "周五",
                6: "周六"
            },
            // data: [{da}]
            showDays : true,
            showMonth : true
        },

        _create : function() {
            var time = this.options.time;
            this.currentMonth = time.getMonth();
            this.currentYear = time.getFullYear();
            
            this._cache = [];

            this.$calendar = $("<table class='c-calendar'></table>");
            this.element.append(this.$calendar);

            if (this.options.showMonth) {
                this._createMonth();
            }

            if (this.options.showDays) {
                this._createDays();
            }
            
            this._createDates();
            
            this.setTime(this.currentYear, this.currentMonth);
        },
        
        _createMonth: function() {
            var tr = $("<tr class='c-row c-header'></tr>");
            this.$month = $("<td class='c-cell' colspan=" + this.options.col + 
                "><a class='prev'>prev</a><h3 class='title'></h3><a class='next'>next</a></td>").appendTo(tr);
            
            var me = this;
            this.$month.find('.prev').on('click', function() {
                me.prev();
            });
            this.$month.find('.next').on('click', function() {
                me.next();
            });
            this.$calendar.append(tr);
        },
        
        prev: function() {
            this.currentMonth -= 1;
            this.setTime(this.currentYear, this.currentMonth);
        },
        
        next: function() {
            this.currentMonth += 1;
            this.setTime(this.currentYear, this.currentMonth);
        },
        
        _createDays: function() {
            this.$days = $("<tr class='c-row c-row-days'></tr>");
            var me = this;
            $.each(this.options.days, function(index, item) {
                var $cell = $("<td class='c-cell'>" + item + "</td>");
                me.$days.append($cell);
            });
            this.$calendar.append(this.$days);
        },
        
        _createDates: function() {
            for (var i = 0; i < this.options.row; i++) {
                var c = [];
                this._cache.push(c);
                
                var $row = $("<tr class='c-row c-row-date'></tr>");
                this.$calendar.append($row);

                for (var j = 0; j < this.options.col; j++) {
                    var $cell = $("<td class='c-cell'></td>").cItem();
                    $row.append($cell);
                    c.push($cell);
                }
            }
        },
        
        setTime: function(year, month) {
            var startDate = new Date(year, month, 1);
            
            this.currentYear = year = startDate.getFullYear();
            this.currentMonth = month = startDate.getMonth();
            
            if (this.options.showMonth) {
                this.$month.find('h3').text(year + "年" + (month + 1) + "月");
            }
            
            for(var i = 0; i < this.options.row; i++) {
                for(var j = 0; j < this.options.col; j++) {
                    this._cache[i][j].cItem("clear");
                }
            }
            
            var start = startDate.getDay();
            var dates = [];
            for(var i = 0; i < this.options.col * this.options.row; i++) {
                var date = new Date(year, month, i - start + 1);
                dates.push(date);
            }
            
            for(var i = 0; i < dates.length; i++) {
                var r = Math.floor(i / 7);
                var c = i % 7;
                var $cell = this._cache[r][c];
                $cell.data("date", dates[i]);
                        
                $cell.cItem({
                   test: dates[i].getMonth() + 1 + ":" + dates[i].getDate()
                });
                
                if(dates[i].getMonth() == month) {
                    $cell.removeClass("c-cell-inactive");
                } else {
                    $cell.addClass("c-cell-inactive");
                }
            }
        },
        
        _destroy: function() {
            for (var i = 0; i < this.options.row; i++) {
                for (var j = 0; j < this.options.col; j++) {
                    var item = this._cache[i][j];
                    if(item) {
                        item.remove();
                    }
                }
            }
            this._cache = [];
            
            if(this.$days) {
                this.$days.remove();
            }
            if(this.$month) {
                this.$month.remove();
            }
            this.$calendar.remove();
            
        }
    });
})(jQuery);

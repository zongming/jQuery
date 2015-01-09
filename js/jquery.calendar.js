(function($) {
    $.widget('qbao.tile', {
        options: {
            // date: new Date()
        },
        
        _create: function() {
            this.$tile = $("<div class='tile'></div>");
            this.element.append(this.$tile);
            
            this.$point = $("<span class='point'></span>").appendTo(this.$tile);
            this.$day = $("<p class='day'></p>").appendTo(this.$tile);
            this.$status = $("<p class='status'>").appendTo(this.$tile);
        },
        
        _init: function() {
            var date = this.options.date;
            if(date) {
                var str = date.getDate();
                this.$day.text(str);
            }
            
            var x = Math.random() * 100;
            x = Math.floor(x);
            this.$status.text(x);
            
            if(x < 0) {
                this.$status.addClass('status-gray');
            }
        },
        
        clear: function() {
            this.$day.empty();
            this.$status.empty();
            this.$status.removeClass('status-gray');
        }
    });
    
    $.widget('qbao.detail', {
        _create: function() {
            this.element.addClass('c-detail');
            this.$title = $('<h4 class="title"></h4>').appendTo(this.element);
            this.$content = $('<div class="content"><p><span class="m"></span><span class="u">钱宝币</span></p>'
            +'<p>剩余名额/名额总数：<em>233</em>/500</p></div>').appendTo(this.element);
        },
        
        _init: function() {
            // this.$content.removeClass('content-ended');
            // this.$content.removeClass('content-notstarted');
            if(this.options.date) {
                var y = this.options.date.getFullYear();
                var month = this.options.date.getMonth();
                var date = this.options.date.getDate();
                var str = y + "年" + (month + 1) + "月" + date + "日";
                this.$title.text(str);
            }
            this.$content.addClass('content-ended');
            this.$content.find('.m').text("1000");
        }
    });
    
    $.widget('qbao.calendar', {
        options : {
            row : 1,
            col : 7,
            
            time: new Date(),

            days : {
                0: "日",
                1: "一",
                2: "二",
                3: "三",
                4: "四",
                5: "五",
                6: "六"
            },
            showDays : true,
            showMonth : true
        },

        _create : function() {
            var time = this.options.time;
            this.currentMonth = time.getMonth();
            this.currentYear = time.getFullYear();
            
            this._cache = [];

            this.$calendar = $("<table cellpadding='0' cellspacing='0' class='c-calendar'></table>");
            this.element.append(this.$calendar);
            
            if (this.options.showMonth) {
                this._createMonth();
            }

            if (this.options.showDays) {
                this._createDays();
            }
            
            this._createDates();
            
            this.setTime(this.currentYear, this.currentMonth);
            
            var me = this;
            this.element.on('mouseover.tile', ':qbao-tile', function(e) {
                var d = $(this).data("date");
                // me._trigger('clickDate', e, d);
                
                me.$detail.detail({
                    date: d
                }).show();
            });
            this.element.on('mouseout', function(e) {
                me.$detail.detail().hide(); 
            });
            
            this.element.css('position', 'relative');
            this.$detail = $("<div></div>").css({
                top: 0,
                left: this.$calendar.outerWidth(true)
            }).detail().appendTo(this.element);
        },
        
        _createMonth: function() {
            var tr = $("<tr class='row c-header'></tr>");
            this.$month = $("<td class='cell cell-last' colspan=" + this.options.col + 
                "><div class='header'><a class='btn next'></a><a class='btn prev'></a><h5 class='title'><span class='time'></span><span class='sub-title'>（单位：钱宝币）</span></h5></div></td>").appendTo(tr);
            
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
            this.setTime(this.currentYear, this.currentMonth - 1);
        },
        
        next: function() {
            this.setTime(this.currentYear, this.currentMonth + 1);
        },
        
        _createDays: function() {
            this.$days = $("<tr class='row row-days'></tr>");
            var me = this;
            $.each(this.options.days, function(index, item) {
                var $cell = $("<td class='cell'>" + item + "</td>");
                me.$days.append($cell);
                
                if(index == me.options.col - 1) {
                    $cell.addClass("cell-last");
                }
            });
            this.$calendar.append(this.$days);
        },
        
        _createDates: function() {
            for (var i = 0; i < this.options.row; i++) {
                var c = [];
                this._cache.push(c);
                
                var $row = $("<tr class='row row-dates'></tr>");
                this.$calendar.append($row);
                if(i == this.options.row - 1) {
                    $row.addClass("row-last");
                }

                for (var j = 0; j < this.options.col; j++) {
                    var $cell = $("<td class='cell'></td>").tile();
                    if(j == this.options.col - 1) {
                        $cell.addClass("cell-last");
                    }
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
                this.$month.find('.time').text(year + "年" + (month + 1) + "月");
            }
            
            for(var i = 0; i < this.options.row; i++) {
                for(var j = 0; j < this.options.col; j++) {
                    this._cache[i][j].tile("clear");
                }
            }
            
            var start = startDate.getDay();
            var dates = [];
            for(var i = 0; i < this.options.col * this.options.row; i++) {
                var date = new Date(year, month, i - start + 1);
                dates.push(date);
            }
            
            for(var i = 0; i < dates.length; i++) {
                var date = dates[i];
                var r = Math.floor(i / 7);
                var c = i % 7;
                var $cell = this._cache[r][c];
                $cell.data("date", date);
                
                $cell.tile({
                    date: date
                });
                $cell.removeClass("cell-today");
                $cell.removeClass("cell-passed");
                $cell.removeClass("cell-notCurrentMonth");
                
                var today = new Date();
                if(date.getFullYear() == today.getFullYear() && date.getMonth() == today.getMonth()) {
                    if(date.getDate() == today.getDate()) {
                        $cell.addClass("cell-today");
                    } else if(date.getDate() < today.getDate()) {
                        $cell.addClass("cell-passed");
                    }
                }
                
                if(date.getMonth() != month) {
                    $cell.addClass("cell-notCurrentMonth");
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
            if(this.$detail) {
                this.$detail.remove();
            }
            this.$calendar.remove();
        }
    });
})(jQuery);

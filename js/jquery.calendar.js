(function($) {
    var now = new Date();
    var testing = [
        {
            date: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            price: 1000,
            showDetail: true,
            detail: {
                type: "notStarted", 
                price: 2,
                listItem: [
                    "1、奖励 10 个抢红包机会；",
                    "2、此产品免交易手续费服务；",
                    "3、奖励 10 个抢红包机会；"
                ],
                imgItem: [
                    "images/calendar/a.png",
                    "images/calendar/b.png",
                    "images/calendar/c.png"
                ],
                prideTime: "奖励发放时间：2014-12-20 0:00:00"
            }
        },
        {
            date: new Date(2015, 0, 1),
            price: 100,
            showDetail: true,
            detail: {
                type: "ended", //"notStarted"
                price: 1
            }
        },
        {
            date: new Date(2015, 0, 2),
            price: -1000,
            showDetail: true,
            detail: {
                type: "notStarted", 
                price: 2,
                listItem: [
                    "1、奖励 10 个抢红包机会；",
                    "2、此产品免交易手续费服务；",
                    "3、奖励 10 个抢红包机会；"
                ],
                imgItem: [
                    "images/calendar/a.png",
                    "images/calendar/b.png",
                    "images/calendar/c.png"
                ],
                prideTime: "奖励发放时间：2014-12-20 0:00:00"
            }
        },
        {
            date: new Date(2015, 0, 3),
            price: -1000,
            showDetail: false,
            detail: {
                price: 3
            }
        },
        {
            date: new Date(2015, 0, 4),
            price: -1000,
            showDetail: true,
            detail: {
                price: -4
            }
        },
        {
            date: new Date(2015, 0, 16),
            price: 1000,
            showDetail: true,
            detail: {
                price: -5
            }
        },
        {
            date: new Date(2015, 1, 10),
            price: -130,
            showDetail: true,
            detail: {
                price: -99
            }
        },
        {
            date: new Date(2015, 2, 1),
            price: -100,
            showDetail: true,
            detail: {
                price: -99
            }
        }
    ];
    
    function getInfoByDate(date) {
        var d = {};
        $.each(testing, function(i, item) {
            if(date.getTime() == item.date.getTime()) {
                d = item;
                return false;
            }
        });
        return d;
    }
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
            
            var x = this.options.price;
            if(!isNaN(x)) {
                if(x < 0) {
                    this.$status.addClass('status-gray');
                    this.$status.text(x);
                } else {
                    this.$status.removeClass('status-gray');
                    this.$status.text("+" + x);
                }
            }
            
            if(this.options.showDetail) {
                this.$tile.find(".point").show();
            } else {
                this.$tile.find(".point").hide();
            }
        },
        
        clear: function() {
            delete this.options.date;
            delete this.options.showDetail;
            delete this.options.price;
            
            this.$day.empty();
            this.$status.empty();
        }
    });
    
    $.widget('qbao.detail', {
        _create: function() {
            this.element.addClass('c-detail');
            this.$title = $('<h4><span class="p-l"></span><span class="title"></span><span class="p-r"></span></h4>').appendTo(this.element);
            this.$content = $('<div class="content"></div>').appendTo(this.element);
            
            this.$pLess = $("<div class='p-less'><p class='money'><span class='m'></span><span class='u'>钱宝币</span></p><p class='x'>剩余名额/名额总数：<em>233</em>/500</p></div>").appendTo(this.$content);
            this.$pMore = $("<div class='p-more'><ul class='pride-list'></ul><ul class='img-list clearfix'></ul><p class='pride-time'></p></div>").appendTo(this.$content);
        },
        
        _init: function() {
            if(this.options.showDetail) {
                this.element.show();
            } else {
                this.element.hide();
                return;
            }
            
            this.$content.removeClass('content-less');
            this.$content.removeClass('content-more');
            
            if(this.options.date) {
                var y = this.options.date.getFullYear();
                var month = this.options.date.getMonth();
                var date = this.options.date.getDate();
                var str = y + "年" + (month + 1) + "月" + date + "日";
                this.$title.find('.title').text(str);
            }
            this.$content.addClass('content-less');
            
            if(this.options.detail && this.options.detail.price) {
                this.$pLess.find('.m').text(this.options.detail.price);
            }
            
            if(this.options.detail && this.options.detail.type == "notStarted") {
                this.$content.addClass('content-more');
            } else {
                this.$content.addClass('content-less');
            }
            
            var pricesList = this.$pMore.find('ul.pride-list').empty();
            if(this.options.detail && this.options.detail.listItem) {
                var me = this;
                $.each(this.options.detail.listItem, function(index, item) {
                    pricesList.append("<li>" + item + "</li>");
                });
            }
            
            var imgsList = this.$pMore.find('ul.img-list').empty();
            if(this.options.detail && this.options.detail.imgItem) {
                var me = this;
                $.each(this.options.detail.imgItem, function(index, item) {
                    imgsList.append("<li><img src='" + item + "'></img></li>");
                });
            }
            
            var temp = this.$pMore.find('.pride-time');
            if(this.options.detail && this.options.detail.prideTime) {
                temp.text(this.options.detail.prideTime);
            }
        },
        
        clear: function() {
            delete this.options.date;
            delete this.options.showDetail;
            delete this.options.price;
            
            delete this.options.showDetail;
            delete this.options.detail;
        }
    });
    
    $.widget('qbao.calendar', {
        options : {
            row : 6,
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
            
            this.element.append("<div class='outer-border'></div>");
            this.$calendar = $("<table cellpadding='0' cellspacing='0' class='c-calendar'></table>");
            this.element.find('.outer-border').append(this.$calendar);
            
            if (this.options.showMonth) {
                this._createMonth();
            }

            if (this.options.showDays) {
                this._createDays();
            }
            
            this._createDates();
            
            this.setTime(this.currentYear, this.currentMonth);
            
            var me = this;
            this.element.on('mouseenter.tile', ':qbao-tile', function(e) {
                var d = $(this).data("date");
                // me._trigger('clickDate', e, d);
                
                var info = $(this).tile("option");
                
                me.$detail.detail("clear");
                me.$detail.detail(info);
            });
            
            this.element.on('mouseleave', function(e) {
                me.$detail.detail().hide(); 
            });
            
            // this.element.css('position', 'relative');
            this.element.addClass('qbao-calendar');
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
                
                var config = {date: date};
                $.extend(config, getInfoByDate(date));
                $cell.tile(config);
                
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

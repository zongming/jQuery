var now = new Date();
var year = now.getFullYear();
var month = now.getMonth();
var date = now.getDate();
var testing = [
    {
        date: new Date(year, month, date -3).toString(),
        status: 1000,
        detail: {
            price: 88888888,
            left: 1,
            total: 100,
            more: {
                listItem: [
                    "1、测试",
                    "2、此产品免交易手续费服务；",
                    "3、奖励 10 个抢红包机会；"
                ],
                imgItem: [
                    "images/calendar/a.png",
                    "images/calendar/b.png",
                    "images/calendar/c.png"
                ],
                prideTime: "奖励发放时间：2014-12-20 0:00:00",
                prideType: -1 
            }
        }
    },
    {
        date: new Date(year, month, date),
        status: 1000,
        detail: {
            price: 88888888,
            left: 0,
            total: 100,
            more: {
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
                prideTime: "奖励发放时间：2014-12-20 0:00:00",
                prideType: 1
            }
        }
    },
    {
        date: new Date(year, month, date - 1),
        status: 100,
        
        detail: {
            price: 1,
            left: 1,
            total: 100
        }
    },
    {
        date: new Date(year, month, date - 2),
        status: -1000,
        detail: {
            price: 2,
            left: 0,
            total: 100,
            more: {
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
        }
    },
    {
        date: new Date(year, month, date + 1),
        status: -1000,
        detail: {
            price: 2,
            left: 1,
            total: 100,
            more: {
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
            }
        },
    {
        date: new Date(year, month, date + 2),
        status: -1000,
        detail: {
            price: -4
        }
    },
    {
        date: new Date(year, month, date + 10),
        status: 1000,
        detail: {
            price: -5
        }
    },
    {
        date: new Date(year, month, date + 11),
        status: 130,
        detail: {
            price: -6
        }
    },
    {
        date: new Date(year, month, date + 15),
        status: -100,
        detail: {
            price: -7
        }
    },
    {
        date: new Date(year, month + 1, 1),
        status: 100,
        detail: {
            price: -7,
            more: {
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
        }
    },
    {
        date: new Date(year, month + 1, date + 2),
        status: -100,
        detail: {
            price: -7,
            more: {
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
        }
    }
];

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
            
            var x = this.options.status;
            if(!isNaN(x)) {
                if(x < 0) {
                    this.$status.addClass('status-nega');
                    this.$status.text(x);
                } else {
                    this.$status.removeClass('status-nega');
                    this.$status.text("+" + x);
                }
                this.$day.removeClass('day-full');
            } else {
                this.$day.addClass('day-full');
            }
            
            var temp = this.options.detail;
            var showIndicator = temp && temp.more && temp.more.prideType && temp.more.prideType > 0;
            
            if(showIndicator) {
                this.$tile.find(".point").show();
            } else {
                this.$tile.find(".point").hide();
            }
            
            // check for today, show price not status for today
            // if it's not started, show price on the first day
            // if it's ended, show price on the last day
            var today = this.options.today;
            var start = this.options.start;
            var end = this.options.end;
            
            var notStarted = today.getTime() < start.getTime();
            var ended = today.getTime() > end.getTime();
            
            if(date) {
                var showPrice = false;
                if(notStarted) {
                    if(date.getTime() == start.getTime()) {
                        showPrice = true;
                    }
                } else if(ended) {
                    if(date.getTime() == end.getTime()) {
                        showPrice = true;
                    }
                } else {
                    if(date.getTime() == today.getTime()) {
                        showPrice = true;
                    }
                }
                
                if(showPrice) {
                    if(this.options.detail && this.options.detail.price) {
                        this.$status.removeClass('status-nega');
                        this.$status.text(this.options.detail.price);
                    } else {
                        this.$status.text("");
                    }
                }
            }
        },
        
        clear: function() {
            delete this.options.date;
            delete this.options.status;
            delete this.options.detail;
            
            this.$day.empty();
            this.$status.empty();
        }
    });
    
    $.widget('qbao.detail', {
        _create: function() {
            this.element.addClass('c-detail');
            this.$title = $('<h4><span class="p-l"></span><span class="title"></span><span class="p-r"></span></h4>').appendTo(this.element);
            this.$content = $('<div class="content"></div>').appendTo(this.element);
            
            this.$pLess = $("<div class='p-less'><p class='money'><span class='m'></span><span class='u'>钱宝币</span></p><p class='x'>剩余名额/名额总数：<em class='left'></em>/<span class='total'></span></p></div>").appendTo(this.$content);
            this.$pMore = $("<div class='p-more'><ul class='pride-list'></ul><ul class='img-list clearfix'></ul><p class='pride-time'></p></div>").appendTo(this.$content);
        },
        
        _init: function() {
            if(this.options.detail) {
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
            
            var left = this.options.detail && this.options.detail.left;
            var total = this.options.detail && this.options.detail.total;
            if(left != undefined || total != undefined) {
                this.$pLess.find('.x').show()
                    .find('.left').text(left).end()
                    .find('.total').text(total);
            } else {
                this.$pLess.find('.x').hide();
            }
            
            if(this.options.detail && this.options.detail.more) {
                this.$content.addClass('content-more');
                var pricesList = this.$pMore.find('ul.pride-list').empty();
                if(this.options.detail.more.listItem) {
                    var me = this;
                    $.each(this.options.detail.more.listItem, function(index, item) {
                        pricesList.append("<li>" + item + "</li>");
                    });
                }
                
                var imgsList = this.$pMore.find('ul.img-list').empty();
                if(this.options.detail.more.imgItem) {
                    var me = this;
                    $.each(this.options.detail.more.imgItem, function(index, item) {
                        imgsList.append("<li><img src='" + item + "'></img></li>");
                    });
                }
                
                var temp = this.$pMore.find('.pride-time').empty();
                if(this.options.detail.more.prideTime) {
                    temp.text(this.options.detail.more.prideTime);
                }
            } else {
                this.$content.addClass('content-less');
            }
        },
        
        clear: function() {
            delete this.options.date;
            delete this.options.status;
            delete this.options.detail;
        }
    });
    
    $.widget('qbao.calendar', {
        options : {
            row : 6,
            col : 7,
            
            today: new Date(),

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
        
        _init: function() {
            this._parseDate();
            this._parsePrice();
            this._superApply(arguments);
        },
        
        _parsePrice : function() {
            var options = this.options;
            
            if(options.informations) {
                $.each(options.informations, function(i, item) {
                    var price = item && item.detail && item.detail.price;
                    if(price != undefined) {
                        item.detail.price = String(price).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
                    }
                });
            }
        },
        
        _parseDate : function() {
            var options = this.options;
            var me = this;
            if(options.informations) {
                $.each(options.informations, function(i, item) {
                    if(item.date && typeof(item.date) == "string") {
                        item.date = me._getDateByString(item.date);//parse date if it's a string
                    }
                });
            }
            
            var temp = ['start', 'today', 'end'];
            var me = this;
            $.each(temp, function(i, p) {
                var item = options[p];
                if(item && typeof(item) == "string") {
                    var time = me._getDateByString(item);
                    me.options[p] = time;
                }
            });
        },
        
        _getDateByString: function(str) {
            var a = str.split("-");
            var m = Number(a[1]) - 1;
            return new Date(a[0], m, a[2]);
        },
        
        _getInfoByDate: function(date) {
            var d = {};
            $.each(this.options.informations, function(i, item) {
                if(date.getTime() == item.date.getTime()) {
                    d = item;
                    return false;
                }
            });
            return d;
        },
    
        _create : function() {
            this._parseDate();
            this._parsePrice();
            
            var time = this.options.today;
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
            
            this.element.find('.row-dates').on('mouseleave', function(e) {
                me.$detail.hide(); 
            });
            
            // this.element.css('position', 'relative');
            this.element.addClass('calendar');
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
                    var $cell = $("<td class='cell'></td>").tile({
                        today: this.options.today,
                        start: this.options.start,
                        end: this.options.end
                    });
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
                $.extend(config, this._getInfoByDate(date));
                $cell.tile(config);
                
                $cell.removeClass("cell-today");
                $cell.removeClass("cell-passed");
                $cell.removeClass("cell-notCurrentMonth");
                $cell.removeClass('cell-inactive');
                
                var today = this.options.today;
                if(date.getTime() == today.getTime()) {
                    $cell.addClass("cell-today");
                }
                
                if(date.getMonth() != month) {
                    $cell.addClass("cell-notCurrentMonth");
                }
                
                if(date.getTime() < this.options.start.getTime() || date.getTime() > this.options.end.getTime()) {//不在活动期间
                    $cell.addClass('cell-inactive');
                } else {
                    $cell.addClass("cell-active"); 
                    if(date.getTime() < today.getTime()) {
                        $cell.addClass("cell-passed"); //在活动期，但是已经过去的日期
                    }
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

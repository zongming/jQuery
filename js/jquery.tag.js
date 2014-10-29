(function($) {
    $.widget("qbao.ptag", {
        options : {
            type : 0, // 0 is in added list, 1 is in choosen list
            added : false,
            disabled : false,
            labelName : ""
        },
        _create : function() {
            this.widget().addClass("ptag");
            this.box = $('<div class="tagbox"></div>');
            this.addIcon = $('<span class="addIcon"></span>').appendTo(this.box);
            this.labelSpan = $('<span class="taglabel"></span>').appendTo(this.box);
            this.deleteIcon = $('<span class="deleteIcon"></span>').appendTo(this.box);

            this.box.appendTo(this.widget());
            this._refresh();
            this._on(this.widget(), {
                click : function(event) {
                    if (!this.options.disabled) {
                        this.widget().trigger("ptagclick", this.widget());
                    }
                }
            });
        },
        _setOptions : function() {
            this._superApply(arguments);
            this._refresh();
        },
        _refresh : function() {
            this.labelSpan.text(this.options.labelName);
            if (this.options.added) {
                if (this.options.type == 0) {
                    this.addIcon.removeClass('addIcon1').hide();
                    this.deleteIcon.css("display", "inline-block");
                } else {
                    this.addIcon.addClass('addIcon1').show();
                    this.deleteIcon.hide();
                }
            } else {
                if (this.options.type == 1) {
                    this.addIcon.removeClass('addIcon1').css("display", "inline-block");
                    this.deleteIcon.hide();
                }
            }
            if (this.options.disabled) {
                this.widget().addClass("ptag-disabled");
            } else {
                this.widget().removeClass("ptag-disabled");
            }
        },
        is : function(name) {
            return this.options.labelName == name;
        }
    });

    window.tagManger = (function() {
        var tagsAdded = [], maxNumberOfTags = 3;

        function init(added, allTags) {
            $.each(added, function(index, tag) {
                tag.added = true;
            });
            $.each(allTags, function(index, tag) {
                tag.type = 1;
                if(isInSelecton(tag, added) != -1) {
                    tag.added = true;
                }
            });

            $.each(allTags, function(index, tag) {
                $("<li></li>").appendTo('#pub-tags-list').ptag(tag).on("ptagclick", function(event, ui) {
                    var added = $(this).ptag("option", "added");
                    if(!added) {
                        var has = false;
                        $('#pub-tags-add-list').find(">:qbao-ptag").each(function(index) {
                            if ($(this).ptag("is", tag.labelName)) {
                                has = true;
                                return false;
                            }
                        });
                        if (!has) {
                            addTag(tag);
                        }
                    } else {
                        removeTag(tag);
                    }
                });
            });
            
            $.each(added, function(index, tag) {
                addTag(tag);
            });
        }

        function isInSelecton(tag, tags) {
            tags = tags || tagsAdded; 
            var i = -1;
            $.each(tagsAdded, function(index, t) {
                if(tag.labelName == t.labelName) {
                    i = index;
                    return false;
                }
            });
            return i;
        }    
        
        function getTags() {
            return tagsAdded;
        }

        function validateTag(tag) {
            if (tagsAdded.length >= maxNumberOfTags) {
                alert("最多只能添加3个标签");
                return false;
            }
            if(!tag.labelName) {
                alert("标签不能为空");
                return false;
            }
            
            if(isInSelecton(tag) != -1) {
                alert("您已经添加了相同的标签");
                return false;
            }
            return true;
        }
        
        function removeTag(tag) {
            var $tag = $('#pub-tags-add-list').find(">:qbao-ptag").filter(function(index, element ) {
                return $(element).ptag("is", tag.labelName);
            });
            
            $tag.remove();
            
            $('#pub-tags-list').find(">:qbao-ptag").filter(function(index, element ) {
                return $(element).ptag("is", tag.labelName);
            }).each(function(index) {
                $(this).ptag({
                    added : false
                });
            });

            var index = isInSelecton(tag);
            tagsAdded.splice(index, 1);

            if (tagsAdded.length < maxNumberOfTags) {
                $('#pub-tags-list').find(">:qbao-ptag").each(function(index) {
                    if(isInSelecton($(this).ptag("option")) == -1) {
                        $(this).ptag({
                            disabled : false
                        });
                    }
                });
            }

            if (tagsAdded.length == 0) {//fix ie7 bug
                $('#pub-tags-add-list').hide();
            }
        }
        
        function addTag(tag) {
            var b = validateTag(tag);
            if(!b) {
                return;
            }

            $('#pub-tags-list').find(">:qbao-ptag").filter(function(index, element ) {
                return $(element).ptag("is", tag.labelName);
            }).each(function(index) {
                $(this).ptag({
                    added : true
                });
            });
            
            tag.added = true;
            delete tag.type;

            $("<li></li>").appendTo('#pub-tags-add-list').ptag(tag).on("ptagclick", function(event, ui) {
                removeTag(tag);
            });

            tagsAdded.push(tag);

            if (tagsAdded.length >= maxNumberOfTags) {
                $('#pub-tags-list').find(">:qbao-ptag").each(function(index) {
                    if(isInSelecton($(this).ptag("option")) == -1) {
                        $(this).ptag({
                            disabled : true
                        });
                    }
                });
            }

            $('#pub-tags-add-list').show();
            //fix ie7 bug
        }

        return {
            init : init,
            getTags : getTags,
            addTag : addTag,
            removeTag : removeTag,
            validateTag : validateTag
        };
    })();

    // 初使化标签
    $(function() {
        var tags = [
            {
                "createTime": 1411264851000,
                "id": 21,
                "labelName": "dasdas",
                "labelType": 0
            }, {
                "createTime": 1411275243000,
                "id": 20,
                "labelName": "20",
                "labelType": 0
            }, {
                "createTime": 1411116372000,
                "id": 18,
                "labelName": "电脑",
                "labelType": 0
            }, {
                "createTime": 1411116372000,
                "id": 17,
                "labelName": "手机",
                "labelType": 0
            }, {
                "createTime": 1411116372000,
                "id": 16,
                "labelName": "特产",
                "labelType": 0
            }, {
                "createTime": 1411116372000,
                "id": 15,
                "labelName": "家政",
                "labelType": 0
            }, {
                "createTime": 1411116372000,
                "id": 14,
                "labelName": "美食",
                "labelType": 0
            }, {
                "createTime": 1411116371000,
                "id": 13,
                "labelName": "汽车",
                "labelType": 0
            }
        ];

        var tagsAdded = [
            {
                "createTime": 1411116372000,
                "id": 14,
                "labelName": "美食",
                "labelType": 0
            }, {
                "createTime": 1411116371000,
                "id": 13,
                "labelName": "汽车",
                "labelType": 0
            }
        ];

        tagManger.init(tagsAdded, tags);
        //run tagManger.getTags(); to get added tags
        
        // 输入框
        $('#pub-btn-add').on("click", function() {
            var label = $('#pub-tags-input').val();
            var tag =
                {
                    labelName: label,
                    id : "$" + label
                };
            tagManger.addTag(tag);
        });
    });
})(jQuery);
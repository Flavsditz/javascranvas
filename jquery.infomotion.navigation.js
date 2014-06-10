(function($) {
    $.fn.navigation = function(options) {
        var settings = {
            url : "jsonNavigation",
            target : "#jsonNavigation"
        };

        var navXhr = null;
        var abortAjaxRequest = function(xhr) {
            if(xhr && xhr.readyState != 4){
                xhr.abort();
            }
        };

        var callback = function(value) {
            navXhr = value;
        };

        var methods = {
            "removeSubs" : function(level) {
                for ( var i = level + 1; i < 5; i++) {
                    $(".level" + i).remove();
                }
            },

            "buildItem" : function(parent, val, level) {

                var item = $("<div>");
                item.html(getText(val.key));
                item.addClass("navigationItem");
                item.addClass("level" + level);

                if (val.selected) {
                    item.addClass("selected");
                }

                if (level == 1) {
                    item.appendTo(parent);
                } else {
                    item.insertAfter(parent);
                }

                item.subscribe("topic" + val.ID, function(data, val) {
                    if (val !== undefined && val.subentry !== undefined) {
                        item.data("subentry", val.subentry);
                    }
                    item.click();
                });

                item.click(function() {
                    if (!$(this).hasClass("loading")) {
                        var load = true;
                        if (item.data("subentry") !== undefined) {
                            load = false;
                        }
                        var data = {};
                        methods.removeSubs(level);

                        if (val.type == "STATIC") {
                            $("#" + val.target).loadWithLoader({
                                url : val.action,
                                data : val.parameter + "=" + val.parameterValue,
                                abortMethod : abortAjaxRequest,
                                xhr : navXhr,
                                callback : callback
                            });

                        } else if (val.type == "DYNAMIC") {
                            data = {};
                            data[val.parameter] = val.rootID;

                            if (load) {
                                $("#contentContainer").loadWithLoader({
                                    url : val.action,
                                    data : data,
                                    abortMethod : abortAjaxRequest,
                                    xhr : navXhr,
                                    callback : callback
                                });
                            }
                            item.addClass("loading");
                            data = {
                                "rootID" : val.rootID,
                                "objectType" : val.objectType,
                                "action" : val.action,
                                "parameter" : val.parameter
                            };
                            $.getJSON("retrieveDynamicItems", data, function(
                                    jsonData) {
                                item.removeClass("loading");
                                $.each(jsonData.reverse(), function(idx, dynamicVal) {
                                    methods.buildItem(item, dynamicVal, level + 1);
                                });
                            });

                        } else if (val.type == "EMPTY") {
                            if (load) {
                                $("#contentContainer").loadWithLoader({
                                    url : val.additionalLink,
                                    abortMethod : abortAjaxRequest,
                                    xhr : navXhr,
                                    callback : callback
                                });
                            }
                            item.addClass("loading");
                            data = {
                                menuItemID : val.ID
                            };
                            $.getJSON("retrieveEmptyItems", data, function(
                                    jsonData) {
                                item.removeClass("loading");
                                $.each(jsonData.reverse(), function(idx, emptyVal) {
                                    methods.buildItem(item, emptyVal, level + 1);
                                });
                            });

                        } else if (val.type == "NAMEDPERSONAL") {
                            data = {
                                organisationType : val.objectType,
                                typeFolder : val.ID
                            };
                            data[val.parameter] = val.parameterValue;

                            $("#contentContainer").loadWithLoader({
                                url : val.action,
                                data : data,
                                abortMethod : abortAjaxRequest,
                                xhr : navXhr,
                                callback : callback
                            });
                        }
                        $("#rightcontent").show();
                        $(".navigationItem").removeClass("selected");
                        $(this).addClass("selected");
                    }

                });

                if (val.ID === $(parent).data("subentry")) {
                    item.click();
                    $(parent).removeData("subentry");
                }

            }
        };

        return this.each(function() {
            if (options) {
                $.extend(settings, options);
            }
            var target = this;
            $.getJSON(settings.url, {}, function(jsonData) {
                $.each(jsonData, function(idx, val) {
                    methods.buildItem(target, val, 1);
                });
            });

        });
    };
})(jQuery);
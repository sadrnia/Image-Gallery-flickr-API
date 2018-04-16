/*
main.js defines two methods: Extend and BuildUrl.
- extend method : Used to merge the properties of objects into one.
- buildUrl method : used to create a valid Url containing a query string,starting from a Url.
 */
(function (document, window) {
    'use strict';

    function buildUrl(url, parameters) {
        var queryString = '';
        for (var key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                queryString += encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key]) + '&';
            }
        }

        if (queryString.lastIndexOf('&') === queryString.length - 1) {
            queryString = queryString.substring(0, queryString.length - 1);
        }

        return url + '?' + queryString;
    }

    function extend(object) {
        for (var i = 1; i < arguments.length; i++) {
            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    object[key] = arguments[i][key];
                }
            }
        }

        return object;
    }

    window.Utility = {
        buildUrl: buildUrl,
        extend: extend
    };
})(document, window);
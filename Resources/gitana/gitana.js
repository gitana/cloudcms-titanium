/*
Copyright 2011 Gitana Software, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); 
you may not use this file except in compliance with the License. 

You may obtain a copy of the License at 
	http://www.apache.org/licenses/LICENSE-2.0 

Unless required by applicable law or agreed to in writing, software 
distributed under the License is distributed on an "AS IS" BASIS, 
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
See the License for the specific language governing permissions and 
limitations under the License. 

For more information, please contact Gitana Software, Inc. at this
address:

  info@gitanasoftware.com
*/
/**
 * This gets added into the Gitana Driver to ensure compilation time compatibility with
 * the Appcelerator Titanium framework.
 */
/* jQuery Sizzle - these are to fool the Ti compiler into not reporting errors! */

/**
 * The driver assumes a globally-scoped "window" variable which is a legacy of browser-compatibility.
 * Frameworks such as Titanium do not have a window root-scoped variable, so we fake one.
 *
 * At minimum, the window variable must have a setTimeout variable.
 */
if (typeof window === "undefined")
{
    window = {
        "setTimeout": function(func, seconds)
        {
            setTimeout(func, seconds);
        }
    }
}
/*
	Base.js, version 1.1a
	Copyright 2006-2010, Dean Edwards
	License: http://www.opensource.org/licenses/mit-license.php
*/

var Base = function() {
	// dummy
};

Base.extend = function(_instance, _static) { // subclass
	var extend = Base.prototype.extend;
	
	// build the prototype
	Base._prototyping = true;
	var proto = new this;
	extend.call(proto, _instance);
  proto.base = function() {
    // call this method from any other method to invoke that method's ancestor
  };
	delete Base._prototyping;
	
	// create the wrapper for the constructor function
	//var constructor = proto.constructor.valueOf(); //-dean
	var constructor = proto.constructor;
	var klass = proto.constructor = function() {
		if (!Base._prototyping) {
			if (this._constructing || this.constructor == klass) { // instantiation
				this._constructing = true;
				constructor.apply(this, arguments);
				delete this._constructing;
			} else if (arguments[0] != null) { // casting
				return (arguments[0].extend || extend).call(arguments[0], proto);
			}
		}
	};
	
	// build the class interface
	klass.ancestor = this;
	klass.extend = this.extend;
	klass.forEach = this.forEach;
	klass.implement = this.implement;
	klass.prototype = proto;
	klass.toString = this.toString;
	klass.valueOf = function(type) {
		//return (type == "object") ? klass : constructor; //-dean
		return (type == "object") ? klass : constructor.valueOf();
	};
	extend.call(klass, _static);
	// class initialisation
	if (typeof klass.init == "function") klass.init();
	return klass;
};

Base.prototype = {	
	extend: function(source, value) {
		if (arguments.length > 1) { // extending with a name/value pair
			var ancestor = this[source];
			if (ancestor && (typeof value == "function") && // overriding a method?
				// the valueOf() comparison is to avoid circular references
				(!ancestor.valueOf || ancestor.valueOf() != value.valueOf()) &&
				/\bbase\b/.test(value)) {
				// get the underlying method
				var method = value.valueOf();
				// override
				value = function() {
					var previous = this.base || Base.prototype.base;
					this.base = ancestor;
					var returnValue = method.apply(this, arguments);
					this.base = previous;
					return returnValue;
				};
				// point to the underlying method
				value.valueOf = function(type) {
					return (type == "object") ? value : method;
				};
				value.toString = Base.toString;
			}
			this[source] = value;
		} else if (source) { // extending with an object literal
			var extend = Base.prototype.extend;
			// if this object has a customised extend method then use it
			if (!Base._prototyping && typeof this != "function") {
				extend = this.extend || extend;
			}
			var proto = {toSource: null};
			// do the "toString" and other methods manually
			var hidden = ["constructor", "toString", "valueOf"];
			// if we are prototyping then include the constructor
			var i = Base._prototyping ? 0 : 1;
			while (key = hidden[i++]) {
				if (source[key] != proto[key]) {
					extend.call(this, key, source[key]);

				}
			}
			// copy each of the source object's properties to this object
			for (var key in source) {
				if (!proto[key]) extend.call(this, key, source[key]);
			}
		}
		return this;
	}
};

// initialise
Base = Base.extend({
	constructor: function() {
		this.extend(arguments[0]);
	}
}, {
	ancestor: Object,
	version: "1.1",
	
	forEach: function(object, block, context) {
		for (var key in object) {
			if (this.prototype[key] === undefined) {
				block.call(context, object[key], key, object);
			}
		}
	},
		
	implement: function() {
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "function") {
				// if it's a function, call it
				arguments[i](this.prototype);
			} else {
				// add the interface using the extend method
				this.prototype.extend(arguments[i]);
			}
		}
		return this;
	},
	
	toString: function() {
		return String(this.valueOf());
	}
});
/*
    http://www.JSON.org/json2.js
    2010-08-25

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
(function(window)
{
    Gitana = Base.extend(
    /** @lends Gitana.prototype */
    {
        /**
         * @constructs
         *
         * @class Gitana
         *
         * Configuration options should look like:
         *
         * {
         *    "serverURL": {String} base path to the Gitana server (i.e. "http://server:port")
         *                 If no value provided, then "/proxy" is assumed
         *    "ticket": {String} ticket,
         *    "ticketAsParameter": {boolean},
         *    "locale": {String}
         * }
         */
        constructor: function(config)
        {
            this.VERSION = "0.1.0";

            // copy any configuration properties onto the gitana object
            Gitana.copyInto(this, config);

            // supply any defaults
            if (!this.serverURL)
            {
                this.serverURL = "/proxy";
            }

            /**
             * Declare any priviledged methods
             */
            this.initXMLHttpClient = function() {
                var http = null;
                try {

                    if (Gitana.isTitanium())
                    {
                        http = Titanium.Network.createHTTPClient();
                    }
                    else
                    {
                        // assume browser
                        http = new XMLHttpRequest();
                    }
                }
                catch (e) {
                    // IE (?!)
                    var success = false;
                    var XMLHTTP_IDS = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];

                    for (var i = 0; i < XMLHTTP_IDS.length && !success; i++) {
                        try {
                            success = true;
                            http = new ActiveXObject(XMLHTTP_IDS[i]);
                        }
                        catch (e) {
                        }
                    }

                    if (!success) {
                        throw new Error('Unable to create XMLHttpRequest!');
                    }
                }

                return http;
            };
        },

        /**
         * Sets the default locale for interactions with the Gitana server by this driver.
         *
         * @public
         *
         * @param {String} locale locale string
         */
        setLocale: function(locale)
        {
            this.locale = locale;
        },

        /**
         * Retrieves the default locale being used by this driver.
         *
         * @returns {String} locale string
         */
        getLocale: function()
        {
            return this.locale;
        },

        /**
         * Default AJAX failure callback
         *
         * @public
         */
        defaultFailureCallback: function(http)
        {
            // if we're in debug mode, log a bunch of good stuff out to console
            if (this.debug)
            {
                if (!(typeof console === "undefined"))
                {
                    var message = "Received bad http state (" + http.status + ")";
                    var stacktrace = null;

                    var responseText = http.responseText;
                    if (responseText)
                    {
                        var json = JSON.parse(responseText);
                        if (json.message)
                        {
                            message = message + ": " + json.message;
                        }
                    }

                    if (json.stacktrace)
                    {
                        stacktrace = json.stacktrace;
                    }

                    console.log(message);
                    if (stacktrace)
                    {
                        console.log(stacktrace);
                    }
                }
            }
        },


        /**
         * Performs Ajax communication with the Gitana server.
         *
         * NOTE: For the most part, you shouldn't have to use this function since most of the things you'd want
         * to do with the Gitana server are wrapped by helper functions.
         *
         * @see Gitana.Driver#gitanaGet
         * @see Gitana.Driver#gitanaPost
         * @see Gitana.Driver#gitanaPut
         * @see Gitana.Driver#gitanaDel
         * @see Gitana.Driver#gitanaRequest
         *
         * @public
         *
         * @param {String} method The kind of method to invoke - "get", "post", "put", or "del"
         * @param {String} url The full URL to the resource being requested (i.e. "http://server:port/uri"}
         * @param {String} [contentType] In the case of a payload carrying request (i.e. not GET), the content type being sent.
         * @param {Object} [data] In the case of a payload carrying request (i.e. not GET), the data to plug into the payload.
         * @param {Object} [headers] A key/value map of headers to place into the request.
         * @param {Function} [successCallback] The function to call if the operation succeeds.
         * @param {Function} [failureCallback] The function to call if the operation fails.  If none provided, the default driver callback is used.
         */
        ajax: function(method, url, contentType, data, headers, successCallback, failureCallback)
        {
            var _this = this;

            var http = this.initXMLHttpClient();

            // treat the method
            if (method == null) {
                method = "get";
            }
            method = method.toLowerCase();

            // flags
            var json = false;
            if (contentType == "application/json")
            {
                json = true;
            }

            // error checking
            if ( (method == "post" || method == "put") && (!contentType))
            {
                Gitana.debug("Performing method: " + method + " but missing content type");
                return;
            }

            // create the connection
            if (Gitana.isTitanium()) {
                http.open(method.toUpperCase(), url, true);
            } else {
                http.open(method, url, true);
            }

            // slightly different behaviors here based on method
            if (method == "get") {
            } else if (method == "post") {
                http.setRequestHeader("Content-Type", contentType);
            } else if (method == "put") {
                http.setRequestHeader("Content-Type", contentType);
            } else if (method == "delete") {
            }

            // apply any headers
            if (headers) {
                for (key in headers) {
                    http.setRequestHeader(key, headers[key]);
                }
            }

            // detect when document is loaded
            http.onreadystatechange = function () {
                if (http.readyState == 4) {
                    if (http.status == 200) {
                        var result = "";
                        if (http.responseText) {
                            result = http.responseText;
                        }

                        // if json comes back, convert into json object
                        if (json)
                        {
                            //\n's in JSON string, when evaluated will create errors in IE
                            result = result.replace(/[\n\r]/g, "");
                            result = eval('(' + result + ')');
                        }

                        //Give the data to the callback function.
                        if (successCallback && Gitana.isFunction(successCallback)) {
                            successCallback(result);
                        }
                    }
                    else {
                        if (failureCallback && Gitana.isFunction(failureCallback)) {
                            failureCallback(http);
                        }
                    }
                }
            };

            var toSend = data;

            // special handling for json
            if (json)
            {
                if (data != null)
                {
                    var d = {};
                    Gitana.copyInto(d, data);

                    // stringify
                    toSend = Gitana.stringify(d);
                }
            }
            http.send(toSend);

            return http;
        },

        /**
         * Send an HTTP request via AJAX to the Gitana Server.
         *
         * This method will additionally make sure of the following:
         *
         *   1) That the Gitana Driver authentication ticket is plugged onto the request.
         *   2) That the Gitana Driver locale is plugged onto the request.
         *   3) That full object data is returned (including metadata).
         *
         * @public
         *
         * @param {String} method The kind of method to invoke - "get", "post", "put", or "del"
         * @param {String} url Either a full URL (i.e. "http://server:port/uri") or a URI against the driver's server URL (i.e. /repositories/...)
         * @param {Object} params parameter map
         * @param [String] contentType If the case of a payload carrying request (i.e. not GET), the content type being sent.
         * @param {Object} data In the case of a payload carrying request (i.e. not GET), the JSON to plug into the payload.
         * @param {Function} [successCallback] The function to call if the operation succeeds.
         * @param {Function} [failureCallback] The function to call if the operation fails.
         */
        gitanaRequest: function(method, url, params, contentType, data, successCallback, failureCallback)
        {
            // make sure we compute the real url
            if (Gitana.startsWith(url, "/")) {
                url = this.serverURL + url;
            }

            if (!failureCallback)
            {
                failureCallback = this.defaultFailureCallback;
            }

            var onSuccess = function(data)
            {
                if (successCallback)
                {
                    var arg = data;
                    if (contentType == "application/json")
                    {
                        arg = new Gitana.Response(data);
                    }
                    successCallback(arg);
                }
            };

            var onFailure = function(http)
            {
                if (failureCallback)
                {
                    failureCallback(http);
                }
            };

            var headers = { };
            if (this.ticket) {
                headers["GITANA_TICKET"] = this.ticket;
            }
            if (this.locale) {
                headers["accept-language"] = this.locale;
            }

            // ensure we have some params
            if (!params)
            {
                params = {};
            }

            // adjust url to include "full" as well as "metadata"
            params["metadata"] = "true";
            params["full"] = "true";

            // add in ticket if we're supposed to
            if (this.ticket && this.ticketAsParameter)
            {
                params["ticket"] = this.ticket;
            }

            // cache buster
            var cacheBuster = new Date().getTime();
            params["cb"] = cacheBuster;

            // update URL to include params
            for (var paramKey in params)
            {
                var paramValue = params[paramKey];
                if (Gitana.isFunction(paramValue))
                {
                    paramValue = paramValue.call();
                }
                else if (Gitana.isString(paramValue))
                {
                    // NOTHING TO DO
                }
                else
                {
                    paramValue = escape(Gitana.stringify(paramValue, false));
                }

                // apply
                if (url.indexOf("?") > -1)
                {
                    url = url + "&" + paramKey + "=" + paramValue;
                }
                else
                {
                    url = url + "?" + paramKey + "=" + paramValue;
                }
            }

            return this.ajax(method, url, contentType, data, headers, onSuccess, onFailure);
        },

        /**
         * Sends an HTTP GET request to the Gitana server.
         *
         * @public
         *
         * @param {String} url Either a full URL (i.e. "http://server:port/uri") or a URI against the driver's server URL (i.e. /repositories/...)
         * @param {Object} params request parameters
         * @param {Function} [successCallback] The function to call if the operation succeeds.
         * @param {Function} [failureCallback] The function to call if the operation fails.
         */
        gitanaGet: function(url, params, successCallback, failureCallback)
        {
            return this.gitanaRequest("GET", url, params, "application/json", null, successCallback, failureCallback);
        },

        /**
         * Sends an HTTP GET request to the Gitana server.
         *
         * @public
         *
         * @param {String} url Either a full URL (i.e. "http://server:port/uri") or a URI against the driver's server URL (i.e. /repositories/...)
         * @param {Object} params request parameters
         * @param {Function} [successCallback] The function to call if the operation succeeds.
         * @param {Function} [failureCallback] The function to call if the operation fails.
         */
        gitanaDownload: function(url, params, successCallback, failureCallback)
        {
            return this.gitanaRequest("GET", url, params, null, null, successCallback, failureCallback);
        },

        /**
         * Sends an HTTP POST request to the Gitana server.
         *
         * @public
         *
         * @param {String} url Either a full URL (i.e. "http://server:port/uri") or a URI against the driver's server URL (i.e. /repositories/...)
         * @param {Object} params request parameters
         * @param {Object} [jsonData] The JSON to plug into the payload.
         * @param {Function} [successCallback] The function to call if the operation succeeds.
         * @param {Function} [failureCallback] The function to call if the operation fails.
         */
        gitanaPost: function(url, params, jsonData, successCallback, failureCallback)
        {
            return this.gitanaRequest("POST", url, params, "application/json", jsonData, successCallback, failureCallback);
        },

        /**
         * Sends an HTTP POST request to the Gitana server.
         *
         * @public
         *
         * @param {String} url Either a full URL (i.e. "http://server:port/uri") or a URI against the driver's server URL (i.e. /repositories/...)
         * @param {Object} params request parameters
         * @param {String} contentType content type being sent
         * @param {Object} [jsonData] The JSON to plug into the payload.
         * @param {Function} [successCallback] The function to call if the operation succeeds.
         * @param {Function} [failureCallback] The function to call if the operation fails.
         */
        gitanaUpload: function(url, params, contentType, data, successCallback, failureCallback)
        {
            return this.gitanaRequest("POST", url, params, contentType, data, successCallback, failureCallback);
        },

        /**
         * Sends an HTTP PUT request to the Gitana server.
         *
         * @public
         *
         * @param {String} url Either a full URL (i.e. "http://server:port/uri") or a URI against the driver's server URL (i.e. /repositories/...)
         * @param {Object} params request parameters
         * @param {Object} [jsonData] The JSON to plug into the payload.
         * @param {Function} [successCallback] The function to call if the operation succeeds.
         * @param {Function} [failureCallback] The function to call if the operation fails.
         */
        gitanaPut: function(url, params, jsonData, successCallback, failureCallback)
        {
            return this.gitanaRequest("PUT", url, params, "application/json", jsonData, successCallback, failureCallback);
        },

        /**
         * Sends an HTTP DELETE request to the Gitana server.
         *
         * @public
         *
         * @param {String} url Either a full URL (i.e. "http://server:port/uri") or a URI against the driver's server URL (i.e. /repositories/...)
         * @param {Object} params request parameters
         * @param {Function} [successCallback] The function to call if the operation succeeds.
         * @param {Function} [failureCallback] The function to call if the operation fails.
         */
        gitanaDelete: function(url, params, successCallback, failureCallback)
        {
            return this.gitanaRequest("DELETE", url, params, "application/json", null, successCallback, failureCallback);
        },

        getFactory: function()
        {
            return new Gitana.ObjectFactory();
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // CHAINING METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Authenticates the driver as the given user.
         * If authenticated, a ticket is returned and stored in the driver.
         *
         * @param {String} username the user name
         * @param {String} password password
         * @param [Function] authentication failure handler
         */
        authenticate: function(username, password, authFailureHandler)
        {
            var driver = this;

            var result = this.getFactory().server(this);
            return Chain(result).then(function() {

                var chain = this;

                // authenticate
                driver.gitanaGet("/security/login", {"u": username, "p": password}, function(response) {

                    // store ticket and username onto new driver
                    driver.ticket = response.ticket;
                    driver.authenticatedUsername = username;

                    // write cookie into document (if applicable)
                    Gitana.writeCookie("GITANA_TICKET", response.ticket, "/");

                    // manually handle next()
                    chain.next();
                }, function(http) {

                    // if authentication fails, respond to custom auth failure handler
                    if (authFailureHandler)
                    {
                        authFailureHandler.call(chain, http);
                    }

                });

                // tell the chain that we'll manually handle calling next()
                return false;
            });
        },

        /**
         * Clears any authentication for the driver.
         */
        clearAuthentication: function()
        {
            this.ticket = null;

            Gitana.deleteCookie("GITANA_TICKET", "/");
        }

    });

    // STATICS
    // Special Groups

    Gitana.EVERYONE = {
        "principal-id": "EVERYONE",
        "principal-type": "GROUP"
    };

    window.Gitana = Gitana;

})(window);(function(window)
{
    /**
     * Creates a chain.  If an object is provided, the chain is augmented onto the object.
     *
     * @param object
     */
    Chain = function(object)
    {
        var generateId = function()
        {
            if (!Chain.idCount)
            {
                Chain.idCount = 0;
            }

            return "chain-" + Chain.idCount++;
        };

        if (!object)
        {
            object = {};
        }

        // wraps the object into a proxy
        var chain;
        /** @namespace */
        chain = Chain.proxy(object);


        // populate chain properties
        chain.queue = [];
        chain.response = null;
        chain.waiting = false;
        chain.id = generateId();
        chain.parent = null;

        // populate chain methods

        /**
         * Queues either a callback function, an array of callback functions or a subchain.
         *
         * @param element
         */
        chain.then = function(element)
        {
            var self = this;

            var autorun = false;

            //
            // ARRAY
            //
            // if we're given an array of functions, we'll automatically build out a function that orchestrates
            // the concurrent execution of parallel chains.
            //
            // the function will be pushed onto the queue
            //
            if (Gitana.isArray(element))
            {
                var array = element;

                // parallel function invoker
                var parallelInvoker = function()
                {
                    // counter and onComplete() method to keep track of our parallel thread completion
                    var count = 0;
                    var total = array.length;
                    var onComplete = function()
                    {
                        count++;
                        if (count == total)
                        {
                            // manually signal that we're done
                            self.next();
                        }
                    };

                    for (var i = 0; i < array.length; i++)
                    {
                        var func = array[i];

                        // use a closure
                        var x = function(func)
                        {
                            // each function gets loaded onto its own "parallel" chain
                            // the parallel chain contains a subchain and the onComplete method
                            // the parallel chain is a clone of this chain
                            // the subchain runs the function
                            // these are serial so that the subchain must complete before the onComplete method is called
                            var parallelChain = Chain(); // note: empty chain (parent)
                            parallelChain.waiting = true; // this prevents auto-run (which would ground out the first subchain call)
                            parallelChain.subchain(self).then(function() { // TODO: should we self.clone() for parallel operations?
                                func.call(this);
                            });
                            parallelChain.then(function() {
                                onComplete();
                            });
                            parallelChain.waiting = false; // switch back to normal
                            parallelChain.run();
                        };
                        x(func);
                    }

                    // return false so that we wait for manual self.next() signal
                    return false;
                };

                // build a subchain
                var subchain = this.subchain(null, true); // don't auto add, we'll do it ourselves
                subchain.queue.push(parallelInvoker);
                element = subchain;
            }

            //
            // FUNCTION
            //
            // if we're given a function, then we're being asked to execute a function serially.
            // to facilitate this, we'll wrap it in a subchain and push the subchain down into the queue.
            // the reason is just to make things a little easier and predictive of what the end user might do with
            // the chain.  they probably don't expect it to just exit out if they try to to
            //   this.then(something)
            // in other words, they should always feel like they have their own chain (which in fact they do)
            else if (Gitana.isFunction(element))
            {
                // create the subchain
                // this does a re-entrant call that adds it to the queue (as a subchain)
                var subchain = this.subchain(null, true); // don't auto add, we'll do it ourselves
                subchain.queue.push(element);
                element = subchain;

                // note: because we're given a function, we can tell this chain to try to "autorun"
                autorun = true;
            }


            // anything that arrives this far is just a subchain


            this.queue.push(element);


            // if we're able to autorun (meaning that we were told to then() a function)...
            // we climb the parents until we find the topmost parent and tell it to run.
            if (autorun && !this.waiting)
            {
                var runner = this;
                while (runner.parent)
                {
                    runner = runner.parent;
                }

                if (!runner.waiting)
                {
                    runner.run();
                }
            }

            // if nothing is currently running, see if there is something on the queue that we can burn through
            /*
            if (!this.waiting && !this.parent)
            {
                // run something off the queue
                this.run();
            }
            */

            // always hand back reference to ourselves
            return this;
        };

        /**
         * Run the next element in the queue
         */
        chain.run = function()
        {
            var self = this;

            // short cut, if nothing in the queue, bail
            if (this.queue.length == 0 || this.waiting)
            {
                return this;
            }

            // mark that we're running something
            this.waiting = true;

            // the element to run
            var element = this.queue.shift();

            // case: callback function
            if (Gitana.isFunction(element))
            {
                // it's a callback function
                var callback = element;

                // try to determine response and previous response
                var response = null;
                var previousResponse = null;
                if (this.parent)
                {
                    response = this.parent.response;
                    if (this.parent.parent)
                    {
                        previousResponse = this.parent.parent.response;
                    }
                }

                // async
                window.setTimeout(function()
                {
                    // execute with "this = chain"
                    var returned = callback.call(self, response, previousResponse);
                    if (returned !== false)
                    {
                        self.next(returned);
                    }
                }, 0);
            }
            else
            {
                // it's a subchain
                // tell it to run
                var subchain = element;
                subchain.response = this.response; // copy response down into it first
                subchain.run();
            }

            return this;
        };

        /**
         * Creates a subchain and adds it to the queue.
         *
         * If no argument is provided, the generated subchain will be cloned from the current chain element.
         */
        chain.subchain = function(object, noAutoAdd)
        {
            if (!object)
            {
                object = this;
            }

            var subchain = Chain(object);
            subchain.parent = this;

            if (!noAutoAdd)
            {
                this.then(subchain)
            }

            return subchain;
        };

        /**
         * Completes the current element in the chain and provides the response that was generated.
         *
         * The response is pushed into the chain as the current response and the current response is bumped
         * back as the previous response.
         *
         * If the response is null, nothing will be bumped.
         *
         * @param [Object] response
         */
        chain.next = function(response)
        {
            // toggle responses
            if (typeof response !== "undefined")
            {
                this.response = response;
            }

            // no longer processing callback
            this.waiting = false;

            // if there isn't anything left in the queue, then we're done
            // if we have a parent, we can signal that we've completed
            if (this.queue.length == 0)
            {
                if (this.parent)
                {
                    // copy response up to parent
                    var r = this.response;
                    this.parent.response = r;
                    delete this.response;

                    // inform parent that we're done
                    this.parent.next();
                }

                // clear parent so that this chain can be relinked
                this.parent = null;
                this.queue = [];
            }
            else
            {
                // run the next element in the queue
                this.run();
            }
        };

        /**
         * Tells the chain to sleep the given number of milliseconds
         */
        chain.wait = function(ms)
        {
            return this.then(function() {

                var wake = function(chain)
                {
                    return function()
                    {
                        chain.next();
                    };
                }(this);

                window.setTimeout(wake, ms);

                return false;
            });
        };

        /**
         * Registers an error handler;
         *
         * @param errorHandler
         */
        chain.trap = function(errorHandler)
        {
            this.errorHandler = errorHandler;

            return this;
        };

        /**
         * Handles the error.
         *
         * @param err
         */
        chain.error = function(err)
        {
            // find the first error handler we can walking up the chain
            var errorHandler = null;
            var ancestor = this;
            while (ancestor && !errorHandler)
            {
                errorHandler = ancestor.errorHandler;
                if (!errorHandler)
                {
                    ancestor = ancestor.parent;
                }
            }

            // clean up the chain so that it can still be used
            this.queue = [];
            this.response = null;

            // disconnect and stop the parent from processing
            if (this.parent)
            {
                this.parent.queue = [];
                this.parent.waiting = false;
            }

            // invoke error handler
            if (errorHandler)
            {
                errorHandler.call(this, err);

                // finish out the chain
                this.next();
            }
        };

        /**
         * Creates a new chain for this object
         */
        chain.chain = function()
        {
            return Chain(this).then(function() {
                // empty chain to kick start
            });
        };


        // if there is already a clone property, don't override it
        if (!chain.clone)
        {
            /**
             * Clones this chain and resets chain properties.
             */
            chain.clone = function()
            {
                var object = {};

                // copies properties
                Gitana.copyInto(object, this);

                Chain(object);

                return object;
            };
        }

        return chain;
    };

    /**
     * Wraps the given object into a proxy.
     *
     * If the object is an existing proxy, it is unpackaged and re-proxied.
     * @param o
     */
    Chain.proxy = function(o)
    {
        if (o.original)
        {
            o = Chain.unproxy(o);
        }

        // wraps the object into a proxy
        function Z() {};
        Z.prototype = o;
        var proxy = new Z();
        proxy.original = o;
        proxy.proxy = true;

        return proxy;
    };

    /**
     * Hands back the original object for a proxy.
     *
     * @param proxy
     */
    Chain.unproxy = function(proxy)
    {
        var o = null;

        if (proxy.original)
        {
            o = proxy.original;
        }

        return o;
    }

})(window);(function(window)
{
    var Gitana = window.Gitana;

    Gitana.Chainable = Base.extend(
    /** @lends Gitana.Chainable.prototype */
    {
        /**
         * @constructs
         *
         * @param {Gitana.Driver} driver
         *
         * @class Provides common chaining functions used by various interface methods
         */
        constructor: function(driver)
        {
            var self = this;

            this.base();


            ///////////////////////////////////////////////////////////////////////////////////////////////////////
            //
            // privileged methods
            //
            ///////////////////////////////////////////////////////////////////////////////////////////////////////

            this.getDriver = function()
            {
                return driver;
            };

            this.getFactory = function()
            {
                return new Gitana.ObjectFactory();
            };

            this.httpError = function(http)
            {
                var err = new Error();
                err.name = "Http Error";
                err.message = JSON.parse(http.responseText).message;
                err.http = http;

                this.error(err);

                return false;
            };

            this.missingNodeError = function(id)
            {
                var err = new Error();
                err.name = "Missing Node error";
                err.message = "The node: " + id + " could not be found";

                this.error(err);

                return false;
            };




            /////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED
            // CHAIN HANDLERS
            //
            /////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Helper to produce the next link in the chain
             *
             * If chainable is an object, it will be wrapped in a subchain function.
             * If chainable is false or null or this, then "this" is handed back.
             *
             * The reason we hand "this" back is because the call to then() will automatically build a subchain
             * for the current object.  No sense doing it twice.
             *
             * @param chainable
             */
            this.link = function(chainable)
            {
                /*
                if (!chainable || chainable == this)
                {
                    return this;
                }
                */

                return this.subchain(chainable);
            };

            /**
             * Performs a GET from the server and populates the chainable.
             * Proceeds with the chain as bound to the chainable.
             *
             * @param chainable
             * @param uri
             * @param params
             */
            this.chainGet = function(chainable, uri, params)
            {
                var self = this;

                return this.link(chainable).then(function() {

                    var chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    driver.gitanaGet(uri, params, function(response) {
                        chain.handleResponse(response);
                        chain.next();
                    }, function(http) {
                        self.httpError(http);
                    });

                    // NOTE: we return false to tell the chain that we'll manually call next()
                    return false;
                });
            };

            /**
             * Creates an object on the server (write + read).
             * Proceeds with the chain as bound to the chainable.
             *
             * @param chainable
             * @param object
             * @param uri
             * @param params
             */
            this.chainCreate = function(chainable, object, uri, params)
            {
                var self = this;

                return this.link(chainable).then(function() {

                    var chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    // create
                    driver.gitanaPost(uri, params, object, function(status) {
                        driver.gitanaGet(uri + "/" + status.getId(), null, function(response) {
                            chain.handleResponse(response);
                            chain.next();
                        }, function(http) {
                            self.httpError(http);
                        });
                    }, function(http) {
                        self.httpError(http);
                    });

                    // NOTE: we return false to tell the chain that we'll manually call next()
                    return false;
                });
            };

            /**
             * Creates an object on the server using one URL and then reads it back using another URL.
             * This exists because the security responses don't include _doc fields like other responses.
             *
             * Proceeds with the chain as bound to the chainable.
             *
             * @param chainable
             * @param object
             * @param createUri
             * @param readUri
             */
            this.chainCreateEx = function(chainable, object, createUri, readUri)
            {
                return this.link(chainable).then(function() {

                    var chain = this;

                    // create
                    driver.gitanaPost(createUri, null, object, function(status) {
                        driver.gitanaGet(readUri, null, function(response) {
                            chain.handleResponse(response);
                            chain.next();
                        }, function(http) {
                            self.httpError(http);
                        });
                    }, function(http) {
                        self.httpError(http);
                    });

                    // NOTE: we return false to tell the chain that we'll manually call next()
                    return false;
                });
            };

            /**
             * Performs a POST to the server and populates the chainable with results.
             * Proceeds with the chain as bound to the chainable.
             *
             * @param chainable
             * @param uri
             * @param params
             * @param payload
             */
            this.chainPost = function(chainable, uri, params, payload)
            {
                var self = this;

                return this.link(chainable).then(function() {

                    var chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    // create
                    driver.gitanaPost(uri, params, payload, function(response) {
                        chain.handleResponse(response);
                        chain.next();
                    }, function(http) {
                        self.httpError(http);
                    });

                    // NOTE: we return false to tell the chain that we'll manually call next()
                    return false;
                });
            };

            /**
             * Performs a POST to the server.  The response is not handled.
             * Proceeds with the chain as bound to the chainable.
             *
             * @param chainable
             * @param uri
             * @param params
             * @param payload (optional)
             * @param contentType (optional) - example "text/plain"
             */
            this.chainPostEmpty = function(chainable, uri, params, payload, contentType)
            {
                var self = this;

                // if no payload, set to empty
                if (!payload)
                {
                    payload = {};
                }

                return this.link(chainable).then(function() {

                    var chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    // create
                    driver.gitanaPost(uri, params, payload, function(response) {
                        chain.next();
                    }, function(http) {
                        self.httpError(http);
                    });

                    // NOTE: we return false to tell the chain that we'll manually call next()
                    return false;
                });
            };

            /**
             * Performs a POST to the server.  The response is not handled.
             * Proceeds with the chain as bound to the chainable.
             *
             * @param chainable
             * @param uri
             * @param params
             * @param contentType (optional) - example "text/plain"
             * @param payload (optional)
             */
            this.chainUpload = function(chainable, uri, params, contentType, payload)
            {
                var self = this;

                // if no payload, leave f
                if (!payload)
                {
                    payload = {};
                }

                return this.link(chainable).then(function() {

                    var chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    // create
                    driver.gitanaUpload(uri, params, contentType, payload, function(response) {
                        chain.next();
                    }, function(http) {
                        self.httpError(http);
                    });

                    // NOTE: we return false to tell the chain that we'll manually call next()
                    return false;
                });
            };

            /**
             * Performs a GET to the server and pushes the response into the chain.
             * Proceeds with the chain as bound to the chainable.
             *
             * @param chainable
             * @param uri
             * @param params
             */
            this.chainGetResponse = function(chainable, uri, params)
            {
                var self = this;

                return this.link(chainable).then(function() {

                    var chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    driver.gitanaGet(uri, params, function(response) {
                        chain.next(response);
                    }, function(http) {
                        self.httpError(http);
                    });

                    // NOTE: we return false to tell the chain that we'll manually call next()
                    return false;
                });
            };

            /**
             * Performs a GET to the server and pushes the "rows" response attribute into the chain.
             * Proceeds with the chain as bound to the chainable.
             *
             * @param chainable
             * @param uri
             * @param params
             */
            this.chainGetResponseRows = function(chainable, uri, params)
            {
                return this.chainGetResponse(chainable, uri, params).then(function() {
                    return this.response["rows"];
                });
            };

            /**
             * Performs a GET to the server and checks whether the "rows" array attribute of the response
             * has the given value.
             *
             * Proceeds with the chain as bound to the chainable.
             *
             * @param chainable
             * @param uri
             * @param value
             */
            this.chainHasResponseRow = function(chainable, uri, value)
            {
                return this.chainGetResponse(chainable, uri).then(function() {
                    var authorized = false;
                    for (var i = 0; i < this.response.rows.length; i++)
                    {
                        if (this.response.rows[i].toLowerCase() == value.toLowerCase())
                        {
                            authorized = true;
                        }
                    }
                    return authorized;
                });
            };

            /**
             * Helper to gets the principal id for a principal object, json structure or principal id itself.
             *
             * @param principal
             */
            this.extractPrincipalId = function(principal)
            {
                var principalId = null;
                if (Gitana.isString(principal))
                {
                    principalId = principal;
                }
                else
                {
                    if (principal.getPrincipalId)
                    {
                        principalId = principal.getPrincipalId();
                    }
                    else
                    {
                        principalId = principal["principal-id"];
                    }
                }

                return principalId;
            }
        }

    });

})(window);
(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Response = Base.extend(
    /** @lends Gitana.Response.prototype */
    {
        /**
         * @constructs
         *
         * @class Gitana Response that wraps a response document from the Gitana server.
         *
         * @param {Object} object json response object
         */
        constructor: function(object)
        {
            Gitana.copyInto(this, object);
        },

        /**
         * Gets the id ("_doc") field of the response (if one is available).
         *
         * @public
         *
         * @returns {String} id
         */
        getId: function()
        {
            return this["_doc"];
        },

        /**
         * Indicates whether this response is a Status Document.
         *
         * @public
         *
         * @returns {Boolean} whether this is a status document
         */
        isStatusDocument: function()
        {
            return (this["ok"] || this["error"]);
        },

        /**
         * Indicates whether this response is a List Document.
         *
         * @public
         *
         * @returns {Boolean} whether this is a list document
         */
        isListDocument: function()
        {
            return this["total_rows"] && this["rows"] && this["offset"];
        },

        /**
         * Indicates whether this response is a Data Document.
         *
         * @public
         *
         * @returns {Boolean} whether this is a data document
         */
        isDataDocument: function()
        {
            return (!this.isStatusDocument() && !this.isListDocument());
        },

        /**
         * Indicates whether the response is "ok".
         *
         * @public
         *
         * @returns {Boolean} whether the response is "ok"
         */
        isOk: function()
        {
            // assume things are ok
            var ok = true;

            if (this.isStatusDocument()) {
                if (this["ok"] != null) {
                    ok = this["ok"];
                }
            }

            // any document type can specify an error
            if (this["error"]) {
                ok = false;
            }

            return ok;
        },

        /**
         * Indicates whetehr the response is in an error state.
         *
         * @public
         *
         * @returns {Boolean} whether the response is in an error state
         */
        isError: function()
        {
            return !this.isOk();
        }

    });

})(window);
(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.SystemMetadata = Base.extend(
    /** @lends Gitana.SystemMetadata.prototype */
    {
        /**
         * @constructs
         *
         * @class System Metadata
         *
         * @param {Object} object the system metadata json object
         */
        constructor: function()
        {
            this.base();

            this._system = {};
        },

        updateFrom: function(json)
        {
            // clear old system properties
            for (var i in this._system) {
                if (this._system.hasOwnProperty(i)) {
                    delete this._system[i];
                }
            }

            Gitana.copyInto(this._system, json);
        },

        get: function(key)
        {
            return this._system[key];
        },

        /**
         * Retrieves the changeset id.
         *
         * @public
         *
         * @return the changeset id
         */
        getChangesetId: function()
        {
            return this.get("changeset");
        },

        /**
         * Retrieves the id of the user who created this object.
         *
         * @public
         *
         * @return the user id of the creator
         */
        getCreatedBy: function()
        {
            return this.get("created_by");
        },

        /**
         * Retrieves the id of the user who modified this object.
         *
         * @public
         *
         * @return the user id of the modifier
         */
        getModifiedBy: function()
        {
            return this.get("modified_by");
        },

        /**
         * Retrieves the timestamp for creation of this object.
         *
         * @public
         *
         * @return creation timestamp
         */
        getCreatedOn: function()
        {
            if (!this.createdOn)
            {
                this.createdOn = new Gitana.Timestamp(this.get("created_on"));
            }

            return this.createdOn;
        },

        /**
         * Retrieves the timestamp for modification of this object.
         *
         * @public
         *
         * @return modification timestamp
         */
        getModifiedOn: function()
        {
            if (!this.modifiedOn)
            {
                this.modifiedOn = new Gitana.Timestamp(this.get("modified_on"));
            }

            return this.modifiedOn;
        }
        
    });
    
})(window);
(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Timestamp = Base.extend(
    /** @lends Gitana.Timestamp.prototype */
    {
        /**
         * @constructs
         *
         * @class Timestamp
         *
         * @param {Object} object the timestamp json object
         */
        constructor: function(object)
        {
            this.base(object);
        },

        /**
         * @returns {Integer} the year
         */
        getYear: function()
        {
            return this["year"];
        },

        /**
          @returns {Integer} the month
         */
        getMonth: function()
        {
            return this["month"];
        },

        /**
         * @returns {Integer} the day of the month
         */
        getDay: function()
        {
            return this["day_of_month"];
        },

        /**
         * @returns {Integer} the hour of the day (24 hour clock)
         */
        getHour: function()
        {
            return this["hour"];
        },

        /**
         * @returns {Integer} the minute
         */
        getMinute: function()
        {
            return this["minute"];
        },

        /**
         * @returns {Integer} the second
         */
        getSecond: function()
        {
            return this["second"];
        },

        /**
         * @returns {Integer} the millisecond (0-1000)
         */
        getMillisecond: function()
        {
            return this["millisecond"];
        },

        /**
         * @returns {Integer} absolute millisecond
         */
        getTime: function()
        {
            return this["ms"];
        },

        /**
         * @returns {String} text-friendly timestamp
         */
        getTimestamp: function()
        {
            return this["timestamp"];
        }

    });
    
})(window);
(function(window)
{
    Gitana.uniqueIdCounter = 0;

    /**
     * Builds an array from javascript method arguments.
     *
     * @inner
     *
     * @param {arguments} arguments
     *
     * @returns {Array} an array
     */
    Gitana.makeArray = function(args) {
        return Array.prototype.slice.call(args);
    };

    /**
     * Serializes a object into a JSON string and optionally makes it pretty by indenting.
     *
     * @inner
     *
     * @param {Object} object The javascript object.
     * @param {Boolean} pretty Whether the resulting string should have indentation.
     *
     * @returns {String} string
     */
    Gitana.stringify = function(object, pretty) {

        var val = null;
        if (pretty)
        {
            val = JSON.stringify(object, null, "  ");
        }
        else
        {
            val = JSON.stringify(object);
        }

        return val;
    };

    /**
     * Determines whether the given argument is a String.
     *
     * @inner
     *
     * @param arg argument
     *
     * @returns {Boolean} whether it is a String
     */
    Gitana.isString = function( arg ) {
        return (typeof arg == "string");
    };

    /**
     * Determines whether the given argument is a Boolean.
     *
     * @inner
     *
     * @param arg argument
     *
     * @returns {Boolean} whether it is a Boolean
     */
    Gitana.isBoolean = function( arg ) {
        return (typeof arg == "boolean");
    };

    /**
     * Determines whether the given argument is a Function.
     *
     * @inner
     *
     * @param arg argument
     *
     * @returns {Boolean} whether it is a Function
     */
    Gitana.isFunction = function(arg) {
        return Object.prototype.toString.call(arg) === "[object Function]";
    };

    /**
     * Determines whether a bit of text starts with a given prefix.
     *
     * @inner
     *
     * @param {String} text A bit of text.
     * @param {String} prefix The prefix.
     *
     * @returns {Boolean} whether the text starts with the prefix.
     */
    Gitana.startsWith = function(text, prefix) {
        return text.substr(0, prefix.length) === prefix;
    };

    /**
     * Copies the members of the source object into the target object.
     * This includes both properties and functions from the source object.
     *
     * @inner
     *
     * @param {Object} target Target object.
     * @param {Object} source Source object.
     */
    Gitana.copyInto = function(target, source) {
        for (var i in source) {
            if (source.hasOwnProperty(i) && !this.isFunction(source[i])) {
                target[i] = source[i];
            }
        }
    };

    Gitana.isArray = function(obj)
    {
        return obj.push && obj.slice;
    };

    Gitana.isUndefined = function(obj)
    {
        return (typeof obj == "undefined");
    };

    Gitana.isEmpty = function(obj)
    {
        return this.isUndefined(obj) || obj == null;
    };

    Gitana.generateId = function()
    {
        Gitana.uniqueIdCounter++;
        return "gitana-" + Gitana.uniqueIdCounter;
    };

    Gitana.isNode = function(o)
    {
        return (
                typeof Node === "object" ? o instanceof Node :
                        typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string");
    };

    Gitana.isElement = function(o)
    {
        return (
                typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
                        typeof o === "object" && o.nodeType === 1 && typeof o.nodeName==="string");
    };

    Gitana.debug = function(str)
    {
        if (!this.isUndefined(console))
        {
            console.log(str);
        }
    };

    Gitana.error = function(str)
    {
        if (!this.isUndefined(console))
        {
            console.error(str);
        }
    };

    Gitana.getNumberOfKeys = function(map)
    {
        var count = 0;
        for (var key in map) {
            count++;
        }

        return count;
    };

    /**
     * Determines whether the JavaScript engine is running on Titanium
     */
    Gitana.isTitanium = function()
    {
        var isTitanium = true;

        if (typeof Titanium === "undefined")
        {
            isTitanium = false;
        }

        return isTitanium;
    };

    /**
     * Writes a cookie to the browser document (if running in a browser)
     *
     * @param cookieName
     * @param cookieValue
     * @param path
     */
    Gitana.writeCookie = function(cookieName, cookieValue, path)
    {
        if (typeof(document) !== "undefined")
        {
            if (!path)
            {
                path = "/";
            }

            document.cookie = cookieName + "=" + cookieValue + ";expires=;path=" + path;
        }
    };

    Gitana.deleteCookie = function(cookieName, path)
    {
        if (typeof(document) !== "undefined")
        {
            document.cookie = cookieName + "=" + ";path=" + path + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
        }
    };

})(window);(function(window)
{
    var Gitana = window.Gitana;
    
    /**
     * Object factory
     *
     * Produces object instances (nodes included) for given json.
     */
    Gitana.ObjectFactory = Base.extend(
    /** @lends Gitana.ObjectFactory.prototype */
    {
        constructor: function()
        {
            this.create = function(klass, existing, object)
            {
                var created = new klass(existing, object);

                return created;
            }
        },

        server: function(driver)
        {
            return this.create(Gitana.Server, driver);
        },

        auditRecord: function(server, object)
        {
            return this.create(Gitana.AuditRecord, server, object);
        },

        repository: function(server, object)
        {
            return this.create(Gitana.Repository, server, object);
        },

        changeset: function(repository, object)
        {
            return this.create(Gitana.Changeset, repository, object);
        },

        branch: function(repository, object)
        {
            return this.create(Gitana.Branch, repository, object);
        },

        /**
         * Creates a node
         *
         * @param branch
         * @param object either object or the string type id
         */
        node: function(branch, object)
        {
            var objectClass = null;

            if (object)
            {
                // allow for object to be the type id
                if (Gitana.isString(object))
                {
                    object = {
                        "_type": object
                    };
                }

                // see if we can derive a more accurate type
                var type = object["_type"];
                if (type)
                {
                    if (Gitana.ObjectFactory.registry[type])
                    {
                        objectClass = Gitana.ObjectFactory.registry[type];
                    }
                }
                if (!objectClass)
                {
                    // allow default trip through to association for association types
                    if (type && Gitana.startsWith(type, "a:"))
                    {
                        objectClass = Gitana.Association;
                    }
                }
                if (!objectClass)
                {
                    // check out if it says its an association via special key
                    if (object["_is_association"])
                    {
                        objectClass = Gitana.Association;
                    }
                }
            }
            if (!objectClass)
            {
                // assume node
                objectClass = Gitana.Node;
            }

            // instantiate and set any properties
            return this.create(objectClass, branch, object);
        },

        association: function(branch, object)
        {
            return this.create(Gitana.Association, branch, object);
        },

        securityUser: function(server, object)
        {
            return this.create(Gitana.SecurityUser, server, object);
        },

        securityGroup: function(server, object)
        {
            return this.create(Gitana.SecurityGroup, server, object);
        },

        definition: function(branch, object)
        {
            return this.create(Gitana.Definition, branch, object);
        },

        form: function(branch, object)
        {
            return this.create(Gitana.Form, branch, object);
        },


        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // MAPS
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////

        auditRecordMap: function(server, object)
        {
            return this.create(Gitana.AuditRecordMap, server, object);
        },

        branchMap: function(repository, object)
        {
            return this.create(Gitana.BranchMap, repository, object);
        },

        changesetMap: function(repository, object)
        {
            return this.create(Gitana.ChangesetMap, repository, object);
        },

        nodeMap: function(branch, object)
        {
            return this.create(Gitana.NodeMap, branch, object);
        },

        principalMap: function(server, object)
        {
            return this.create(Gitana.PrincipalMap, server, object);
        },

        repositoryMap: function(server, object)
        {
            return this.create(Gitana.RepositoryMap, server, object);
        },


        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // TRAVERSAL RESULTS
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////

        traversalResults: function(branch, object)
        {
            return this.create(Gitana.TraversalResults, branch, object);
        }

    });

    // static methods for registration
    Gitana.ObjectFactory.registry = { };
    Gitana.ObjectFactory.register = function(qname, objectClass)
    {
        Gitana.ObjectFactory.registry[qname] = objectClass;
    };

})(window);
(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AbstractPersistable = Gitana.Chainable.extend(
    /** @lends Gitana.AbstractPersistable.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Chainable
         *
         * @class Abstract base class for abstract objects and maps
         *
         * @param {Gitana.Server} server Gitana server instance.
         * @param [Object] object
         */
        constructor: function(server, object)
        {
            this.base(server.getDriver());

            ///////////////////////////////////////////////////////////////////////////////////////////////////////
            //
            // privileged methods
            //
            ///////////////////////////////////////////////////////////////////////////////////////////////////////

            this.getServer = function()
            {
                return server;
            };


            // auto-load response
            if (!this.object)
            {
                this.object = {};
            }
            if (object)
            {
                this.handleResponse.call(this, object);
            }
        },

        /**
         * @EXTENSION_POINT
         *
         * Convert the json response object into the things we want to preserve on the object.
         * This should set the "object" property but may choose to set other properties as well.
         *
         * @param response
         */
        handleResponse: function(response)
        {
            // remove existing object properties
            for (var i in this.object) {
                if (this.object.hasOwnProperty(i) && !Gitana.isFunction(this.object[i])) {
                    delete this.object[i];
                }
            }

            // special handling - if response contains "_ref", remove it
            delete response["_ref"];

            Gitana.copyInto(this.object, response);

            this.handleSystemProperties();
        },

        /**
         * Gets called after the response is handled and allows the object to pull out special values from
         * the "object" field so that they don't sit on the JSON object
         */
        handleSystemProperties: function()
        {

        }

    });

})(window);
(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AbstractMap = Gitana.AbstractPersistable.extend(
    /** @lends Gitana.AbstractMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPersistable
         *
         * @class Abstract base class for a map of Gitana objects
         *
         * @param {Gitana.Server} server
         * @param [Object] object
         */
        constructor: function(server, object)
        {
            if (!this.map)
            {
                this.map = {};
            }
            if (!this.keys)
            {
                this.keys = [];
            }

            this.base(server, object);
        },

        clear: function()
        {
            // empty the map
            for (var i in this.map) {
                if (this.map.hasOwnProperty(i)) {
                    delete this.map[i];
                }
            }

            // NOTE: we can't use slice(0,0) to do this since that hands back a NEW array!
            // we need the keys and map variables to remain on the non-proxied subobject
            // if we create a new array, they get pushed up to top-scope object
            // empty the keys
            while (this.keys.length > 0)
            {
                this.keys.shift();
            }
        },

        /**
         * @override
         *
         * Convert the json response object into the things we want to preserve on the object.
         * This should set the "object" property but may choose to set other properties as well.
         *
         * @param response
         */
        handleResponse: function(response)
        {
            this.base(response);

            this.clear();

            if (response)
            {
                // parse array
                if (Gitana.isArray(response.rows))
                {
                    for (var i = 0; i < response.rows.length; i++)
                    {
                        var o = this.buildObject(response.rows[i]);
                        this.map[o.getId()] = o;

                        this.keys.push(o.getId());
                    }
                }
                else
                {
                    // parse object

                    for (var key in response.rows)
                    {
                        var value = response.rows[key];

                        var o = this.buildObject(value);
                        this.map[o.getId()] = o;

                        this.keys.push(o.getId());
                    }
                }
            }

            //this.object = response;
        },

        /**
         * @abstract
         * ABSTRACT METHOD
         *
         * @param json
         */
        buildObject: function(json)
        {

        },

        get: function(key)
        {
            return this.map[key];
        },

        /**
         * Iterates over the map and fires the callback function in SERIAL for each element in the map.
         * The scope for the callback is the object from the map (i.e. repository object, node object).
         *
         * The arguments to the callback function are (key, value) where value is the same as "this".
         *
         * NOTE: This works against elements in the map in SERIAL.  One at a time.  If you are doing concurrent
         * remote operations for members of the set such that each operation is independent, you may want to use
         * the eachX() method.
         *
         * @chained this
         *
         * @param callback
         */
        each: function(callback)
        {
            return this.then(function() {

                // run functions
                for (var i = 0; i < this.keys.length; i++)
                {
                    // key and value from the map
                    var key = this.keys[i];
                    var value = this.map[key];

                    // a function that fires our callback
                    // wrap in a closure so that we store the callback and key
                    // note: this = the value wrapped in a chain, so we don't pass in value
                    var f = function(callback, key, index)
                    {
                        return function()
                        {
                            callback.call(this, key, this, index);
                        };

                    }(callback, key, i);

                    // create subchain mounted on this chainable and the run function
                    this.subchain(value).then(f);
                }

                return this;
            });
        },

        /**
         * Iterates over the map and fires the callback function in PARALLEL for each element in the map.
         * The scope for the callback is the object from the map (i.e. repository object, node object).
         *
         * The arguments to the callback function are (key, value) where value is the same as "this".
         *
         * NOTE: This works against elements in the map in PARALLEL.  All map members are fired against at the same
         * time on separate timeouts.  There is no guaranteed order for their completion.  If you require serial
         * execution, use the each() method.
         *
         * @chained
         *
         * @param callback
         */
        eachX: function(callback)
        {
            return this.then(function() {

                // create an array of functions that invokes the callback for each element in the array
                var functions = [];
                for (var i = 0; i < this.keys.length; i++)
                {
                    var key = this.keys[i];
                    var value = this.map[key];

                    var f = function(callback, key, value, index) {

                        return function()
                        {
                            // NOTE: we're running a parallel chain that is managed for us by the Chain then() method.
                            // we can't change the parallel chain but we can subchain from it
                            // in our subchain we run our method
                            // the parallel chain kind of acts like one-hop noop so that we can take over and do our thing
                            this.subchain(value).then(function() {
                                callback.call(this, key, this, index);
                            });
                        };

                    }(callback, key, value, i);

                    functions.push(f);
                }

                // kick off all these functions in parallel
                // adding them to the subchain
                return this.then(functions)

            });
        },

        /**
         * Iterates over the map and applies the callback filter function to each element.
         * It should hand back true if it wants to keep the value and false to remove it.
         *
         * NOTE: the "this" for the callback is the object from the map.
         *
         * @chained
         *
         * @param callback
         */
        filter: function(callback)
        {
            return this.then(function() {

                var keysToKeep = [];
                var keysToRemove = [];

                for (var i = 0; i < this.keys.length; i++)
                {
                    var key = this.keys[i];
                    var object = this.map[key];

                    var keepIt = callback.call(object);
                    if (keepIt)
                    {
                        keysToKeep.push(key);
                    }
                    else
                    {
                        keysToRemove.push(key);
                    }
                }

                // remove any keys we don't want from the map
                for (var i = 0; i < keysToRemove.length; i++)
                {
                    delete this.map[keysToRemove[i]];
                }

                // swap keys to keep
                // NOTE: we first clear the keys but we can't use slice(0,0) since that produces a NEW array
                // instead, do this shift trick
                while (this.keys.length > 0)
                {
                    this.keys.shift();
                }
                for (var i = 0; i < keysToKeep.length; i++)
                {
                    this.keys.push(keysToKeep[i]);
                }
            });
        },

        /**
         * Applies a comparator to sort the map.
         *
         * If no comparator is applied, the map will be sorted by its modification timestamp (if possible).
         *
         * The comparator can be a string that uses dot-notation to identify a field in the JSON that
         * should be sorted.  (example: "title" or "property1.property2.property3")
         *
         * Finally, the comparator can be a function.  It takes (previousValue, currentValue) and hands back:
         *   -1 if the currentValue is less than the previousValue (should be sorted lower)
         *   0 if they are equivalent
         *   1 if they currentValue is greater than the previousValue (should be sorted higher)
         *
         * @chained
         *
         * @param comparator
         */
        sort: function(comparator)
        {
            return this.then(function() {

                this.keys.sort(comparator);

            });
        },

        /**
         * Limits the number of elements in the map.
         *
         * @chained
         *
         * @param size
         */
        limit: function(size)
        {
            return this.then(function() {

                var keysToRemove = [];

                if (size > this.keys.length)
                {
                    // keep everything
                    return;
                }

                // figure out which keys to remove
                for (var i = 0; i < this.keys.length; i++)
                {
                    if (i >= size)
                    {
                        keysToRemove.push(this.keys[i]);
                    }
                }

                // truncate the keys
                // NOTE: we can't use slice here since that produces a new array
                while (this.keys.length > size)
                {
                    this.keys.pop();
                }

                // remove any keys to remove from map
                for (var i = 0; i < keysToRemove.length; i++)
                {
                    delete this.map[keysToRemove[i]];
                }
            });
        },

        /**
         * Counts the number of elements in the map and stores it as a response for future then() calls.
         */
        count: function(callback)
        {
            return this.then(function() {
                callback.call(this, this.keys.length);
            });
        },

        /**
         * Keeps the first element in the map
         */
        keepOne: function()
        {
            var self = this;

            var chainable = this.buildObject({});

            var result = this.subchain(chainable);

            result.subchain(self).then(function() {

                if (this.keys.length > 0)
                {
                    var obj = this.map[this.keys[0]];

                    if (result.loadFrom)
                    {
                        // for objects, like nodes or branches
                        result.loadFrom(obj);
                    }
                    else
                    {
                        // non-objects? (i.e. binary or attachment maps)
                        result.handleResponse(obj.object);
                    }
                }
                else
                {
                    var err = new Error();
                    err.name = "Empty Map";
                    err.message = "The map doesn't have any elements in it";
                    this.error(err);
                }

            });

            return result;
        }

    });

})(window);
(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AbstractObject = Gitana.AbstractPersistable.extend(
    /** @lends Gitana.AbstractObject.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPersistable
         *
         * @class Abstract base class for Gitana document objects.
         *
         * @param {Gitana.Server} server
         * @param [Object] object
         */
        constructor: function(server, object)
        {
            if (!this.system)
            {
                this.system = new Gitana.SystemMetadata();
            }


            ///////////////////////////////////////////////////////////////////////////////////////////////
            //
            // INSTANCE CHAINABLE METHODS
            //
            ///////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Executes an HTTP delete for this object and continues the chain with the chainable.
             *
             * @param chainable
             * @param uri
             * @param params
             */
            this.chainDelete = function(chainable, uri, params)
            {
                var self = this;

                return this.link(chainable).then(function() {

                    var chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    // delete
                    chain.getDriver().gitanaDelete(uri, params, function() {
                        chain.next();
                    }, function(http) {
                        self.httpError(http);
                    });

                    // NOTE: we return false to tell the chain that we'll manually call next()
                    return false;
                });
            };

            /**
             * Reloads this object from the server and then passes control to the chainable.
             *
             * @param uri
             * @param params
             */
            this.chainReload = function(chainable, uri, params)
            {
                var self = this;

                return this.link(chainable).then(function() {

                    var chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    // reload
                    chain.getDriver().gitanaGet(uri, params, function(obj) {
                        chain.handleResponse(obj);
                        chain.next();
                    }, function(http) {
                        self.httpError(http);
                    });

                    // NOTE: we return false to tell the chain that we'll manually call next()
                    return false;
                });
            };

            /**
             * Executes an update (write + read) of this object and then passes control to the chainable.
             *
             * @param chainable
             * @param uri
             * @param params
             */
            this.chainUpdate = function(chainable, uri, params)
            {
                var self = this;

                return this.link(chainable).then(function() {

                    var chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    // delete
                    chain.getDriver().gitanaPut(uri, params, chain.object, function() {
                        chain.getDriver().gitanaGet(uri, params, function(obj) {
                            chain.handleResponse(obj);
                            chain.next();
                        }, function(http) {
                            self.httpError(http);
                        });
                    }, function(http) {
                        self.httpError(http);
                    });

                    // NOTE: we return false to tell the chain that we'll manually call next()
                    return false;
                });
            };


            // finally chain to parent prototype
            this.base(server, object);
        },

        /**
         * @EXTENSION_POINT
         */
        getUri: function()
        {
            return null;
        },

        getDownloadUri: function()
        {
            return this.getDriver().serverURL + this.getUri();
        },

        /**
         * Get a json property
         *
         * @param key
         */
        get: function(key)
        {
            return this.object[key];
        },

        /**
         * Set a json property
         *
         * @param key
         * @param value
         */
        set: function(key ,value)
        {
            this.object[key] = value;
        },

        /**
         * Hands back the ID ("_doc") of this object.
         *
         * @public
         *
         * @returns {String} id
         */
        getId: function()
        {
            return this.get("_doc");
        },

        /**
         * Hands back the system metadata for this object.
         *
         * @public
         *
         * @returns {Gitana.SystemMetadata} system metadata
         */
        getSystemMetadata: function()
        {
            return this.system;
        },

        /**
         * The title for the object.
         *
         * @public
         *
         * @returns {String} the title
         */
        getTitle: function()
        {
            return this.get("title");
        },

        /**
         * The description for the object.
         *
         * @public
         *
         * @returns {String} the description
         */
        getDescription: function()
        {
            return this.get("description");
        },

        // TODO: this is a temporary workaround at the moment
        // it has to do all kinds of special treatment for _ variables because these variables are
        // actually system managed but they're on the top level object.
        //
        // TODO:
        // 1) gitana repo system managed properties should all be under _system
        // 2) the system block should be pulled off the object on read and not required on write

        /**
         * Replaces all of the properties of this object with those of the given object.
         * This method should be used to update the state of this object.
         *
         * Any functions from the incoming object will not be copied.
         *
         * @public
         *
         * @param object {Object} object containing the properties
         */
        replacePropertiesWith: function(object)
        {
            // create a copy of the incoming object
            var candidate = {};
            Gitana.copyInto(candidate, object);

            // we don't allow the following values to be replaced
            var backups = {};
            backups["_doc"] = this.object["_doc"];
            delete candidate["_doc"];
            backups["_type"] = this.object["_type"];
            delete candidate["_type"];
            backups["_qname"] = this.object["_qname"];
            delete candidate["_qname"];

            // remove our properties
            for (var i in this.object) {
                if (this.object.hasOwnProperty(i) && !Gitana.isFunction(this.object[i])) {
                    delete this.object[i];
                }
            }

            // restore
            this.object["_doc"] = backups["_doc"];
            this.object["_type"] = backups["_type"];
            this.object["_qname"] = backups["_qname"];

            // copy in candidate properties
            Gitana.copyInto(this.object, candidate);
        },

        /**
         * @override
         */
        handleSystemProperties: function()
        {
            if (this.object)
            {
                if (this.object["_system"])
                {
                    // strip out system metadata
                    var json = {};
                    Gitana.copyInto(json, this.object["_system"]);
                    delete this.object["_system"];

                    // update system properties
                    this.system.updateFrom(json);
                }
            }
        },

        /**
         * Helper function to convert the object portion to JSON
         *
         * @param pretty
         */
        stringify: function(pretty)
        {
            return Gitana.stringify(this.object, pretty);
        },

        /**
         * Helper method that loads this object from another object of the same type.
         *
         * For example, loading a node from another loaded node.
         *
         * @param anotherObject
         */
        loadFrom: function(anotherObject)
        {
            this.handleResponse(anotherObject.object);
            this.system.updateFrom(anotherObject.system._system);
        }

    });

})(window);
(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AbstractNode = Gitana.AbstractObject.extend(
    /** @lends Gitana.AbstractNode.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class Abstract base class for Gitana Node implementations.
         *
         * @param {Gitana.Branch} branch
         * @param [Object] object
         */
        constructor: function(branch, object)
        {
            this.base(branch.getServer(), object);


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Repository object.
             *
             * @inner
             *
             * @returns {Gitana.Repository} The Gitana Repository object
             */
            this.getRepository = function() { return branch.getRepository(); };

            /**
             * Gets the Gitana Repository id.
             *
             * @inner
             *
             * @returns {String} The Gitana Repository id
             */
            this.getRepositoryId = function() { return branch.getRepository().getId(); };

            /**
             * Gets the Gitana Branch object.
             *
             * @inner
             *
             * @returns {Gitana.Branch} The Gitana Branch object
             */
            this.getBranch = function() { return branch; };

            /**
             * Gets the Gitana Branch id.
             *
             * @inner
             *
             * @returns {String} The Gitana Branch id
             */
            this.getBranchId = function() { return branch.getId(); };
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().node(this.getBranch(), this.object);
        },

        /**
         * Acquires the stats for this node.  The stats may be out of sync with the server.  If you want to be
         * sure to bring them into sync, run reload() first.
         */
        stats: function()
        {
            var stats = this.get("stats");
            if (!stats)
            {
                stats = {};
            }

            return stats;
        },

        /**
         * Reload.
         *
         * @chained node
         */
        reload: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId();
            };

            return this.chainReload(this.clone(), uriFunction);
        },

        /**
         * Update.
         *
         * @chained node
         *
         * @public
         */
        update: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId();
            };

            return this.chainUpdate(this.clone(), uriFunction);
        },

        /**
         * Delete.
         *
         * @chained branch
         *
         * @public
         *
         * @param {String} nodeId the node id
         */
        del: function(nodeId)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId();
            };

            // NOTE: pass control back to the branch
            return this.chainDelete(this.getBranch(), uriFunction);
        },

        /**
         * Hands back a list of the feature ids that this node has.
         *
         * @public
         *
         * @returns {Array} An array of strings that are the ids of the features.
         */
        getFeatureIds: function()
        {
            var featureIds = [];

            if (this.get("_features"))
            {
                for (var featureId in this.get("_features"))
                {
                    featureIds[featureIds.length] = featureId;
                }
            }

            return featureIds;
        },

        /**
         * Gets the configuration for a given feature.
         *
         * @public
         *
         * @param {String} featureId the id of the feature
         *
         * @returns {Object} the JSON object configuration for the feature
         */
        getFeature: function(featureId)
        {
            var featureConfig = null;

            if (this.get("_features"))
            {
                featureConfig = this.get("_features")[featureId];
            }

            return featureConfig;
        },

        /**
         * Removes a feature from this node.
         *
         * @public
         *
         * @param {String} featureId the id of the feature
         */
        removeFeature: function(featureId)
        {
            if (this.get("_features"))
            {
                if (this.get("_features")[featureId])
                {
                    delete this.get("_features")[featureId];
                }
            }
        },

        /**
         * Adds a feature to this node.
         *
         * @public
         * @param {String} featureId the id of the feature
         * @param {Object} featureConfig the JSON object configuration for the feature
         */
        addFeature: function(featureId, featureConfig)
        {
            if (!this.get("_features"))
            {
                this.set("_features", {});
            }

            this.get("_features")[featureId] = featureConfig;
        },

        /**
         * Indicates whether this node has the given feature.
         *
         * @public
         *
         * @param {String} featureId the id of the feature
         *
         * @returns {Boolean} whether this node has this feature
         */
        hasFeature: function(featureId)
        {
            var has = false;

            if (this.get("_features"))
            {
                has = this.get("_features")[featureId];
            }

            return has;
        },

        /**
         * Gets the QName for this node.
         *
         * @public
         *
         * @returns {String} the qname of this node.
         */
        getQName: function()
        {
            return this.get("_qname");
        },

        /**
         * Gets the type QName for this node.
         *
         * @public
         *
         * @returns {String} the type qname of this node.
         */
        getTypeQName: function()
        {
            return this.get("_type");
        },

        /**
         * Indicates whether the current object is an association.
         *
         * @public
         *
         * @returns {Boolean} whether this node is an association
         */
        isAssociation: function()
        {
            return false;
        },

        /**
         * Indicates whether this node has the "f:container" feature
         *
         * @public
         *
         * @returns {Boolean} whether this node has the "f:container" feature
         */
        isContainer: function()
        {
            return this.hasFeature("f:container");
        }
    });

})(window);
(function(window)
{
    var Gitana = window.Gitana;

    Gitana.Association = Gitana.AbstractNode.extend(
    /** @lends Gitana.Association.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractNode
         *
         * @class Association
         *
         * @param {Gitana.Branch} branch
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(branch, object)
        {
            this.base(branch, object);

            this.objectType = "Gitana.Association";
        },

        /**
         * @override
         */
        isAssociation: function()
        {
            return true;
        },

        /**
         * @returns {String} the directionality of the association
         */
        getDirectionality: function()
        {
            return this.get("directionality");
        },

        /**
         * Gets the source node id for this association.
         *
         * @public
         *
         * @returns {String} source node id
         */
        getSourceNodeId: function()
        {
            return this.get("source");
        },

        /**
         * Gets the source node changeset id for this association.
         *
         * @public
         *
         * @returns {String} source node changeset id
         */
        getSourceNodeChangesetId: function()
        {
            return this.get("source_changeset");
        },

        /**
         * Gets the source node type for this association.
         *
         * @public
         *
         * @returns {String} source node type qname
         */
        getSourceNodeType: function()
        {
            return this.get("source_type");
        },

        /**
         * Gets the target node id for this association.
         *
         * @public
         *
         * @returns {String} target node id
         */
        getTargetNodeId: function()
        {
            return this.get("target");
        },

        /**
         * Gets the target node changeset id for this association.
         *
         * @public
         *
         * @returns {String} target node changeset id
         */
        getTargetNodeChangesetId: function()
        {
            return this.get("target_changeset");
        },

        /**
         * Gets the target node type for this association.
         *
         * @public
         *
         * @returns {String} target node type qname
         */
        getTargetNodeType: function()
        {
            return this.get("target_type");
        },

        /**
         * Reads the source node.
         *
         * @chained source node
         *
         * @public
         */
        readSourceNode: function()
        {
            var self = this;

            var chainable = this.getFactory().node(this.getBranch());
            return this.subchain(chainable).then(function() {

                var chain = this;

                this.subchain(self.getBranch()).readNode(self.getSourceNodeId()).then(function() {
                    chainable.loadFrom(this);
                });
            });
        },

        /**
         * Reads the target node.
         *
         * @chained target node
         *
         * @public
         */
        readTargetNode: function()
        {
            var self = this;

            var chainable = this.getFactory().node(this.getBranch());
            return this.subchain(chainable).then(function() {

                var chain = this;

                this.subchain(self.getBranch()).readNode(self.getTargetNodeId()).then(function() {
                    chainable.loadFrom(this);
                });
            });
        },

        /**
         * Given a node, reads back the other node of the association.
         *
         * @param {Object} node either a Gitana.Node or a string with the node id
         *
         * @chained other node
         *
         * @param node
         */
        readOtherNode: function(node)
        {
            var self = this;

            var nodeId = null;

            if (Gitana.isString(node))
            {
                nodeId = node;
            }
            else
            {
                nodeId = node.getId();
            }

            var result = this.subchain(this.getFactory().node(this.getBranch()));
            result.subchain(self).then(function() {

                if (nodeId == this.getSourceNodeId())
                {
                    this.readTargetNode().then(function() {
                        result.loadFrom(this);
                    });
                }
                else if (nodeId == this.getTargetNodeId())
                {
                    this.readSourceNode().then(function() {
                        result.loadFrom(this);
                    });
                }
                else
                {
                    var err = new Error();
                    err.name = "No node on association";
                    err.message = "The node: " + nodeId + " was not found on this association";

                    this.error(err);

                    return false;
                }
            });

            return result;
        },

        /**
         * NOTE: this is not a chained function
         *
         * Given a node, determines what direction this association describes.
         *
         * If the association's directionality is UNDIRECTED, the direction is MUTUAL.
         *
         * If the association's directionality is DIRECTED...
         *   If the node is the source, the direction is OUTGOING.
         *   If the node is the target, the direction is INCOMING.
         *
         * @param {Object} node either a Gitana.Node or a string with the node id
         *
         * @returns {String} the direction or null if the node isn't on the association
         */
        getDirection: function(node)
        {
            var nodeId = null;

            if (Gitana.isString(node))
            {
                nodeId = node;
            }
            else
            {
                nodeId = node.getId();
            }

            var direction = null;

            if (this.getDirectionality() == "UNDIRECTED")
            {
                direction = "MUTUAL";
            }
            else
            {
                if (this.getSourceNodeId() == nodeId)
                {
                    direction = "OUTGOING";
                }
                else if (this.getTargetNodeId() == nodeId)
                {
                    direction = "INCOMING";
                }
            }

            return direction;
        },

        /**
         * NOTE: this is not a chained function.
         *
         * Determines the node id of the other node.
         *
         * @param {Object} node either a Gitana.Node or a string with the node id
         *
         * @returns {String} the id of the other node
         */
        getOtherNodeId: function(node)
        {
            var nodeId = null;

            if (Gitana.isString(node))
            {
                nodeId = node;
            }
            else
            {
                nodeId = node.getId();
            }

            var otherNodeId = null;

            if (this.getSourceNodeId() == nodeId)
            {
                otherNodeId = this.getTargetNodeId();
            }
            else if (this.getTargetNodeId() == nodeId)
            {
                otherNodeId = this.getSourceNodeId();
            }

            return otherNodeId;
        }

    });

})(window);
(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AuditRecord = Gitana.AbstractObject.extend(
    /** @lends Gitana.AuditRecord.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class AuditRecord
         *
         * @param {Object} persistable
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(persistable, object)
        {
            this.base(persistable.getServer(), object);

            this.persistable = persistable;

            this.objectType = "Gitana.AuditRecord";
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return this.persistable.getUri() + "/audit";
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().auditRecord(this.getServer(), this.object);
        },

        /**
         * @returns {String} the scope of the audit record (i.e. "NODE")
         */
        getScope: function()
        {
            return this.get("scope");
        },

        /**
         * @returns {String} the action of the audit record ("CREATE", "READ", "UPDATE", "DELETE", "MOVE", "COPY", "EXISTS")
         */
        getAction: function()
        {
            return this.get("action");
        },

        /**
         * @returns {String} the principal for the audit record
         */
        getPrincipalId: function()
        {
            return this.get("principal");
        },

        /**
         * @returns {String} method that was invoked
         */
        getMethod: function()
        {
            return this.get("method");
        },

        /**
         * @returns {String} handler
         */
        getHandler: function()
        {
            return this.get("handler");
        },

        /**
         * @returns {Object} argument descriptors
         */
        getArgs: function()
        {
            return this.get("args");
        },

        /**
         * @returns {Object} return value descriptor
         */
        getReturn: function()
        {
            return this.get("return");
        }

    });

})(window);
(function(window)
{
    var Gitana = window.Gitana;

    Gitana.Branch = Gitana.AbstractObject.extend(
    /** @lends Gitana.Branch.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class Branch
         *
         * @param {Gitana.Repository} repository
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(repository, object)
        {
            this.base(repository.getServer(), object);

            this.objectType = "Gitana.Branch";


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Repository object.
             *
             * @inner
             *
             * @returns {Gitana.Repository} The Gitana Repository object
             */
            this.getRepository = function() { return repository; };

            /**
             * Gets the Gitana Repository id.
             *
             * @inner
             *
             * @returns {String} The Gitana Repository id
             */
            this.getRepositoryId = function() { return repository.getId(); };
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().branch(this.getRepository(), this.object);
        },

        /**
         * @returns {Boolean} whether this is the master branch
         */
        isMaster: function()
        {
            return (this.getType().toLowerCase() == "master");
        },

        /**
         * @return {String} the type of branch ("master" or "custom")
         */
        getType: function()
        {
            return this.get("type");
        },

        /**
         * Reload.
         *
         * @chained this
         *
         * @public
         */
        reload: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId()
            };

            return this.chainReload(this.clone(), uriFunction);
        },

        /**
         * Update.
         *
         * @chained this
         *
         * @public
         */
        update: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId()
            };

            return this.chainUpdate(this.clone(), uriFunction);
        },

        /**
         * Delete.
         *
         * @chained server
         *
         * @public
         *
         * NOTE: not implemented but provided for NOOP consistency
         */
        del: function()
        {
            // TODO

            // NOTE: pass control back to the repository
            return this.subchain(this.getRepository()).then(function() {
            });
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ACL METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Retrieve full ACL and pass into chaining method.
         *
         * @chained server
         *
         * @param callback
         */
        loadACL: function(callback)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/acl";
            };

            return this.chainGetResponse(this, uriFunction).then(function() {
                callback.call(this, this.response);
            });
        },

        /**
         * Retrieve list of authorities and pass into chaining method.
         *
         * @chained server
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param callback
         */
        listAuthorities: function(principal, callback)
        {
            var principalId = this.extractPrincipalId(principal);

            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/acl/" + principalId;
            };

            return this.chainGetResponseRows(this, uriFunction).then(function() {
                callback.call(this, this.response);
            });
        },

        /**
         * Checks whether the given principal has a granted authority for this object.
         * This passes the result (true/false) to the chaining function.
         *
         * @chained server
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         * @param callback
         */
        checkAuthority: function(principal, authorityId, callback)
        {
            var principalId = this.extractPrincipalId(principal);

            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/acl/" + principalId;
            };

            return this.chainHasResponseRow(this, uriFunction, authorityId).then(function() {
                callback.call(this, this.response)
            })
        },

        /**
         * Grants an authority to a principal against this object.
         *
         * @chained server
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         */
        grantAuthority: function(principal, authorityId)
        {
            var principalId = this.extractPrincipalId(principal);

            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/acl/" + principalId + "/grant/" + authorityId;
            };

            return this.chainPostEmpty(this, uriFunction);
        },

        /**
         * Revokes an authority from a principal against this object.
         *
         * @chained server
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         */
        revokeAuthority: function(principal, authorityId)
        {
            var principalId = this.extractPrincipalId(principal);

            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/acl/" + principalId + "/revoke/" + authorityId;
            };

            return this.chainPostEmpty(this, uriFunction);
        },

        /**
         * Revokes all authorities for a principal against the server.
         *
         * @chained server
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         */
        revokeAllAuthorities: function(principal)
        {
            return this.revokeAuthority(principal, "all");
        },

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // END OF ACL METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////


        /**
         * Acquires a list of mount nodes under the root of the repository.
         *
         * @chained node map
         *
         * @public
         *
         * @param [Object] pagination
         */
        listMounts: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/nodes";
            };

            var chainable = this.getFactory().nodeMap(this);
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Reads a node.
         *
         * @chained node
         *
         * @public
         *
         * @param {String} nodeId the node id
         */
        readNode: function(nodeId)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/nodes/" + nodeId;
            };

            var chainable = this.getFactory().node(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Create a node
         *
         * @chained node
         *
         * @public
         *
         * @param [Object] object JSON object
         */
        createNode: function(object)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/nodes";
            };

            var chainable = this.getFactory().node(this);
            return this.chainCreate(chainable, object, uriFunction);
        },

        /**
         * Searches the branch.
         *
         * @chained node map
         *
         * Config should be:
         *
         *    {
         *       "search": {
         *           ... Elastic Search Config Block
         *       }
         *    }
         *
         * For a full text term search, you can simply provide text in place of a config json object.
         *
         * See the Elastic Search documentation for more advanced examples
         *
         * @public
         *
         * @param search
         * @param [Object] pagination
         */
        searchNodes: function(search, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            if (Gitana.isString(search))
            {
                search = {
                    "search": search
                };
            }

            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/nodes/search";
            };

            var chainable = this.getFactory().nodeMap(this);
            return this.chainPost(chainable, uriFunction, params, search);
        },

        /**
         * Queries for nodes on the branch.
         *
         * Config should be:
         *
         *    {
         *       Gitana query configs
         *    }
         *
         * @chained node map
         *
         * @public
         *
         * @param {Object} query
         * @param [Object] pagination
         */
        queryNodes: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/nodes/query"
            };

            var chainable = this.getFactory().nodeMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Reads the person object for a security user.
         *
         * @chained node
         *
         * @param {String} userId
         * @param [Boolean] createIfNotFound whether to create the person object if it isn't found
         */
        readPerson: function(userId, createIfNotFound)
        {
            var uriFunction = function()
            {
                var uri = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/person/" + userId;
                if (createIfNotFound)
                {
                    uri += "?createIfNotFound=" + createIfNotFound;
                }

                return uri;
            };

            var chainable = this.getFactory().node(this, "n:person");
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Reads the group object for a security group.
         *
         * @chained node
         *
         * @param {String} groupId
         * @param [Boolean] createIfNotFound whether to create the group object if it isn't found
         */
        readGroup: function(groupId, createIfNotFound)
        {
            var uriFunction = function()
            {
                var uri = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/group/" + groupId;
                if (createIfNotFound)
                {
                    uri += "?createIfNotFound=" + createIfNotFound;
                }

                return uri;
            };

            var chainable = this.getFactory().node(this, "n:group");
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Acquire a list of definitions.
         *
         * @chained node map
         *
         * @public
         *
         * @param [String] filter Optional filter of the kind of definition to fetch - "association", "type" or "feature"
         */
        listDefinitions: function(filter)
        {
            var uriFunction = function()
            {
                // uri
                var uri = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/definitions";
                if (filter)
                {
                    uri = uri + "?filter=" + filter;
                }

                return uri;
            };

            var chainable = this.getFactory().nodeMap(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Reads a definition by qname.
         *
         * @chained definition
         *
         * @public
         *
         * @param {String} qname the qname
         */
        readDefinition: function(qname)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/definitions/" + qname;
            };

            var chainable = this.getFactory().definition(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Determines an available QName on this branch given some input.
         * This makes a call to the repository and asks it to provide a valid QName.
         *
         * The valid QName is passed as an argument to the next method in the chain.
         *
         * Note: This QName is a recommended QName that is valid at the time of the call.
         *
         * If another thread writes a node with the same QName after this call but ahead of this thread
         * attempting to commit, an invalid qname exception may still be thrown back.
         *
         * @chained this
         *
         * @public
         *
         * @param {Object} object an object with "title" or "description" fields to base generation upon
         */
        generateQName: function(object, callback)
        {
            var self = this;

            return this.then(function() {

                var chain = this;

                // call
                var uri = "/repositories/" + self.getRepositoryId() + "/branches/" + self.getId() + "/qnames/generate";
                self.getDriver().gitanaPost(uri, null, object, function(response) {

                    var qname = response["_qname"];

                    callback.call(chain, qname);

                    chain.next();
                });

                // NOTE: we return false to tell the chain that we'll manually call next()
                return false;
            });
        },

        /**
         * Creates an association between the source node and the target node of the given type.
         *
         * @chained branch (this)
         *
         * @param sourceNode
         * @param targetNode
         * @param object (or string identifying type)
         */
        associate: function(sourceNode, targetNode, object)
        {
            // source
            var sourceNodeId = null;
            if (Gitana.isString(sourceNode))
            {
                sourceNodeId = sourceNode;
            }
            else
            {
                sourceNodeId = sourceNode.getId();
            }

            // target
            var targetNodeId = null;
            if (Gitana.isString(targetNode))
            {
                targetNodeId = targetNode;
            }
            else
            {
                targetNodeId = targetNode.getId();
            }

            // make sure we hand back the branch
            var result = this.subchain(this);

            // run a subchain to do the association
            result.subchain(this).then(function() {
                this.readNode(sourceNodeId).associate(targetNodeId, object);
            });

            return result;
        },

        /**
         * Traverses around the given node.
         *
         * Note: This is a helper function provided for convenience that delegates off to the node to do the work.
         *
         * @chained traversal results
         *
         * @param node or node id
         * @param config
         */
        traverse: function(node, config)
        {
            var nodeId = null;
            if (Gitana.isString(node))
            {
                nodeId = node;
            }
            else
            {
                nodeId = node.getId();
            }

            return this.readNode(nodeId).traverse(config);
        },

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // CONTAINER (a:child) CONVENIENCE FUNCTIONS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Creates a container node.
         *
         * This is a convenience function that simply applies the container feature to the object
         * ahead of calling createNode.
         *
         * @chained node
         *
         * @public
         *
         * @param [Object] object JSON object
         */
        createContainer: function(object)
        {
            if (!object)
            {
                object = {};
            }

            if (!object["_system"])
            {
                object["_system"] = {};
            }

            if (!object["_system"]["_features"])
            {
                object["_system"]["_features"] = {};
            }

            object["_system"]["_features"]["f:container"] = {
                "active": "true"
            };

            return this.createNode(object);
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // FIND
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Finds nodes within a branch
         *
         * @chained node map
         *
         * Config should be:
         *
         *    {
         *       "query": {
         *           ... Query Block
         *       },
         *       "search": {
         *           ... Elastic Search Config Block
         *       }
         *    }
         *
         * Alternatively, the value for "search" in the JSON block above can simply be text.
         *
         * @public
         *
         * @param {Object} config search configuration
         */
        find: function(config, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/nodes/find";
            };

            var chainable = this.getFactory().nodeMap(this);
            return this.chainPost(chainable, uriFunction, params, config);
        }

    });

})(window);
(function(window)
{
    var Gitana = window.Gitana;

    Gitana.Changeset = Gitana.AbstractObject.extend(
    /** @lends Gitana.Changeset.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class Changeset
         *
         * @param {Gitana.Repository} repository
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(repository, object)
        {
            this.base(repository.getServer(), object);

            this.objectType = "Gitana.Changeset";


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Repository object.
             *
             * @inner
             *
             * @returns {Gitana.Repository} The Gitana Repository object
             */
            this.getRepository = function() { return repository; };

            /**
             * Gets the Gitana Repository id.
             *
             * @inner
             *
             * @returns {String} The Gitana Repository id
             */
            this.getRepositoryId = function() { return repository.getId(); };

            /**
             * Gets the Gitana Server object.
             *
             * @inner
             *
             * @returns {Gitana.Server} The Gitana Server object
             */
            this.getServer = function() { return repository.getServer(); };
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/repositories/" + this.getRepositoryId() + "/changesets/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().changeset(this.getRepository(), this.object);
        },

        /**
         * Reload.
         *
         * @chained changeset
         *
         * @public
         */
        reload: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/changesets/" + this.getId()
            };

            return this.chainReload(this.clone(), uriFunction);
        },

        /**
         * Update.
         *
         * @chained changeset
         *
         * @public
         */
        update: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/changesets/" + this.getId()
            };

            return this.chainUpdate(this.clone(), uriFunction);
        },

        /**
         * Delete.
         *
         * @chained repository
         *
         * @public
         *
         * NOTE: not implemented but provided for NOOP consistency
         */
        del: function()
        {
            // TODO
            var chainable = this.subchain(this.getRepository());
            return this.subchain(chainable).then(function() {
            });
        }

    });

})(window);
(function(window)
{
    var Gitana = window.Gitana;

    Gitana.Node = Gitana.AbstractNode.extend(
    /** @lends Gitana.Node.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractNode
         *
         * @class Node
         *
         * @param {Gitana.Branch} branch
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(branch, object)
        {
            this.base(branch, object);

            this.objectType = "Gitana.Node";
        },

        /**
         * Acquires the "child nodes" of this node.  This is done by fetching all of the nodes that are outgoing-associated to this
         * node with a association of type "a:child".
         *
         * @chained node map
         *
         * @public
         *
         * @param [Object] pagination
         */
        listChildren: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/children";
            };

            var chainable = this.getFactory().nodeMap(this.getBranch());
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Retrieves all of the association objects for this node.
         *
         * @chained node map
         *
         * @public
         *
         * @param [Object] config
         * @param [Object] pagination
         */
        associations: function(config, pagination)
        {
            var type = null;
            var direction = null;

            if (config)
            {
                type = config.type;
                direction = config.direction.toUpperCase();
            }

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                var url = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/associations?a=1";
                if (type)
                {
                    url = url + "&type=" + type;
                }
                if (direction)
                {
                    url = url + "&direction=" + direction;
                }

                return url;
            };

            var chainable = this.getFactory().nodeMap(this.getBranch());
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Retrieves all of the incoming association objects for this node.
         *
         * @chained node map
         *
         * @public
         *
         * @param [String] type the type of association
         * @param [Object] pagination
         */
        incomingAssociations: function(type, pagination)
        {
            var config = {
                "direction": "INCOMING"
            };
            if (type) {
                config.type = type;
            }

            return this.associations(config, pagination);
        },

        /**
         * Retrieves all of the outgoing association objects for this node.
         *
         * @chained node map
         *
         * @public
         *
         * @param [String] type the type of association
         * @param [Object] pagination
         */
        outgoingAssociations: function(type, pagination)
        {
            var config = {
                "direction": "OUTGOING"
            };
            if (type) {
                config.type = type;
            }

            return this.associations(config, pagination);

        },

        /**
         * Associates a target node to this node.
         *
         * @chained this
         *
         * @public
         *
         * @param {String|Node} targetNode the id of the target node or the target node itself
         * @param [Object|String] object either a JSON object or a string identifying the type of association
         * @param [Boolean] undirected whether the association is undirected (i.e. mutual)
         */
        associate: function(targetNodeId, object, undirected)
        {
            if (!Gitana.isString(targetNodeId))
            {
                targetNodeId = targetNodeId.getId();
            }

            if (object)
            {
                if (Gitana.isString(object))
                {
                    object = {
                        "_type": object
                    };
                }
            }

            var uriFunction = function()
            {
                var url = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/associate?node=" + targetNodeId;

                if (undirected)
                {
                    url += "&directionality=UNDIRECTED";
                }

                return url;
            };

            return this.chainPostEmpty(this, uriFunction, null, object);
        },

        /**
         * Creates an association from another node to this one.
         *
         * @chained node (this)
         *
         * @public
         *
         * @param sourceNode
         * @param object
         * @param undirected
         */
        associateOf: function(sourceNode, object, undirected)
        {
            var self = this;

            // what we're handing back (ourselves)
            var result = this.subchain(this);

            // our work
            result.subchain(sourceNode).then(function() {
                this.associate(self, object, undirected);
            });

            return result;
        },

        /**
         * Unassociates a target node from this node.
         *
         * @chained this
         *
         * @public
         *
         * @param {String|Node} targetNode the id of the target node or the target node itself
         * @param [String] type A string identifying the type of association
         * @param [Boolean] undirected whether the association is undirected (i.e. mutual)
         */
        unassociate: function(targetNodeId, type, undirected)
        {
            if (!Gitana.isString(targetNodeId))
            {
                targetNodeId = targetNodeId.getId();
            }

            var uriFunction = function()
            {
                var url = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/unassociate?node=" + targetNodeId;

                if (type)
                {
                    url = url + "&type=" + type;
                }

                if (undirected)
                {
                    url += "&directionality=UNDIRECTED";
                }

                return url;
            };

            return this.chainPostEmpty(this, uriFunction);
        },

        /**
         * Traverses around the node and returns any nodes found to be connected on the graph.
         *
         * Example config:
         *
         * {
         *    "associations": {
         *       "a:child": "MUTUAL",
         *       "a:knows": "INCOMING",
         *       "a:related": "OUTGOING"
         *    },
         *    "depth": 1,
         *    "types": [ "custom:type1", "custom:type2" ]
         * } 
         *
         * @chained traversal results
         *
         * @public
         *
         * @param {Object} config configuration for the traversal
         */
        traverse: function(config)
        {
            var _this = this;

            // build the payload
            var payload = {
                "traverse": config
            };

            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/traverse";
            };

            var chainable = this.getFactory().traversalResults(this.getBranch());
            var params = {};
            return this.chainPost(chainable, uriFunction, params, payload);
        },

        /**
         * Mounts a node
         *
         * @chained this
         *
         * @public
         *
         * @param {String} mountKey the mount key
         */
        mount: function(mountKey)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/mount/" + mountKey;
            };

            return this.chainPostEmpty(this, uriFunction, null, object);
        },

        /**
         * Unmounts a node
         *
         * @public
         */
        unmount: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/unmount";
            };

            return this.chainPostEmpty(this, uriFunction, null, object);
        },

        /**
         * Locks a node
         *
         * @chained this
         *
         * @public
         */
        lock: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/lock";
            };

            return this.chainPostEmpty(this, uriFunction);
        },

        /**
         * Unlocks a node
         *
         * @chained this
         *
         * @public
         */
        unlock: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/unlock";
            };

            return this.chainPostEmpty(this, uriFunction);
        },

        /**
         * Checks whether the node is locked.
         * The result is passed into the next method in the chain.
         *
         * @chained this
         *
         * @public
         */
        checkLocked: function(callback)
        {
            // TODO: isn't this subchain() redundant?
            return this.subchain(this).then(function() {

                var chain = this;

                // call
                var uri = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/lock";
                this.getDriver().gitanaGet(uri, null, function(response) {

                    callback.call(chain, response["locked"]);

                    chain.next();
                });

                // NOTE: we return false to tell the chain that we'll manually call next()
                return false;
            });
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ACL METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Retrieve full ACL and pass into chaining method.
         *
         * @chained node
         */
        loadACL: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/acl";
            };

            return this.chainGetResponse(this, uriFunction);
        },

        /**
         * Retrieve list of authorities and pass into chaining method.
         *
         * @chained node
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         */
        listAuthorities: function(principal)
        {
            var principalId = this.extractPrincipalId(principal);

            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/acl/" + principalId;
            };

            return this.chainGetResponseRows(this, uriFunction);
        },

        /**
         * Checks whether the given principal has a granted authority for this object.
         * This passes the result (true/false) to the chaining function.
         *
         * @chained this
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         */
        checkAuthority: function(principal, authorityId)
        {
            var principalId = this.extractPrincipalId(principal);

            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/acl/" + principalId;
            };

            return this.chainHasResponseRow(this, uriFunction, authorityId);
        },

        /**
         * Grants an authority to a principal against this object.
         *
         * @chained this
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         */
        grantAuthority: function(principal, authorityId)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/acl/" + principalId + "/grant/" + authorityId;
            };

            var principalId = this.extractPrincipalId(principal);

            return this.chainPostEmpty(this, uriFunction);
        },

        /**
         * Revokes an authority from a principal against this object.
         *
         * @chained this
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         */
        revokeAuthority: function(principal, authorityId)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/acl/" + principalId + "/revoke/" + authorityId;
            };

            var principalId = this.extractPrincipalId(principal);

            return this.chainPostEmpty(this, uriFunction);
        },

        /**
         * Revokes all authorities for a principal against the server.
         *
         * @chained this
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         */
        revokeAllAuthorities: function(principal)
        {
            return this.revokeAuthority(principal, "all");
        },

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // END OF ACL METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////


        /**
         * Acquire a list of audit records concerning this node.
         *
         * @chained audit record map
         *
         * @public
         *
         * @param [Object] pagination
         */
        listAuditRecords: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/auditrecords";
            };

            var chainable = this.getFactory().auditRecordMap(this);
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Creates a new translation.
         *
         * @chained translation node
         *
         * @param {String} edition the edition of the translation (can be any string)
         * @param {String} locale the locale string for the translation (i.e. "en_US")
         * @param [Object] object JSON object
         */
        createTranslation: function(edition, locale, object)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/i18n?edition=" + edition + "&locale=" + locale;
            };

            var chainable = this.getFactory().node(this.getBranch());
            return this.chainCreate(chainable, object, uriFunction);
        },

        /**
         * Lists all of the editions for this master node.
         * Passes them into the next function in the chain.
         *
         * @chained this
         *
         * @param callback
         */
        editions: function(callback)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/i18n/editions"
            };

            return this.chainGetResponse(this, uriFunction).then(function() {
                callback.call(this, this.response["editions"]);
            });
        },

        /**
         * Lists all of the locales for the given edition of this master node.
         * Passes them into the next function in the chain.
         *
         * @chained this
         *
         * @param {String} edition the edition
         * @param callback
         */
        locales: function(edition, callback)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/i18n/locales?edition=" + edition;
            };

            return this.chainGetResponse(this, uriFunction).then(function() {
                callback.call(this, this.response["locales"]);
            });
        },

        /**
         * Reads a translation node of the current master node into a given locale and optional edition.
         * If an edition isn't provided, the tip edition from the master node is assumed.
         *
         * @chained translation node
         *
         * @param [String] edition The edition of the translation to use.  If not provided, the tip edition is used from the master node.
         * @param {String} locale The locale to translate into.
         */
        readTranslation: function()
        {
            var edition;
            var locale;

            var args = Gitana.makeArray(arguments);

            if (args.length == 1)
            {
                locale = args.shift();
            }
            else if (args.length > 1)
            {
                edition = args.shift();
                locale = args.shift();
            }

            var uriFunction = function()
            {
                var uri = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/i18n?locale=" + locale;
                if (edition)
                {
                    uri += "&edition=" + edition;
                }

                return uri;
            };

            var chainable = this.getFactory().node(this.getBranch());
            return this.chainGet(chainable, uriFunction);
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ATTACHMENTS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Hands back an attachments map.
         *
         * @chained attachment map
         *
         * @public
         */
        listAttachments: function()
        {
            var self = this;

            var attachmentMap = new Gitana.NodeAttachmentMap(this);

            var result = this.subchain(attachmentMap);
            result.subchain().then(function() {

                var chain = this;

                self.getDriver().gitanaGet(self.getUri() + "/attachments", null, function(response) {

                    var map = {};
                    for (var i = 0; i < response.rows.length; i++)
                    {
                        map[response.rows[i]["_doc"]] = response.rows[i];
                    }
                    attachmentMap.handleMap(map);

                    chain.next();
                });

                return false;
            });

            return result;
        },

        /**
         * Picks off a single attachment
         *
         * @chained attachment
         *
         * @param attachmentId (null for default)
         */
        attachment: function(attachmentId)
        {
            return this.listAttachments().select(attachmentId);
        },

        /**
         * Creates an attachment.
         *
         * When using this method from within the JS driver, it really only works for text-based content such
         * as JSON or text.
         *
         * @chained attachment
         *
         * @param attachmentId (use null or false for default attachment)
         * @param contentType
         * @param data
         */
        attach: function(attachmentId, contentType, data)
        {
            var self = this;

            if (!attachmentId)
            {
                attachmentId = "default";
            }

            // the thing we're handing back
            var result = this.subchain(new Gitana.NodeAttachment(this, attachmentId));

            // preload some work onto a subchain
            result.subchain().then(function() {

                // upload the attachment
                var uploadUri = self.getUri() + "/attachments/" + attachmentId;
                this.chainUpload(this, uploadUri, null, contentType, data).then(function() {

                    // read back attachment information and plug onto result
                    this.subchain(self).listAttachments().select(attachmentId).then(function() {
                        result.handleAttachment(this.attachment);
                    });
                });
            });

            return result;
        },

        /**
         * Deletes an attachment.
         *
         * @param attachmentId
         */
        unattach: function(attachmentId)
        {
            return this.subchain().then(function() {

                this.chainDelete(this, this.getUri() + "/attachments/" + attachmentId).then(function() {

                    // TODO

                });
            });
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // CONTAINER CONVENIENCE FUNCTIONS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Create a node as a child of this node.
         *
         * This is a convenience function around the branch createNode method.  It chains a create with a
         * childOf() call.
         *
         * @chained new node
         *
         * @public
         *
         * @param [Object] object JSON object
         */
        createChild: function(object)
        {
            return this.subchain(this.getBranch()).createNode(object).childOf(this);
        },

        /**
         * Associates this node as an "a:child" of the source node.
         *
         * This is a convenience function that simply creates an association from another node to this one.
         *
         * @chained node (this)
         *
         * @public
         *
         * @param sourceNode
         */
        childOf: function(sourceNode)
        {
            return this.associateOf(sourceNode, "a:child");
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // FIND
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Finds around a node.
         *
         * @chained node map
         *
         * Config should be:
         *
         *    {
         *       "query": {
         *           ... Query Block
         *       },
         *       "search": {
         *           ... Elastic Search Config Block
         *       },
         *       "traverse: {
         *           ... Traversal Configuration
         *       }
         *    }
         *
         * Alternatively, the value for "search" in the JSON block above can simply be text.
         *
         * @public
         *
         * @param {Object} config search configuration
         */
        find: function(config, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/find";
            };

            var chainable = this.getFactory().nodeMap(this.getBranch());
            return this.chainPost(chainable, uriFunction, params, config);
        }

    });

})(window);
(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Principal = Gitana.AbstractObject.extend(
    /** @lends Gitana.Principal.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class Principal
         *
         * @param {Gitana.Server} server
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(server, object)
        {
            this.base(server, object);

            this.objectType = "Gitana.Principal";
        },

        /**
         * @returns {String} the principal id
         */
        getPrincipalId: function()
        {
            return this.get("principal-id");
        },

        /**
         * @returns {String} the principal type ("user" or "group")
         */
        getPrincipalType: function()
        {
            return this.get("principal-type");
        },

        /**
         * Acquires the groups that contain this principal
         *
         * @chained principal map
         *
         * @public
         *
         * @param {Boolean} indirect whether to consider indirect groups
         */
        listMemberships: function(indirect)
        {
            var _this = this;

            // uri
            var uri = "/security/" + this.getPrincipalType().toLowerCase() + "s/" + _this.getPrincipalId() + "/memberships";
            if (indirect)
            {
                uri = uri + "?indirect=true";
            }

            var chainable = this.getFactory().principalMap(this.getServer());
            return this.chainGet(chainable, uri);
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ATTACHMENTS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Hands back an attachments map.
         *
         * @chained attachment map
         *
         * @public
         */
        listAttachments: function()
        {
            var self = this;

            var attachmentMap = new Gitana.BinaryAttachmentMap(this);

            var result = this.subchain(attachmentMap);
            result.subchain().then(function() {

                var chain = this;

                self.getDriver().gitanaGet(self.getUri() + "/attachments", null, function(response) {

                    var map = {};
                    for (var i = 0; i < response.rows.length; i++)
                    {
                        map[response.rows[i]["_doc"]] = response.rows[i];
                    }
                    attachmentMap.handleMap(map);

                    chain.next();
                });

                return false;
            });

            return result;
        },

        /**
         * Picks off a single attachment
         *
         * @chained attachment
         *
         * @param attachmentId
         */
        attachment: function(attachmentId)
        {
            return this.listAttachments().select(attachmentId);
        },

        /**
         * Creates an attachment.
         *
         * When using this method from within the JS driver, it really only works for text-based content such
         * as JSON or text.
         *
         * @chained attachment
         *
         * @param attachmentId (use null or false for default attachment)
         * @param contentType
         * @param data
         */
        attach: function(attachmentId, contentType, data)
        {
            var self = this;

            // the thing we're handing back
            var result = this.subchain(new Gitana.BinaryAttachment(this, attachmentId));

            // preload some work onto a subchain
            result.subchain().then(function() {

                // upload the attachment
                var uploadUri = self.getUri() + "/attachments/" + attachmentId;
                this.chainUpload(this, uploadUri, null, contentType, data).then(function() {

                    // read back attachment information and plug onto result
                    this.subchain(self).listAttachments().select(attachmentId).then(function() {
                        result.handleAttachment(this.attachment);
                    });
                });
            });

            return result;
        },

        /**
         * Deletes an attachment.
         *
         * @param attachmentId
         */
        unattach: function(attachmentId)
        {
            return this.subchain().then(function() {

                this.chainDelete(this, this.getUri() + "/attachments/" + attachmentId).then(function() {

                    // TODO

                });
            });
        }

    });

})(window);
(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Repository = Gitana.AbstractObject.extend(
    /** @lends Gitana.Repository.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class Repository
         *
         * @param {Gitana.Driver} driver
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(server, object)
        {
            this.base(server, object);

            this.objectType = "Gitana.Repository";
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/repositories/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().repository(this.getServer(), this.object);
        },

        /**
         * Delete
         *
         * @chained server
         *
         * @public
         */
        del: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId();
            };

            // NOTE: pass control back to the server instance
            return this.chainDelete(this.getServer(), uriFunction);
        },

        /**
         * Reload
         *
         * @chained security group
         *
         * @public
         */
        reload: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId();
            };

            return this.chainReload(this.clone(), uriFunction);
        },

        /**
         * Update
         *
         * @chained security group
         *
         * @public
         */
        update: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId();
            };

            return this.chainUpdate(this.clone(), uriFunction);
        },

        /**
         * List the branches.
         *
         * @chained branch map
         *
         * @public
         *
         * @param [Object] pagination
         */
        listBranches: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/branches";
            };

            var chainable = this.getFactory().branchMap(this);
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Reads a branch.
         *
         * @chained branch
         *
         * @public
         *
         * @param {String} branchId the branch id
         */
        readBranch: function(branchId)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/branches/" + branchId;
            };

            var chainable = this.getFactory().branch(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Creates a branch.
         *
         * @chained branch
         *
         * @public
         *
         * @param {String} changesetId the changeset id where the new branch should be rooted.
         * @param [Object] object JSON object for the branch
         */
        createBranch: function(changesetId, object)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/branches";
            };

            var createParams = {
                "changeset": changesetId
            };
            var chainable = this.getFactory().branch(this);
            return this.chainCreate(chainable, object, uriFunction, createParams);
        },

        /**
         * Queries for branches.
         *
         * Config should be:
         *
         *    {
         *       Gitana query configs
         *    }
         *
         * @public
         *
         * @param {Object} query
         * @param [Object] pagination
         */
        queryBranches: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/branches/query";
            };

            var chainable = this.getFactory().branchMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * List the changesets in this repository.
         *
         * @chained
         *
         * @public
         */
        listChangesets: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/changesets";
            };

            var chainable = this.getFactory().changesetMap(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Read a changeset.
         *
         * @chained
         *
         * @public
         *
         * @param {String} changesetId the id of the changeset
         */
        readChangeset: function(changesetId)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/changesets/" + changesetId;
            };

            var chainable = this.getFactory().changeset(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Acquires a list of the parent changesets for a given changeset.
         *
         * @chained
         *
         * @public
         *
         * @param {String} changesetId the id of the changeset
         */
        listChangesetParents: function(changesetId)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/changesets/" + changesetId + "/parents";
            };

            var chainable = this.getFactory().changesetMap(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Acquires a list of the child changesets for a given changeset.
         *
         * @chained
         *
         * @public
         *
         * @param {String} changesetId the id of the changeset
         */
        listChangesetChildren: function(changesetId)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/changesets/" + changesetId + "/children";
            };

            var chainable = this.getFactory().changesetMap(this);
            return this.chainGet(chainable, uriFunction);
        },

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ACL METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Retrieve full ACL and pass into chaining method.
         *
         * @chained server
         *
         * @param callback
         */
        loadACL: function(callback)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/acl";
            };

            return this.chainGetResponse(this, uriFunction).then(function() {
                callback.call(this, this.response);
            });
        },

        /**
         * Retrieve list of authorities and pass into chaining method.
         *
         * @chained server
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param callback
         */
        listAuthorities: function(principal, callback)
        {
            var principalId = this.extractPrincipalId(principal);

            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/acl/" + principalId;
            };

            return this.chainGetResponseRows(this, uriFunction).then(function() {
                callback.call(this, this.response);
            });
        },

        /**
         * Checks whether the given principal has a granted authority for this object.
         * This passes the result (true/false) to the chaining function.
         *
         * @chained server
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         * @param callback
         */
        checkAuthority: function(principal, authorityId, callback)
        {
            var principalId = this.extractPrincipalId(principal);

            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/acl/" + principalId;
            };

            return this.chainHasResponseRow(this, uriFunction, authorityId).then(function() {
                callback.call(this, this.response)
            })
        },

        /**
         * Grants an authority to a principal against this object.
         *
         * @chained server
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         */
        grantAuthority: function(principal, authorityId)
        {
            var principalId = this.extractPrincipalId(principal);

            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/acl/" + principalId + "/grant/" + authorityId
            };

            return this.chainPostEmpty(this, uriFunction);
        },

        /**
         * Revokes an authority from a principal against this object.
         *
         * @chained server
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         */
        revokeAuthority: function(principal, authorityId)
        {
            var principalId = this.extractPrincipalId(principal);

            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/acl/" + principalId + "/revoke/" + authorityId;
            };

            return this.chainPostEmpty(this, uriFunction);
        },

        /**
         * Revokes all authorities for a principal against the server.
         *
         * @chained server
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         */
        revokeAllAuthorities: function(principal)
        {
            return this.revokeAuthority(principal, "all");
        },

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // END OF ACL METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ACCESSORS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        getMaxSize: function()
        {
            return this.get("maxSize");
        },

        getSize: function()
        {
            return this.get("size");
        },

        getObjectCount: function()
        {
            return this.get("objectcount");
        }

    });

})(window);
(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.SecurityGroup = Gitana.Principal.extend(
    /** @lends Gitana.SecurityGroup.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Principal
         *
         * @class Group
         *
         * @param {Gitana.Server} server
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(server, object)
        {
            this.base(server, object);

            this.objectType = "Gitana.SecurityGroup";
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/security/groups/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().securityGroup(this.getServer(), this.object);
        },

        /**
         * Delete
         *
         * @chained server
         *
         * @public
         */
        del: function()
        {
            // NOTE: pass control back to the server
            return this.chainDelete(this.getServer(), "/security/groups/" + this.getId());
        },

        /**
         * Reload
         *
         * @chained security group
         *
         * @public
         */
        reload: function()
        {
            return this.chainReload(this.clone(), "/security/groups/" + this.getId());
        },

        /**
         * Update
         *
         * @chained security group
         *
         * @public
         */
        update: function()
        {
            return this.chainUpdate(this.clone(), "/security/groups/" + this.getId());
        },

        /**
         * Acquires a list of all of the members who are in this group.
         *
         * @chained principal map
         *
         * @public
         *
         * @param {String} filter type of principal to hand back ("user" or "group")
         * @param {Boolean} indirect whether to include members that inherit through child groups
         * @param [Object] pagination
         */
        listMembers: function(filter, indirect, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }
            params["filter"] = filter;
            if (indirect)
            {
                params["indirect"] = true;
            }

            var uriFunction = function()
            {
                return "/security/groups/" + self.getPrincipalId() + "/members";
            };

            var chainable = this.getFactory().principalMap(this.getServer());
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Acquires a list of all of the users who are in this group.
         *
         * @chained principal map
         *
         * @public
         *
         * @param [Boolean] inherit whether to include members that inherit through child groups
         * @param [Object] pagination
         */
        listUsers: function()
        {
            var inherit = false;
            var pagination = null;
            var args = Gitana.makeArray(arguments);
            var a1 = args.shift();
            if (Gitana.isBoolean(a1))
            {
                inherit = a1;
                pagination = args.shift();
            }
            else
            {
                pagination = args.shift();
            }

            return this.listMembers("user", inherit, pagination);
        },

        /**
         * Acquires a list of all of the groups who are in this group.
         *
         * @chained principal map
         *
         * @public
         *
         * @param [Boolean] inherit whether to include members that inherit through child groups
         * @param [Object] pagination
         */
        listGroups: function()
        {
            var inherit = false;
            var pagination = null;
            var args = Gitana.makeArray(arguments);
            var a1 = args.shift();
            if (Gitana.isBoolean(a1))
            {
                inherit = a1;
                pagination = args.shift();
            }
            else
            {
                pagination = args.shift();
            }

            return this.listMembers("group", inherit, pagination);
        },

        /**
         * Adds a principal as a member of this group.
         *
         * @chained current group
         *
         * @public
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         */
        addMember: function(principal)
        {
            var principalId = this.extractPrincipalId(principal);

            return this.chainPostEmpty(this, "/security/groups/" + this.getId() + "/add/" + principalId);
        },

        /**
         * Removes a principal as a member of this group.
         *
         * @chained current group
         *
         * @public
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         */
        removeMember: function(principal)
        {
            var principalId = this.extractPrincipalId(principal);

            return this.chainPostEmpty(this, "/security/groups/" + this.getId() + "/remove/" + principalId);
        }

    });

})(window);
(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.SecurityUser = Gitana.Principal.extend(
    /** @lends Gitana.SecurityUser.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Principal
         *
         * @class User
         *
         * @param {Gitana.Server} server
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(server, object)
        {
            this.base(server, object);

            this.objectType = "Gitana.SecurityUser";
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/security/users/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().securityUser(this.getServer(), this.object);
        },

        /**
         * Delete
         *
         * @chained server
         *
         * @public
         */
        del: function()
        {
            // NOTE: pass control back to the server
            return this.chainDelete(this.getServer(), "/security/users/" + this.getId());
        },

        /**
         * Reload
         *
         * @chained security user
         *
         * @public
         */
        reload: function()
        {
            return this.chainReload(this.clone(), "/security/users/" + this.getId());
        },

        /**
         * Update
         *
         * @chained security user
         *
         * @public
         */
        update: function()
        {
            return this.chainUpdate(this.clone(), "/security/users/" + this.getId());
        },

        /**
         * Reads the person object for this user.
         *
         * @param branch
         * @param createIfNotFound
         *
         * @chained person
         * @public
         */
        readPerson: function(branch, createIfNotFound)
        {
            // what we hand back
            var result = this.subchain(this.getFactory().node(branch, "n:person"));

            // work
            result.subchain(branch).readPerson(this.getPrincipalId(), createIfNotFound).then(function() {
                result.handleResponse(this.object);
            });

            return result;
        },



        //////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // PROPERTIES
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////

        getFirstName: function()
        {
            return this.get("firstName");
        },

        setFirstName: function(firstName)
        {
            this.set("firstName", firstName);
        },

        getLastName: function()
        {
            return this.get("lastName");
        },

        setLastName: function(lastName)
        {
            this.set("lastName", lastName);
        },

        getCompanyName: function()
        {
            return this.get("companyName");
        },

        setCompanyName: function(companyName)
        {
            this.set("companyName", companyName);
        },

        getEmail: function()
        {
            return this.get("email");
        },

        setEmail: function(email)
        {
            this.set("email", email);
        }

    });

})(window);
(function(window)
{
    Gitana = window.Gitana;

    Gitana.Server = Gitana.Chainable.extend(
    /** @lends Gitana.Server.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Chainable
         *
         * @class Gitana server object
         */
        constructor: function(driver)
        {
            this.base(driver);

            this.objectType = "Gitana.Server";
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/";
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().server(this.getDriver());
        },

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ACL METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Retrieve full ACL and pass into chaining method.
         *
         * @chained server
         *
         * @param callback
         */
        loadACL: function(callback)
        {
            return this.chainGetResponse(this, "/acl").then(function() {
                callback.call(this, this.response);
            });
        },

        /**
         * Retrieve list of authorities and pass into chaining method.
         *
         * @chained server
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param callback
         */
        listAuthorities: function(principal, callback)
        {
            var principalId = this.extractPrincipalId(principal);

            return this.chainGetResponseRows(this, "/acl/" + principalId).then(function() {
                callback.call(this, this.response);
            });
        },

        /**
         * Checks whether the given principal has a granted authority for this object.
         * This passes the result (true/false) to the chaining function.
         *
         * @chained server
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         * @param callback
         */
        checkAuthority: function(principal, authorityId, callback)
        {
            var principalId = this.extractPrincipalId(principal);

            return this.chainHasResponseRow(this, "/acl/" + principalId, authorityId).then(function() {
                callback.call(this, this.response)
            })
        },

        /**
         * Grants an authority to a principal against this object.
         *
         * @chained server
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         */
        grantAuthority: function(principal, authorityId)
        {
            var principalId = this.extractPrincipalId(principal);

            return this.chainPostEmpty(this, "/acl/" + principalId + "/grant/" + authorityId);
        },

        /**
         * Revokes an authority from a principal against this object.
         *
         * @chained server
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         */
        revokeAuthority: function(principal, authorityId)
        {
            var principalId = this.extractPrincipalId(principal);

            return this.chainPostEmpty(this, "/acl/" + principalId + "/revoke/" + authorityId);
        },

        /**
         * Revokes all authorities for a principal against the server.
         *
         * @chained server
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         */
        revokeAllAuthorities: function(principal)
        {
            return this.revokeAuthority(principal, "all");
        },

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // END OF ACL METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////






        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // CHAINING METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Acquires a list of all groups.
         *
         * @chained group map
         *
         * @param [Gitana.SecurityGroup] group optionally only look for users in a group
         * @param [Object] pagination pagination (optional)
         */
        listGroups: function()
        {
            // figure out arguments
            var args = Gitana.makeArray(arguments);
            var group = null;
            var pagination = null;
            var a1 = args.shift();
            if (a1)
            {
                if (a1.objectType == "Gitana.SecurityGroup")
                {
                    group = a1;
                    pagination = args.shift();
                }
                else
                {
                    pagination = a1;
                }
            }

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            // get to work
            var chainable = this.getFactory().principalMap(this);

            if (!group)
            {
                // all groups
                return this.chainGet(chainable, "/security/groups", params);
            }
            else
            {
                // subchain that want to hand back
                var result = this.subchain(chainable);

                // now push our logic into a subchain that is the first thing in the result
                var groupId = this.extractPrincipalId(group);

                result.subchain(this /*server*/).readGroup(groupId).listGroups(params).then(function() {
                    result.handleResponse(this.object);
                });

                return result;
            }
        },

        /**
         * Reads a group
         *
         * @chained group
         *
         * @param {String} groupId the group id
         */
        readGroup: function(groupId)
        {
            var chainable = this.getFactory().securityGroup(this);
            return this.chainGet(chainable, "/security/groups/" + groupId);
        },

        /**
         * Create a group.
         *
         * @chained group
         *
         * @param {String} groupId the group id
         * @param [Object] object JSON object
         */
        createGroup: function(groupId, object)
        {
            if (!object)
            {
                object = {};
            }
            object["principal-id"] = groupId;
            object["principal-type"] = "group";

            var chainable = this.getFactory().securityGroup(this);
            return this.chainCreateEx(chainable, object, "/security/groups", "/security/groups/" + groupId);
        },

        /**
         * Acquires a list of all users.
         *
         * @chained principal map
         *
         * @param [Gitana.SecurityGroup] group optionally only look for users in a group
         * @param [Object] pagination pagination (optional)
         */
        listUsers: function()
        {
            // figure out arguments
            var args = Gitana.makeArray(arguments);
            var group = null;
            var pagination = null;
            var a1 = args.shift();
            if (a1)
            {
                if (a1.objectType == "Gitana.SecurityGroup")
                {
                    group = a1;
                    pagination = args.shift();
                }
                else
                {
                    pagination = a1;
                }
            }

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            // now get to work
            var chainable = this.getFactory().principalMap(this);

            if (!group)
            {
                // all users
                return this.chainGet(chainable, "/security/users", params);
            }
            else
            {
                // subchain that want to hand back
                var result = this.subchain(chainable);

                // now push our logic into a subchain that is the first thing in the result
                var groupId = this.extractPrincipalId(group);
                result.subchain(this /*server*/).readGroup(groupId).listUsers(params).then(function() {
                    result.handleResponse(this.object);
                });

                return result;
            }
        },

        /**
         * Reads a user
         *
         * @chained user
         *
         * @param {String} userId the user id
         */
        readUser: function(userId)
        {
            var chainable = this.getFactory().securityUser(this);
            return this.chainGet(chainable, "/security/users/" + userId);
        },

        /**
         * Create a user.
         *
         * @chained user
         *
         * @param {String} userId user id
         * @param [Object] object JSON object
         */
        createUser: function(userId, object)
        {
            var self = this;

            if (!object)
            {
                object = {};
            }
            object["principal-id"] = userId;
            object["principal-type"] = "user";

            var chainable = this.getFactory().securityUser(this);
            return this.chainCreateEx(chainable, object, "/security/users", "/security/users/" + userId);
        },

        /**
         * Lists repositories.
         *
         * @chained repository map
         *
         * @param [Object] pagination pagination (optional)
         */
        listRepositories: function(pagination)
        {
            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().repositoryMap(this);
            return this.chainGet(chainable, "/repositories", params);
        },

        /**
         * Read a repository.
         *
         * @chained repository
         *
         * @param {String} repositoryId the repository id
         */
        readRepository: function(repositoryId)
        {
            var chainable = this.getFactory().repository(this);
            return this.chainGet(chainable, "/repositories/" + repositoryId);
        },

        /**
         * Create a repository
         *
         * @chained repository
         *
         * @param [Object] object JSON object
         */
        createRepository: function(object)
        {
            var chainable = this.getFactory().repository(this);
            return this.chainCreate(chainable, object, "/repositories");
        },

        /**
         * Queries for a repository.
         *
         * @chained repository map
         *
         * @param {Object} query Query for finding a repository.
         * @param [Object] pagination pagination (optional)
         */
        queryRepositories: function(query, pagination)
        {
            var chainable = this.getFactory().repositoryMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, "/repositories/query", params, query);
        },

        /**
         * Adds a principal as a member of a group
         *
         * @chained server
         *
         * @public
         *
         * @param {Gitana.Principal|String} group the group or the group id
         * @param {Gitana.Principal|String} principal the principal or the principal id
         */
        addMember: function(group, principal)
        {
            var groupId = this.extractPrincipalId(group);
            var principalId = this.extractPrincipalId(principal);

            return this.chainPostEmpty(this, "/security/groups/" + groupId + "/add/" + principalId);
        },

        /**
         * Removes a principal as a member of a group.
         *
         * @chained server
         *
         * @public
         *
         * @param {Gitana.Principal|String} group the group or the group id
         * @param {Gitana.Principal|String} principal the principal or the principal id
         */
        removeMember: function(group, principal)
        {
            var groupId = this.extractPrincipalId(group);
            var principalId = this.extractPrincipalId(principal);

            return this.chainPostEmpty(this, "/security/groups/" + groupId + "/remove/" + principalId);
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ACL METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Logs in as the given user.
         *
         * This delegates a call to the underlying driver.
         *
         * @param {String} username the user name
         * @param {String} password password
         * @param [Function] authentication failure handler
         */
        authenticate: function(username, password, authFailureHandler)
        {
            return this.getDriver().authenticate(username, password, authFailureHandler);
        },

        /**
         * Clears authentication against the server.
         *
         * @chained server
         *
         * @public
         */
        logout: function()
        {
            var self = this;

            var result = this.subchain(this);

            result.subchain().then(function() {
                self.getDriver().clearAuthentication();
            });

            return result;
        }

    });

    // STATICS
    // Special Groups

    Gitana.EVERYONE = {
        "principal-id": "EVERYONE",
        "principal-type": "GROUP"
    };

})(window);(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AuditRecordMap = Gitana.AbstractMap.extend(
    /** @lends Gitana.AuditRecordMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of audit record objects
         *
         * @param persistable
         * @param [Object] object
         */
        constructor: function(persistable, object)
        {
            this.objectType = "Gitana.AuditRecordMap";

            this.persistable = persistable;

            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(persistable.getServer(), object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().auditRecordMap(this.persistable, this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().auditRecord(this.persistable, json);
        }

    });

})(window);
(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.BranchMap = Gitana.AbstractMap.extend(
    /** @lends Gitana.BranchMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of branch objects
         *
         * @param {Gitana.Repository} repository
         * @param [Object] object
         */
        constructor: function(repository, object)
        {
            this.objectType = "Gitana.BranchMap";

            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Repository object.
             *
             * @inner
             *
             * @returns {Gitana.Repository} The Gitana Repository object
             */
            this.getRepository = function() { return repository; };

            /**
             * Gets the Gitana Repository id.
             *
             * @inner
             *
             * @returns {String} The Gitana Repository id
             */
            this.getRepositoryId = function() { return repository.getId(); };


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(repository.getServer(), object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().branchMap(this.getRepository(), this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().branch(this.getRepository(), json);
        }

    });

})(window);
(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.ChangesetMap = Gitana.AbstractMap.extend(
    /** @lends Gitana.ChangesetMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of changeset objects
         *
         * @param {Gitana.Server} server Gitana server instance.
         * @param [Object] object
         */
        constructor: function(repository, object)
        {
            this.objectType = "Gitana.ChangesetMap";

            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Repository object.
             *
             * @inner
             *
             * @returns {Gitana.Repository} The Gitana Repository object
             */
            this.getRepository = function() { return repository; };

            /**
             * Gets the Gitana Repository id.
             *
             * @inner
             *
             * @returns {String} The Gitana Repository id
             */
            this.getRepositoryId = function() { return repository.getId(); };


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(repository.getServer(), object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().changesetMap(this.getRepository(), this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().changeset(this.getRepository(), json);
        }

    });

})(window);
(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.NodeMap = Gitana.AbstractMap.extend(
    /** @lends Gitana.NodeMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of node objects
         *
         * @param {Gitana.Server} server Gitana server instance.
         * @param [Object] object
         */
        constructor: function(branch, object)
        {
            this.objectType = "Gitana.NodeMap";

            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Repository object.
             *
             * @inner
             *
             * @returns {Gitana.Repository} The Gitana Repository object
             */
            this.getRepository = function() { return branch.getRepository(); };

            /**
             * Gets the Gitana Repository id.
             *
             * @inner
             *
             * @returns {String} The Gitana Repository id
             */
            this.getRepositoryId = function() { return branch.getRepository().getId(); };

            /**
             * Gets the Gitana Branch object.
             *
             * @inner
             *
             * @returns {Gitana.Branch} The Gitana Branch object
             */
            this.getBranch = function() { return branch; };

            /**
             * Gets the Gitana Branch id.
             *
             * @inner
             *
             * @returns {String} The Gitana Branch id
             */
            this.getBranchId = function() { return branch.getId(); };


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(branch.getServer(), object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().nodeMap(this.getBranch(), this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().node(this.getBranch(), json);
        }

    });

})(window);
(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.PrincipalMap = Gitana.AbstractMap.extend(
    /** @lends Gitana.PrincipalMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of principal objects
         *
         * @param {Gitana.Server} server Gitana server instance.
         * @param [Object] object
         */
        constructor: function(server, object)
        {
            this.objectType = "Gitana.PrincipalMap";


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(server, object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().principalMap(this.getServer(), this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            var o = null;

            var principalType = json["principal-type"];
            if (principalType)
            {
                principalType = principalType.toLowerCase();

                if (principalType == "user")
                {
                    o = this.getFactory().securityUser(this.getServer(), json);
                }
                else if (principalType == "group")
                {
                    o = this.getFactory().securityGroup(this.getServer(), json);
                }
            }

            return o;
        }

    });

})(window);
(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.RepositoryMap = Gitana.AbstractMap.extend(
    /** @lends Gitana.RepositoryMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of repository objects
         *
         * @param {Gitana.Server} server Gitana server instance.
         * @param {Object} object
         */
        constructor: function(server, object)
        {
            this.objectType = "Gitana.RepositoryMap";


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(server, object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().repositoryMap(this.getServer(), this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().repository(this.getServer(), json);
        }

    });

})(window);
(function(window)
{
    var Gitana = window.Gitana;

    Gitana.Definition = Gitana.Node.extend(
    /** @lends Gitana.Definition.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Node
         *
         * @class Definition
         *
         * @param {Gitana.Branch} branch
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(branch, object)
        {
            this.base(branch, object);

            this.objectType = "Gitana.Definition";
        },

        /**
         * Acquires a list of associations of type "a:has_form" for this definition.
         *
         * @chaining node map
         *
         * @public
         */
        listFormAssociations: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/forms";
            };

            var chainable = this.getFactory().nodeMap(this.getBranch());
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Reads a form by form key that is associated to this definition.
         *
         * @public
         *
         * @param {String} formKey the form key
         */
        readForm: function(formKey)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/forms/" + formKey;
            };

            var chainable = this.getFactory().form(this.getBranch());
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Creates a form and associates it to this definition.
         *
         * @public
         *
         * @param {String} formKey the form key
         * @param [Object] object the object that constitutes the form
         */
        createForm: function(formKey, formObject)
        {
            var self = this;

            // set up form object
            if (!formObject)
            {
                formObject = {};
            }
            formObject["_type"] = "n:form";

            var chainable = this.getFactory().form(this.getBranch());

            // subchain that want to hand back
            var result = this.subchain(chainable);

            // now push our logic into a subchain that is the first thing in the result
            result.subchain(this.getBranch()).createNode(formObject).then(function() {
                var formNode = this;

                // switch to definition node
                this.subchain(self).then(function() {
                    var associationObject = {
                        "_type": "a:has_form",
                        "form-key": formKey
                    };
                    this.associate(formNode, associationObject).then(function() {

                        var association = this;

                        // read back into the form chainable
                        var uri = "/repositories/" + formNode.getRepositoryId() + "/branches/" + formNode.getBranchId() + "/nodes/" + formNode.getId();
                        this.getDriver().gitanaGet(uri, null, function(response) {

                            result.handleResponse(response);
                            association.next();
                        });

                        // we manually signal when this then() is done
                        return false;
                    });
                });
            });

            return result;
        },

        /**
         * Convenience function to remove a form linked to this definition.
         * Note: This doesn't delete the form, it simply unlinks the association.
         *
         * @chained this
         *
         * @public
         *
         * @param {String} formKey the form key
         */
        removeFormAssociation: function(formKey)
        {
            return this.link(this).then(function() {

                var association = null;

                this.listFormAssociations().each(function() {
                    if (this.getFormKey() == formKey)
                    {
                        association = this;
                    }
                }).then(function() {
                    if (association)
                    {
                        this.subchain(association).del();
                    }
                })
            });
        }
    });

    Gitana.ObjectFactory.register("d:type", Gitana.Definition);
    Gitana.ObjectFactory.register("d:feature", Gitana.Definition);
    Gitana.ObjectFactory.register("d:association", Gitana.Definition);

})(window);
(function(window)
{
    var Gitana = window.Gitana;

    Gitana.Form = Gitana.Node.extend(
    /** @lends Gitana.Form.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Node
         *
         * @class Form
         *
         * @param {Gitana.Branch} branch
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(branch, object)
        {
            this.base(branch, object);

            this.objectType = "Gitana.Form";
        },

        /**
         * Gets the engine id for this form.
         *
         * @public
         *
         * @returns {String} engine id
         */
        getEngineId: function()
        {
            return this.get("engineId");
        },

        /**
         * Sets the engine id for this form.
         *
         * @public
         *
         * @param engineId
         */
        setEngineId: function(engineId)
        {
            this.set("engineId", engineId);
        }

    });

    Gitana.ObjectFactory.register("n:form", Gitana.Form);

})(window);
(function(window)
{
    var Gitana = window.Gitana;

    Gitana.HasFormAssociation = Gitana.Association.extend(
    /** @lends Gitana.HasFormAssociation.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Association
         *
         * @class Has Form Association
         *
         * @param {Gitana.Branch} branch
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(branch, object)
        {
            this.base(branch, object);

            this.objectType = "Gitana.HasFormAssociation";
        },

        /**
         * Gets the form key for the association.
         *
         * @public
         *
         * @returns {String} form key
         */
        getFormKey: function()
        {
            return this.get("form-key");
        },

        /**
         * Sets the form key for the association.
         *
         * @public
         * 
         * @param formKey
         */
        setFormKey: function(formKey)
        {
            this.set("form-key", formKey);
        }
    });

    Gitana.ObjectFactory.register("a:has_form", Gitana.HasFormAssociation);

})(window);
(function(window)
{
    var Gitana = window.Gitana;

    Gitana.HasTranslationAssociation = Gitana.Association.extend(
    /** @lends Gitana.HasTranslationAssociation.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Association
         *
         * @class Has Translation Association
         *
         * @param {Gitana.Branch} branch
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(branch, object)
        {
            this.base(branch, object);

            this.objectType = "Gitana.HasTranslationAssociation";
        },

        /**
         * Gets the locale of this association.
         *
         * @returns {String} locale
         */
        getLocale: function()
        {
            return this.get("locale");;
        },

        /**
         * Sets the locale of this association.
         *
         * @param locale
         */
        setLocale: function(locale)
        {
            this.set("locale", locale);
        },

        /**
         * Gets the edition of this association.
         *
         * @returns {String} edition
         */
        getEdition: function()
        {
            return this.get("edition");
        },

        /**
         * Sets the edition of this association.
         *
         * @param edition
         */
        setEdition: function(edition)
        {
            this.set("edition", edition);
        }

    });

    Gitana.ObjectFactory.register("a:has_translation", Gitana.HasTranslationAssociation);

})(window);
(function(window)
{
    var Gitana = window.Gitana;

    Gitana.Person = Gitana.Node.extend(
    /** @lends Gitana.Person.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Node
         *
         * @class Person
         *
         * @param {Gitana.Branch} branch
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(branch, object)
        {
            this.base(branch, object);

            this.objectType = "Gitana.Person";
        },

        getPrincipalId: function()
        {
            return this.get("principal-id");
        },

        /**
         * Reads the user object for this person.
         *
         * @chained security user
         */
        readUser: function()
        {
            // what we're handing back
            var result = this.subchain(this.getFactory().securityUser(this.getServer()));

            // work
            result.subchain(this.getServer()).readUser(this.getPrincipalId()).then(function() {
                result.handleResponse(this.object);
            });

            return result;
        }

    });

    Gitana.ObjectFactory.register("n:person", Gitana.Person);

})(window);
(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.TraversalResults = Gitana.AbstractPersistable.extend(
    /** @lends Gitana.TraversalResults.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPersistable
         *
         * @class Provides access to traversal results
         *
         * @param {Gitana.Branch} branch
         * @param [Object] object
         */
        constructor: function(branch, object)
        {
            if (!this._nodes)
            {
                this._nodes = {};
            }
            if (!this._associations)
            {
                this._associations = {};
            }
            if (!this._config)
            {
                this._config = {};
            }

            this.base(branch.getServer(), object);


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Repository object.
             *
             * @inner
             *
             * @returns {Gitana.Repository} The Gitana Repository object
             */
            this.getRepository = function() { return branch.getRepository(); };

            /**
             * Gets the Gitana Repository id.
             *
             * @inner
             *
             * @returns {String} The Gitana Repository id
             */
            this.getRepositoryId = function() { return branch.getRepository().getId(); };

            /**
             * Gets the Gitana Branch object.
             *
             * @inner
             *
             * @returns {Gitana.Branch} The Gitana Branch object
             */
            this.getBranch = function() { return branch; };

            /**
             * Gets the Gitana Branch id.
             *
             * @inner
             *
             * @returns {String} The Gitana Branch id
             */
            this.getBranchId = function() { return branch.getId(); };
        },

        clear: function()
        {
            // empty the nodes map
            for (var i in this._nodes) {
                if (this._nodes.hasOwnProperty(i)) {
                    delete this._nodes[i];
                }
            }

            // empty the associations map
            for (var i in this._associations) {
                if (this._associations.hasOwnProperty(i)) {
                    delete this._associations[i];
                }
            }

            // empty the config map
            for (var i in this._config) {
                if (this._config.hasOwnProperty(i)) {
                    delete this._config[i];
                }
            }
        },

        /**
         * @override
         *
         * @param response
         */
        handleResponse: function(response)
        {
            this.base(response);

            this.clear();

            // copy nodes and associations map values
            Gitana.copyInto(this._nodes, response.nodes);
            Gitana.copyInto(this._associations, response.associations);

            // copy config
            Gitana.copyInto(this._config, response.config);

            // copy center node information
            this._config["center"] = response.node;
        },

        /**
         * Looks up the node around which this traversal is centered.
         */
        center: function()
        {
            var chainable = this.getFactory().node(this.getBranch());

            var result = this.subchain(chainable);

            // push our logic to the front
            result.subchain(this.getBranch()).readNode(this._config["center"]).then(function() {
                result.handleResponse(this.object);
            });

            return result;
        },

        /**
         * Counts the number of nodes in the traversal results
         *
         * @param callback
         */
        nodeCount: function(callback)
        {
            return this.then(function() {
                callback.call(this, Gitana.getNumberOfKeys(this._nodes));
            });
        },

        /**
         * Counts the number of associations in teh traversal results
         *
         * @param callback
         */
        associationCount: function(callback)
        {
            return this.then(function() {
                callback.call(this, Gitana.getNumberOfKeys(this._associations));
            });
        },

        /**
         * Hands back a map of all of the nodes in the traversal results
         *
         * @chained node map
         */
        nodes: function()
        {
            var self = this;

            // what we're handing back
            var result = this.subchain(this.getFactory().nodeMap(this.getBranch()));

            // subchain at front to load
            result.subchain().then(function() {

                var response = {
                    "rows": self._nodes
                };

                result.handleResponse(response);
            });

            return result;
        },

        /**
         * Hands back a single node
         *
         * @chained node
         *
         * @param nodeId
         */
        node: function(id)
        {
            var self = this;

            // node
            var result = this.subchain(this.getFactory().node(this.getBranch()));

            result.subchain(self).then(function() {
                this.nodes().then(function() {
                    var node = this.get(id);
                    if (node)
                    {
                        result.handleResponse(node.object);
                    }
                    else
                    {
                        // NOTE: return here so that we don't continue processing beyond this link
                        return self.missingNodeError(id);
                    }
                });
            });

            return result;
        },

        /**
         * Hands back a map of all of the associations in the traversal results
         *
         * @chained node map
         */
        associations: function()
        {
            var self = this;

            // what we're handing back
            var result = this.subchain(this.getFactory().nodeMap(this.getBranch()));

            // subchain at front to load
            result.subchain().then(function() {

                var response = {
                    "rows": self._associations
                };

                result.handleResponse(response);
            });

            return result;
        },

        /**
         * Hands back a single association.
         *
         * @chained association
         *
         * @param id
         */
        association: function(id)
        {
            var self = this;

            var result = this.subchain(this.getFactory().association(this.getBranch()));

            result.subchain().then(function() {
                this.associations().then(function() {
                    var node = this.get(id);
                    if (node)
                    {
                        result.handleResponse(node.object);
                    }
                    else
                    {
                        // NOTE: return here so that we don't continue processing beyond this link
                        return self.missingNodeError(id);
                    }
                });
            });

            return result;
        }

    });

})(window);
(function(window)
{
    var Gitana = window.Gitana;

    Gitana.BinaryAttachment = Gitana.Chainable.extend(
    /** @lends Gitana.BinaryAttachment.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Chainable
         *
         * @class Binary Attachment
         *
         * @param {Object} persistable gitana object
         * @param {String} attachmentId
         * @param {Object} attachment
         */
        constructor: function(persistable, attachmentId, attachment)
        {
            this.base(persistable.getDriver());

            this.objectType = "Gitana.BinaryAttachment";

            this.persistable = persistable;
            this.attachmentId = attachmentId;
            this.attachment = {};

            this.handleAttachment(attachment);
        },

        handleAttachment: function(attachment)
        {
            // empty the attachment object
            for (var i in this.attachment) {
                if (this.attachment.hasOwnProperty(i)) {
                    delete this.attachment[i];
                }
            }

            if (attachment)
            {
                Gitana.copyInto(this.attachment, attachment);
            }
        },

        getId: function()
        {
            return this.attachmentId;
        },

        getLength: function()
        {
            return this.attachment.length;
        },

        getContentType: function()
        {
            return this.attachment.contentType;
        },

        getUri: function()
        {
            return this.persistable.getUri() + "/attachments/" + this.getId();
        },

        getDownloadUri: function()
        {
            return this.getDriver().serverURL + this.getUri();
        },

        /**
         * Deletes the attachment, hands back control to the persistable.
         *
         * @chained persistable
         */
        del: function()
        {
            var self = this;

            var result = this.subchain(this.persistable);

            // our work (first in chain)
            result.subchain(self).then(function() {

                var chain = this;

                // delete the attachment
                this.getDriver().gitanaDelete(this.getUri(), null, function() {

                    chain.next();

                }, function(http) {
                    self.httpError(http);
                });

                return false;
            });

            return result;
        },

        /**
         * Downloads the attachment.
         *
         * @chained attachment
         * @param callback
         */
        download: function(callback)
        {
            var self = this;

            return this.then(function() {

                var chain = this;

                // download
                this.getDriver().gitanaDownload(this.getUri(), null, function(data) {
                    callback.call(self, data);
                    chain.next();
                }, function(http) {
                    self.httpError(http);
                });

                return false;
            });
        }

    });

})(window);
(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.BinaryAttachmentMap = Gitana.AbstractPersistable.extend(
    /** @lends Gitana.BinaryAttachmentMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPersistable
         *
         * @class Provides access to binaries
         *
         * @param repository
         * @param map
         */
        constructor: function(persistable, _map)
        {
            this.base(persistable.getServer());

            this.objectType = "Gitana.BinaryAttachmentMap";

            this.persistable = persistable;
            this.map = {};

            this.handleMap(_map);


            // priviledged methods

            this.getAttachments = function()
            {
                var attachments = {};

                for (var attachmentId in this.map)
                {
                    attachments[attachmentId] = this.produce(attachmentId, this.map[attachmentId]);
                }

                return attachments;
            },

            this.produce = function(attachmentId, attachment)
            {
                return new Gitana.BinaryAttachment(this.persistable, attachmentId, attachment);
            }
        },

        handleMap: function(map)
        {
            // empty the map object
            for (var i in this.map) {
                if (this.map.hasOwnProperty(i)) {
                    delete this.map[i];
                }
            }

            if (map)
            {
                Gitana.copyInto(this.map, map);
            }
        },

        /**
         * Counts the number of attachments.
         *
         * @param callback
         */
        count: function(callback)
        {
            return this.then(function() {

                var count = Gitana.getNumberOfKeys(this.getAttachments());

                callback.call(this, count);
            });
        },

        each: function(callback)
        {
            return this.then(function() {

                var count = 0;
                var attachments = this.getAttachments();
                for (var attachmentId in attachments)
                {
                    var attachment = attachments[attachmentId];

                    // a function that fires our callback
                    // wrap in a closure so that we store the callback and key
                    // note: this = the value wrapped in a chain, so we don't pass in value
                    var f = function(callback, key, index)
                    {
                        return function()
                        {
                            callback.call(this, key, this, index);
                        };

                    }(callback, attachmentId, count);

                    // create subchain mounted on this chainable and the run function
                    this.subchain(attachment).then(f);
                    count++;
                }

                return this;
            });
        },

        /**
         * Retrieves an individual attachment.
         *
         * @param attachmentId
         */
        select: function(attachmentId)
        {
            var self = this;

            if (!attachmentId)
            {
                attachmentId = "default";
            }

            // what we hand back
            var result = this.subchain(this.produce(attachmentId));

            // auto-load on subchain
            result.subchain().then(function() {

                var loaded = self.getAttachments()[attachmentId];
                if (!loaded)
                {
                    var err = new Error();
                    err.name = "No attachment with id: " + attachmentId;
                    err.message = err.name;

                    this.error(err);

                    return false;
                }
                result.handleAttachment(loaded.attachment);
            });

            return result;
        }

    });

})(window);
(function(window)
{
    var Gitana = window.Gitana;

    /**
     * Node attachments are similar to binary attachments.  They're identical in structure except that they
     * additionally provide information about the original filename.
     */
    Gitana.NodeAttachment = Gitana.BinaryAttachment.extend(
    /** @lends Gitana.NodeAttachment.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.BinaryAttachment
         *
         * @class Binary Attachment
         *
         * @param {Object} persistable gitana object
         * @param {String} attachmentId
         * @param {Object} attachment
         */
        constructor: function(persistable, attachmentId, attachment)
        {
            this.base(persistable, attachmentId, attachment);
        },

        /**
         * Gets attachment file name
         * @returns {String} attachment file name
         */
        getFilename: function()
        {
            return this.attachment.filename;
        }

    });

})(window);
(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.NodeAttachmentMap = Gitana.BinaryAttachmentMap.extend(
    /** @lends Gitana.NodeAttachmentMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.BinaryAttachmentMap
         *
         * @class Provides access to node attachments
         *
         * @param repository
         * @param map
         */
        constructor: function(persistable, _map)
        {
            this.base(persistable, _map);

            this.objectType = "Gitana.NodeAttachmentMap";

            this.produce = function(attachmentId, attachment)
            {
                return new Gitana.NodeAttachment(this.persistable, attachmentId, attachment);
            }
        }

    });

})(window);
(function(window) {
/**
 * @ignore
 */
    var Gitana = window.Gitana;

    Gitana.Context = Gitana.Chainable.extend(
    /** @lends Gitana.Context.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Chainable
         *
         * @class Utility class for providing Gitana context
         *
         * @param [Object] configs Configuration parameters
         */
        constructor: function(configs) {
            this.base(new Gitana(configs['driver'] ? configs['driver'] : {}));

            // cache
            if (!this.cache) {
                this.cache = {};
            }
            this.cache["repository"] = null;
            this.cache["branch"] = null;
            this.cache["server"] = null;

            ///////////////////////////////////////////////////////////////////////////////////////////////////////
            //
            // privileged methods
            //
            ///////////////////////////////////////////////////////////////////////////////////////////////////////

            this.getConfigs = function() {
                return configs;
            };

            this.getRepositoryConfigs = function() {
                var repositoryConfigs = configs['repository'];
                if (typeof repositoryConfigs == "string") {
                    repositoryConfigs = {
                        "repository" : repositoryConfigs
                    };
                }
                return repositoryConfigs;
            };

            this.getBranchConfigs = function() {
                var branchConfigs = configs['branch'] ? configs['branch'] : 'master';
                if (typeof branchConfigs == "string") {
                    if (branchConfigs == 'master') {
                        branchConfigs = {
                            'type' : 'MASTER'
                        };
                    } else {
                        branchConfigs = {
                            "_doc" : branchConfigs
                        };
                    }
                }
                return branchConfigs;
            };

            this.getUserConfigs = function() {
                return configs['user'];
            };

            this.getDriverConfigs = function() {
                return configs['driver'];
            };
        },

        server: function(server)
        {
            if (server || server === null) {
                this.cache.server = server;
            }

            return this.cache.server ? Chain(this.cache.server) : null;
        },

        repository: function(repository)
        {
            if (repository || repository === null) {
                this.cache.repository = repository;
            }

            return this.cache.repository ? Chain(this.cache.repository) : null;
        },

        branch: function(branch)
        {
            if (branch || branch === null) {
                this.cache.branch = branch;
            }

            return this.cache.branch ? Chain(this.cache.branch) : null;
        },

        /**
         * Hands back an initialized version of the Gitana Context object
         *
         * @chained gitana context
         */
        init: function () {

            var self = this;

            var loadServer = function(successCallback, errorCallback)
            {
                if (!self.server())
                {
                    var username = self.getConfigs()["user"]["username"];
                    var password = self.getConfigs()["user"]["password"];

                    self.getDriver().authenticate(username, password, function(http) {
                        if (errorCallback) {
                            errorCallback({
                                'message': 'Failed to login Gitana.',
                                'reason': 'INVALID_LOGIN',
                                'error': http
                            });
                        }
                    }).then(function() {

                        self.server(this);

                        // now move on to repository
                        loadRepository(successCallback, errorCallback)
                    });
                }
                else
                {
                    loadRepository(successCallback, errorCallback)
                }
            };

            var loadRepository = function(successCallback, errorCallback)
            {
                if (!self.repository())
                {
                    self.server().trap(function(error) {
                        if (errorCallback) {
                            errorCallback({
                                'message': 'Failed to get repository',
                                'error': error
                            });
                        }
                    }).queryRepositories(self.getRepositoryConfigs()).count(function(count) {
                        if (errorCallback) {
                            if (count == 0) {
                                errorCallback({
                                    'message': 'Cannot find any repository'
                                });
                            }
                            if (count > 1) {
                                errorCallback({
                                    'message': 'Found more than one repository'
                                });
                            }
                        }
                    }).keepOne().then(function() {

                        self.repository(this);

                        // now move on to branch
                        loadBranch(successCallback, errorCallback);
                    });
                }
                else
                {
                    loadBranch(successCallback, errorCallback);
                }
            };

            var loadBranch = function(successCallback, errorCallback)
            {
                if (!self.branch())
                {
                    self.repository().trap(function(error) {
                        if (errorCallback) {
                            errorCallback({
                                'message': 'Failed to get branch',
                                'error': error
                            });
                        }
                    }).queryBranches(self.getBranchConfigs()).count(function(count) {
                        if (errorCallback) {
                            if (count == 0) {
                                errorCallback({
                                    'message': 'Cannot find any branch'
                                });
                            }
                            if (count > 1) {
                                errorCallback({
                                    'message': 'Found more than one branch'
                                });
                            }
                        }
                    }).keepOne().then(function() {

                        self.branch(this);

                        // now fire the success callback
                        successCallback.call();
                    });
                }
                else
                {
                    // fire the success callback
                    successCallback.call();
                }
            };

            // we hand back a chained version of ourselves
            var result = Chain(this);

            // preload work onto the chain
            return result.subchain().then(function() {

                var chain = this;

                loadServer(function() {

                    // success, advance chain manually
                    chain.next();

                }, function(err) {

                    var errorCallback = self.getConfigs()['error'];
                    if (errorCallback)
                    {
                        errorCallback.call(self, err);
                    }

                });

                // return false so that the chain doesn't complete until we manually complete it
                return false;
            });
        }
    });

    /**
     * Static helper function to build and init a new context.
     *
     * @param config
     */
    Gitana.Context.create = function(config)
    {
        var context = new Gitana.Context(config);
        return context.init();
    }

})(window);
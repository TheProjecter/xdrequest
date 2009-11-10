/*
 *	This file is part of xdRequest.
 *
 *	--- ABOUT ---
 *  
 *  -------------------------------------------------------------------------------
 *  Project owner and main developer:	Jorge Sierra <jsierra@gmail.com>
 *	-------------------------------------------------------------------------------
 *	Involved Developers:				Davide Zanotti <davidezanotti@gmail.com>
 *	-------------------------------------------------------------------------------
 *   
 *  --- LICENSE ---
 *
 *	xdRequest is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU General Public License as published by
 *	the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *	xdRequest is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU General Public License for more details.
 *
 *	You should have received a copy of the GNU General Public License
 *	along with xdRequest.  If not, see <http://www.gnu.org/licenses/>.
 *   
 *	--- NOTES ---
 *	    
 *	- Utils.JSON has been grabbed from here: http://www.sitepoint.com/blogs/2009/08/19/javascript-json-serialization
 *  
*/

/**
 * @version 1
 */
(function(){
	
	/**
	 * Internal utilities functions used by xdRequest
	 * 
	 * @private
	 */
	var Utils = (function(){
		
		return {
			
			log: function(msg, severity) {
				
				if (typeof console != "undefined") {
					
					console[severity || "log"](msg);
					
				}
				
			},
			
			DOM: {
			
				/**
				 * Create a script element on the fly and append it
				 * to a given container (deafault to "head")
				 * 
				 * @param {String} id
				 * @param {String} src
				 * @param {String} container
				 */
				addScript: function(id, src, container) {
					
					/*[debug]*/ Utils.log("Utils.DOM.addScript() - id: " + id); /*[/debug]*/
					
					var script = document.createElement("script");
					var head = document.getElementsByTagName(container || "head")[0];
					
					script.id = id;
					script.src = src;
					head.appendChild(script);
					
				}
				
			},
			
			string: {
				
				/**
				 * Returns a trimmed string
				 * 
				 * @param {String} s <dd>A string to trim</dd>
				 */
				trim: function(s) {
					
					return s.replace(/^\s+|\s+$/g, "");
					
				}
				
			},
			
			url: {
				
				/**
				 * Test if an url can be used to initialize a request
				 * 
				 * @param {String} url <dd>url to test</dd>
				 * @return {Boolean} true if the url is ok, false otherwise
				 */
				isValid: function(url) {
					
					return (
						url.match(/^https?:\/\/([\w]*\.)*[\w]{2,}$/) || 
						url.match(/^https?:\/\/([\w]*\.)*[\w]{2,}\/.*$/)
					);
								
				},
				
				/**
				 * Returns true if the url is https
				 * 
				 * @param {String} url
				 */
				isSecure: function(url) {
					
					return url.match(/^https/) != null;
					
				},
				
				/**
				 * Returns the domain name of the given url
				 * 
				 * @param {String} url
				 */
				getDomain: function(url) {
					
					if (url.match(/^https?:\/\/([^\/]*).*/)) {
						return url.match(/^https?:\/\/([^\/]*).*/)[1];
					}
					
					return null;
					
				},
				
				/**
				 * Replace undesired characters inside the url
				 * 
				 * @param {String} s <dd>the url to escape</dd>
				 * @return {String} the escaped url
				 */
				"escape": function(s) {
					
					var r = new RegExp("[.*+?|()\\[\\]{}\\\\\\/]", "g");
		  			return s.replace(r, "\\$&");
					
				}
				
			},
			
			JSON: {
				
				/**
				 * Serialize an object into a JSON string
				 * 
				 * @param {Object} an object to convert into a JSON string
				 * @return {String} JSON string representing the given object
				 */
				stringify: function(obj) {
					
					var t = typeof obj;
					
					if (t != "object" || obj === null) {
				
						// simple data type
						if (t == "string") {
							
							obj = '"' + obj + '"';
							
						} 
						
						return String(obj);
						
					} else {
						
						// recurse array or object
						var n, v, json = [], arr = (obj && obj.constructor == Array);
						
						for (n in obj) {
							
							v = obj[n];
							t = typeof v;
							
							if (t == "string") {
								
								v = '"' + v + '"';
								
							} else if (t == "object" && v !== null) {
								
								v = Utils.JSON.stringify(v);
								
							}
							
							json.push((arr ? "" : '"' + n + '":') + String(v));
							
						}
						
						return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
						
					}
					
				},
				
				/**
				 * Returns an evaluation of the JSON string
				 * 
				 * @param {String} s <dd>String to evaluate</dd>
				 * @return {Object}
				 */
				parse: function(s) {
					
					if (s === "") {
						s = '""';
					} 
					
					eval("var p=" + s + ";");
					
					return p;
					
				}
			
			}
			
		};
		
	})();
	
	// Define the global array to track callbacks for the JASONP calls
	window.xdCallbacks = window.xdCallbacks || [];
	
	/**
	 * An object representing a request header
	 * 
	 * @param {String} name <dd>Header name</dd>
	 * @param {String} value <dd>Header value</dd>
	 * @exception {Error} xdHeader is invalid
	 */
	window.xdHeader = function(name, value) {
		
		/*[debug]*/ Utils.log("xdHeader()"); /*[/debug]*/
		
		var n = name, v = value;
		
		// name and value must be both defined
		if (!(n && Utils.string.trim(n).length) || !(v && Utils.string.trim(v).length)) {
			throw new Error("xdHeader is invalid.");
		}
		
		/**
		 * Returns header name
		 * @return {String} name
		 */
		this.getName = function() {
			return n;
		};
		
		/**
		 * Returns header value
		 * @return {String} name
		 */
		this.getValue = function() {
			return v;
		};
		
		/**
		 * Returns the object converted into a string
		 * @return {String}
		 */
		this.toString = function() {
			return ["{name:", n, ", value:", v, "}"].join("");
		};
		
	};
	
	window.xdRequestCookie = function(cookieString) {
		
		/*[debug]*/ Utils.log("xdRequestCookie()"); /*[/debug]*/
		
		// Public properties
		this.name = "";
		this.value = "";
		this.domain = "";
		this.path = "";
		this.expiration = null;
		this.secure = false;
		
		/**
		 * Returns true if expired false otherwise
		 * 
		 * @return {Boolean}
		 */
		this.isExpired = function() {
			
			/*[debug]*/ Utils.log("xdRequestCookie.isExpired()"); /*[/debug]*/
			
			return this.expiration == "session" ? false : Date.parse(Date()) > this.expiration;
			
		};
		
		/**
		 * Check to see if a cookie matches the input parameters
		 * 
		 * @param {Object} url
		 * @param {Object} compareSecure
		 */
		this.testCookie = function(url, compareSecure) {
			
			/*[debug]*/ Utils.log("xdRequestCookie.testCookie()"); /*[/debug]*/
			
			// First of all, if this cookie is expired, return false
			if(this.isExpired()) {
				return false;
			}
			
			// Check the domain
			var compareDomain = url.match(/^https?:\/\/([^\/]*).*/);
			
			if (!compareDomain) {
				throw new Error("Invalid URL specified on cookie match.");
			}
			
			compareDomain = compareDomain[1];
			
			if (!compareDomain.match(Utils.url.escape(this.domain))) {
				return false;
			}
			
			// Check the path
			var matched = url.match(/^https?:\/\/[^\/]*\/.*/);
			var comparePath = matched ? matched[1] : "/";
			
			
			if (!comparePath.match(Utils.url.escape("^" + this.path))) {
				return false;
			}
			
			// If we're on an insecure site, we're good to go
			if(url.match(/^http:/) && this.secure) {
				return false;
			}
			
			return true;
		};
		
		// Constructor
		if (cookieString) {
			
			var propertyName;
			var propertyValue;
			var instance = this;
			
			this.name = cookieString.split(/;\s*/)[0].match(/^([^=]*)=/)[1];
			this.value = cookieString.split(/;\s*/)[0].match(/^[^=]*=(.*)$/)[1];
			var properties = cookieString.split(/;\s*/);
			
			for (var p in properties) {
				
				// Check to see if the property name has a "=" in it
				// If it does, then it is a property with a value
				if (properties[p].match(/^([^=]*)=/)) {
					
					propertyName = properties[p].match(/^([^=]*)=/)[1];
					propertyValue = properties[p].match(/^[^=]*=(.*)$/)[1];
					
					switch (propertyName) {
						
						case ("domain" || "Domain"):
							this.domain = propertyValue.replace(/"|'/g, "");
							break;
						
						case ("path" || "Path"):
							this.path = propertyValue.replace(/"|'/g, "");
							break;
						
						case ("expires" || "Expires"):
							this.expiration = Date.parse(propertyValue.replace(/"|'/g, ""));
							break;
					}
					
				} else {
					
					// If it doesn't have a value, then it is a flag-type of property
					if (properties[p]) {
						this.secure = true;
					}
					
				}
				
			}
			
			if (!this.expiration) {
				this.expiration = "session";
			}
			
			return instance;
			
		}
		
	};
	
	/**
	 * This is the core object of xdRequest.
	 * 
	 * @param {Object} configurator <dd>a JSON "configurator" object</dd>
	 * 
	 * @example 
	 * 
	 * <pre>
	 * var myRequest = new xdRequest({ <br />
	 * 		url: "http://www.somedomain.com", // defaul to {undefined} <br />
	 * 		method: "post", // defaul to {"get"} <br />
	 * 		format: "xml", // default to {"json"}, <br />
	 * 		debug: true, // default to {false} <br />
	 * 		callback: function(res) { // default to {undefined} <br />
	 * 			// handle data <br />
	 * 		} <br />
	 * }); <br />
	 * </pre>
	 */
	window.xdRequest = function(cfg) {
		
		/*[debug]*/ Utils.log("xdRequest()"); /*[/debug]*/
		
		/**
		 * Method to add cookies
		 * @param {Array} newCookieArray
		 * @private
		 */
		function addCookies(newCookieArray) {
			
			/*[debug]*/ Utils.log("addCookies()"); /*[/debug]*/
			
			// Add all the cookies
			for (var i=0; i<newCookieArray; i++) {
				instance.addCookie(newCookieArray[i]);
			}
			
			// Delete any expired cookies
			for(var j=0; j<cookiejar.length; j++) {
				
				if (cookiejar[j].isExpired()) {
					deleteCookie(cookiejar[j]);
				}
				
			}
			
		};
		
		/**
		 * Method to get a cookie by name and value
		 * 
		 * @param {String} name <dd>Cookie name</dd>
		 * @param {String} value <dd>Cookie value</dd>
		 * @param {Boolean} returnIndex <dd>True to get the index false, to get the value</dd>
		 * @private
		 */
		function getCookie(name, value, returnIndex) {
			
			/*[debug]*/ Utils.log("getCookie()"); /*[/debug]*/
			
			for (var i=0; i<cookiejar.length; i++) {
				
				var c = cookiejar[i];
				
				if (name == c.name && value == c.value) {
					
					// return the index, if that's what we wanted
					// otherwise, return the cookie itinstance
					return returnIndex ? i : cookiejar[i];
					
				}
			}
			
			// We didn't find the cookie
			return false;
		};
		
		/**
		 * Method to delete a cookie
		 * 
		 * @param {Object} cookie
		 * @private
		 */
		function deleteCookie(cookie) {
			
			/*[debug]*/ Utils.log("deleteCookie()"); /*[/debug]*/
			
			// Delete by index
			if (typeof cookie == "number") {
				return cookiejar.splice(cookie, 1);
			}
			
			// Delete by cookie
			else if (cookie instanceof xdRequestCookie) {
				return cookiejar.splice(getCookie(cookie.name, cookie.value, true), 1);
			} else {
				return false;
			}
			
		};
		
		/**
		 * Private method for setting up a new callback function
		 * 
		 * @param {Function} callback
		 * @param {String} scriptID
		 */
		function addCallback(callback, scriptID) {
			
			/*[debug]*/ Utils.log("addCallback()"); /*[/debug]*/
			
			var handler = function(response) {
				
				/*[debug]*/ 
				
					Utils.log("callback()"); 
					
					for (var i in response) {
						
						Utils.log(i + ": " + response[i]); 
						
					}
				
				/*[/debug]*/
			
				if (response.query) {
					
					var res = response.query.results;
					
					// If we got an error back in the results, output it
					if (res.error) {
						callback(res.error);
					}
					
					// If the HTML is undefined, we got a bad URL
					else if (res.result.html.match(/org.mozilla.javascript.Undefined/)) {
						
						callback({error: "Invalid URL was specified."});
						
					}
					else {
						
						// First, we need to add cookies to the cookie jar
						if (res.result.response_headers["set-cookie"]) {
							addCookies(res.result.response_headers["set-cookie"]);
						}
						
						// Next, we need to check for a redirect
						// If we get a redirect, we need to perform a new get to the URL
						if (res.result.status.match(/^3[\d]{2}/)) {
							
							for (var header in res.result.response_headers) {
								
								if (header == "location") {
									
									// replace current url with the redirect
									url = res.result.response_headers[header];
									
									// execute a new call to the right url
									instance.execute();
									
									break;
									
								}
								
							}
							
						}
						else if (res.result != 200) {
							
							// If we got something other than a 200, append it to the results
							newresult = res.result;
							newresult.error = response.query.diagnostics.url[1]["http-status-message"];
							
							// Set the HTML
							html = res.result.html;
							callback(res.result);
						}
						else {
							// Set the HTML
							html = res.result.html;
							callback(res.result);
						}
					}
				}
				else {
					// There was no query,  there must have been an error.  Send back the error instead
					if (response.error != undefined && response.error.description != undefined) {
						
						callback({
							error: 
								response.error.description.match(/mismatched character/) ?
								"Invalid parameters transmitted.  Please ensure that single quotes are properly escaped." :
								response.error.description
						});
						
					}
					else {
						
						callback({"error" : "Unknown error."});
						
					}
				}

				// Remove the script from the document
				var script = document.getElementById(scriptID);
				
				try {
					script.parentNode.removeChild(script);
				} catch (e) {
					// Just ignore any problems removing the script, because it's already gone
				}
				
			};
			
			// Add the callback to the callback array
			xdCallbacks.push(handler);
			
			// Return a string with the name of the callback from the array
			return "xdCallbacks[" + (xdCallbacks.length - 1) + "]";
			
		};
		
		/**
		 * Add a new xdHeader object to request headers
		 * 
		 * @param {xdHeader} header
		 * @exception {Error} invalid xdHeader
		 * @return {xdRequest} current instance
		 */
		this.addHeader = function(header) {
			
			/*[debug]*/ Utils.log("xdRequest.addHeader()"); /*[/debug]*/
			
			if (header instanceof xdHeader) {
				
				// this is a valid xdHeader object, let's get it
				properties.headers.push([header.getName(), header.getValue()]);
				
			} else {
				
				// invalid xdHeader ...what the hell are you try do give me?
				throw new Error("Invalid xdHeader.");
				
			}
			
			return instance;
			
		};
		
		/**
		 * Returns headers collection of the current xdRequest instance
		 * 
		 * @return {Array} headers
		 */
		this.getHeaders = function() {
			
			/*[debug]*/ Utils.log("xdRequest.getHeaders()"); /*[/debug]*/
			
			return properties.headers;
			
		};
		
		/**
		 * Public method to return the cookiejar, based on the current URL
		 * 
		 * @return {Array} cookies
		 */
		this.getCookies = function() {
			
			/*[debug]*/ Utils.log("xdRequest.getCookies()"); /*[/debug]*/
			
			var cookies = [];
			
			for (var i=0; i<cookiejar.length; i++) {
				
				if (cookiejar[i].match(url)) {
					cookies.push(cookiejar[i]);
				}
				
			}
			
			return cookies;
			
		};
		
		/**
		 * Add a new cookie
		 * 
		 * @param {String} newCookieString
		 */
		this.addCookie = function(newCookieString) {
			
			/*[debug]*/ Utils.log("xdRequest.addCookie()"); /*[/debug]*/
			
			var newCookie = new xdRequestCookie(newCookieString);
			var cookieIndex = getCookie(newCookie.name, newCookie.value, true);
			
			if (!newCookie.domain) {
				newCookie.domain = this.domain();
			}
			
			// Update the expiration if we find it by name and value
			if (cookieIndex) {
				cookiejar[cookieIndex].expiration = newCookie.expiration;
			}
			// Otherwise, add it to the cookiejar
			else {
				cookiejar.push(newCookie);
			}
			
			return instance;
			
		};
		
		/**
		 * Start the request
		 * 
		 * @return {xdRequest} current instance
		 */
		this.execute = function() {
			
			/*[debug]*/ Utils.log("xdRequest.execute()"); /*[/debug]*/
			
			var requestID = "xd-" + new Date().getTime();
			
			var yqlStatement = [
				BASE_YQL_STATEMENT,
				"SELECT * FROM remote WHERE url='", url,
				"' AND parameters='", Utils.JSON.stringify(properties), "'"
			].join("");
			
			var yqlURL = [
				BASE_YQL_PUBLIC_URL,
				encodeURIComponent(yqlStatement).replace(/%255C'/g, "%5C'"),
				"&callback=", encodeURIComponent(addCallback(callback, requestID))
			].join("");
			
			// append the JSONP script
			Utils.DOM.addScript(requestID, yqlURL);
			
			// clear out properties for the next call
			properties = {"headers" : []};
			
			return instance;
			
		};
		
		// Local "constants"
		var REMOTE_TABLE, YQL_OPTIONS, BASE_YQL_PUBLIC_URL, BASE_YQL_STATEMENT;
		
		// public properties
		this.postBody = null;
		this.postHiddenFields = true;
		
		// private properties
		var instance = this;
		var properties = {headers: []};
		var cookiejar = [];
		var url, callback, html;
		
		// xdRequest "constructor"
		(function(){
			
			// default configuration
			var format = (cfg.format || "json").toLowerCase();
			var method = (cfg.method || "get").toLowerCase();
			var debug = cfg.debug || false;
			
			// Make sure we have a post body for post
			if (method == "post" && !instance.postBody) {
				
				throw new Error("postBody required for post method.");
				
			}
			
			// url configuration
			if (cfg.url !== undefined && Utils.url.isValid(Utils.string.trim(cfg.url))) {
				
				url = Utils.string.trim(cfg.url);
				
			} else {
				
				throw new Error("Invalid URL specified.");
				
			}
			
			// callback configuration
			if (typeof cfg.callback == "function") {
				
				callback = cfg.callback;
				
			} else {
				
				throw new Error("Invalid callback specified.");
				
			}
			
			// headers configuration
			if (cfg.headers && cfg.headers instanceof Array) {
				
				while (cfg.headers.length) {
					instance.addHeader(cfg.headers.pop());
				}
				
			} 
			
			REMOTE_TABLE = "http://xdrequest.googlecode.com/svn/trunk/xdRequest.xml";
			YQL_OPTIONS = "format=" + format + "&debug=" + String(debug) + "&q=";
			BASE_YQL_PUBLIC_URL = "https://query.yahooapis.com/v1/public/yql?" + YQL_OPTIONS; // Davide doubt: why https?
			BASE_YQL_STATEMENT = "USE '" + REMOTE_TABLE + "' AS remote;";
			
		})();
		
	};
	
})();

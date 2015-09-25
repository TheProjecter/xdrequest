# Overview #
All web browsers enforce security restrictions that prevent webpages from making cross-domain [XMLHttpRequests](http://en.wikipedia.org/wiki/XMLHttpRequest).  xdRequest is a JavaScript library that allows you to easily make cross-domain requests with [dynamic script tags](http://www.xml.com/pub/a/2005/12/21/json-dynamic-script-tag.html).  They dynamic scripts are generated with [YQL](http://developer.yahoo.com/yql/) requests/responses made to a custom [open table definition](http://developer.yahoo.com/yql/guide/yql-opentables-chapter.html).

xdRequest does all of the work of performing the dynamic script tag insertions and parsing the YQL JASONP responses to make them easier to work with.  This makes it quick and easy to develop cross-domain scripts to obtain and parse data.

# Features #
  * Make cross-domain requests using the GET and POST methods
  * Add request headers along with the requests
  * Automatically collect cookies sent by the remote web server
  * Automatically follow redirects and collect cookies along the way
  * Properly store/transmit cookies, much like the popular server-side library, [curl.haxx.se cURL]
  * Automatically submits hidden fields detected within forms on webpages

# Quick Sample #
Here's an example of how easy xdRequest is to use:

```

var myXDR = new xdRequest;
myXDR.setURL("http://www.example.com").addCookie("foo", "bar").get(
function(response) {
// Replace the contents of id_of_element_in_page
document.getElementById("id_of_element_in_page").innerHTML = response.html;
}
);
```

# Try it Now! #
[Download the latest version](http://xdrequest.googlecode.com/files/xdRequest.js) and visit the [xdRequest Instructions page](http://code.google.com/p/xdrequest/wiki/Instructions) to learn more about using it.  You can also check out an [xdRequest demo](http://geeklad.com/tools/xdRequest/xdRequest-example.html) to see it working live.
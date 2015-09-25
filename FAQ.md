# Frequently Asked Questions #

## How does xdRequest work?  Is it exploiting any web browser security vulnerabilities? ##
xdRequest performs all its magic via [YQL](http://developer.yahoo.com/yql/).  YQL is a free Yahoo! web service (part of the [Yahoo! Open Strategy](http://developer.yahoo.com/yos/intro/)) that allows developers to easily access data from websites and web services.  xdRequest takes advantage of YQL, and makes it faster and easier to access pages from remote websites.  It works by using [dynamic script tags](http://www.xml.com/pub/a/2005/12/21/json-dynamic-script-tag.html) and processing [JSONP](http://en.wikipedia.org/wiki/JSON#JSONP) responses sent by YQL. It does not violate web browser security.

## xdRequest is great!  Is there anything it can't do?  Are there any limitations? ##
There are limitations as to what xdRequest can do:
  * YQL honors **robots.txt** files, so if access to a URL is prohibited by the **robots.txt** you will not be able to retrieve the data with xdRequest.
  * Because xdRequest uses dynamic script tags, the client web browser will limit the length of the URL for the YQL request.  That means it probably won't be possible to submit large amounts of data to POST forms (i.e. perform document uploads to POST forms).  Problems may also arise if the remote site you are accessing has a very long URL.
  * In its current state, YQL only retrieves the plain text response for the remote server.  If you request XML data, it will just simply return the response without parsing.
  * There is a per-IP limit to the number of YQL calls that can be made per hour (10,000 per hour), although for most applications this should not be an issue.
  * xdRequest is slower than XMLHttpRequest
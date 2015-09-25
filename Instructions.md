# Include the JavaScript File #

xdRequest is very simple to use.  Just copy the xdRequest.js file somewhere on your server (or you could link directly to the [xdRequest.js download](http://xdrequest.googlecode.com/svn/trunk/xdRequest.js)).  Then add a `script` tag to the source of the HTML page where you want to use it.  Here's the tag you would add to use the xdRequest.js download file:
```

<script type="text/javascript" src="http://xdrequest.googlecode.com/files/xdRequest.js">

Unknown end tag for &lt;/script&gt;


```


# Declaring an Instance of the xdRequest Object #

You can declare a new instance of the xdRequest object, just as you would any other JavaScript object:
```

var myVariable = new xdRequest;
```
If you declare a new instance in this manner, you'll need to set the URL before you make any requests with the setURL method:
```

myVariable.setURL("http://www.example.com");
```
Alternatively, you can perform both of these actions at once by declaring the instance with a parameter, indicating the URL that you will be working with:
```

var myVariable = new xdRequest("http://www.example.com");
```


Once you've created the new instance, you can interact with public methods and properties to send cross-domain requests.

# xdRequest Methods and Properties #

## Method: `setURL(url)` ##
Set the URL you will be working with.

It returns the `xdRequest` object itself, so you can chain other calls behind it.  For example:
```

myVariable.setURL("http://www.example.com").get();
```

## Method: `getURL()` ##
Returns the URL that the xdRequest that is currently being worked with.

## Method: `get(callback)` or `get(url, callback)` ##
Use the GET method to retrieve data from the set URL.  The `get` method can accept one or two parameters.

If only one parameter is used, it must be a callback function.  The callback function can accept one argument, which will contain an object with the response.  If two parameters are used, the first is a URL to retrieve, and the second is the callback function with the response.

Example of using get with one parameter (just the callback). In this example, the callback is an anonymous function:

```

myVariable.get(
function(response) {
// Do something with the response here
}
);
```

The response sent to the callback function contains the following properties and values:
> ### `url` ###
> A `string` with the URL requested.
> ### `status` ###
> A `number` with the status code sent by the web server.
> ### `method` ###
> A `string` with the method used to retrieve the data. (GET or POST)
> ### `html` ###
> A `string` containing the HTML retrieved from the URL.
> ### `request_headers` ###
> An `array` of arrays.  Each of the arrays within are name/value pairs of the headers transmitted to the web server.  For example, if you sent a `Referrer` header with the value `http://www.foo.com`, the `request_headers` property would be:
```

request_headers : [
["Referrer", "http://www.foo.com"]
]
```

> ### `response_headers` ###
> An `array` of arrays.  Each of the arrays within are name/value pairs of the headers received from the web server.  For example, if the server sent a `Content-Type` header with the value `text/html; charset=iso-8859-1`, the `response_headers` might look like:
```

response_headers : [
["content-type", "text/html; charset=iso-8859-1"]
]
```
> ### `error` ###
> A `string` with an error message, if one was generated.
> ### `post_body` ###
> A `string` with the post body, if one was transmitted.

## Property: `post_body` ##
Prior to making a call to the `post` method,the post\_body must be set.  The `post_body` should be a well-formed POST body string.  For example, if a form contains 3 fields, the `post_post` body would need could be assigned as follows:
```

myVariable.post_body = "var1=value1&var2=value2&var3=value3";
```

## Method: `post(callback)` or `post(url, callback)` ##
The `post` method works exactly the same as the `get` method.  The only difference is that the `post` method requires the `post_body` to be assigned so that there is something to post to the remote page.

## Method: `header([name, value])` ##
This method adds a header to be transmitted to the `url` when the request is sent.  The `header` method accepts an array with a name/value pair.  The first value in the array is the `name`, the second is the `value`.  To transmit multiple headers, just make multiple calls to `header`.

Just like the `setURL` method, `header` also returns the `xdRequest` object, which allows chaining commands together.  For example:
```

myVariable.setURL("http://www.example.com").header("Referrer", "http://www.foo.com").header("User-Agent","Some user-agent browser string of your choice").get();
```

## Property: `post_hidden_fields` ##
By default, xdRequest will automatically post hidden fields found on web forms.  To disable this functionality, set `post_hidden_fields` to false.
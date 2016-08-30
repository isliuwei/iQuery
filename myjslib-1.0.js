/**
	根据id查找元素
	@param id 元素的id
	@return 元素对象
*/
function id(id){
	return document.getElementById(id);
}

/**
	根据tagName查找元素
	@param tagName 元素的标签名
	@param context 搜索的范围
	@return 查找到的元素对象数组
*/
function tag(tagName, context){
	return (context || document).getElementsByTagName(tagName);
}


/**
	根据className查找元素
	@param className 类名
	@param context 搜索的上下文
*/
function getByClass(className, context){
	context = context || document;
	var result = [];
	if(document.getElementsByClassName){
		return context.getElementsByClassName(className);
	}else{
		var arr = context.getElementsByTagName('*');
		var re = new RegExp('\\b' + className + '\\b');
		for(var i=0; i<arr.length; i++){
			if( re.test(arr[i].className) ){
				result.push(arr[i]);
			}
		}
		return result;
	}

}

/**
	根据指定的选择器查找元素
	@param selector 选择器
	@param context 搜索的上下文
*/
function $(selector, context){
	context = context || document;
	switch(selector.charAt(0)){
		case '#':
			return [id(selector.substr(1))];
			break;
		case '.':
			return getByClass(selector.substr(1), context);
			break;
		default:
			return tag(selector, context);
	}
}

/**
	设置或获取元素的属性
	@param elem 元素
	@param name 属性名
	@param value 属性值
*/
function attr(elem, name, value) {
    //Make sure that a valid name was provided
    if ( !name || name.constructor != String ) return '';

     //Figure out if the name is one of the weird naming cases

    name = { 'for': 'htmlFor', 'class': 'className' }[name] || name;

    // If the user is setting a value, also

    if ( value != null ) {
        // Set the quick way first
        elem[name] = value;

        // If we can, use setAttribute
        if ( elem.setAttribute )
            elem.setAttribute(name,value);
    }

    // Return the value of the attribute
    return elem[name] || elem.getAttribute(name) || '';
  
}

/**
	设置或获取元素的value属性
	@param elem 元素
	@param value 值
*/
function val(elem, value){
	if(value){
		elem.value = value;
	}else{
		return elem.value;
	}
}
/**
	获取元素的文本内容
	@param elem 元素
*/
function text(e) {
    var t = "";
    // If an element was passed, get it’s children, 
    // otherwise assume it’s an array
    e = e.childNodes || e;
    // Look through all child nodes
    for ( var j = 0; j < e.length; j++ ) {
        // If it’s not an element, append its text value
        // Otherwise, recurse through all the element’s children 
        t += e[j].nodeType != 1 ? e[j].nodeValue : text(e[j].childNodes);
    }
    // Return the matched text
    return t;
}



function next(elem){
	do{
		elem = elem.nextSibling;
	}while( elem && elem.nodeType != 1);
	
	return elem;
}

function prev(elem){
	do{
		elem = elem.previousSibling;
	}while( elem && elem.nodeType != 1);
	
	return elem;
}

function first(elem){
	elem = elem.firstChild;

	return elem && elem.nodeType != 1 ? next(elem) : elem;
	
}

function last(elem){
	elem = elem.lastChild;

	return elem && elem.nodeType != 1 ? prev(elem) : elem;
	
}


/**
	绑定事件
	@param elem 元素
	@param type 事件类型
	@param fn 事件处理函数
*/
function addEvent(elem, type, fn){
	if(elem.addEventListener){
		elem.addEventListener(type, fn, false);
	}else if(elem.attachEvent){
		elem.attachEvent('on'+type, fn);
	}else{
		elem['on'+type] = fn;
	}
}

/**
	获取元素计算样式
	@param elem 元素
	@param name css属性
	@return 元素当前计算的样式
*/
// Get a style property (name) of a specific element (elem)
function getStyle( elem, name ) {
    //If the property exists in style[], then it’s been set recently (and is current)
    if (elem.style[name])
        return elem.style[name];

    // Otherwise, try to use IE’s method
    else if (elem.currentStyle)
        return elem.currentStyle[name];

    // Or the W3C’s method, if it exists
    else if (document.defaultView && document.defaultView.getComputedStyle) {
        // It uses the traditional ‘text-align’ style of rule writing, instead of textAlign
        name = name.replace(/([A-Z])/g,"-$1");//textAlign => text-Align
        name = name.toLowerCase();// text-Align => text-align

        // Get the style object and get the value of the property (if it exists)
        var s = document.defaultView.getComputedStyle(elem,"");
        return s && s.getPropertyValue(name);

    // Otherwise, we’re using some other browser
    } else
        return null;
}
/**
	获取或设置元素css样式
	@param elem 元素
	@param name css属性
	@param value 属性值
*/
function css(elem, name, value){
	///mmmm
	if(value) {
		name = name.replace(/-[a-z]/g, function(word){
			return word.substring(1).toUpperCase();
		});//background-color => backgroudColor
		elem.style[name] = value;
	}
	else{
		if(typeof name == 'string'){ // name.constructor == String
			return getStyle(elem, name);
		}else if(typeof name == 'object'){
			for(var p in name){
				p2 = p.replace(/-[a-z]/g, function(word){
					return word.substring(1).toUpperCase();
				});
				elem.style[p2] = name[p];
				// elem.style.backgroundColor = '#000';
			}
		}
	}

}
/**
	为元素添加class
	@param elem 元素
	@param className 样式
*/
function addClass(elem, className){
	elem.className = trim(elem.className + ' ' + className);
}
/**
	为元素删除class
	@param elem 元素
	@param className 样式
*/
function removeClass(elem, className){
	var re = new RegExp('\\b' + className + '\\b', 'g');
	elem.className = trim(elem.className.replace(re, ''));
}


/**
	去首尾空格
	@param str 源字符串
	@return 去空格后的字符串
*/
function trim(str){//   ab c   , =>ab c
	return str.replace(/^\s+|\s+$/g, '');
}

/**
	获取元素当前的计算的高
	@param elem 元素
*/
// Get the actual height (using the computed CSS) of an element
function getHeight( elem ) {
    // Gets the computed CSS value and parses out a usable number
    return parseInt( getStyle( elem, 'height' ) );
}
/**
	获取元素当前的计算的宽
	@param elem 元素
*/
// Get the actual width (using the computed CSS) of an element
function getWidth( elem ) {
    // Gets the computed CSS value and parses out a usable number
    return parseInt( getStyle( elem, 'width') );
}
/**
	获取浏览器的可视区域高度
*/
// Find the height of the viewport
function windowHeight() {
    // A shortcut, in case we’re using Internet Explorer 6 in Strict Mode
    var de = document.documentElement;

    // If the innerHeight of the browser is available, use that
    return window.innerHeight ||

        // Otherwise, try to get the height off of the root node
        ( de && de.clientHeight ) ||

        // Finally, try to get the height off of the body element
        document.body.clientHeight;
}
/**
	获取浏览器的可视区域宽度
*/
// Find the width of the viewport
function windowWidth() {
    // A shortcut, in case we’re using Internet Explorer 6 in Strict Mode
    var de = document.documentElement;

    // If the innerWidth of the browser is available, use that
    return self.innerWidth ||

        // Otherwise, try to get the width off of the root node
        ( de && de.clientWidth ) ||

        // Finally, try to get the width off of the body element
        document.body.clientWidth;
}

/**
	获取整个页面的高度
*/
// Returns the height of the web page
// (could change if new content is added to the page)
function pageHeight() {
    return document.body.scrollHeight;
}
/**
	获取整个页面的宽度
*/
// Returns the width of the web page
function pageWidth() {
    return document.body.scrollWidth;
}

/**
	获取当前元素相对于浏览器左边的距离
	@param elem 元素
*/
// Find the X (Horizontal, Left) position of an element
function pageX(elem) {
    var p = 0;

    // We need to add up all of the offsets for every parent
    while ( elem.offsetParent ) {
        // Add the offset to the current count
        p += elem.offsetLeft;

        // and continue on to the next parent
        elem = elem.offsetParent;
    }

    return p;
}
/**
	获取当前元素相对于浏览器上边的距离
	@param elem 元素
*/
// Find the Y (Vertical, Top) position of an element
function pageY(elem) {
    var p = 0;

    // We need to add up all the offsets for every parent
    while ( elem.offsetParent ) {
        // Add the offset to the current count
        p += elem.offsetTop;

        // and continue on to the next parent
        elem = elem.offsetParent;
    }

    return p;
}

/**
	获取当前元素相对于浏览器style left
	@param elem 元素
*/
// Find the left position of an element
function posX(elem) {
    // Get the computed style and get the number out of the value
    return parseInt( getStyle( elem, "left" ) );
}

// Find the top position of an element
function posY(elem) {
    // Get the computed style and get the number out of the value
    return parseInt( getStyle( elem, "top" ) );
}

/**
	获取当前元素相对于父元素的左边距离
	@param elem 元素
*/
// Find the horizontal positioing of an element within its parent
function parentX(elem) {
    // If the offsetParent is the element’s parent, break early
    return elem.parentNode == elem.offsetParent ?
        elem.offsetLeft :

        // Otherwise, we need to find the position relative to the entire
        // page for both elements, and find the difference
        pageX( elem ) - pageX( elem.parentNode );
}
/**
	获取鼠标到页面最左右的值
	@param elem 元素
*/
// Find the vertical positioing of an element within its parent
function parentY(elem) {
    // If the offsetParent is the element’s parent, break early
    return elem.parentNode == elem.offsetParent ?
        elem.offsetTop :

        // Otherwise, we need to find the position relative to the entire
        // page for both elements, and find the difference
        pageY( elem ) - pageY( elem.parentNode );
}

// Find the horizontal position of the cursor
function getX(e) {
    // Normalize the event object
    e = e || window.event;

    // Check for the non-IE position, then the IE position, and finally return 0
    return e.pageX || e.clientX + document.body.scrollLeft || 0;
}

// Find the vertical position of the cursor
function getY(e) {
    // Normalize the event object
    e = e || window.event;

    // Check for the non-IE position, then the IE position, and finally return 0
    return e.pageY || e.clientY + document.body.scrollTop || 0;
}

/**
	为一个元素添加一个指定的距离
	@param elem 元素
*/
// A function for adding a number of pixels to the horizontal
// position of an element 
function addX(elem,pos) {
    // Get the current horz. position and add the offset to it.
    setX( posX(elem) + pos );
}

// A function that can be used to add a number of pixels to the
// vertical position of an element
function addY(elem,pos) {
    // Get the current vertical position and add the offset to it
    setY( posY(elem) + pos );
}

/**
	获取滚动条滚动的水平滚动的值
	@param elem 元素
*/
// A function for determining how far horizontally the browser is scrolled
function scrollX() {
    // A shortcut, in case we’re using Internet Explorer 6 in Strict Mode
    var de = document.documentElement;

    // If the pageXOffset of the browser is available, use that
    return self.pageXOffset ||

        // Otherwise, try to get the scroll left off of the root node
        ( de && de.scrollLeft ) ||

        // Finally, try to get the scroll left off of the body element
        document.body.scrollLeft;
}

// A function for determining how far vertically the browser is scrolled
function scrollY() {
    // A shortcut, in case we’re using Internet Explorer 6 in Strict Mode
    var de = document.documentElement;

    // If the pageYOffset of the browser is available, use that
    return self.pageYOffset ||

        // Otherwise, try to get the scroll top off of the root node
        ( de && de.scrollTop ) ||

        // Finally, try to get the scroll top off of the body element
        document.body.scrollTop;
}
/**
	获取鼠标相对于事件源的水平距离
	@param elem 元素
*/
// Get the X position of the mouse relative to the element target 
// used in event object ‘e’
function getElementX( e ) {
    // Find the appropriate element offset
    return ( e && e.layerX ) || window.event.offsetX;
}
 
// Get the Y position of the mouse relative to the element target
// used in event object ‘e’
function getElementY( e ) {
    // Find the appropriate element offset
    return ( e && e.layerY ) || window.event.offsetY;
}

function create( tag ) {
    return document.createElement( tag );
}

function checkElem(a) {
    var r = [];
    // Force the argument into an array, if it isn’t already
    if ( a.constructor != Array ) 
        a = [ a ];// ['<h1>haha<span>xixi</span></h1>']

    for ( var i = 0; i < a.length; i++ ) {
        // If there’s a String
        if ( a[i].constructor == String ) {
            // Create a temporary element to house the HTML
            var div = document.createElement("div");

            // Inject the HTML, to convert it into a DOM structure
            div.innerHTML = a[i];//'<h1>haha</h1><span>xixi</span>'

             // Extract the DOM structure back out of the temp DIV
             for ( var j = 0; j < div.childNodes.length; j++ )
                 r[r.length] = div.childNodes[j];

        } else if ( a[i].length ) { // If it’s an array
            // Assume that it’s an array of DOM Nodes
            for ( var j = 0; j < a[i].length; j++ )//oDiv2.childNodes
                r[r.length] = a[i][j];
        } else { // Otherwise, assume it’s a DOM Node
            r[r.length] = a[i];
        }
    }
    return r;
}


function append( parent, elem ) {
    // Get the array of elements
    var elems = checkElem( elem );

    // Append them all to the element
    for ( var i = 0; i < elems.length; i++ ) {
        parent.appendChild( elems[i] );
    }
}

function before( parent, before, elem ) {
    // Check to see if no parent node was provided
    if ( elem == null ) {
        elem = before;
        before = parent;
        parent  = before.parentNode;
    }
    parent.insertBefore(  elem , before );
}

// Remove a single Node from the DOM
function remove( elem ) {
    if ( elem ) elem.parentNode.removeChild( elem );
}

// Remove all of an Element’s children from the DOM
function empty( elem ) {
    while ( elem.firstChild )
        remove( elem.firstChild );
}

function addEvent(elem, type, handler){
	if(elem.addEventListener){
		elem.addEventListener(type, handler, false);
	}else if(elem.attachEvent){
		elem[type+handler] = function(){
			handler.call(elem);
		};
		elem.attachEvent('on' + type, elem[type+handler]);
	}else{
		elem['on' + type] = handler;
	}
}

function removeEvent(elem, type, handler){
	if(elem.removeEventListener){
		elem.removeEventListener(type, handler, false);
	}else if(elem.detachEvent){
		elem.detachEvent('on'+type, elem[type+handler]);
	}else{
		elem['on' + type]  = null;
	}
}
/**
	动画函数
	@param elem 做动画的元素
	@param attr css属性
	@param callback 回调函数
*/
function animate(elem, attr, callback){
    clearInterval(elem.timer);
    elem.timer = setInterval(function(){
        var bStop = true;//一个标识位，值为true是代表需要停止定时器，为false不需要停止
        for(var prop in attr){//取出所有attr对象中的属性
            var currentStyle;

            if(prop == 'opacity'){//如果prop是opacity
                currentStyle = parseInt(css(elem, prop)*100);//那么将获取出来的当前值转换成为百分制
            }else{
                currentStyle = parseInt(css(elem, prop));
            }

            var speed = (attr[prop] - currentStyle) / 8;
            speed = speed < 0 ? Math.floor(speed) : Math.ceil(speed);


            if(currentStyle != attr[prop]){
                bStop = false;
            }

            currentStyle += speed;
            if(prop == 'opacity'){
                elem.style.opacity = currentStyle / 100;
                elem.style.filter = "alpha(opacity:"+currentStyle+")";
            }else{
                elem.style[prop] = currentStyle + 'px';
            }
        }

        if(bStop){
            clearInterval(elem.timer);
            if(callback) callback();
        }
    }, 30);
}

// A function for hiding (using display) an element
function hide( elem ) {
    // Find out what it’s current display state is
    var curDisplay = getStyle( elem, 'display' );

    //  Remember its display state for later
    if ( curDisplay != 'none' )
        elem.$oldDisplay = curDisplay;

    // Set the display to none (hiding the element)
    elem.style.display = 'none';
}

// A function for showing (using display) an element
function show( elem ) {
    // Set the display property back to what it use to be, or use
    // ‘block’, if no previous display had been saved
    elem.style.display = elem.$oldDisplay || 'block';
}























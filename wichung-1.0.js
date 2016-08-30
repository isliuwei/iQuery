/**
 *  根据元素的id选择元素
 *  @param sId 元素的id
 */
function id(sId){
    return document.getElementById(sId);
}
/**
 *  根据元素的标签选择元素
 *  @param sTagName 元素的标签
 */
function tag(sTagName, context){
    context = context || document;
    return context.getElementsByTagName(sTagName);
}
/**
 *  根据元素的类选择元素
 *  @param sClassName 元素的类
 *  @param context 搜索的上下文
 *  @param sType 限定的元素的标签类型
 */
function getByClass(sClassName, context, sType){
    var result = [];
    context = context || document;
    if(document.getElementsByClassName && !sType){
        return context.getElementsByClassName(sClassName);
    }
    sType = sType || "*";
    var aElem = context.getElementsByTagName(sType);
    var re = new RegExp("\\b" + sClassName + "\\b");//双引号里需要再加一个“\”。
    for(var i=0; i<aElem.length; i++){
        if(re.test(aElem[i].className)){
            result.push(aElem[i]);
        }
    }
    return result;
}
/**
 *  $选择器，可以根据元素的id、class、tag来选择元素
 *  @param selector 选择器
 *  @param context 搜索的上下文
 *  @param sType 限定的元素的标签类型
 */
function $(selector, context, sType){
    switch (selector.charAt(0)){
        case '#':
            return [id(selector.substr(1))];
            break;
        case '.':
            return getByClass(selector.substr(1), context, sType);
            break;
        default :
            return tag(selector, context);
    }
}
/**
 *  设置或获取元素的属性
 *  @param elem 元素
 *  @param name 属性名
 *  @param value 属性值
 */
function attr(elem, name, value) {
    // Make sure that a valid name was provided
    if ( !name || name.constructor != String ) return '';

    // Figure out if the name is one of the weird naming cases
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
 *  设置或获取元素的val属性
 *  @param elem 元素
 *  @param value 属性值
 */
function val(elem, value){
    if ( value != null ) {
        if ( elem.setAttribute )
            elem.setAttribute('value',value);
    }
    return elem.getAttribute('value') || '';
}
/**
 *  设置或获取元素的css样式
 *  @param elem 元素
 *  @param value 属性值
 */
function css(elem, name, value){
    // Make sure that a valid name was provided
    if ( !name ) return '';

    if(name.constructor == String && !value){
        return getStyle(elem, name);
    }else if(name.constructor == Object){//name = {width: '100px'; height: '200px'}
        for(var prop in name){
            setCss(name, prop);
        }
    }else if(name.constructor == String && value){
        setCss(name, value);
    }else{
        return '';
    }

    function setCss(attr, value){
        switch(attr){
            case 'width':
            case 'height':
            case 'padding':
            case 'paddingLeft':
            case 'paddingRight':
            case 'paddingTop':
            case 'paddingBottom':
                value = /\%/.test(value)?value:Math.max(parseInt(value), 0) + 'px';
                break;
            case 'left':
            case 'top':
            case 'bottom':
            case 'right':
            case 'margin':
            case 'marginLeft':
            case 'marginRight':
            case 'marginTop':
            case 'marginBottom':
                value = /\%/.test(value)?value:parseInt(value) + 'px';
                break;
        }
        elem.style[attr] = value;
    }
}

/**
 *  获取元素的计算css样式
 *  @param elem 元素
 *  @param value 属性值
 */
function getStyle( elem, name ) {
    // If the property exists in style[], then it’s been set recently (and is current)
    if (elem.style[name])
        return elem.style[name];

    // Otherwise, try to use IE’s method
    else if (elem.currentStyle)
        return elem.currentStyle[name];

    // Or the W3C’s method, if it exists
    else if (document.defaultView && document.defaultView.getComputedStyle) {
        // It uses the traditional ‘text-align’ style of rule writing, instead of textAlign
        name = name.replace(/([A-Z])/g,"-$1"); //backgroundColor => background-Color
        name = name.toLowerCase();// background-Color =>  background-color

        // Get the style object and get the value of the property (if it exists)
        var s = document.defaultView.getComputedStyle(elem, false);
        return s && s.getPropertyValue(name);

        // Otherwise, we’re using some other browser
    } else
        return null;
}
/**
 *  为元素添加新类
 *  @param elem 元素
 *  @param className 要添加的新类
 */
function addClass(elem, className){
    if(!className || className.constructor != String) return;
    var re = new RegExp('\\b' + className + '\\b');
    if(re.test(elem.className)) return;
    elem.className = elem.className + ' ' + className;
}
/**
 *  为元素添加新类
 *  @param elem 元素
 *  @param className 要添加的新类
 */
function removeClass(elem, className){
    if(!className || className.constructor != String) return;
    var re = new RegExp('\\b' + className + '\\b');
    if(re.test(elem.className))
        elem.className = trim(elem.className.replace(className, ''));
}
/**
 *  去除字符串首尾空格
 *  @param str 原字符串
 */
function trim(str){
    return str.replace(/^\s|\s$/g , '');
}
/**
 *  获取元素的内容的高度
 *  @param elem 元素
 */
// Get the actual height (using the computed CSS) of an element
function getHeight( elem ) {
    // Gets the computed CSS value and parses out a usable number
    return parseInt( getStyle( elem, 'height' ) );
}
// Get the actual width (using the computed CSS) of an element
function getWidth( elem ) {
    // Gets the computed CSS value and parses out a usable number
    return parseInt( getStyle( elem, 'width') );
}
/**
 *  获取元素的完整的高度
 *  @param elem 元素
 */
// Find the full, possible, height of an element (not the actual,
// current, height)
function fullHeight( elem ) {
    // If the element is being displayed, then offsetHeight
    // should do the trick, barring that, getHeight() will work
    if ( getStyle( elem, 'display' ) != 'none' )
        return elem.offsetHeight || getHeight( elem );

    // Otherwise, we have to deal with an element with a display
    // of none, so we need to reset its CSS properties to get a more
    // accurate reading
    var old = resetCSS( elem, {
        display: 'block',
        visibility: 'hidden',
        position: 'absolute'
    });

    // Figure out what the full height of the element is, using clientHeight
    // and if that doesn't work, use getHeight
    var h = elem.offsetHeight || getHeight( elem );

    // Finally, restore the CSS properties back to what they were
    restoreCSS( elem, old );

    // and return the full height of the element
    return h;
}

// Find the full, possible, width of an element (not the actual,
// current, width)
function fullWidth( elem ) {
    // If the element is being displayed, then offsetWidth
    // should do the trick, barring that, getWidth() will work
    if ( getStyle( elem, 'display' ) != 'none' )
        return elem.offsetWidth || getWidth( elem );

    // Otherwise, we have to deal with an element with a display
    // of none, so we need to reset its CSS properties to get a more
    // accurate reading
    var old = resetCSS( elem, {
        display: 'block',
        visibility: 'hidden',
        position: 'absolute'
    });

    // Figure out what the full width of the element is, using clientWidth
    // and if that doesn't work, use getWidth
    var w = elem.clientWidth || getWidth( elem );

    // Finally, restore the CSS properties back to what they were
    restoreCSS( elem, old );

    // and return the full width of the element
    return w;
}

// A function used for setting a set of CSS properties, which
// can then be restored back again later
function resetCSS( elem, prop ) {
    var old = {};

    // Go through each of the properties
    for ( var i in prop ) {
        // Remember the old property value
        old[ i ] = elem.style[ i ]; //old.display = elem.style.display

        // And set the new value
        elem.style[ i ] = prop[i];
    }

    // Retun the set of changed values, to be used by restoreCSS
    return old;
}

// A function for restoring the side effects of the resetCSS function
function restoreCSS( elem, prop ) {
    // Reset all the properties back to their original values
    for ( var i in prop )
        elem.style[ i ] = prop[ i ];
}
/**
 *  获取窗口可视区域的高度
 */
// Find the height of the viewport
function windowHeight() {
    // A shortcut, in case we’re using Internet Explorer 6 in Strict Mode
    var de = document.documentElement;

    // If the innerHeight of the browser is available, use that
    return self.innerHeight ||

        // Otherwise, try to get the height off of the root node
        ( de && de.clientHeight ) ||

        // Finally, try to get the height off of the body element
        document.body.clientHeight;
}
/**
 *  获取窗口可视区域的宽度
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
 *  获取窗口可视区域的宽度
 */
// Returns the height of the web page
// (could change if new content is added to the page)
function pageHeight() {
    return document.body.scrollHeight;
}

// Returns the width of the web page
function pageWidth() {
    return document.body.scrollWidth;
}
/**
 *  获取元素相对于浏览器左边的距离
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
 *  获取元素的css样式中的left的值
 */
// Find the left position of an element
function posX(elem) {
    // Get the computed style and get the number out of the value
    return parseInt( getStyle( elem, 'left' ) );
}

// Find the top position of an element
function posY(elem) {
    // Get the computed style and get the number out of the value
    return parseInt( getStyle( elem, 'top' ) );
}
// Find the horizontal positioing of an element within its parent
function parentX(elem) {
    // If the offsetParent is the element’s parent, break early
    return elem.parentNode == elem.offsetParent ?
        elem.offsetLeft :

        // Otherwise, we need to find the position relative to the entire
        // page for both elements, and find the difference
        pageX( elem ) - pageX( elem.parentNode );
}

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
/**
 *  根据标签创建新元素
 *  @param sType 元素的标签
 */
function create(sType){
    return document.createElement(sType);
}
/**
 *  在一个元素的内部后面插入新元素
 *  @param parent 父元素
 *  @param elem 将要插入的元素
 */
function append( parent, elem ) {
    // Get the array of elements
    var elems = checkElem( elem );

    // Append them all to the element
    for ( var i = 0; i <= elems.length; i++ ) {
        parent.appendChild( elems[i] );
    }
}
function checkElem(a) {//"<p>ooooo<strong>8888</strong></p>"
    var r = [];
    // Force the argument into an array, if it isn’t already
    if ( a.constructor != Array ) a = [ a ];//["<p>ooooo<strong>8888</strong></p>"], [oSpan], [aLi]

    for ( var i = 0; i < a.length; i++ ) {
        // If there’s a String
        if ( a[i].constructor == String ) {
            // Create a temporary element to house the HTML
            var div = document.createElement("div");

            // Inject the HTML, to convert it into a DOM structure
            div.innerHTML = a[i];

            // Extract the DOM structure back out of the temp DIV
            for ( var j = 0; j < div.childNodes.length; j++ )
                r[r.length] = div.childNodes[j];
        } else if ( a[i].length ) { // If it’s an array
            // Assume that it’s an array of DOM Nodes
            for ( var j = 0; j < a[i].length; j++ )//a[i] = aLi
                r[r.length] = a[i][j];
        } else { // Otherwise, assume it’s a DOM Node
            r[r.length] = a[i];
        }
    }
    return r;
}
//before(oThird, oLi);
function before( parent, before, elem ) {
    // Check to see if no parent node was provided
    if ( !elem ){
        elem = before;
        before = parent;
        parent  = before.parentNode;
    }

    // Get the new array of elements
    var elems = checkElem( elem );

    // Move through the array backwards,
    // because we’re prepending elements
    for ( var i = elems.length - 1; i >= 0; i-- ) {
        parent.insertBefore( elems[i], before );
    }
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
function text(e, txt) {

    if(!txt){
        var t = "";

        // If an element was passed, get it’s children,
        // otherwise assume it’s an array
        e = e.childNodes //|| e;

        // Look through all child nodes
        for ( var j = 0; j < e.length; j++ ) {
            // If it’s not an element, append its text value
            // Otherwise, recurse through all the element’s children
            t += e[j].nodeType != 1 ?
                e[j].nodeValue : text(e[j].childNodes);
        }
        // Return the matched text
        return t;
    }
    empty(e);
    if(e.innerText){
        e.innerText = txt;
    }else if(e.textContent){
        e.textContent = txt;
    }
}

function next(elem){
    do{
        elem = elem.nextSibling;
    }while(elem && elem.nodeType != 1);
    return elem;
}

function prev(elem){
    do{
        elem = elem.previousSibling;
    }while(elem && elem.nodeType != 1);
    return elem;
}

function first(elem){
    elem = elem.firstChild;
    return elem && elem.nodeType != 1 ? next( elem ) : elem;
}

function last(elem){
    elem = elem.lastChild;
    return elem && elem.nodeType != 1 ? prev( elem ) : elem;
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

function slideDown( elem ) {
    // Show the element (but you can see it, since the height is 0)
    show( elem );

    // Find the full, potential, height of the element
    var h = fullHeight( elem );

    // Start the slide down at  0
    elem.style.height = '0px';

    // WeÕre going to do a 20 ÔframeÕ animation that takes
    // place over one second
    for ( var i = 0; i <= 100; i += 5 ) {
        // A closure to make sure that we have the right ÔiÕ
        (function(){
            var pos = i;

            // Set the timeout to occur at the specified time in the future
            setTimeout(function(){

                // Set the new height of the element
                elem.style.height = ( pos / 100 ) * h  + "px";
                console.log(pos);
            }, ( pos + 1 ) * 10 );
        })();
    }
}

function fadeIn( elem ) {
    // Start the opacity at  0
    setOpacity( elem, 0 );

    // Show the element (but you can see it, since the opacity is 0)
    show( elem );

    // WeÕre going to do a 20 ÔframeÕ animation that takes
    // place over one second
    for ( var i = 0; i <= 100; i += 5 ) {
        // A closure to make sure that we have the right ÔiÕ
        (function(){
            var pos = i;

            // Set the timeout to occur at the specified time in the future
            setTimeout(function(){

                // Set the new opacity of the element
                setOpacity( elem, pos );

            }, ( pos + 1 ) * 10 );
        })();
    }
}
// Set an opacity level for an element
// (where level is a number 0-100)
function setOpacity( elem, level ) {
    // If filters exist, then this is IE, so set the Alpha filter
    if ( elem.filters )
        elem.filters.alpha.opacity = level;//elem.style.filter="alpha(opacity=50)"

    // Otherwise use the W3C opacity property
    else
        elem.style.opacity = level / 100;
}

function ajax(options){
    options = {
        type: options.type || "GET",
        url: options.url,
        data: options.data || {},
        success: options.success
    };

    var xmlHttp;
    if(window.XMLHttpRequest){
        xmlHttp = new XMLHttpRequest();
    }else{
        xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    //'server.php?q='+val
    xmlHttp.open(options.type, options.url + '?' + serialize(options.data), true);
    xmlHttp.send();

    xmlHttp.onreadystatechange = function(){
        if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
            options.success(xmlHttp.responseText);
        };
    };

    function serialize(json){ //json={name: 'lisi', age: 23}
        var str = '';
        for(var prop in json){
            str += prop + '=' + json[prop] + '&'
        }
        return str.substring(0, str.length-1);// name=lisi&age=23
    }
}













































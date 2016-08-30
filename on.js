/**
	jQuery的$的事件注册函数，实现事件代理
*/


/*	iQuery类 构造函数	*/
function iQuery(arg)
{

	/*	DOM元素数组	接受获取的不同类型选择器的DOM元素  */
	this.elements = [];

	/* typeof arg 根据不同类型分别处理 */
	switch(typeof arg)
	{

		/* function 文档就绪函数 */
		case 'function':
			/* addEventListener 注册事件 实现注册多次事件而不被覆盖*/
			window.addEventListener('load',arg,false);
			break;

		/* 操作 DOM对象 */	
		case 'object':
			this.elements.push(arg);
			break;
			
		/* string 选择器 id class tag */
		case 'string':
		//default:
			/*判断arg字符串的第一个字符的类型*/
			var prefix = arg.charAt(0);
			switch(prefix)
			{
				/* id 选择器 */
				case '#':
					this.elements.push(document.getElementById(arg.substring(1)));
					break;

				/* class 选择器 */	
				case '.':
					this.elements = document.getElementsByClassName(arg.substring(1));
					break;

				/* tag 选择器 */	
				default:
					this.elements = document.getElementsByTagName(arg);
					break;
			}

			break;
	}


}

/*	iQuery类 函数 原型下的方法	*/
iQuery.prototype.on = function( type,selector,fn )
{
	if(typeof selector === 'string'){
		for(var i=0; i<this.elements.length; i++)
		{
			this.elements[i].addEventListener(type,function(e){

				if(e.target.className === selector.substring(1)){
					fn.call(e.target);
				}else if(e.target.id === selector.substring(1)){
					fn.call(e.target);
				}else if(e.target.tagName.toLowerCase() === selector){
					fn.call(e.target);
				}
			},false);
		}

	}else{
		for(var i=0; i<this.elements.length; i++)
		{
			fn = selector;
			this.elements[i].addEventListener(type,fn,false);
		}
		
	}
	


	/* 级联函数 保证链式调用成为现实*/
	return this;

}


/* $函数 返回一个iQuery对像实例 */
function $(arg)
{
	return new iQuery(arg);
}









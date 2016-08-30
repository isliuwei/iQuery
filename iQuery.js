/**
	$函数的实现：
	一般情况下，jquery的$函数的参数有三种类数据类型：字符串string表示一个选择器、函数function表示文档就绪函数并且
	函数可以多次重复调用，第三个就是DOM对象object。
	所以我们就需要对这三种不同的数据类型进行处理，使用typeof操作符对$函数的参数进行判断。
	并且该函数后续可能进行不同的操作或者获取不同的属性，因此该函数返回值就是一个对象，而该对象应该就是jquery对象。
	而且这些对象均具有相同的属性或者相同的方法，因此我们一般定义一个类，然后$函数返回该类型的一个实例化对象，
	然后该对象就具有jquery对象的属性和方法。
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
					this.elements.push(arg);
					break;
			}

			break;
	}


}

/*	iQuery类 函数 原型下的方法	*/
iQuery.prototype.on = function( type,fn )
{
	for(var i=0; i<this.elements.length; i++)
	{
		this.elements[i].addEventListener(type,fn,false);
	}

	/* 级联函数 保证链式调用成为现实*/
	return this;

}


/* $函数 返回一个iQuery对像实例 */
function $(arg)
{
	return new iQuery(arg);
}








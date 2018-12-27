// var page=parseInt(Math.random()*20)+1;
// 	var  arr=['1','2','3','4'];
// 	reSort(page,arr);
/*
	reSort(arr,page)
	arr:需要打乱的数组
	page:模版在AC中的当前页码获取
	page的统一方法：
	//AC当前模版所在页码
	let page=isSync?parent.window.h5SyncActions.currentPage:parseInt(Math.random()*20+1);
*/
window.reSort = function(arr, page) {
	let newArr = [];
	let len = arr.length;
	let Index = page % len;
	let Middle = arr[Index];
	arr[Index] = arr[0];
	arr[0] = Middle;
	if (len % 2 == 0) {
		let num = len / 2;
		for (let i = 0; i < arr.length; i++) {
			if (i < num) {
				newArr[i] = arr[num + i];
			} else {
				newArr[i] = arr[--num];
			}
		}
	} else {
		let num = (len - 1) / 2;
		for (var i = 0; i < arr.length; i++) {
			if (i <= num) {
				newArr[i] = arr[num + i];
			} else {
				newArr[i] = arr[--num];
			}
		}
	}
	return newArr;
}

window.reRamdom = function (a, page = 18) {
	if ( a.length < 4 ) {
		return a.reverse();
	}
	var newArr = [];
	var arr1 = a.splice(0, Math.floor(a.length/2));
    if ( page % 2 != 0 ) {
        var last = arr1.pop();
		var first = arr1.shift();
		arr1.unshift(last);
		arr1.push(first);
		a.unshift(a.pop());
    } else {
		var last = a.pop();
		var first = a.shift();
		a.unshift(last);
		a.push(first);
    }
	arr1 = arr1.reverse();
	a = a.reverse();

	for ( var i=0; i<arr1.length; i++ ) {
		newArr.push(arr1[i], a[i]);
    }

	if ( arr1.length < a.length ) {
		newArr.push(a[a.length-1]);
	}

	return newArr;
}

/**
 * 
 * 埋点初始化
 * @param tplate：埋点学术编号
 * 如果控制器端有埋点方法，则使用控制器上报，否则使用公共文件上报
 */
var h5SyncActions = parent.window.h5SyncActions;
window.initTrack = function (tplate) {
	if ( parent.window.dataReport ) {
		parent.window.dataReport.tracking.init({ 
			tplate: tplate
		})
	} else {
		Tracking.init(h5SyncActions.classConf, {
            tplate: tplate
        });
	}
}
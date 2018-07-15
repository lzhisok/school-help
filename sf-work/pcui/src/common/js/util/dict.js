import store from 'store';
/**
 * @author：qm
 * @function: 数据字典方法调用
 * @pramas: 1.pkeypath 必填
 */
export default {
	getData: function (pkeyPath) {
		try {
			var data = {};
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4 && xhr.status === 200) {
					data = JSON.parse(xhr.responseText);
				}
			};
			xhr.open('POST', store.state.global.url + 'dictionary/queryEntityListById?pkeyPath=' + pkeyPath, false);
			xhr.withCredentials = true; //支持跨域发送cookies
			xhr.send();
			return data;
		} catch (error) {
			return null
		}
	},
	getSessionStorageList: function (pkeyPath) {//存储已查询过的pkeypath到sessionStorage
		var data = {}, list = [], flag = false;
		if (sessionStorage.dicList !== undefined) {
			var dicList = JSON.parse(sessionStorage.dicList);
			for (var i = 0; i < dicList.length; i++) {
				var l_pk = dicList[i].pkeyPath;
				if (pkeyPath === l_pk) {
					data = dicList[i];
					flag = true;
					break;
				}
			}
			if (!flag) {
				data = this.getData(pkeyPath);
				if (data === null || data === undefined) {
					return null
				}
				data = data.result;
				data.pkeyPath = pkeyPath;
				dicList.push(data);
			}
			sessionStorage.dicList = JSON.stringify(dicList);
		} else {
			data = this.getData(pkeyPath);
			if (data === null || data === undefined) {
				return null
			}
			if (data.result.redirect) {
				return null
			}
			data = data.result;
			data.pkeyPath = pkeyPath;
			list.push(data);
			sessionStorage.dicList = JSON.stringify(list);
		}
		return data
	},
	getList: function (pkeyPath) {//返回数组
		var data = pkeyPath === '' ? null : this.getSessionStorageList(pkeyPath);
		if (data === null || data.dictionary === null || data.dictionary === undefined) {
			return null;
		}
		return data.dicList;
	},
	getValNameObj: function (pkeyPath) {//只有value和key的对象
		var d = pkeyPath === '' ? null : this.getSessionStorageList(pkeyPath), o = {};
		if (d === null || d.dictionary === null || d.dictionary === undefined) {
			return null;
		} else {
			d = this.getSessionStorageList(pkeyPath).dicList;
		}
		for (var i = 0; i < d.length; i++) {
			o[d[i].dicValue || d[i].dicKey] = d[i].dicName || "";
		}
		return o;
	},
	getValName: function (pkeyPath, val) {//返回对应的name值
		var d = pkeyPath === '' ? null : this.getSessionStorageList(pkeyPath), n = '';
		if (d === null || d.dictionary === null || d.dictionary === undefined) {
			return val;
		} else {
			d = this.getSessionStorageList(pkeyPath).dicList;
		}
		for (var i = 0; i < d.length; i++) {
			if (val === d[i].dicValue) {
				n = d[i].dicName;
			}
		}
		return n;
	},
	getKeyName: function (pkeyPath, key) {//返回对应的name值
		var d = pkeyPath === '' ? null : this.getSessionStorageList(pkeyPath), n = '';
		if (d === null || d.dictionary === null || d.dictionary === undefined) {
			return key;
		} else {
			d = this.getSessionStorageList(pkeyPath).dicList;
		}
		for (var i = 0; i < d.length; i++) {
			if (key === d[i].dicKey) {
				n = d[i].dicName;
			}
		}
		return n;
	},
	getInfo: function (pkeyPath) {//当前pkeyPath的info
		var data = pkeyPath === '' ? null : this.getSessionStorageList(pkeyPath);
		if (data === null || data.dictionary === null || data.dictionary === undefined) {
			return null;
		}
		return data.dictionary;
	},
	getSeletList: function (pkeyPath, selFirst) {//下拉框数组格式
		var data = pkeyPath === '' ? null : this.getValNameObj(pkeyPath), s = [];
		if (data === null) {
			return null;
		}
		if (!(selFirst === undefined)) {
			var obj = {};
			obj.value = '';
			obj.label = selFirst;
			s.push(obj);
		}
		for (var i in data) {
			if (data.hasOwnProperty(i)) {
				var obj2 = {};
				obj2.value = i;
				obj2.label = data[i];
				s.push(obj2);
			}
		}
		return s;
	}
}
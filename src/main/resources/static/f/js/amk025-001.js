var app = angular.module('myApp', ['ngSanitize']);
var initApp = function($scope, $http){
	$scope.elementsMap = {}
	$scope.referencesMap = {}
	$scope.referenceElementPaars = {}
	build_request($scope)
	exe_fn = new Exe_fn($scope, $http);
	exe_fn.httpGet_j2c_table_db1_params_then_fn = function(params, then_fn){
		return {
			url : '/r/url_sql_read_db1',
			params : params,
			then_fn : then_fn,
	}	}

	json_to_map = function(jsonDoc){
		json_elementsMap(jsonDoc, $scope.elementsMap, $scope.referencesMap)
	}

}

var initEdit_table = function($scope, $http){
	$scope.edit_table = {}
	console.log($scope.edit_table)
	$scope.edit_table.saveEditRow = function(){
//		this.editRow.row_id = this.editRow['row_'+$scope.request.parameters.tableId+'_id']
		//console.log(this)
		//console.log(this.editRow)
		if(this.editRow){
			if(this.editRow.row_id && this.editRow.row_id!=0){
				saveRow(this.editRow)
			}else{//INSERT row
				saveRow(this.editRow, true)
			}
		}
	}

	$scope.edit_table.addRow = function(table_id, table_data){
		var rowAttName = 'row_'+table_id+'_id'
		if(table_data[0][rowAttName]==0){
			this.newRow = table_data[0]
		}else{
			this.newRow = {}
			this.newRow[rowAttName] = 0
			table_data.splice(0,0,this.newRow)
		}
		console.log(this.newRow)
		this.selectedRow = this.newRow
		$scope.edit_table.editRow = this.newRow
//		initEditRow()
	}
	$scope.edit_table.selectRow = function(row){
		this.selectedRow = row
		console.log($scope.edit_table.selectedRow)
	}
	$scope.edit_table.cancelEditRow = function(){
		delete $scope.edit_table.editRow
		delete $scope.edit_table.newRow
	}
	$scope.edit_table.setEditRow = function(table_id){
		console.log(this.selectedRow)
		$scope.edit_table.editRow = this.selectedRow
	}
	$scope.edit_table.saveEditRow = function(rowParentId){
		this.editRow.row_id = this.editRow['row_'+saveRow.tableId+'_id']
		//console.log(this.editRow)
		if(this.editRow.row_id){
			saveRow.saveRow(this.editRow)
		}else{//INSERT row
			saveRow.saveRow(this.editRow, rowParentId)
		}
	}
}

function readRef($scope){
	console.log($scope.referencesMap)
	angular.forEach($scope.referencesMap, function(v,k){
		if(!v){
//			console.log(k)
			readSql({
				sql:sql_amk025.read_obj_from_docRoot(),
				jsonId:k,
				afterRead:function(response){
					if(!$scope.referencesMap[k]){
//						console.log(k)
						if(response.data.list[0]){
							var jsonDoc = JSON.parse(response.data.list[0].docbody)
//							console.log(jsonDoc)
							json_elementsMap(jsonDoc.docRoot, $scope.elementsMap, $scope.referencesMap)
						}
					}
				}
			})
		}
	})
}

function replaceParams(params){
	angular.forEach(params.sql.split(':'), function(v,k){
		if(k>0){
			var p = v.split(' ')[0].replace(')','')
			var pv = params[p]
//			console.log(p+' = '+pv)
			params.sql = params.sql.replace(':'+p,pv)
		}
	})
//	console.log(params)
//	console.log(params.sql)
}

function readSql(params, obj){
	replaceParams(params)
	if(!obj) obj = params
	exe_fn.httpGet(exe_fn.httpGet_j2c_table_db1_params_then_fn(
	params,
	function(response) {
		obj.list = response.data.list
		if(obj.afterRead){
			obj.afterRead(response)
		}else if(params.afterRead){
			params.afterRead(response)
		}
	}))
}

var writeSql = function(data){
	exe_fn.httpPost
	({	url:'/r/url_sql_read_db1',
		then_fn:function(response) {
//			console.log(response.data)
			if(data.dataAfterSave)
				data.dataAfterSave(response)
		},
		data:data,
	})
}

var sql_1c = {}
sql_1c.doc_read_elements_5 = function(){
	return this.doc_read_elements() +
	"(SELECT d5.doc_id FROM doc d, doc d0, doc d1, doc d2, doc d3, doc d4, doc d5 " +
	"WHERE d.doc_id=:docId AND d0.parent=d.doc_id " +
	"AND d1.parent=d0.doc_id " +
	"AND d2.parent=d1.doc_id " +
	"AND d3.parent=d2.doc_id " +
	"AND d4.parent=d3.doc_id " +
	"AND d5.parent=d4.doc_id " +
	")"
}
sql_1c.doc_read_elements_4 = function(){
	return this.doc_read_elements() +
	"(SELECT d4.doc_id FROM doc d, doc d0, doc d1, doc d2, doc d3, doc d4 " +
	"WHERE d.doc_id=:docId AND d0.parent=d.doc_id " +
	"AND d1.parent=d0.doc_id " +
	"AND d2.parent=d1.doc_id " +
	"AND d3.parent=d2.doc_id " +
	"AND d4.parent=d3.doc_id " +
	")"
}
sql_1c.doc_read_elements_3 = function(){
	return this.doc_read_elements() +
	"(SELECT d3.doc_id FROM doc d, doc d0, doc d1, doc d2, doc d3 " +
	"WHERE d.doc_id=:docId AND d0.parent=d.doc_id " +
	"AND d1.parent=d0.doc_id " +
	"AND d2.parent=d1.doc_id " +
	"AND d3.parent=d2.doc_id " +
	")"
}
sql_1c.doc_read_elements_2 = function(){
	return this.doc_read_elements() +
	"(SELECT d2.doc_id FROM doc d, doc d0, doc d1, doc d2 " +
	"WHERE d.doc_id=:docId AND d0.parent=d.doc_id " +
	"AND d1.parent=d0.doc_id " +
	"AND d2.parent=d1.doc_id " +
	")"
}
sql_1c.doc_read_elements_1 = function(){
	return this.doc_read_elements() +
	"(SELECT d1.doc_id FROM doc d, doc d0, doc d1 " +
	"WHERE d.doc_id=:docId AND d0.parent=d.doc_id " +
	"AND d1.parent=d0.doc_id " +
	")"
}
sql_1c.doc_read_elements_0 = function(){
	return this.doc_read_elements() +
	"(SELECT d0.doc_id FROM doc d, doc d0 " +
	"WHERE d.doc_id=:docId AND d0.parent=d.doc_id)"
}

sql_1c.doc_read_elements = function(){
	return "SELECT * FROM doc " +
	"\n LEFT JOIN (select value string, string_id from string) string ON string_id=doc_id " +
	"\n LEFT JOIN (select value vinteger, integer_id from integer) integer ON integer_id=doc_id " +
	"\n LEFT JOIN docbody ON docbody_id=doc_id " +
	"LEFT JOIN sort ON sort_id=doc_id " +
	"WHERE doc_id IN "
}

function JsonTree($scope, $http){
	var readTreeLevel = function(level, elementId){
//		console.log(level)
		readSql({
			sql:sql_1c['doc_read_elements_'+level](),
			docId:elementId,
			afterRead:function(response){
				var list = response.data.list
				angular.forEach(list, function(el){
					var p = $scope.elementsMap[el.parent]
					if(!p.children) p.children = []
					p.children.push(el)
					mapElement(el)
				})
				if(list[0]){
					readTreeLevel(++level, elementId)
				}
			}
		})
	}
	var mapElement = function(element){
		$scope.elementsMap[element.doc_id] = element
		if(element.reference){
			$scope.referenceElementPaars[element.reference] = element.doc_id
		}
		if(element.reference2){
//			console.log($scope.referenceElementPaars)
//			console.log("------read reference2 -------------")
			console.log(element.reference2)
			exe_fn.jsonTree.readTree(element.reference2)
		}
	}

	this.readTree = function(elementId){
//		console.log(sql_1c.doc_read_elements()+" (" +elementId +")")
		readSql({
			sql:sql_1c.doc_read_elements()+" (" +elementId +")",
			afterRead:function(response){
				var el = response.data.list[0]
//				console.log(el)
				if(el){
					mapElement(el)
					readTreeLevel(0, elementId)
				}
			}
		})
//		console.log(sql_1c.doc_read_elements_0())
	}

}

function Exe_fn($scope, $http){
	this.httpGet=function(progr_am){
		if(progr_am.error_fn)
			$http
			.get(progr_am.url, {params:progr_am.params})
			.then(progr_am.then_fn, progr_am.error_fn)
		else
			$http
			.get(progr_am.url, {params:progr_am.params})
			.then(progr_am.then_fn)
	}
	this.httpPost=function(progr_am){
		if(progr_am.error_fn)
			$http.post(progr_am.url, progr_am.data)
			.then(progr_am.then_fn, progr_am.error_fn)
		else
			$http.post(progr_am.url, progr_am.data)
			.then(progr_am.then_fn)
	}
}

function json_elementsMap(json, elementsMap, referencesMap){
	elementsMap[json.doc_id] = json
	if(json.reference){
		referencesMap[json.reference] = null
	}
	angular.forEach(json.children, function(v){
		json_elementsMap(v, elementsMap, referencesMap)
	})
}

function build_request($scope){
	$scope.request={};
//	console.log($scope.request)
	$scope.request.path = window.location.pathname.split('.html')[0].split('/').reverse()
	$scope.request.parameters={};
	if(window.location.search.split('?')[1]){
		angular.forEach(window.location.search.split('?')[1].split('&'), function(value, index){
			var par = value.split("=");
			$scope.request.parameters[par[0]] = par[1];
		});
	}
}

var sql_amk025 = {}
sql_amk025.read_sql_from_docRoot = function(){
	return "SELECT * FROM doc, docbody  WHERE doc_id=docbody_id and doctype=19  AND parent=:jsonId AND reference = :tableId "
}
sql_amk025.amk025_template = function(){
	return "SELECT * FROM doc d2, doc d1,docbody " +
	"WHERE d1.doc_id=docbody_id AND d2.doc_id=d1.parent AND d2.doctype IN (6,17) AND d1.reference=:jsonId"
}
sql_amk025.read_obj_from_docRoot = function(){
	return "SELECT * FROM doc d2, doc d1,docbody " +
	"WHERE d1.doc_id=docbody_id AND d2.doc_id=d1.parent AND d2.doctype IN (6,17) AND d1.reference " +
	" IN (SELECT parent FROM doc where doc_id=:jsonId)"
}

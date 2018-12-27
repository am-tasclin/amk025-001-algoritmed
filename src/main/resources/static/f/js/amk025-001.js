var app = angular.module('myApp', ['ngSanitize']);
var initApp = function($scope, $http){
	$scope.elementsMap = {}
	$scope.referencesMap = {}
	build_request($scope)
	exe_fn = new Exe_fn($scope, $http);
	exe_fn.httpGet_j2c_table_db1_params_then_fn = function(params, then_fn){
		return {
			url : '/r/url_sql_read_db1',
			params : params,
			then_fn : then_fn,
	}	}

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
	$scope.edit_table.saveEditRow = function(){
		this.editRow.row_id = this.editRow['row_'+saveRow.tableId+'_id']
		//console.log(this.editRow)
		if(this.editRow.row_id){
			saveRow.saveRow(this.editRow)
		}else{//INSERT row
			saveRow.saveRow(this.editRow, true)
		}
	}
}


function readRef($scope){
	console.log($scope.referencesMap)
	angular.forEach($scope.referencesMap, function(v,k){
		if(!v){
			console.log(k)
			readSql({
				sql:sql_amk025.read_obj_from_docRoot(),
				jsonId:k,
				afterRead:function(response){
					if(!$scope.referencesMap[k]){
						console.log(k)
						if(response.data.list[0]){
							var jsonDoc = JSON.parse(response.data.list[0].docbody)
							console.log(jsonDoc)
							json_elementsMap(jsonDoc.docRoot, $scope.elementsMap, $scope.referencesMap)
						}
					}
				}
			})
		}
	})
}

function readSql(params, obj){
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
sql_amk025.amk025_template = function(){
	return "SELECT * FROM doc d2, doc d1,docbody " +
	"WHERE d1.doc_id=docbody_id AND d2.doc_id=d1.parent AND d2.doctype IN (6,17) AND d1.reference=:jsonId"
}

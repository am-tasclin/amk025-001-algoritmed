var app = angular.module('myApp', ['ngSanitize']);
var initApp = function($scope, $http){
	$scope.elementsMap = {}
	$scope.referencesMap = {}
	$scope.referenceElementPaars = {}
	build_request($scope)
	$scope.fn = {}
	$scope.fn.getTimestamp = function(ts){
		var d = new Date(ts)
		return d
	}
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

	$scope.isGender = function (o){
		if($scope.referenceElementPaars[85370]){
			var gender = $scope.elementsMap[$scope.elementsMap[$scope.referenceElementPaars[85370]].reference2]
			if(gender){
				var evl = eval('"'+gender.string + '"=="' +o.children[1].value+'"')
				o.calcIf = evl
				return o.calcIf
			}
		}
	}

	$scope.calcAgeGroup = function (o){
		var age = $scope.getAgeOfPatient()
		var evl = eval(age+o.children[0].value+o.children[1].value)
		o.calcIf = evl
		return o.calcIf
	}
	$scope.getGenderOfPatient = function (){
		var g = $scope.elementsMap[$scope.elementsMap[$scope.referenceElementPaars[85370]].reference2].string
		return g
	}
	$scope.getAgeOfPatient = function (){
		if($scope.referenceElementPaars[85247]){
			var d1 = $scope.elementsMap[$scope.referenceElementPaars[85247]].date
			return $scope.getAge(d1)
		}
	}

	$scope.getAge = function (d1, d2){
		if(d1){
			dd1=new Date(d1)
			d2 = d2 || new Date();
			var diff = d2.getTime() - dd1.getTime();
			return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
		}
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
//							console.log(k, jsonDoc)
							json_elementsMap(jsonDoc.docRoot, $scope.elementsMap, $scope.referencesMap)
						}
					}
				}
			})
		}
	})
}

function replaceParams(params){
//	console.log(params.sql)
	angular.forEach(params.sql.split(':'), function(v,k){
		if(k>0){
			var p = v.split(' ')[0].replace(')','').replace(',','').replace(';','').trim()
			var pv = params[p]
//			console.log(p+' = '+pv)
			if(pv){
				params.sql = params.sql.replace(':'+p, "'"+pv+"'")
			}
		}
	})
//	console.log(params.ts_value)
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
	replaceParams(data)
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
	return "SELECT * FROM doc d1" +
	"\n LEFT JOIN (SELECT value string, string_id FROM string) string ON string_id=doc_id " +
	"\n LEFT JOIN (SELECT value date, date_id FROM date) date ON date_id=doc_id " +
	"\n LEFT JOIN (SELECT value ts, timestamp_id FROM timestamp) timestamp ON timestamp_id=doc_id " +
	"\n LEFT JOIN (SELECT value vinteger, integer_id FROM integer) integer ON integer_id=doc_id " +
	"\n LEFT JOIN docbody ON docbody_id=doc_id " +
	"\n LEFT JOIN (SELECT doc_id, s.value string_reference FROM doc LEFT JOIN string s ON string_id=doc_id ) d2 ON d2.doc_id=d1.reference " +
	"LEFT JOIN sort ON sort_id=d1.doc_id " +
	"WHERE d1.doc_id IN "
}

readAmk = function($scope){
	console.log(new Date(1548013371088))
	console.log($scope.elementsMap)
	readSql({
		sql:sql_amk025.amk025_template(),
		jsonId:85085,
		afterRead:function(response){
			$scope.amk025_template = JSON.parse(response.data.list[0].docbody)
			console.log('amk_template '+$scope.amk025_template.docRoot.doc_id
					, $scope.amk025_template)
					json_elementsMap($scope.amk025_template.docRoot, $scope.elementsMap, $scope.referencesMap)
					readRef($scope)
					if($scope.request.parameters.amk){
console.log('--------------',$scope.request.parameters.amk)
						exe_fn.jsonTree.readTree($scope.request.parameters.amk)
					}
//			console.log($scope.elementsMap)
		}
	})
}


function Daybook($scope, $http){
	this.getDataElement = function(fnAfterSave){ 
		var o = {
				sql:"INSERT INTO doc (doctype, doc_id, parent, reference) " +
				" VALUES (18, :nextDbId1, :parent, :reference);\n " +
				"INSERT INTO docbody (docbody_id, docbody) VALUES (:nextDbId1, :docbody);\n ",
				dataAfterSave:function(response){
					console.log(response)
				},
		}
		if(fnAfterSave)
			o.dataAfterSave = fnAfterSave

		return o
	}

	$scope.addDaybook = function(fnAfterSave){
		console.log($scope.elementsMap[$scope.request.parameters.amk])
		var l1 = 85116 || $scope.request.parameters.l1
		var daybookDatatypeElement = $scope.elementsMap[$scope.elementsMap[l1].reference]
		console.log(daybookDatatypeElement)
		var amkPartEl = $scope.elementsMap[$scope.referenceElementPaars[l1]]
		//console.log(exe_fn)
		//console.log(exe_fn.daybook)
		var dataElement = exe_fn.daybook.getDataElement(fnAfterSave)
		dataElement.reference = daybookDatatypeElement.doc_id
		dataElement.sql += "INSERT INTO doc (doctype, doc_id, parent, reference) " +
		" VALUES (18, :nextDbId2, :nextDbId1, :reference2);\n " +
		"INSERT INTO timestamp (timestamp_id, value) VALUES (:nextDbId2, :ts_value);\n " +
		"INSERT INTO sort (sort_id, sort) VALUES (:nextDbId1, :sort); "
		console.log(dataElement.sql)
		var ts = new Date()
		dataElement.ts_value = ts.toISOString().substring(0,23).replace('T',' ')
//		dataElement.ts_value = ts.toISOString().replace('T',' ')
		dataElement.sort = ts.getTime()
		dataElement.docbody = ''
		dataElement.reference2 = daybookDatatypeElement.children[0].doc_id
		if(amkPartEl)
			dataElement.parent = amkPartEl.doc_id
		saveDataDocbody2(amkPartEl, dataElement)
	}

}

var saveDataDocbody2 = function(amkPartEl, dataElement){
	if(!amkPartEl){//INSERT part element
		console.log('------INSERT part element----------')
		insertWithPartElement(dataElement)
	}else{
		console.log('------update element----------')
		console.log(amkPartEl)
		console.log(dataElement)
		writeSql(dataElement)
	}
	
}

var insertWithPartElement = function(dataElement){
	var dataParentElement = {
			parent:$scope.request.parameters.amk,
			reference:$scope.request.parameters.l1,
			sql:"INSERT INTO doc (doctype, doc_id, parent, reference) VALUES (18, :nextDbId1, :parent, :reference);",
			dataAfterSave:function(response){
				console.log(response)
				console.log(response.data)
				console.log(response.data.nextDbId1)
				dataElement.parent = response.data.nextDbId1
				writeSql(dataElement)
			},
	}
	console.log(dataParentElement)
	writeSql(dataParentElement)
}

function JsonTree($scope, $http){
	this.readTreeLevel = function(level, elementId){
//		console.log(level)
		var thisO = this
		readSql({
			sql:sql_1c['doc_read_elements_'+level](),
			docId:elementId,
			afterRead:function(response){
				var list = response.data.list
				angular.forEach(list, function(el){
					var p = $scope.elementsMap[el.parent]
					if(!p.children) p.children = []
					p.children.push(el)
					thisO.mapElement(el)
				})
				if(list[0]){
					thisO.readTreeLevel(++level, elementId)
				}
			}
		})
	}

	this.readDocBody = function(docId){
		var thisO = this
		readSql({
			sql:sql_amk025.amk025_template(),
			jsonId:docId,
			afterRead:function(response){
				var el = response.data.list[0]
				if(el){
					if(el.docbody){
						if(el.docbody.includes('SELECT')){
						}else{
							try{
								var docbodyDocument = JSON.parse(el.docbody).docRoot
								var docRootDoc = $scope.elementsMap[docId]
								if(!docRootDoc){
									docRootDoc = {doc_id:docId}
								}
								if(!docRootDoc.docRoot){
									docRootDoc.docRoot = docbodyDocument
								}
								$scope.elementsMap[docId] = docRootDoc
								console.log('readDocBody ',docId, docbodyDocument)
								thisO.mapTree(docbodyDocument)
							}catch(e){
								if (e instanceof SyntaxError) {
									console.error(e)
//								console.log(el)
								} else {
									console.log(e)
								}
			}	}	}	}	}
		})

	}

	this.mapElement = function(element){
		$scope.elementsMap[element.doc_id] = element
		if(element.reference){
			$scope.referenceElementPaars[element.reference] = element.doc_id
			this.readDocBody(element.reference)
		}
		if(element.reference2){
//				console.log($scope.referenceElementPaars)
//				console.log("------read reference2 -------------")
//				console.log(element.reference2, element)
			exe_fn.jsonTree.readTree(element.reference2)
		}
	}

	this.mapTree = function(el){
		$scope.elementsMap[el.doc_id] = el
		var thisO = this
		angular.forEach(el.children, function(v){
			thisO.mapTree(v)
		})
	}


	this.readTree = function(elementId, docName){
//		console.log(sql_1c.doc_read_elements()+" (" +elementId +")")
		var thisO = this
		readSql({
			sql:sql_1c.doc_read_elements()+" (" +elementId +")",
			afterRead:function(response){
				var el = response.data.list[0]
//				console.log(elementId, el)
//				console.log('exe_fn.jsonTree.readTree '+el.doc_id, el)
				if(el){
					thisO.mapElement(el)
					thisO.readTreeLevel(0, elementId)
					if(docName){
						$scope[docName] = el
					}
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

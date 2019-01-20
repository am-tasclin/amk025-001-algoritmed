app.controller('myCtrl', function($scope, $http, $interval, $filter) {
	initApp($scope, $http)
	console.log($scope.request.parameters)
	exe_fn.jsonTree = new JsonTree($scope, $http)
	
	console.log(123)
	$scope.elementNoteDialog = {
		elementId:0, style:{display:'none'},
		save:function(){
			$scope.saveDataDocbody(this)
		},
		close:function(){
			this.style		= {display:'none'}
		},
		open:function(o){
			console.log(this)
			this.o				= o
			this.elementId		= o.doc_id
			this.style			= {display:'block'}
			var amkElId			= o.doc_id
			var patientAmkEl	= $scope.elementsMap[$scope.referenceElementPaars[amkElId]]
			if(patientAmkEl){
				this.note		= patientAmkEl.docbody
			}else{
				delete this.note
			}
		},
	}

	var getDataElement = function(){ return {
		sql:"INSERT INTO doc (doctype, doc_id, parent, reference) " +
		" VALUES (18, :nextDbId1, :parent, :reference);\n " +
		"INSERT INTO docbody (docbody_id, docbody) VALUES (:nextDbId1, :docbody);\n ",
		dataAfterSave:function(response){
			console.log(response)
		}
	}}

	$scope.addDaybook = function(){
		console.log($scope.elementsMap[$scope.request.parameters.amk])
//		console.log($scope.request.parameters.l1)
//		console.log($scope.elementsMap[$scope.request.parameters.l1])
		var daybookDatatypeElement = $scope.elementsMap[$scope.elementsMap[$scope.request.parameters.l1].reference]
		console.log(daybookDatatypeElement)
		var amkPartEl = $scope.elementsMap[$scope.referenceElementPaars[$scope.request.parameters.l1]]
		var dataElement = getDataElement()
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

	$scope.saveDataDocbody = function(colO){
		console.log($scope.elementsMap[$scope.request.parameters.amk])
		var amkPartEl = $scope.elementsMap[$scope.referenceElementPaars[$scope.request.parameters.l1]]
		console.log(colO)
		var amkElId = colO.o.doc_id
		console.log(amkElId)
		console.log($scope.elementsMap[amkElId])
//		logEnvirontment()
		var dataElement = getDataElement()
		dataElement.docbody = colO.note
		dataElement.reference = amkElId
		if(!amkPartEl){//INSERT part element
			insertWithPartElement(dataElement)
		}else{
			var patientAmkEl = $scope.elementsMap[$scope.referenceElementPaars[amkElId]]
			console.log(patientAmkEl)
			if(patientAmkEl){//UPDATE
				dataElement.docbody_id = patientAmkEl.doc_id
				dataElement.sql = "UPDATE docbody SET docbody=:docbody WHERE docbody_id=:docbody_id"
			}else{//INSERT
				dataElement.parent = amkPartEl.doc_id
			}
			console.log(dataElement)
			writeSql(dataElement)
		}
	}

	$scope.saveDataReference2 = function(o, amkElId){
		console.log(o)
		console.log(amkElId)
		console.log($scope.elementsMap[amkElId])
//		logEnvirontment()
		var dataElement = {
			reference:amkElId,
			reference2:o.doc_id,
			sql:"INSERT INTO doc (doctype, doc_id, parent, reference, reference2) " +
				" VALUES (18, :nextDbId1, :parent, :reference, :reference2);",
			dataAfterSave:function(response){
				console.log(response)
			}
		}
		var amkPartEl = $scope.elementsMap[$scope.referenceElementPaars[$scope.request.parameters.l1]]
		if(!amkPartEl){
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
		}else{
			var patientAmkEl = $scope.elementsMap[$scope.referenceElementPaars[amkElId]]
			console.log(patientAmkEl)
			if(patientAmkEl){//UPDATE
				dataElement.doc_id = patientAmkEl.doc_id
				dataElement.sql = "UPDATE doc SET reference2=:reference2 WHERE doc_id=:doc_id"
			}else{//INSERT
				dataElement.parent = amkPartEl.doc_id
			}
			console.log(dataElement)
			writeSql(dataElement)
		}
	}

	var logEnvirontment = function(){
		console.log($scope.referenceElementPaars)
		console.log($scope.referenceElementPaars[85089])
		console.log($scope.elementsMap[$scope.referenceElementPaars[85089]])
		console.log($scope.referenceElementPaars[$scope.request.parameters.l1])
		console.log($scope.elementsMap[$scope.referenceElementPaars[$scope.request.parameters.l1]])
		console.log('амк документ '+ $scope.request.parameters.amk)
		console.log($scope.elementsMap[$scope.request.parameters.amk])
		console.log($scope.elementsMap[85086])
		console.log($scope.elementsMap[$scope.request.parameters.l1])
		console.log('пацієнт')
		console.log($scope.elementsMap[85256])
	}
	
	readSql({
		sql:sql_amk025.amk025_template(),
		jsonId:85085,
		afterRead:function(response){
			$scope.amk025_template = JSON.parse(response.data.list[0].docbody)
			console.log('amk')
			console.log($scope.amk025_template)
			json_elementsMap($scope.amk025_template.docRoot, $scope.elementsMap, $scope.referencesMap)
			readRef($scope)
			if($scope.request.parameters.amk)
				exe_fn.jsonTree.readTree($scope.request.parameters.amk)
		}
	})
	
	readSql({
		sql:sql_amk025.amk025_template(),
		jsonId:5036,
		afterRead:function(response){
			$scope.amk025_dd = JSON.parse(response.data.list[0].docbody)
			console.log($scope.amk025_dd)
			json_elementsMap($scope.amk025_dd.docRoot, $scope.elementsMap, $scope.referencesMap)
		}
	})
	
	readAmk($scope)
	
})

readAmk = function($scope){
	console.log(new Date(1548013371088))
	console.log($scope.elementsMap)
}

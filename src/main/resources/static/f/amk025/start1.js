app.controller('myCtrl', function($scope, $http, $interval, $filter) {
	initApp($scope, $http)
	console.log($scope.request.parameters)
	exe_fn.jsonTree = new JsonTree($scope, $http)

	$scope.saveBloodGroup = function(o, amkElId){
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
	
})

sql_amk025.read_obj_from_docRoot = function(){
	return "SELECT * FROM doc d2, doc d1,docbody " +
	"WHERE d1.doc_id=docbody_id AND d2.doc_id=d1.parent AND d2.doctype IN (6,17) AND d1.reference " +
	" IN (SELECT parent FROM doc where doc_id=:jsonId)"
}

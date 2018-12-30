app.controller('myCtrl', function($scope, $http, $interval, $filter) {
	initApp($scope, $http)
	initEdit_table($scope, $http)
	var jsonDocAmk025 = new JsonDoc($scope, $http, 85085)
	jsonDocAmk025.readDoc()
	saveRow = new Init_saveRow($scope, $http, 85243)

	$scope.makeAmk025 = function(){
		console.log($scope.edit_table.selectedRow)
		console.log($scope.elementsMap[85085].docRoot)
		var	amk025_data = $scope.elementsMap[85085].meta_elements[47],
			amk025_data_element = amk025_data[Object.keys(amk025_data)[0]]
		console.log(amk025_data_element)
		var data = {
			parent:amk025_data_element.doc_id,
			reference:$scope.elementsMap[85085].docRoot.doc_id,
			reference_2:$scope.elementsMap[85089].doc_id,
			reference_3:$scope.elementsMap[85255].doc_id,
			reference_3:$scope.elementsMap[85255].doc_id,
			reference2_3:$scope.edit_table.selectedRow.row_85243_id,
			dataAfterSave:function(response){
				console.log(response)
			}
		}
		var sql_makeAmk025 = 
			"INSERT INTO doc (doctype, doc_id, parent, reference) VALUES (18, :nextDbId1, :parent, :reference); "+
			"INSERT INTO doc (doctype, doc_id, parent, reference) VALUES (18, :nextDbId2, :nextDbId1, :reference_2); "+
			"INSERT INTO doc (doctype, doc_id, parent, reference, reference2) " +
			"VALUES (18, :nextDbId3, :nextDbId2, :reference_3, :reference2_3);"
		data.sql = sql_makeAmk025
		console.log(data)
		writeSql(data)
	}

	readSql({
		sql:sql_amk025.amk025_template(),
		jsonId:85242,
		afterRead:function(response){
			$scope.patient_template = JSON.parse(response.data.list[0].docbody)
//			console.log($scope.patient_template)
			json_elementsMap($scope.patient_template.docRoot, $scope.elementsMap, $scope.referencesMap)
			readRef($scope)
			console.log($scope.patient_template.docRoot.join_select)
			readSql({
				sql:$scope.patient_template.docRoot.join_select,
				afterRead:function(response){
					$scope.patient_data = response.data.list
					console.log($scope.patient_data)
				},
			})
//			saveRow.saveRow()
		}
	})

})
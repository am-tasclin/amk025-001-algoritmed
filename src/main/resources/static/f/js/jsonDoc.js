var JsonDoc = function ($scope, $http, jsonId){
	this.jsonId = jsonId

	this.readDoc = function(){
		var sql_firstchildren = "SELECT * FROM doc " +
		" LEFT JOIN docbody ON doc_id=docbody_id " +
		" LEFT JOIN string ON doc_id=string_id " +
		" WHERE :jsonId IN (doc_id,parent)"
		readSql({
			sql:sql_firstchildren ,
			jsonId:this.jsonId,
			afterRead:function(response){
				angular.forEach(response.data.list, function(v){
					json_to_map(v)
					if(20==v.doctype){
						var docbody = JSON.parse(v.docbody)
						if(docbody){
							v.docbody = docbody
							console.log(docbody.docRoot)
							json_to_map(docbody.docRoot)
							if($scope.elementsMap[docbody.docRoot.parent]){
								$scope.elementsMap[docbody.docRoot.parent].docRoot
								= docbody.docRoot
							}
						}
					}
				})
				
				var docId = this.jsonId
				
				$scope.elementsMap[docId].children = []
				angular.forEach(response.data.list, function(v){
					$scope.elementsMap[docId].children.push(v)
				})
				
				$scope.elementsMap[docId].meta_elements = {}
				console.log($scope.elementsMap[docId].meta_elements)
				angular.forEach(response.data.list, function(v){
					if(!$scope.elementsMap[docId].meta_elements[v.doctype]){
						$scope.elementsMap[docId].meta_elements[v.doctype] = {}
					}
					$scope.elementsMap[docId].meta_elements[v.doctype][v.doc_id] = v
				})
			}
		})
	}
}

var DocType = function ($scope, $http){
	readSql({
		sql:"SELECT * FROM doctype",
		afterRead:function(response){
			console.log(response.data)
			$scope.doctype = {}
			console.log($scope.doctype)
			angular.forEach(response.data.list, function(v){
				$scope.doctype[v.doctype_id] = v
			})
		}
	})
	
}

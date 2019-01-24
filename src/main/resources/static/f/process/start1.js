app.controller('myCtrl', function($scope, $http, $interval, $filter) {
	initApp($scope, $http)
	console.log($scope.request.parameters)
	exe_fn.jsonTree = new JsonTree($scope, $http)
	exe_fn.daybook = new Daybook($scope, $http)

	var calcIf = function(o){
		var ifIs = true
		angular.forEach(o.children, function(v, k){
			console.log(v.calcIf+'/'+v.value)
			if(v.calcIf !== undefined){
				ifIs = ifIs && v.calcIf
			}
		})
		o.ifIs = ifIs
	}

	readAmk($scope)

	$scope.setCheckPlanTask = function(o){
		console.log(o)
		console.log($scope.referenceElementPaars[o.doc_id])
		if($scope.referenceElementPaars[o.doc_id]){
			o.isDeletedChecked = !o.isDeletedChecked
		}
	}
	$scope.savePlanAction = function(o, list, path){
		console.log(o)
		console.log(list)
		console.log(path)
		var lastPathId = path.reverse()[0]
		var data = { idn:0, sql:'',}
		if($scope.referenceElementPaars[lastPathId]){
			parentId = $scope.referenceElementPaars[o.doc_id]
			console.log(parentId)
			if(parentId){
				data.parent = parentId
				console.log(data)
				angular.forEach(list, function(v){
					var savedDataId = $scope.referenceElementPaars[v.doc_id]
					if(savedDataId){
//						if(!v.isChecked){//DELETE
						if(v.isDeletedChecked){//DELETE
							data.sql += "DELETE FROM doc WHERE doc_id = "+savedDataId+";\n "
						}
					}else{
						if(v.isChecked){//INSERT
							data.idn++
							data.sql += "INSERT INTO doc (doctype, doc_id, parent, reference) " +
							" VALUES (18, :nextDbId"+ data.idn +", "+ data.parent +", "+ v.doc_id +");\n "
						}
					}
				})
				console.log(data.sql)
				writeSql(data)
			}
		}else{
			$scope.addDaybook(function(response){
				console.log('-27--',response)
				console.log(response.data.nextDbId1)
				data.parent = response.data.nextDbId1
				angular.forEach(path, function(v){
					data.idn++
					data.sql += "INSERT INTO doc (doctype, doc_id, parent, reference) " +
					" VALUES (18, :nextDbId"+ data.idn +", :parent, "+v+");\n "
				})
				if(data.idn > 0){
					var parent = data.idn
					data.idn++
					data.sql += "INSERT INTO doc (doctype, doc_id, parent, reference) " +
					" VALUES (18, :nextDbId"+ data.idn +", :nextDbId"+ parent +", "+ o.doc_id +");\n "
					parent = data.idn
					angular.forEach(list, function(v){
						if(v.isChecked){
							data.idn++
							data.sql += "INSERT INTO doc (doctype, doc_id, parent, reference) " +
							" VALUES (18, :nextDbId"+ data.idn +", :nextDbId"+ parent +", "+ v.doc_id +");\n "
							console.log(v.sort)
						}
					})
					console.log(data.sql)
//					writeSql(data)
				}
			})
		}
	}

	var l_calcAllIfs = $interval( function(){ calcAllIfs(); }, 1000)
	var calcAllIfs = function(){
		console.log('---calc all Ifs-3------')
		angular.forEach($scope.process_85236.children, function(v){
			if(v.children){
				var allIfs = false
				var ifsElemnt = v.children[0].children[1]
				angular.forEach(ifsElemnt.children, function(v2){
					calcIf(v2)
					if(v2.ifIs !== undefined){
						allIfs = allIfs || v2.ifIs
					}
				})
				console.log(allIfs)
				ifsElemnt.allIfs = allIfs
			}
		})
		$interval.cancel(l_calcAllIfs)
	}

	if($scope.request.parameters.amk){
		exe_fn.jsonTree.readTree($scope.request.parameters.amk, 'amkData')
	}

	readSql({
		sql:sql_amk025.amk025_template(),
		jsonId:85236,
		afterRead:function(response){
			$scope.process_85236 = JSON.parse(response.data.list[0].docbody).docRoot
			console.log($scope.process_85236)
		}
	})

})

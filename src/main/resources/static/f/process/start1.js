app.controller('myCtrl', function($scope, $http, $interval, $filter) {
	initApp($scope, $http)
	console.log($scope.request.parameters)
	exe_fn.jsonTree = new JsonTree($scope, $http)
	exe_fn.daybook = new Daybook($scope, $http)

	var calcIf = function(o){
		var ifIs = true
		angular.forEach(o.children, function(v, k){
//			console.log(v.calcIf+'/'+v.value)
			if(v.calcIf !== undefined){
				ifIs = ifIs && v.calcIf
			}
		})
		o.ifIs = ifIs
	}

	readAmk($scope)

	$scope.process_85569 ={}
	$scope.process_85569.color = function(o){
		var v = o.children[0].value*1
		if(v>=15){
			return 'w3-pink'
		}else if(v>=10){
			return 'w3-red'
		}else if(v>=5){
			return 'w3-deep-orange'
		}else if(v>=3){
			return 'w3-lime'
		}else if(v>=2){
			return 'w3-yellow'
		}else if(v>=1){
			return 'w3-green'
		}else{
			return 'w3-light-green'
		}
	}
	
	$scope.setViewBlock = function(o){
		console.log(o)
		o.closeBlock = !o.closeBlock
	}
	$scope.setCheckPlanTask = function(o){
		console.log(o)
		console.log($scope.referenceElementPaars[o.doc_id])
		if($scope.referenceElementPaars[o.doc_id]){
			o.isDeletedChecked = !o.isDeletedChecked
		}
	}

	var saveToDoAction = function(o, data, parentId){
		console.log(parentId, o, o.children[1].children)
		var oToDoPlanId = o.children[1].doc_id,
		oToDoId = $scope.referenceElementPaars[oToDoPlanId]
		console.log(oToDoId)
		if(!oToDoId){
			data.idn++
			data.sql += "INSERT INTO (doc_id, parent, reference ) " +
			"VALUES (:nextDbId"+data.idn+", "+parentId+", "+oToDoPlanId+" ); "
		}
		angular.forEach(o.children[1].children, function(v){
			if(v.isChecked){
				console.log(v)
			}
		})
	}

	$scope.savePlanAction = function(o, list, path){
		console.log(path,o,list)
		var firstPathId = path.reverse()[0]
		var data = { idn:0, sql:'',}

		console.log(firstPathId ,$scope.referenceElementPaars,o.doc_id)
		var firstPathDataId = $scope.referenceElementPaars[firstPathId]
		if(firstPathDataId){// план обробляється вдруге
			parentId = $scope.referenceElementPaars[o.doc_id]
			console.log(parentId)
			if(parentId){
				data.parent = parentId
				console.log(data, list)
				angular.forEach(list, function(v){
					var savedDataId = $scope.referenceElementPaars[v.doc_id]
					if(savedDataId){
//						if(!v.isChecked)//DELETE
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
				saveToDoAction(o, data, parentId)
				console.log(data.sql)
				if(data.sql){
//					writeSql(data)
				}
			}else{
				data.parent = firstPathDataId
				data.idn = 1
				console.log('--new code-----', firstPathDataId, data)
				data.sql += "INSERT INTO doc (doctype, doc_id, parent, reference) " +
				" VALUES (18, :nextDbId"+ data.idn +", "+ firstPathDataId +", "+ o.doc_id +");\n "
				saveNosology(data, o, list, data.idn)
				console.log(data.sql)
				writeSql(data)
			}
		}else{// план обробляється вперше
			$scope.addDaybook(function(response){// перший запис в щоденник 
				console.log('-27--',response)
				console.log(response.data.nextDbId1)
				data.parent = response.data.nextDbId1
				data.idn = 1
				savePlanExecute(data, o, list, path)
			})
		}
	}
	
	var saveNosology = function(data, o, list, parentNextDbId){
		angular.forEach(list, function(v){
			if(v.isChecked){
				data.idn++
				if(v.reference){
					data.sql += "INSERT INTO doc (doctype, doc_id, parent, reference, reference2) " +
					" VALUES (18, :nextDbId"+ data.idn +", "+ data.parent +", "+ v.reference +", "+ v.reference +");\n "
				}else{
					data.sql += "INSERT INTO doc (doctype, doc_id, parent, reference) " +
					" VALUES (18, :nextDbId"+ data.idn +", :nextDbId"+ parentNextDbId +", "+ v.doc_id +");\n "
				}
				console.log(v.sort)
			}
		})
	}

	var savePlanExecute = function(data, o, list, path){
		data.sql += "INSERT INTO doc (doctype, doc_id, parent, reference) " +
		" VALUES (18, :nextDbId"+ data.idn +", :parent, "+path[0]+");\n "
		angular.forEach(path.slice(1), function(v,k){
			data.idn++
			data.sql += "INSERT INTO doc (doctype, doc_id, parent, reference) " +
			" VALUES (18, :nextDbId"+ data.idn +", :nextDbId"+(data.idn-1)+", "+v+");\n "
		})
		if(data.idn > 0){
			var parentNextDbId = data.idn
			data.idn++
			data.sql += "INSERT INTO doc (doctype, doc_id, parent, reference) " +
			" VALUES (18, :nextDbId"+ data.idn +", :nextDbId"+ parentNextDbId +", "+ o.doc_id +");\n "
			parentNextDbId = data.idn
			saveNosology(data, o, list, data.idn)
			console.log(data.sql)
			writeSql(data)
		}
	}

	var l_calcAllIfs = $interval( function(){ calcAllIfs(); }, 1000)
	var calcAllIfs = function(){
		console.log('---calc all Ifs-3------')
		angular.forEach($scope.process_85236.children, function(v){
			if(v.children && v.children[0].children){
				var ifsElemnt = v.children[0].children[1]
				var allIfs = false
				angular.forEach(ifsElemnt.children, function(v2){
					calcIf(v2)
					if(v2.ifIs !== undefined){
						allIfs = allIfs || v2.ifIs
					}
				})
				//console.log(allIfs)
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
			exe_fn.jsonTree.mapTree($scope.process_85236)
			exe_fn.jsonTree.readLinks(85236, $scope.process_85236)
		}
	})

	$scope.openReferenceDocument = function(o){
		var referenceDocId = $scope.elementsMap[o.reference].reference
		console.log(referenceDocId, o)
		exe_fn.jsonTree.readDocBody(referenceDocId)
		$scope.elementDialog.open(o)
	}

	$scope.elementDialog = {
		elementId:0, style:{display:'none'},
	}
	$scope.elementDialog.close = function(){
		this.style		= {display:'none'}
	}
	$scope.elementDialog.open = function(o){
		console.log(this)
		this.o				= o
		this.elementId		= o.doc_id
		this.style			= {display:'block'}
	}


	
})

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

	$scope.savePlanAction = function(o, list, path){
		console.log(o)
		console.log(list)
		console.log(path)
		$scope.addDaybook(function(response){
			console.log('-27--',response)
			console.log(response.data.nextDbId1)
			var data = {
				idn:1,
				sql:'',
				parent:response.data.nextDbId1
			}
			angular.forEach(path, function(v){
				data.sql += "INSERT INTO doc (doctype, doc_id, parent, reference) " +
				" VALUES (18, :nextDbId"+data.idn+", :parent, "+v+");"
				data.idn++
			})
			console.log(data)
			writeSql(data)
		})
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

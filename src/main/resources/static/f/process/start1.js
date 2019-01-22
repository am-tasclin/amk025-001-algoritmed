app.controller('myCtrl', function($scope, $http, $interval, $filter) {
	initApp($scope, $http)
	console.log($scope.request.parameters)
	exe_fn.jsonTree = new JsonTree($scope, $http)

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

	$scope.savePlanAction = function(o){
		console.log(o)
	}

	var lcalcAllIfs = $interval( function(){ calcAllIfs(); }, 2000)
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
		$interval.cancel(lcalcAllIfs)
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

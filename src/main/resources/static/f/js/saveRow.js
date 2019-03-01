if(!sql_1c)
var sql_1c = {}
sql_1c.insertCell = function(row_id, columnId, i){
	var sql = "INSERT INTO doc (doctype, doc_id, parent, reference ) " +
	"VALUES (5, :nextDbId" +i +", :nextDbId1, "+columnId +" );\n"
	if(row_id){sql = sql.replace(/:nextDbId1/,row_id)}
	return sql
}

elementData.saveRow_col_85370 = function(o, params, $scope){
	var reference2 = params.editRow.gender_id
	if(reference2){
		if(params.editRow.col_85370){//UPDATE value
			params.sql += "UPDATE doc SET reference2 = " + reference2 +" WHERE doc_id = "+params.editRow.col_85370_id + " ;\n "
		}else{//INSERT 
			params.sql += sql_1c.insertCell(params.editRow.row_id, o.doc_id, params.i)
			params.sql += "UPDATE doc SET reference2 = " + reference2 +" WHERE doc_id = :nextDbId"+params.i + " ;\n "
			params.i++
		}
	}else{//DELETE
		params.sql += "DELETE FROM doc WHERE doc_id = "+params.editRow.col_85370_id + " ;\n "
	}
}

var Init_saveRow = function ($scope, $http, tableId){

	this.tableId = tableId

	this.adjustData = function(params){
		if(params.v == params.editRow['start_col_'+params.columnId]){
			params.isoData = params.v
		}else{
			var d = new Date(Date.parse(params.v))
			console.log(d)
			d.setDate(d.getDate()+1)
			var n = d.toISOString();
			params.isoData = n.split('T')[0]
		}
	}

	this.saveRow = function(editRow, rowParentId){
		var thisO = this
		var params = {sql:'', i:2, editRow:editRow}
		//var sql = '', i = 2
		var tableEl = $scope.elementsMap[this.tableId]
		console.log(elementData, this.tableId, $scope.elementsMap, editRow, tableEl)
		angular.forEach(tableEl.children, function(vt,k){
//			console.log(vt)
			params.columnId = vt.doc_id,
			columnObj = $scope.elementsMap[params.columnId]
//			console.log(columnObj)
			params.v = editRow['col_'+params.columnId]
			cellId = editRow['col_'+params.columnId+'_id']
			var reference2 = editRow['row_'+params.columnId+'_id']
			console.log(params.columnId+'/'+params.v+'/'+cellId+'/'+columnObj.doctype+'/'+reference2)
			if(elementData['saveRow_col_'+params.columnId]){
				elementData['saveRow_col_'+params.columnId](vt, params, $scope)
			}else
			if(cellId){//UPDATE value
				switch (columnObj.doctype) {
				case 27:
					if(reference2){
						params.sql += "UPDATE doc SET reference2 = " + reference2 +" WHERE doc_id = "+cellId + ";\n "
					}
					break;
				case 57:
					params.sql += "UPDATE doc SET reference = " + editRow['ref2_'+params.columnId] +" " +" WHERE doc_id = "+cellId + ";\n "
					break;
				case 26:
					console.log(params.columnId, params.v, editRow['start_col_'+params.columnId])
					thisO.adjustData(params)
					params.sql += "UPDATE date SET value = '" + params.isoData +"' " +" WHERE date_id = "+cellId + ";\n "
					break;
				case 22:
					params.sql += "UPDATE string SET value = '" + params.v +"' " +" WHERE string_id = "+cellId + ";\n "
					break;
				case 23:
					params.sql += "UPDATE integer SET value = " + params.v +" " +" WHERE integer_id = "+cellId + ";\n "
					break;
				}
			}else{//INSERT cell & value
				switch (columnObj.doctype) {
				case 27:
					if(reference2){
						params.sql += sql_1c.insertCell(editRow.row_id, params.columnId, params.i)
						params.sql += "UPDATE doc SET reference2 = " + reference2 +" " +" WHERE doc_id = :nextDbId"+params.i + " ;\n "
					}
					break;
				case 57:
					params.sql += sql_1c.insertCell(editRow.row_id, params.columnId, params.i)
					params.sql += "UPDATE doc SET reference2 = " + editRow['ref2_'+params.columnId] +" WHERE doc_id = :nextDbId"+params.i + " ;\n "
//					sql += "UPDATE doc SET reference2 = :nextDbId"+i +" WHERE doc_id = :nextDbId"+i + " ;\n "
//					sql += "INSERT INTO inn (inn, inn_id) VALUES ('"+v+"',:nextDbId"+i +" );\n"
					break;
				}
				if(params.v){
					switch (columnObj.doctype) {
					case 26:
						thisO.adjustData(params)
						params.sql += sql_1c.insertCell(editRow.row_id, params.columnId, params.i)
						params.sql += "INSERT INTO date (value, date_id) VALUES ('"+params.isoData+"',:nextDbId" +params.i +" );\n"
						break;
					case 22:
						params.sql += sql_1c.insertCell(editRow.row_id, params.columnId, params.i)
						params.sql += "INSERT INTO string (value, string_id) VALUES ('"+v+"',:nextDbId" +params.i +" );\n"
						break;
					case 23:
						params.sql += sql_1c.insertCell(editRow.row_id, params.columnId, params.i)
						params.sql += "INSERT INTO integer (value, integer_id) VALUES ("+v+",:nextDbId" +params.i +" );\n"
						break;
					}
				}
				params.i++
			}
		})
		if(params.sql){
			if(rowParentId){
				params.sql = "INSERT INTO doc (doctype, doc_id, parent, reference) " +
				"VALUES (4, :nextDbId1, " + rowParentId
				+ ", " +this.tableId+");\n" +
				params.sql
			}
			/*
			sql += sql_1c.select_row($scope.table.join_select, editRow.row_id)
			 */
			console.log(params.sql)
//			return
			writeSql({sql : params.sql,
				dataAfterSave:function(response){
					if(response.data.sql){
						if(response.data.sql.indexOf('(4')>0){
							angular.forEach(response.data, function(v,k){
								if(k.indexOf('list')==0){
									console.log(v[0])
									$scope.table_data.list.splice(0,0,v[0])
			}	})	}	}	}	})
		}
	}

}

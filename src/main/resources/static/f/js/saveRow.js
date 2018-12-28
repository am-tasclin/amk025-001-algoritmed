var sql_1c = {}
sql_1c.insertCell = function(row_id, columnId, i){
	var sql = "INSERT INTO doc (doctype, doc_id, parent, reference ) " +
	"VALUES (5, :nextDbId" +i +", :nextDbId1, "+columnId +" );\n"
	if(row_id){sql = sql.replace(/:nextDbId1/,row_id)}
	return sql
}
var Init_saveRow = function ($scope, $http, tableId){
	this.tableId = tableId
	this.saveRow = function(editRow, rowParentId){
		var sql = '', i = 2
		console.log(this.tableId)
		console.log($scope.elementsMap)
		console.log(editRow)
		var tableEl = $scope.elementsMap[this.tableId]
		console.log(tableEl)
		angular.forEach(tableEl.children, function(vt,k){
//			console.log(vt)
			var columnId = vt.doc_id,
			columnObj = $scope.elementsMap[columnId]
//			console.log(columnObj)
			v = editRow['col_'+columnId]
			cellId = editRow['col_'+columnId+'_id']
			var reference2 = editRow['row_'+columnId+'_id']
			console.log(columnId+'/'+v+'/'+cellId+'/'+columnObj.doctype+'/'+reference2)
			if(cellId){//UPDATE value
				switch (columnObj.doctype) {
				case 27:
					if(reference2){
						sql += "UPDATE doc SET reference2 = " + reference2 +" WHERE doc_id = "+cellId + ";\n "
					}
					break;
				case 57:
					sql += "UPDATE doc SET reference = " + editRow['ref2_'+columnId] +" " +" WHERE doc_id = "+cellId + ";\n "
					break;
				case 26:
					sql += "UPDATE date SET value = '" + v +"' " +" WHERE date_id = "+cellId + ";\n "
					break;
				case 22:
					sql += "UPDATE string SET value = '" + v +"' " +" WHERE string_id = "+cellId + ";\n "
					break;
				case 23:
					sql += "UPDATE integer SET value = " + v +" " +" WHERE integer_id = "+cellId + ";\n "
					break;
				}
			}else{//INSERT cell & value
				switch (columnObj.doctype) {
				case 27:
					if(reference2){
						sql += sql_1c.insertCell(editRow.row_id, columnId, i)
						sql += "UPDATE doc SET reference2 = " + reference2 +" " +" WHERE doc_id = :nextDbId"+i + " ;\n "
					}
					break;
				case 57:
					sql += sql_1c.insertCell(editRow.row_id, columnId, i)
					sql += "UPDATE doc SET reference2 = " + editRow['ref2_'+columnId] +" WHERE doc_id = :nextDbId"+i + " ;\n "
//					sql += "UPDATE doc SET reference2 = :nextDbId"+i +" WHERE doc_id = :nextDbId"+i + " ;\n "
//					sql += "INSERT INTO inn (inn, inn_id) VALUES ('"+v+"',:nextDbId"+i +" );\n"
					break;
				}
				if(v){
					switch (columnObj.doctype) {
					case 26:
						sql += sql_1c.insertCell(editRow.row_id, columnId, i)
						sql += "INSERT INTO date (value, date_id) VALUES ('"+v+"',:nextDbId" +i +" );\n"
						break;
					case 22:
						sql += sql_1c.insertCell(editRow.row_id, columnId, i)
						sql += "INSERT INTO string (value, string_id) VALUES ('"+v+"',:nextDbId" +i +" );\n"
						break;
					case 23:
						sql += sql_1c.insertCell(editRow.row_id, columnId, i)
						sql += "INSERT INTO integer (value, integer_id) VALUES ("+v+",:nextDbId" +i +" );\n"
						break;
					}
				}
				i++
			}
		})
		if(sql){
			if(rowParentId){
				sql = "INSERT INTO doc (doctype, doc_id, parent, reference) " +
				"VALUES (4, :nextDbId1, " + rowParentId
				+ ", " +this.tableId+");\n" +
				sql
			}
			/*
			sql += sql_1c.select_row($scope.table.join_select, editRow.row_id)
			 */
			console.log(sql)
			writeSql({sql : sql,
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

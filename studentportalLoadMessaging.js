var allConnectionsRef = schoolRef.child("/connections/")

function loadAllConnections(userId) {
	allConnectionsRef.once("value", function(snapshot) {
    
    	for ( connection in snapshot.val() ) {
    		if (snapshot.child(connection+"/tutor/").val() == userId) {
        		createMessagingBlock(connection)
    		}
    	}
   	})
}

function createMessagingBlock(connection) {

}

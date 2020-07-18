firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		var userDB = firebase.firestore()
		var userID = user.uid

		userDB.collection("users").onSnapshot(function(doc) {
			if(doc.get(userID+'.admin') == true) {
				console.log('yay')
			} else {
				location.href = "https://www.jointutortree.com"
			}
		})
	} else {
		location.href = "https://www.jointutortree.com"
	}
}

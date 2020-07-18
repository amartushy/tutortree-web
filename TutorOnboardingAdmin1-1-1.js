firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
	        var userDB = firebase.firestore()
	        var userID = user.uid
          
          userDB.collection("users").doc(userID)
    		      .onSnapshot(function(doc) {
                  console.log("yay")
              }

      } else {
		      location.href = "https://www.jointutortree.com"
      }
}

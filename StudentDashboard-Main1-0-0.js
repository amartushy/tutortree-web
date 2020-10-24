//Global Variables__________________________________________________________________
var userDB = firebase.firestore()

var globalID,
    coreAvailability,
    coreBio,
    coreEmail,
    coreIsEmailOn,
    coreIsSMSOn,
    coreisTutor,
    coreIsAdmin,
    coreMaxHPW,
    coreName,
    corePhone,
    corePricePHH,
    coreProfileImage,
    coreSchool,
    coreApplicantStatus,
    coursesForTutor = {}




//Initialize elements on page load
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var ID = user.uid
        
        //Check if user is admin, else redirect: TODO
        loadCoreProperties(ID)
        
    //If user is not logged in return them home
    } else {
        location.href = "https://www.tutortree.com"
    }
})


function loadCoreProperties(ID) {
    globalID = ID
	console.log(globalID)
    userDB.collection('userTest').doc(globalID).onSnapshot(function(doc) {
        var userData = doc.data()

        coreBio = userData.bio
        coreEmail = userData.email
        coreIsEmailOn = userData.isEmailOn 
        coreIsSMSOn = userData.coreIsSMSOn
	    coreIsAdmin = userData.isAdmin
        coreName = userData.name 
        corePhone = userData.phoneNumber 
        coreProfileImage = userData.profileImage 
        coreSchool = userData.school
        

		//loadHome()
	    //loadMyCourses()

    })
}

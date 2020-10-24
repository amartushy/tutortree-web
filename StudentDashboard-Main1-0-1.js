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

function getFormattedDate(timeEpoch) {
    console.log(timeEpoch)
    var time = parseFloat(timeEpoch)
    var d = new Date(0);
    d.setUTCSeconds(time);
  
    var dayLong = d.toLocaleDateString("en-US", {weekday: "long"}); 
    var month = d.toLocaleDateString("en-US", {month: "short"});
    var dayInt = d.toLocaleDateString("en-US", {day: "numeric"});

    var suffix
    if (dayInt == 1 || dayInt == 21 ||dayInt == 31) {
        suffix = "st"
    } else if( dayInt == 2 || dayInt == 22) {
        suffix = "nd"
    } else if (dayInt == 3 || dayInt == 23) {
        suffix = "rd"
    } else {
        suffix = "th"
    }
    dayWithSuffix = dayInt + suffix
    var dateObject = [dayLong, month, dayWithSuffix]
    return (dateObject)
}

function getFormattedTime(startEpoch, endEpoch) {
    console.log(startEpoch)
    var start = parseFloat(startEpoch)
    var end = parseFloat(endEpoch)
    var startTime = new Date(start*1000)
    var endTime = new Date(end*1000)

    var startHour = startTime.getHours()
    var endHour = endTime.getHours()
    var startAMPM = "am"
    var endAMPM = "am"
    if (startHour > 12) {
        startHour = startHour - 12
        startAMPM = "pm"
    }
    if (endHour > 12) {
        endHour = endHour - 12
        endAMPM = "pm"
    }

    var startMinutes = "00"
    var endMinutes = "00"
    if (startTime.getMinutes() >  0) {
        startMinutes = startTime.getMinutes()
    }
    if (endTime.getMinutes() > 0) {
        endMinutes = endTime.getMinutes()
    }
    startString = startHour + ":" + startMinutes + startAMPM
    endString = endHour + ":" + endMinutes + endAMPM

    var timeObject = [startString, endString]
    return(timeObject)
}

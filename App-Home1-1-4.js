document.getElementById("tutor-1").addEventListener('click', () => {
	location.href = "https://app-tutortree.webflow.io/tutor-profile"
})

//Global Variables__________________________________________________________________
var userDB = firebase.firestore()

var globalUserId,
    coreBio,
    coreBalance,
    coreEmail,
    coreIsEmailOn,
    coreIsSMSOn,
    coreisTutor,
    coreName,
    corePhone,
    coreProfileImage


//Initialize elements on page load
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		var ID = user.uid
		 
        loadCoreProperties(ID)
		
	//If user is not logged in return them to login screen
	} else {
		location.href = "https://app-tutortree.webflow.io/login"
	}
})

function loadCoreProperties(ID) {
    globalUserId = ID
	console.log(globalUserId)
    userDB.collection('userTest').doc(globalUserId).onSnapshot(function(doc) {
        var data = doc.data()

        coreBio = data.bio
	coreBalance = data.currentBalance    
        coreEmail = data.email
        coreIsEmailOn = data.isEmailOn 
        coreIsSMSOn = data.coreIsSMSOn
        coreisTutor = data.isTutor
        coreName = data.name 
        corePhone = data.phoneNumber 
        coreProfileImage = data.profileImage 

        loadHeader()

    })
}

function loadHeader() {

    var profileTab = document.getElementById('profile')

    while( profileTab.firstChild) {
        profileTab.removeChild(profileTab.lastChild)
    }

    var usersPhoto = document.createElement('img')
    usersPhoto.setAttribute('class', 'header-image')
    usersPhoto.src = coreProfileImage
    profileTab.appendChild(usersPhoto)

    var profileText = document.createElement('div')
    profileText.setAttribute('class', 'header-text')
    profileText.innerHTML = 'Profile'
    profileTab.appendChild(profileText)
}





const adrianProfile = document.getElementById('adrian-profile')
adrianProfile.setAttribute('onClick', 'getTutorData("wR441Js4g6RM3u8tsDe3kmujsUs2")')

const tutorProfile = document.getElementById('tutor-profile')
const homeBack = document.getElementById('home-back')

homeBack.addEventListener('click', () => {
    tutorProfile.style.display = 'none'
})

function getTutorData(tutorID) {
    tutorProfile.style.display = 'flex'


    userDB.collection('userTest').doc(tutorID).get().then(function(doc) {
        const data = doc.data()

        loadTutorProfile(data, tutorID)
        loadButtons(data, tutorID)
        //loadSimilarTutors()
        //loadReviews()
        //loadAvailability(data)
    })
}


//Filtering
//Filter variables
var gradeLevel,
    attendingSchool,
    subject,
    course

//Text displays
var tutorFilterText = document.getElementById('tutor-filter-text')
var attendingFilterText = document.getElementById('attending-filter-text')
var subjectFilterText = document.getElementById('subject-filter-text')
var courseFilterText = document.getElementById('course-filter-text')

//Grade level options
var middleSchoolOption = document.getElementById('middle-school-option')
var highSchoolOption = document.getElementById('high-school-option')
var collegeOption = document.getElementById('college-option')

collegeOption.addEventListener('click', () => {
    tutorFilterText.innerHTML = 'College'
    gradeLevel = 'college'

    loadAttendingOptions()
})

function loadAttendingOptions() {
    
    var schoolNames = []

    userDB.collection('schools').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            const schoolData = doc.data()
            const schoolPath = doc.id
            schoolNames.push([schoolPath, schoolData])

        })

        buildAttendingOptions(schoolNames)
    })

}

function buildAttendingOptions(schoolArray) {
    var attendingOptionsContainer = document.getElementById('attending-options-container')

    while (attendingOptionsContainer.firstChild) {
        attendingOptionsContainer.removeChild(attendingOptionsContainer.firstChild)
    }
    var schoolTitles = []
    schoolArray.forEach(function(school) {
        const schoolData = school[1]
        schoolTitles.push(schoolData.title)
    })

    for( i = 0; i < schoolTitles.length; i++) {
        var schoolOption = document.createElement('div')
        if (i == 0) {
            schoolOption.setAttribute('class', 'filter-option-top')
        } else if (i == schoolTitles.length - 1) {
            schoolOption.setAttribute('class', 'filter-option-bottom')
        } else {
            schoolOption.setAttribute('class', 'filter-option')
        }
        
        schoolTitle = schoolTitles[i]
        schoolOption.innerHTML = schoolTitles[i]
        schoolPath = schoolArray[i][0]
        schoolOption.setAttribute('onClick', 'loadSubjectsForSchool("' + schoolPath + '","' + schoolTitle + '")')
        attendingOptionsContainer.appendChild(schoolOption)
    }
}

function loadSubjectsForSchool(schoolPath, schoolTitle) {
    attendingSchool = schoolPath
    attendingFilterText.innerHTML = schoolTitle

    var subjectsForSchool = []

    userDB.collection('schools').doc(schoolPath).collection('courses').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            subjectsForSchool.push(doc.id) 
        })

        buildSubjectOptions(subjectsForSchool)
    })
}

function buildSubjectOptions(subjectOptions) {
    var subjectOptionsContainer = document.getElementById('subject-options-container')

    while (subjectOptionsContainer.firstChild) {
        subjectOptionsContainer.removeChild(subjectOptionsContainer.firstChild)
    }

    for (i = 0; i < subjectOptions.length; i ++ ) {
        var subjectOption = document.createElement('div')

        if (i == 0) {
            subjectOption.setAttribute('class', 'filter-option-top')
        } else if (i == subjectOptions.length - 1) {
            subjectOption.setAttribute('class', 'filter-option-bottom')
        } else {
            subjectOption.setAttribute('class', 'filter-option')
        }

        const subjectTitle = subjectOptions[i]
        subjectOption.innerHTML = subjectTitle
        subjectOption.setAttribute('onClick', 'loadCoursesForSubject("' + subjectTitle + '")')
        subjectOptionsContainer.appendChild(subjectOption)
    }
}

function loadCoursesForSubject(subjectTitle) {

    subject = subjectTitle
    subjectFilterText.innerHTML = subjectTitle

    var coursesForSubject = []

    userDB.collection('schools').doc(attendingSchool).collection('courses').doc(subjectTitle).get().then(function(doc) {
        
        const courseDict = doc.data()

        for (var course in courseDict) {
            if ( courseDict.hasOwnProperty(course) ) {
                var tutorsForCourse = []
                for (var tutor in courseDict[course].tutors) {
                    tutorsForCourse.push(tutor)
                }
                coursesForSubject.push([course, tutorsForCourse])
            }
        }

        buildCourseOptions(coursesForSubject)
    })
}

function buildCourseOptions(courseOptions) {
    console.log(courseOptions)
    var courseOptionsContainer = document.getElementById('course-options-container')

    while (courseOptionsContainer.firstChild) {
        courseOptionsContainer.removeChild(courseOptionsContainer.firstChild)
    }

    for (i = 0; i < courseOptions.length; i ++ ) {
        var courseOption = document.createElement('div')

        if (i == 0) {
            courseOption.setAttribute('class', 'filter-option-top')
        } else if (i == courseOptions.length - 1) {
            courseOption.setAttribute('class', 'filter-option-bottom')
        } else {
            courseOption.setAttribute('class', 'filter-option')
        }

        const courseTitle = courseOptions[i][0]
        courseOption.innerHTML = courseTitle
        const tutorsForCourse = courseOptions[i][1]
        courseOption.setAttribute('onClick', 'loadTutorsForCourse("' + courseTitle + '","' + tutorsForCourse + '")')
        courseOptionsContainer.appendChild(courseOption)
    }
}

function loadTutorsForCourse(courseTitle, tutorsForCourse) {
    var tutorPreviewsContainer = document.getElementById('tutor-previews-container')

    while (tutorPreviewsContainer.firstChild) {
        tutorPreviewsContainer.removeChild(tutorPreviewsContainer.firstChild)
    }
    
    var tutorsArray = tutorsForCourse.split(",")

    courseFilterText.innerHTML = courseTitle
    tutorsArray.forEach(function(tutor) {

        userDB.collection('userTest').doc(tutor).get().then(function(doc) {
            const tutorData = doc.data()

            buildTutorPreview(tutor, tutorData)
        })
    })
}

function buildTutorPreview(tutorID, tutorData) {
    var tutorPreviewsContainer = document.getElementById('tutor-previews-container')

    const tutorPreviewDiv = document.createElement('div')
    tutorPreviewDiv.setAttribute('class', 'tutor-preview-div')
    tutorPreviewsContainer.appendChild(tutorPreviewDiv)

    const tutorPreviewImage = document.createElement('img')
    tutorPreviewImage.setAttribute('class', 'tutor-preview-image')
    tutorPreviewImage.src = tutorData.profileImage
    tutorPreviewDiv.appendChild(tutorPreviewImage)

    const tutorPreviewInfoDiv = document.createElement('div')
    tutorPreviewInfoDiv.setAttribute('class', 'tutor-preview-info-div')
    tutorPreviewDiv.appendChild(tutorPreviewInfoDiv)

    const tutorPreviewName = document.createElement('div')
    tutorPreviewName.setAttribute('class', 'tutor-preview-name')
    tutorPreviewName.innerHTML = tutorData.name 
    tutorPreviewInfoDiv.appendChild(tutorPreviewName)

    const tutorPreviewSchool = document.createElement('div')
    tutorPreviewSchool.setAttribute('class', 'tutor-preview-school')
    tutorPreviewSchool.innerHTML = tutorData.school 
    tutorPreviewInfoDiv.appendChild(tutorPreviewSchool)
}



//Profile____________________________________________________________________________________________________________________________________________________



async function loadTutorProfile(data, ID) {
    //Load image
    const tutorContainer = document.getElementById('tutor-image-container')
    tutorContainer.removeChild(tutorContainer.firstChild)
    var tutorImage = document.createElement('img')
    tutorImage.setAttribute('class', 'tutor-profile-image')
    tutorImage.src = data.profileImage
    tutorContainer.appendChild(tutorImage)

    //get first name
    var tutorsName = data.name 
    const nameArray = tutorsName.split(" ")
    const firstName = nameArray[0]

    //load name, school, major, bio
    document.getElementById('tutor-profile-name').innerHTML = data.name
    document.getElementById('tutor-profile-school').innerHTML = await getSchoolName(data.school)
    document.getElementById('tutor-profile-name').innerHTML = tutorsName
    document.getElementById('tutor-profile-major').innerHTML = data.major
    document.getElementById('bio-header').innerHTML = 'Meet ' + firstName
    document.getElementById('tutor-profile-bio').innerHTML = data.bio

    //load sessions and average
    document.getElementById('tutor-profile-sessions').innerHTML = await getCountOfSessions(ID)
    document.getElementById('tutor-profile-average').innerHTML = await getRatingForUser(ID)

    //load hourly
    document.getElementById('tutor-profile-hourly').innerHTML = data.pricePHH * 2

}

function loadButtons(data, tutorID) {
    //load favorite button

    //load report button

    //load message button
    document.getElementById('message-button').addEventListener('click', () => {
        openMessageModal(data, tutorID)
    })

    //load book session button
    const sessionBookingPage = document.getElementById('session-booking-page')
    const bookSessionButton = document.getElementById('book-session-button')
    const profileBackButton = document.getElementById('profile-back-button')

    bookSessionButton.addEventListener('click', () => {
    	sessionBookingPage.style.display = 'flex'
    	tutorProfile.style.display = 'none'
	
	loadBookingPageFromData(data, tutorID)
    })

    profileBackButton.addEventListener('click', () => {
    	tutorProfile.style.display = 'flex'
    	sessionBookingPage.style.display = 'none'
    })
	
}

function openMessageModal(data, tutorID) {
    const messageModalClose = document.getElementById('message-modal-close')
    const messageModal = document.getElementById('message-modal')
    const messageModalHeader = document.getElementById('message-modal-header')
    const messageSendButton = document.getElementById('send-button')
    const messageDiv = document.getElementById('message-div')
    const messageCompletionDiv = document.getElementById('message-completion-div')

    messageModal.style.display = 'flex'
    messageDiv.style.display = 'flex'
    messageCompletionDiv.style.display = 'none'

    var tutorsName = data.name 
    const nameArray = tutorsName.split(" ")
    const firstName = nameArray[0]
    messageModalHeader.innerHTML = 'Message ' + firstName

    messageModalClose.addEventListener('click', () => {
        messageModal.style.display = 'none'
    })

    messageSendButton.addEventListener('click', () => {
        updateConnections(data, tutorID)
        messageDiv.style.display = 'none'
        messageCompletionDiv.style.display = 'flex'
    })
}

function updateConnections(data, tutorID) {
    const connectionID = tutorID + ":" + globalUserId

    var messageRef = userDB.collection('messages').doc(connectionID)
    messageRef.get().then(function(doc) {
        if (doc.exists) {
            //If connection exists then add to messages collection
            console.log("Document Exists:", doc.data())
            sendConnectionMessage(tutorID, connectionID, "student")
        } else {
            //if not, create document and add fields and messages collection
            console.log("Document does not exist, creating new one")
            var updateDict = {
                "members" : [globalUserId, tutorID],
                "student" : globalUserId,
                "tutor" : tutorID
            }
            userDB.collection('messages').doc(connectionID).set(updateDict).then(function() {
                sendConnectionMessage(tutorID, connectionID, "student")
            })
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function sendConnectionMessage(otherID, connectionID, senderType) {
    var today = new Date()
    var timeStamp = (today.getTime() / 1000).toString()
    var updateDict = {
        'message' : document.getElementById('message-field').value,
        'sender' : globalUserId,
        'senderType' : senderType
    }
    userDB.collection('messages').doc(connectionID).collection('messages').doc(timeStamp).set(updateDict)
    sendMessagingNotifications(otherID, coreName, document.getElementById('message-field').value)
    document.getElementById('message-field').value = ""
}

function sendMessagingNotifications(otherID, currentName, message) {
    userDB.collection('userTest').doc(otherID).get().then(function(doc) {
        var userData = doc.data()

        var isSMSOn = userData.isSMSOn
        var isPushOn = userData.isPushOn

        if(isSMSOn) {
            var phoneNumber = userData.phoneNumber
            var smsMessage = "New Message From " + currentName + ": " + message
            sendSMSTo(phoneNumber, smsMessage)
        }

        if(isPushOn) {
            var token = userData.pushToken
            var title = "New Message From " + currentName
            sendPushTo(token, title, message)
        }
    })
}

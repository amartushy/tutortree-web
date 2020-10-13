

//Global Variables__________________________________________________________________
var userDB = firebase.firestore()

var globalTutorID,
    coreAvailability,
    coreBio,
    coreEmail,
    coreIsEmailOn,
    coreIsSMSOn,
    coreisTutor,
    coreMaxHPW,
    coreName,
    corePhone,
    corePricePHH,
    coreProfileImage,
    coreSchool,
    coreApplicantStatus

//Elements__________________________________________________________________________

//Tabs
var home = document.getElementById('tab-home')
var profile = document.getElementById('tab-profile')
var upcoming = document.getElementById('tab-upcoming')
var messages = document.getElementById('tab-messages')
var myCourses = document.getElementById('tab-courses')
var availability = document.getElementById('tab-availability')
var settings = document.getElementById('tab-settings')

home.addEventListener('click', function(){
    loadHome()
})
profile.addEventListener('click', function(){
    loadProfile()
})

//Home
var schoolHeaderHome = document.getElementById('school-header-home')
var featuredTutorsArea = document.getElementById('featured-tutors-area')
var tutorsOnCampus = document.getElementById('tutors-on-campus')

//Profile
var hiddenPhotoUploadButton = document.getElementById('hidden-photo-upload-button')
var profileImageBlock = document.getElementById('profile-image-block')
var tutorsProfilePhoto = document.getElementById('tutors-profile-photo')
var tutorsName = document.getElementById('tutors-name')
var sessionsText = document.getElementById('sessions-text')
var averageText = document.getElementById('average-text')
var hourlyText = document.getElementById('hourly-text')
var tutorsBio = document.getElementById('tutors-bio')
var updateProfileBlock = document.getElementById('update-profile-block')
var updateProfile = document.getElementById('update-profile')

//Upcoming
var noPastSessions = document.getElementById('no-past-sessions')
var noPendingSessions = document.getElementById('no-pending-sessions')
var noUpcomingSessions = document.getElementById('no-upcoming-sessions')
var pastSessionsArea = document.getElementById('past-sessions-area')
var pendingSessionsArea = document.getElementById('pending-sessions-area')
var upcomingSessionsArea = document.getElementById('upcoming-sessions-area')

//Messages
var connectionsArea = document.getElementById('connections-area')
var messagesHeader = document.getElementById('messages-header')
var messagesArea = document.getElementById('messages-area')
var messagesField = document.getElementById('messages-field')
var sendMessage = document.getElementById('send-message')

//My Courses
var coursesSchoolHeader = document.getElementById('courses-school-header')
var subjectsAreaCourses = document.getElementById('subjects-area-courses')

//Settings
var priceText = document.getElementById('price-text')
var priceMinus = document.getElementById('price-minus')
var pricePlus = document.getElementById('price-plus')
var maxText = document.getElementById('max-text')
var maxMinus = document.getElementById('max-minus')
var maxPlus = document.getElementById('max-plus')
var emailToggle = document.getElementById('email-toggle')
var emailField = document.getElementById('email-field')
var smsToggle = document.getElementById('sms-toggle')
var smsField = document.getElementById('sms-field')
var transactionsButton = document.getElementById('transactions-button')
var depositButton = document.getElementById('deposit-button')
var withdrawButton = document.getElementById('withdraw-button')
var signOutButton = document.getElementById('sign-out-button')
var tosButton = document.getElementById('tos-button')
var contactUsButton = document.getElementById('contact-us-button')

//Tutor Applicant Sidebar
var tutorApplicantImage = document.getElementById('tutor-applicant-image')
var applicantPending = document.getElementById('applicant-pending')
var applicantWaitlisted = document.getElementById('applicant-waitlisted')
var applicantRejected = document.getElementById('applicant-rejected')
var applicantRApproved = document.getElementById('applicant-approved')
var scheduleInterview = document.getElementById('schedule-interview')
var interviewIncomplete = document.getElementById('interview-incomplete')
var interviewComplete = document.getElementById('interview-complete')
var uploadTranscript = document.getElementById('upload-transcript')
var transcriptIncomplete = document.getElementById('transcript-incomplete')
var transcriptComplete = document.getElementById('transcript-complete')
var uploadFaculty = document.getElementById('upload-faculty')
var facultyIncomplete = document.getElementById('faculty-incomplete')
var facultyComplete = document.getElementById('faculty-complete')

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
    globalTutorID = ID

    userDB.collection('userTest').doc(globalTutorID).onSnapshot(function(doc) {
        var data = doc.data()

        coreAvailability = data.availability
        coreBio = data.bio
        coreEmail = data.email
        coreIsEmailOn = data.isEmailOn 
        coreIsSMSOn = data.coreIsSMSOn
        coreisTutor = data.isTutor
        coreMaxHPW = data.maxHPW 
        coreName = data.name 
        corePhone = data.phoneNumber 
        corePricePHH = data.pricePHH 
        coreProfileImage = data.profileImage 
        coreSchool = data.school
        coreApplicantStatus = data.tutorApplicantStatus

        loadHome()
        
    })
}

//Home Functions _____________________________________________________________________________

function loadHome() {
    userDB.collection('schools').doc(coreSchool).get().then(function(school) {
        //Set Header
        schoolHeaderHome.innerHTML = school.data().title

        //Set Featured Tutors
        while(featuredTutorsArea.firstChild) {
			featuredTutorsArea.removeChild(featuredTutorsArea.firstChild)
        }
        
        var featuredTutors = school.data().featured
        for (var tutor in featuredTutors) {
            if (featuredTutors.hasOwnProperty(tutor)) {           
                buildFeaturedTutor(tutor)
            }
        }
    })

    //set courses
    buildTutorsOnCampus(coreSchool)
}

function buildFeaturedTutor(featuredID) {
    //Create Elements
    var featuredTutorBlock = document.createElement('div')
    var featuredTutorImage = document.createElement('img')
    var featuredTutorName = document.createElement('div')
    var featuredTutorRatingBlock = document.createElement('div')
    var featuredTutorStar = document.createElement('div')
    var featuredTutorRating = document.createElement('div')

    //Set Attributes
    featuredTutorBlock.setAttribute('class', 'featured-tutor-block')
    featuredTutorImage.setAttribute('class', 'featured-tutor-image')
    featuredTutorName.setAttribute('class', 'featured-tutor-name')
    featuredTutorRatingBlock.setAttribute('class', 'featured-tutor-rating-block')
    featuredTutorStar.setAttribute('class', 'featured-tutor-star')
    featuredTutorRating.setAttribute('class', 'featured-tutor-rating')

    //Append Childs
    featuredTutorsArea.appendChild(featuredTutorBlock)
    featuredTutorBlock.appendChild(featuredTutorImage)
    featuredTutorBlock.appendChild(featuredTutorName)
    featuredTutorBlock.appendChild(featuredTutorRatingBlock)
    featuredTutorRatingBlock.appendChild(featuredTutorStar)
    featuredTutorRatingBlock.appendChild(featuredTutorRating)

    userDB.collection('userTest').doc(featuredID).get().then(async function(doc) {
        var name = doc.data().name 
        var image = doc.data().profileImage 

        featuredTutorStar.innerHTML = ''
        featuredTutorName.innerHTML = name
        featuredTutorImage.src = image

        //TODO
        featuredTutorRating.innerHTML = await getRatingForUser(featuredID)

    })
}

function buildTutorsOnCampus(school) {

    while(tutorsOnCampus.firstChild) {
        tutorsOnCampus.removeChild(tutorsOnCampus.firstChild)
    }

    userDB.collection("schools").doc(school).collection('courses').onSnapshot(function(subject) {
        subject.forEach(function(doc) {
            buildSubjectBlock(school, doc.id, doc.data())
        })
    })
}


async function buildSubjectBlock(schoolTitle, subject, courseDict) {
        
        var subjectBlock = document.createElement('div')
        var subjectHeader = document.createElement('h4')
        var coursesBlock = document.createElement('div')

        subjectBlock.setAttribute('class','subject-block')
        subjectHeader.setAttribute('class', 'subject-header')
        coursesBlock.setAttribute('class', 'courses-block')

        subjectHeader.innerHTML = subject

        tutorsOnCampus.appendChild(subjectBlock)
        subjectBlock.appendChild(subjectHeader)
        subjectBlock.appendChild(coursesBlock)

        for (var course in courseDict) {
            if (courseDict.hasOwnProperty(course)) {
                var courseBlockHome = document.createElement('div')
                var courseTitleHome = document.createElement('div')
                
                courseBlockHome.setAttribute('class', 'course-block-home')
                courseTitleHome.setAttribute('class', 'course-title-home')

                courseTitleHome.innerHTML = course

                courseBlockHome.appendChild(courseTitleHome)
                coursesBlock.appendChild(courseBlockHome)

                for (var tutor in courseDict[course].tutors) {

                    var otherTutorHome = document.createElement('div')
                    var tutorImageHome = document.createElement('img')
                    var otherTutorName = document.createElement('div')

                    otherTutorHome.setAttribute('class', 'other-tutor-home')
                    tutorImageHome.setAttribute('class', 'tutor-image-home')
                    otherTutorName.setAttribute('class', 'other-tutor-name')
                    
                    courseBlockHome.appendChild(otherTutorHome)
                    otherTutorHome.appendChild(tutorImageHome)
                    otherTutorHome.appendChild(otherTutorName)

                    await userDB.collection('userTest').doc(tutor).get().then(function(doc) {
                        tutorImageHome.src = doc.data().profileImage
                        otherTutorName.innerHTML = doc.data().name
                    })
                }
            }
        }
}

async function getRatingForUser(ID) {
    var rating = 0

    await userDB.collection('userTest').doc(ID).collection('sessions').get().then(function(session) {
        var ratingSum = 0
        var sessionsWithRating = 0

        session.forEach(function(doc) {
            if(doc.data().ratingFromOtherUser != null) {
                ratingSum += doc.data().ratingFromOtherUser
                sessionsWithRating += 1
                rating = ratingSum / sessionsWithRating
            }
        })
    })

    if (rating == 0) {
        return ('NEW')
    } else {
        return rating.toFixed(2)
    }
}

async function getCountOfSessions(ID) {
    var sessions = 0

    await userDB.collection('userTest').doc(ID).collection('sessions').get().then(function(session) {

        session.forEach(function(doc) {
            sessions += 1
        })
    })

    return sessions
}


//Profile functions_____________________________________________________________________________

function loadProfile() {

    userDB.collection('userTest').doc(globalTutorID).get().then(async function(doc) {
        var tutorData = doc.data()
        var tutorsRating = await getRatingForUser(globalTutorID)
        var sessionsCount = await getCountOfSessions(globalTutorID)

        //create Photo element because setting src doesn't work :/
		profileImageBlock.removeChild(profileImageBlock.firstChild)
        var tutorsProfilePhoto = document.createElement('img') 
        tutorsProfilePhoto.setAttribute('class', 'upload-image')
        tutorsProfilePhoto.src = tutorData.profileImage
        tutorsProfilePhoto.addEventListener('click', openPhotoUploadDialog)

        profileImageBlock.appendChild(tutorsProfilePhoto)

        tutorsName.value = tutorData.name
        sessionsText.innerHTML = sessionsCount
        averageText.innerHTML = tutorsRating
        hourlyText.innerHTML = '$' + tutorData.pricePHH * 2
        tutorsBio.value = tutorData.bio

        tutorsBio.onfocus = function() {
            updateProfileBlock.style.display = 'flex'
        }

        tutorsName.onfocus = function() {
            updateProfileBlock.style.display = 'flex'
        }

    })

    updateProfile.addEventListener('click', function() {
        var newName = tutorsName.value
        var newBio = tutorsBio.value

        userDB.collection("userTest")
		.doc(globalTutorID)
        .update( {"name" : newName,
                    "bio" : newBio })     
                    
    updateProfileBlock.style.display = 'none'
    })
}

//Photo Upload
storageRef = storageService.ref()

function openPhotoUploadDialog() {
	hiddenPhotoUploadButton.click();
}

hiddenPhotoUploadButton.addEventListener('change', uploadProfileImage);

var selectedPhotoFile;
function uploadProfileImage(e) {
    selectedPhotoFile = e.target.files[0];
    handlePhotoUpload()
}

async function handlePhotoUpload() {
	const uploadTask = await storageRef.child(`images/${selectedPhotoFile.name}`).put(selectedPhotoFile);
	uploadAndUpdateFirebasePhoto()
}

//final submit button and update firebase
async function uploadAndUpdateFirebasePhoto() {
	var phototFileURL = ""
	await storageRef.child('/images/'+selectedPhotoFile.name)
		.getDownloadURL()
		.then(function(url) { phototFileURL = url.toString() })
	userDB.collection("userTest")
		.doc(globalTutorID)
        .update( {"profileImage" : phototFileURL })
        .then(function() {
            userDB.collection('userTest').doc(globalTutorID).get().then(async function(doc) {
                profileImageBlock.removeChild(profileImageBlock.firstChild)
                
                var tutorsProfilePhoto = document.createElement('img') 
                tutorsProfilePhoto.setAttribute('class', 'upload-image')
                tutorsProfilePhoto.src = doc.data().profileImage
                tutorsProfilePhoto.addEventListener('click', function() {
                    uploadProfileImage()
                })
                profileImageBlock.appendChild(tutorsProfilePhoto)
            })
        })
}

//My Courses___________________________________________________________________________________________________________

myCourses.addEventListener('click', function(){
    loadMyCourses()
})

async function loadMyCourses() {

    userDB.collection('schools').doc(coreSchool).get().then(async function(school) {
        //Set Header
        coursesSchoolHeader.innerHTML = school.data().title

        //Load Subject
        await userDB.collection("schools").doc(coreSchool).collection('courses').onSnapshot(function(subject) {
            while(subjectsAreaCourses.firstChild) {
                subjectsAreaCourses.removeChild(subjectsAreaCourses.firstChild)
            }
            
            subject.forEach(function(doc) {
                buildMySubjects(school, doc.id, doc.data())
            })
        })
    })
}

function buildMySubjects(schoolPath, subjectTitle, courseDict) {
    var subjectBlock = document.createElement('div')
    var subjectHeader = document.createElement('h4')
    var myCoursesBlock = document.createElement('div')
    
    subjectBlock.setAttribute('class', 'subject-block')
    subjectHeader.setAttribute('class', 'subject-header')
    myCoursesBlock.setAttribute('class', 'my-courses-block')

    subjectsAreaCourses.appendChild(subjectBlock)
    subjectBlock.appendChild(subjectHeader)
    subjectBlock.appendChild(myCoursesBlock)

    subjectHeader.innerHTML = subjectTitle

    for (var course in courseDict) {
        if (courseDict.hasOwnProperty(course)) {
            var courseBlock = document.createElement('div')
            courseBlock.setAttribute('class', 'course-block')
            courseBlock.innerHTML = course
            myCoursesBlock.appendChild(courseBlock)
            courseBlock.setAttribute('onClick', 'updateTutorForCourse("' + subjectTitle + '","' + course  + '")')

            for (var tutor in courseDict[course].tutors) {
                if(tutor == globalTutorID) {
                    courseBlock.setAttribute('class', 'course-block-selected')
                }
            }
        }
    }
}

function updateTutorForCourse(subject, course) {
    console.log(subject)
    console.log(course)
    userDB.collection('schools').doc(coreSchool).collection('courses').doc(subject).get().then(function(doc) {
        const courseInfo = doc.data()

        var numTutors = courseInfo[course].info.numTutors
        var isTutor = false

        if (courseInfo[course].tutors != null) {
        	isTutor = courseInfo[course]["tutors"][globalTutorID] != null
        }

        if (isTutor) {
            var tutorPath =  course  + '.tutors.' + globalTutorID 
            var tutorDict = {}
            tutorDict[tutorPath] = firebase.firestore.FieldValue.delete()
            userDB.collection('schools').doc(coreSchool).collection('courses').doc(subject).update( tutorDict )

            numTutors = numTutors - 1
            var numTutorPath = course + '.info.numTutors' 
            var numTutorDict = {}
            numTutorDict[numTutorPath] = numTutors
            userDB.collection('schools').doc(coreSchool).collection('courses').doc(subject).update( numTutorDict )

        } else {
            var tutorPath = course + '.tutors.' + globalTutorID 
            var tutorDict = {}
            tutorDict[tutorPath] = globalTutorID
            userDB.collection('schools').doc(coreSchool).collection('courses').doc(subject).update( tutorDict )

            numTutors = numTutors + 1
            var numTutorPath = course + '.info.numTutors' 
            var numTutorDict = {}
            numTutorDict[numTutorPath] = numTutors
            userDB.collection('schools').doc(coreSchool).collection('courses').doc(subject).update( numTutorDict )
        }
    })
}

//Availability Functions____________________________________________________________________________________________
var updateAvailabilityButton = document.getElementById('update-availability-button')
var mondayArray,
    tuesdayArray,
    wednesdayArray,
    thursdayArray,
    fridayArray,
    saturdayArray,
    sundayArray
var availabilityArray
var dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
var timeOptions = ["6:00am", "6:30am", "7:00am", "7:30am", "8:00am","8:30am", "9:00am", "9:30am", "10:00am", "10:30am",
                    "11:00am", "11:30am", "12:00pm", "12:30pm", "1:00pm", "1:30pm", "2:00pm", "2:30pm", "3:00pm", "3:30pm", 
                    "4:00pm", "4:30pm", "5:00pm", "5:30pm", "6:00pm", "6:30pm", "7:00pm", "7:30pm", "8:00pm", "8:30pm", 
                    "9:00pm", "9:30pm", "10:00pm", "10:30pm", "11:00pm", "11:30pm", "12:00am"]

availability.addEventListener('click', function(){
    updateAvailabilityButton.style.display = 'none'

    loadAvailability()
})

function loadAvailability() {

    userDB.collection('userTest').doc(globalTutorID).get().then(function(doc) {
        var availability = doc.data().availability
        
        mondayArray = twosComplement(availability.Monday).split("")
        tuesdayArray = twosComplement(availability.Tuesday).split("")
        wednesdayArray = twosComplement(availability.Wednesday).split("")
        thursdayArray = twosComplement(availability.Thursday).split("")
        fridayArray = twosComplement(availability.Friday).split("")
        saturdayArray = twosComplement(availability.Saturday).split("")
        sundayArray = twosComplement(availability.Sunday).split("")

        availabilityArray = [mondayArray, tuesdayArray, wednesdayArray, thursdayArray, fridayArray, saturdayArray, sundayArray]
        loadButtons()
    })
}

function loadButtons() {

    for( day = 0; day < 7; day ++) {
        
        var dayObject = document.getElementById(dayOptions[day]+ '-timeslots')

        while(dayObject.firstChild) {
            dayObject.removeChild(dayObject.firstChild)
        }
        
        for ( time = 0; time < 36; time ++ ) {
            var timeSlot = document.createElement('div')
            timeSlot.innerHTML = timeOptions[time]
            dayObject.appendChild(timeSlot)
            timeSlot.setAttribute('onclick', 'flipAvailability("'+ day + '","' + time + '")')
            if (availabilityArray[day][time] == "1") {
                timeSlot.setAttribute('class', 'available')
            } else {
                timeSlot.setAttribute('class', 'unavailable')
            }
        }
    }
}

function flipAvailability(day, time) {
    updateAvailabilityButton.style.display = 'flex'

    if(availabilityArray[day][time] == "1") { 
        availabilityArray[day][time] = "0"
    } else if (availabilityArray[day][time] == "0") {
        availabilityArray[day][time] = "1"
    }
    
    loadButtons()
}

updateAvailabilityButton.addEventListener('click', function() {
    var decimalAvailabilityArray = []

    for( i = 0; i < 7; i++ ) {
        var binaryString = '0000000000000000' + availabilityArray[i].join('')
        const decimalAvailability = parseInt( binaryString, 2)
        var updateDayPath = 'availability.' + dayOptions[i]
        var updateDay = {}
        updateDay[updateDayPath] = decimalAvailability
        userDB.collection('userTest').doc(globalTutorID).update(updateDay)
    }
    updateAvailabilityButton.style.display = 'none'
})

function twosComplement(value) {
    let binaryStr;
    
    if (value >= 0) {
      let twosComp = value.toString(2);
      binaryStr = padAndChop(twosComp, '0', (64 || twosComp.length));
    } else {
      binaryStr = (Math.pow(2, 64) + value).toString(2);
      
      if (Number(binaryStr) < 0) {
        return undefined
      }
    }
    
    return binaryStr.slice(16,64)
}

function padAndChop(str, padChar, length) {
    return (Array(length).fill(padChar).join('') + str).slice(length * -1);
}





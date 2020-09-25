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
var tutorsProfilePhoto = document.getElementById('tutors-profile-photo')
var tutorsName = document.getElementById('tutors-name')
var sessionsText = document.getElementById('sessions-text')
var averageText = document.getElementById('average-text')
var hourlyText = document.getElementById('hourly-text')
var tutorsBio = document.getElementById('tutors-bio')

//Upcoming
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

    userDB.collection('userTest').doc(featuredID).get().then(function(doc) {
        var name = doc.data().name 
        var image = doc.data().profileImage 

        featuredTutorStar.innerHTML = 'star'
        featuredTutorName.innerHTML = name
        featuredTutorImage.src = image

        //TODO
        featuredTutorRating.innerHTML = getRatingForUser(featuredID)

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
                ratingSum += session.ratingFromOtherUser
                sessionsWithRating += 1
                rating = ratingSum / sessionsWithRating
            }
        })
    })

    if (rating == 0) {
        return ('NEW')
    } else {
        return rating
    }
}

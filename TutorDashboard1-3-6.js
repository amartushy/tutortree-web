

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
    coreApplicantStatus,
    coursesForTutor = {}

//Elements__________________________________________________________________________

//Tabs
var home = document.getElementById('tab-home')
var profile = document.getElementById('tab-profile')
var upcoming = document.getElementById('tab-upcoming')
var messages = document.getElementById('tab-messages')
var myCourses = document.getElementById('tab-courses')
var availability = document.getElementById('tab-availability')
var settings = document.getElementById('tab-settings')


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
	console.log(globalTutorID)
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
        
        if (coreSchool == "Invalid School") {
            chooseSchoolModal.style.display = 'flex'
        }

        loadHome()
	    loadMyCourses()
    })
}

//Handle if the tutor has not yet selected a school
var chooseSchoolModal = document.getElementById('choose-school-modal')
var ucsdButton = document.getElementById('ucsd-button')
var ucsbButton = document.getElementById('ucsb-button')
var uscButton = document.getElementById('ucsd-button')
var oregonstateButton = document.getElementById('ucsd-button')
var sjsuButton = document.getElementById('ucsd-button')
var uoregonButton = document.getElementById('ucsd-button')
var stanfordButton = document.getElementById('ucsd-button')
var sdsuButton = document.getElementById('ucsd-button')
var uclaButton = document.getElementById('ucla-button')
var berkeleyButton = document.getElementById('ucsd-button')
var pepperdineButton = document.getElementById('ucsd-button')

ucsdButton.addEventListener('click', function() {
    updateUsersSchool('ucsd')
})
ucsbButton.addEventListener('click', function() {
    updateUsersSchool('ucsb')
})
uscButton.addEventListener('click', function() {
    updateUsersSchool('usc')
})
oregonstateButton.addEventListener('click', function() {
    updateUsersSchool('oregonstate')
})
sjsuButton.addEventListener('click', function() {
    updateUsersSchool('sjsu')
})
uoregonButton.addEventListener('click', function() {
    updateUsersSchool('uoregon')
})
stanfordButton.addEventListener('click', function() {
    updateUsersSchool('stanford')
})
sdsuButton.addEventListener('click', function() {
    updateUsersSchool('sdsu')
})
uclaButton.addEventListener('click', function() {
    updateUsersSchool('ucla')
})
berkeleyButton.addEventListener('click', function() {
    updateUsersSchool('berkeley')
})
pepperdineButton.addEventListener('click', function() {
    updateUsersSchool('pepperdine')
})


function updateUsersSchool(school) {
    userDB.collection('userTest').doc(globalTutorID).update({'school' : school}).then(function() {
        loadCoreProperties()
        chooseSchoolModal.style.display = 'none'
    })
}



//My Courses___________________________________________________________________________________________________________

async function loadMyCourses() {

    userDB.collection('schools').doc(coreSchool).get().then(async function(school) {
        //Set Header
        coursesSchoolHeader.innerHTML = school.data().title

        //Load Subject
        await userDB.collection("schools").doc(coreSchool).collection('courses').onSnapshot(function(subject) {
		coursesForTutor = {}
		
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
                    
                    if ( subjectTitle in coursesForTutor ) {
                    	var array = coursesForTutor[subjectTitle]
                      array.push(course)
                      coursesForTutor[subjectTitle] = array
                    } else {
                    	var array = [course]
                    	coursesForTutor[subjectTitle] = array
                    }
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
            userDB.collection('schools').doc(coreSchool).collection('courses').doc(subject).update( tutorDict ).then(function() {
		    loadProfileCourses()
	    })

            numTutors = numTutors - 1
            var numTutorPath = course + '.info.numTutors' 
            var numTutorDict = {}
            numTutorDict[numTutorPath] = numTutors
            userDB.collection('schools').doc(coreSchool).collection('courses').doc(subject).update( numTutorDict )

        } else {
            var tutorPath = course + '.tutors.' + globalTutorID 
            var tutorDict = {}
            tutorDict[tutorPath] = globalTutorID
            userDB.collection('schools').doc(coreSchool).collection('courses').doc(subject).update( tutorDict ).then(function() {
		    loadProfileCourses()
	    })

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





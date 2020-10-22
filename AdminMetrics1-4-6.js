var schoolDB = firebase.firestore()

var oregonstate = document.getElementById('oregonstate')
var ucsb = document.getElementById('ucsb')
var sjsu = document.getElementById('sjsu')
var uoregon = document.getElementById('uoregon')
var stanford = document.getElementById('stanford')
var csun = document.getElementById('csun')
var ucla = document.getElementById('ucla')
var pepperdine = document.getElementById('pepperdine')
var berkeley = document.getElementById('berkeley')
var ucsd = document.getElementById('ucsd')
var sdsu = document.getElementById('sdsu')
var usc = document.getElementById('usc')
var tutortree = document.getElementById('tutortree')

oregonstate.setAttribute('onClick', 'showTutorsForSchool("oregonstate")')
ucsb.setAttribute('onClick', 'showTutorsForSchool("ucsb")')
sjsu.setAttribute('onClick', 'showTutorsForSchool("sjsu")')
uoregon.setAttribute('onClick', 'showTutorsForSchool("uoregon")')
stanford.setAttribute('onClick', 'showTutorsForSchool("stanford")')
csun.setAttribute('onClick', 'showTutorsForSchool("csun")')
ucla.setAttribute('onClick', 'showTutorsForSchool("ucla")')
pepperdine.setAttribute('onClick', 'showTutorsForSchool("pepperdine")')
berkeley.setAttribute('onClick', 'showTutorsForSchool("berkeley")')
ucsd.setAttribute('onClick', 'showTutorsForSchool("ucsd")')
sdsu.setAttribute('onClick', 'showTutorsForSchool("sdsu")')
usc.setAttribute('onClick', 'showTutorsForSchool("usc")')
tutortree.setAttribute('onClick', 'showTTMetrics()')

var subjectArea = document.getElementById('subject-area')

var totalTutors = 0
var totalCourses = 0
var totalCoursesWithTutors = 0
var totalCumulativeCount = 0

function showTTMetrics() {
    totalTutors = 0
    totalCourses = 0
    totalCoursesWithTutors = 0
    totalCumulativeCount = 0
    
    schoolDB.collection("schools").onSnapshot(function(school) {
        while(subjectArea.firstChild) {
            subjectArea.removeChild(subjectArea.firstChild)
        }
        var tutortreeMetrics = document.createElement('div')
        tutortreeMetrics.setAttribute('class', 'tutortree-metrics')
        tutortreeMetrics.setAttribute('id', 'tutortree-metrics-block')
        
        subjectArea.appendChild(tutortreeMetrics)
        
        var counter = 0
        school.forEach(function(doc) {
            var schoolTitle = doc.data().title
            var schoolPath = doc.id
            getTutors(schoolPath, schoolTitle)

        })
    })
}

function buildTutortreeMetrics() {
    var tutortreeBlock = document.createElement('div')
    tutortreeBlock.setAttribute('class', 'tutortree-metrics-header')
    document.getElementById('tutortree-metrics-block').appendChild(tutortreeBlock)
    
    var tutortreeHeader = document.createElement('h3') 
    tutortreeHeader.setAttribute('class', 'school-title')
    tutortreeBlock.appendChild(tutortreeHeader)
    tutortreeHeader.innerHTML = "TUTORTREE"
    
    var tutortreeMetricsBlock = document.createElement('div')
    tutortreeMetricsBlock.setAttribute('class', 'metrics-block')
    tutortreeBlock.appendChild(tutortreeMetricsBlock)

    var totalTutorsHeader = document.createElement('h3')
    totalTutorsHeader.setAttribute('class', 'metrics-header')
    tutortreeMetricsBlock.appendChild(totalTutorsHeader)
    totalTutorsHeader.innerHTML = totalTutors + " Total Tutors"
    
    var totalCoursesHeader = document.createElement('h4')
    totalCoursesHeader.setAttribute('class', 'metrics-subheader')
    tutortreeMetricsBlock.appendChild(totalCoursesHeader)
    totalCoursesHeader.innerHTML = totalCourses + " Total Courses"

    var totalCoursesWithTutorsHeader = document.createElement('h4')
    totalCoursesWithTutorsHeader.setAttribute('class', 'metrics-subheader')
    tutortreeMetricsBlock.appendChild(totalCoursesWithTutorsHeader)
    totalCoursesWithTutorsHeader.innerHTML = totalCoursesWithTutors + " Courses With Tutors"
    
    var totalCumulativeCountHeader = document.createElement('h4')
    totalCoursesWithTutorsHeader.setAttribute('class', 'metrics-subheader')
    tutortreeMetricsBlock.appendChild(totalCumulativeCountHeader)
    totalCumulativeCountHeader.innerHTML = totalCumulativeCount + " Cumulative Tutor-Courses"
}

async function getTutors(schoolPath, schoolTitle) {
    var tutorsArray = []
    var countOfTutors = 0
    var coursesCount = 0
    var coursesWithTutors = 0
    var cumulativeCount = 0
    await schoolDB.collection("schools").doc(schoolPath).collection('courses').onSnapshot(function(subjects) {
        subjects.forEach(function(subject) {
            var courseDict = subject.data()
            for ( var course in courseDict ) {
                if (courseDict.hasOwnProperty(course)) {
                    coursesCount += 1
                    if( courseDict[course].info.numTutors != 0) {
                        coursesWithTutors += 1
                    }
                    cumulativeCount += courseDict[course].info.numTutors
                    for (var tutor in courseDict[course].tutors) {
                        if (!tutorsArray.includes(tutor)) {
                            tutorsArray.push(tutor)
                            console.log(tutorsArray)
                        }
                    }
                }
            }
        })
        countOfTutors = tutorsArray.length
        
        totalTutors += countOfTutors
        totalCourses += coursesCount
        totalCoursesWithTutors += coursesWithTutors
        totalCumulativeCount += cumulativeCount

        buildSchoolMetrics(tutorsArray, countOfTutors, coursesCount, coursesWithTutors, cumulativeCount,  schoolTitle)
    })
}




async function buildSchoolMetrics(tutorsArray, countOfTutors, coursesCount, coursesWithTutors, cumulativeCount, schoolTitle) {
    if (schoolTitle == "USC") {
        buildTutortreeMetrics()
    }
    var schoolMetrics = document.createElement('div')
    schoolMetrics.setAttribute('class', 'school-metrics')
    subjectArea.appendChild(schoolMetrics)
    
    var schoolMetricsHeader = document.createElement('div')
    schoolMetricsHeader.setAttribute('class', 'school-metrics-header')
    schoolMetrics.appendChild(schoolMetricsHeader)
    
    var schoolTitleElement = document.createElement('h3')
    schoolTitleElement.setAttribute('class', 'school-title')
    schoolTitleElement.innerHTML = schoolTitle
    console.log(schoolTitle)
    schoolMetricsHeader.appendChild(schoolTitleElement)
    
    //Metrics Block
    var metricsBlock = document.createElement('div')
    metricsBlock.setAttribute('class', 'metrics-block')
    schoolMetricsHeader.appendChild(metricsBlock)

    var numTutors = document.createElement('h3')
    numTutors.setAttribute('class', 'metrics-header')
    numTutors.innerHTML = countOfTutors + " Tutors"
    metricsBlock.appendChild(numTutors)
    
    var countCourses = document.createElement('h4')
    countCourses.setAttribute('class', 'metrics-subheader')
    countCourses.innerHTML = coursesCount + " Courses"
    metricsBlock.appendChild(countCourses)
    
    var coursesWithBlock = document.createElement('h4')
    coursesWithBlock.setAttribute('class', 'metrics-subheader')
    coursesWithBlock.innerHTML = coursesWithTutors + " Courses with Tutors"
    metricsBlock.appendChild(coursesWithBlock)
    
    var cumulativeBlock = document.createElement('h4')
    cumulativeBlock.setAttribute('class', 'metrics-subheader')
    cumulativeBlock.innerHTML = cumulativeCount + " Cumulative Tutor-Courses"
    metricsBlock.appendChild(cumulativeBlock)
    
    //Tutors images
    var tutorsBlock = document.createElement('tutors-block')
    tutorsBlock.setAttribute('class', 'tutors-block')
    schoolMetrics.appendChild(tutorsBlock)
    
    for ( i = 0; i < tutorsArray.length; i++) {
        await schoolDB.collection('userTest').doc( tutorsArray[i] ).onSnapshot(function(tutor) {
            var tutorBlockMetrics = document.createElement('div')
            tutorBlockMetrics.setAttribute('class', 'tutor-block-metrics')
            tutorsBlock.appendChild(tutorBlockMetrics)
            
            var tutorImage = document.createElement('img')
            tutorImage.setAttribute('class', 'tutor-image')
            tutorBlockMetrics.appendChild(tutorImage)
            tutorImage.src = tutor.data().profileImage
            tutorBlockMetrics.appendChild(tutorImage)
            
            var tutorsNameMetrics = document.createElement('h5')
            tutorsNameMetrics.setAttribute('class', 'tutors-name-metrics')
            tutorsNameMetrics.innerHTML = tutor.data().name
            tutorBlockMetrics.appendChild(tutorsNameMetrics)
        })
    }
}


function showTutorsForSchool(schoolTitle) {

    while(subjectArea.firstChild) {
        subjectArea.removeChild(subjectArea.firstChild)
    }

    schoolDB.collection("schools").doc(schoolTitle).collection('courses').onSnapshot(function(subject) {
        subject.forEach(function(doc) {
            buildSubjectBlock(schoolTitle, doc.id, doc.data())
        })
    })
}


async function buildSubjectBlock(schoolTitle, subject, courseDict) {

        console.log(courseDict)
        var subjectBlock = document.createElement('div')
        subjectBlock.setAttribute('class','subject-block')
        subjectArea.appendChild(subjectBlock)

        var subjectTitle = document.createElement('h3')
        subjectTitle.setAttribute('class', 'subject-title')
        subjectTitle.innerHTML = subject
        subjectBlock.appendChild(subjectTitle)

        var courseArray = document.createElement('div')
        courseArray.setAttribute('class', 'course-array')
        subjectBlock.appendChild(courseArray)

        for (var course in courseDict) {
            if (courseDict.hasOwnProperty(course)) {
                console.log(course + " -> " + courseDict[course]);

                var courseBlock = document.createElement('div')
                courseBlock.setAttribute('class', 'course-block-metrics')
                courseArray.appendChild(courseBlock)

                var courseTitle = document.createElement('div')
                courseTitle.setAttribute('class', 'course-title')
                courseTitle.innerHTML = course
                courseBlock.appendChild(courseTitle)

                var numTutors = document.createElement('div')
                numTutors.setAttribute('class', 'num-tutors')
                numTutors.innerHTML = courseDict[course].info.numTutors
                courseBlock.appendChild(numTutors)

                for (var tutor in courseDict[course].tutors) {
                    console.log(tutor)

                    var tutorBlock = document.createElement('div')
                    tutorBlock.setAttribute('class', 'tutor-block-metrics')
                    courseBlock.appendChild(tutorBlock)
                    console.log('appending tutor: ' + tutor)

                    var tutorImage = document.createElement('img')
                    tutorImage.setAttribute('class', 'tutor-image')
                    tutorBlock.appendChild(tutorImage)

                    var tutorName = document.createElement('h5')
                    tutorName.setAttribute('class', 'tutors-name-metrics' )
                    tutorBlock.appendChild(tutorName)

                    await schoolDB.collection('userTest').doc(tutor).get().then(function(doc) {
                        tutorImage.src = doc.data().profileImage
                        tutorName.innerHTML = doc.data().name
                    })
                }
            }
        }
}



var allSessionsArea = document.getElementById('admin-all-sessions')

schoolDB.collection('globalSessions').onSnapshot(async function(sessions) {
    var unsortedSessionsArray = []
    var promises = []

    while(allSessionsArea.firstChild) {
        allSessionsArea.removeChild(allSessionsArea.firstChild)
    }
    sessions.forEach( function(session) {
        const sessionData = session.data()

        const start = sessionData.start
        const end = sessionData.end
        const course = sessionData.course
        const status = sessionData.status
        const school = sessionData.school
        const studentID = sessionData.student
        const tutorID = sessionData.tutor
        const sessionID = session.id

        var studentName,
            tutorName

        const studentPromise = schoolDB.collection('userTest').doc(studentID).get().then(function(doc) {
            studentName = doc.data().name
        })

        const tutorPromise = schoolDB.collection('userTest').doc(tutorID).get().then(function(doc) {
            try {
                tutorName = doc.data().name
            } catch {
                console.log(tutorID)
                tutorName = "no name"
            }

            var sessionToAdd = [ start, [end, course, status, school, studentID, tutorID, sessionID, studentName, tutorName] ]
            unsortedSessionsArray.push(sessionToAdd)
        })

        promises.push(tutorPromise, studentPromise)
    })

    Promise.all(promises).then(results => {

        buildSessions(unsortedSessionsArray)
    })
})


function buildSessions(unsortedSessions) {
    var sortedSessions = unsortedSessions.sort(function(a,b) {
        return b[0] - a[0]
    })

    sortedSessions.forEach(async function (session, count) {
        var start = sortedSessions[count][0]
        var end = sortedSessions[count][1][0]
        var course = sortedSessions[count][1][1]
        var status = sortedSessions[count][1][2]
        var school = sortedSessions[count][1][3]
        var studentID = sortedSessions[count][1][4]
        var tutorID = sortedSessions[count][1][5]
        var sessionID = sortedSessions[count][1][6]
        var studentName = sortedSessions[count][1][7]
        var tutorName = sortedSessions[count][1][8]

        buildSessionBlock(start, end, course, status, school, studentID, tutorID, sessionID, studentName, tutorName)
    })
}


async function buildSessionBlock(start, end, course, status, school, studentID, tutorID, sessionID, studentName, tutorName) {

    //Outer Divs
    var adminSessionBlock = document.createElement('div')
    var adminSesssionInfoBlock = document.createElement('div')
    var adminSessionDateDiv = document.createElement('div')
    var adminSessionSchoolDiv = document.createElement('div')
    var adminSessionStudentDiv = document.createElement('div')
    var adminSessionTutorDiv = document.createElement('div')
    var adminSessionStatusDiv = document.createElement('div')

    //Outer Div Classes
    adminSessionBlock.setAttribute('class', 'admin-session-block') 
    adminSesssionInfoBlock.setAttribute('class', 'admin-session-data-div') 
    adminSessionDateDiv.setAttribute('class', 'admin-session-date-div')
    adminSessionSchoolDiv.setAttribute('class', 'admin-session-school-div')
    adminSessionStudentDiv.setAttribute('class', 'admin-session-student-div')
    adminSessionTutorDiv.setAttribute('class', 'admin-session-tutor-div')
    adminSessionStatusDiv.setAttribute('class', 'admin-session-status')

    //Inner Elements
    var adminSessionID = document.createElement('div')
    var adminSessionDate = document.createElement('div')
    var adminSessionSchool = document.createElement('div')
    var adminSessionStudentName = document.createElement('div')
    var adminSessionTutorName = document.createElement('div')
    var adminSessionStatus = document.createElement('div')

    //Inner Elements Classes
    adminSessionID.setAttribute('class', 'session-id')
    adminSessionDate.setAttribute('class', 'session-text')
    adminSessionSchool.setAttribute('class', 'session-text')
    adminSessionStudentName.setAttribute('class', 'session-text')
    adminSessionTutorName.setAttribute('class', 'session-text')
    adminSessionStatus.setAttribute('class', 'session-text')
    
    if (status == 'pending') {
        adminSessionStatus.innerHTML = "Pending"
        adminSessionStatus.setAttribute('class', 'admin-session-pending')

    } else if (status == 'confirmed') {
        adminSessionStatus.innerHTML = 'Confirmed'
        adminSessionStatus.setAttribute('class', 'admin-session-confirmed')

    } else if (status == 'declined') {
        adminSessionStatus.innerHTML = 'Declined'
        adminSessionStatus.setAttribute('class', 'admin-session-declined')

    } else if (status == 'cancelled') {
        adminSessionStatus.innerHTML = 'Cancelled'
        adminSessionStatus.setAttribute('class', 'admin-session-cancelled')
    }

    var dateObject = getFormattedDate(start)

    //Set Inner Elements Values
    adminSessionID.innerHTML = sessionID
    adminSessionDate.innerHTML = dateObject[0] + ', ' + dateObject[1] + ' ' + dateObject[2]
    adminSessionSchool.innerHTML = school
    adminSessionStudentName.innerHTML = studentName
    adminSessionTutorName.innerHTML = tutorName
    adminSessionStatus.innerHTML = status

    //Append childs
    adminSessionBlock.appendChild(adminSesssionInfoBlock)
    adminSessionBlock.appendChild(adminSessionDateDiv)
    adminSessionBlock.appendChild(adminSessionSchoolDiv)
    adminSessionBlock.appendChild(adminSessionStudentDiv)
    adminSessionBlock.appendChild(adminSessionTutorDiv)
    adminSessionBlock.appendChild(adminSessionStatusDiv)

    adminSesssionInfoBlock.appendChild(adminSessionID)
    adminSessionDateDiv.appendChild(adminSessionDate)
    adminSessionSchoolDiv.appendChild(adminSessionSchool)
    adminSessionStudentDiv.appendChild(adminSessionStudentName)
    adminSessionTutorDiv.appendChild(adminSessionTutorName)
    adminSessionStatusDiv.appendChild(adminSessionStatus)

    allSessionsArea.appendChild(adminSessionBlock)
    adminSessionBlock.addEventListener('click', function() {
        openSessionModal(start, end, course, status, school, studentID, tutorID, sessionID)
    })
}

function openSessionModal(start, end, course, status, school, studentID, tutorID, sessionID) {

    var sessionModal = document.getElementById('session-modal')
    sessionModal.style.display = 'none'

    var studentModalImage = document.getElementById('student-modal-image')
    var studentModalID = document.getElementById('student-id')
    var studentModalName = document.getElementById('student-name')
    var studentModalEmail = document.getElementById('student-email')
    var studentModalNumber = document.getElementById('student-number')

    var tutorModalImage = document.getElementById('tutor-modal-image')
    var tutorModalId = document.getElementById('tutor-id')
    var tutorModalName = document.getElementById('tutor-name')
    var tutorModalEmail = document.getElementById('tutor-email')
    var tutorModalNumber = document.getElementById('tutor-number')

    var sessionSchoolImage = document.getElementById('sesion-school-image')
    var sessionModalStatus = document.getElementById('session-modal-status')
    var sessionModalID = document.getElementById('session-modal-id')
    var sessionModalDate = document.getElementById('session-modal-date')
    var sessionModalTime = document.getElementById('session-modal-time')

    await schoolDB.collection('userTest').doc(studentID).get().then(function(doc) {
        var studentData = doc.data()

        studentModalImage.removeChild(studentModalImage.firstChild)
        var studentImage = document.createElement('img')
        studentImage.setAttribute('class', 'admin-user-image')
        studentImage.src = studentData.profileImage
        studentModalImage.appendChild(studentImage)

        studentModalID.innerHTML = doc.id
        studentModalName.innerHTML = studentData.name
        studentModalEmail.innerHTML = studentData.email
        studentModalNumber.innerHTML = studentData.phoneNumber
    })

    await schoolDB.collection('userTest').doc(tutorID).get().then(function(doc) {
        var tutorData = doc.data()

        tutorModalImage.removeChild(tutorModalImage.firstChild)
        var tutorImage = document.createElement('img')
        tutorImage.setAttribute('class', 'admin-user-image')
        tutorImage.src = tutorData.profileImage
        tutorModalImage.appendChild(tutorImage)

        tutorModalId.innerHTML = doc.id
        tutorModalName.innerHTML = tutorData.name
        tutorModalEmail.innerHTML = tutorData.email
        tutorModalNumber.innerHTML = tutorData.phoneNumber
    })

    await schoolDB.collection('schools').doc(school).get().then(function(doc) {
        var schoolData = doc.data()

        sessionSchoolImage.removeChild(sessionSchoolImage.firstChild)
        var schoolImage = document.createElement('img')
        schoolImage.setAttribute('class', 'admin-user-image')
        schoolImage.src = schoolData.icon
        tutorModalImage.appendChild(tutorImage)

        var dateObject = getFormattedDate(start)
        var timeObject = getFormattedTime(start, end)

        sessionModalStatus.innerHTML = status
        sessionModalID.innerHTML = sessionID
        sessionModalDate.innerHTML = dateObject[0] + ', ' + dateObject[1] + ' ' + dateObject[2]
        sessionModalTime.innerHTML = timeObject[0] + ' to ' + timeObject[1]
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

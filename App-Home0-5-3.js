//Global Variables__________________________________________________________________
var userDB = firebase.firestore()

var globalUserId,
    coreBio,
    coreBalance,
    coreEmail,
    coreIsEmailOn,
    coreIsSMSOn,
    coreisTutor,
    coreLikedTutors,
    coreName,
    corePhone,
    corePinnedTutors,
    corePreferences,
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
	coreLikedTutors = data.likedTutors
        coreName = data.name 
        corePhone = data.phoneNumber 
	corePinnedTutors = data.pinnedTutors
	corePreferences = data.preferences
        coreProfileImage = data.profileImage 

        loadHeader()
        loadHomePage()
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
    $('#home-page').fadeIn()
})

function getTutorData(tutorID) {
    tutorProfile.style.display = 'flex'


    userDB.collection('userTest').doc(tutorID).get().then(function(doc) {
        const data = doc.data()

        loadTutorProfile(data, tutorID)
        loadButtons(data, tutorID)
        //loadSimilarTutors()
	loadProfileExperience(data)
        loadReviews(data, tutorID)
        //loadAvailability(data)
    })
}


//Home Page___________________________________________________________________________________________________________________
let homeProfileBlock = document.getElementById('home-profile-block')
let homeProfileImageContainer = document.getElementById('home-profile-image-container')
let homeProfileName = document.getElementById('home-profile-name')

let tutorsHomeHeader = document.getElementById('tutors-home-header')
let tutorsHomeSubheader = document.getElementById('tutors-home-subheader')

let pinnedTutorsArea = document.getElementById('pinned-tutors-area')

function loadHomePage() {
    homeProfileImageContainer.removeChild(homeProfileImageContainer.firstChild)

    let homeProfileImage = document.createElement('img')
    homeProfileImage.setAttribute('class', 'home-profile-image')
    homeProfileImage.src = coreProfileImage
    homeProfileImageContainer.appendChild(homeProfileImage)

    homeProfileName.innerHTML = `Hi ${getFirstName(coreName)}!`

    if (corePreferences != null) {
        loadFiltersFromPreferences()
    } else {
        loadFilters()
    }
    loadPinnedTutors()
}

function loadFiltersFromPreferences() {
    gradeFilterArea.style.display = 'none'
    schoolFilterArea.style.display = 'none'
    subjectFilterArea.style.display = 'none'
    courseFilterArea.style.display = 'none'
    
    grade = corePreferences.grade
    school = corePreferences.school 
    subject = corePreferences.subject 
    course = corePreferences.course 

    gradeFilterText.innerHTML = grade
    schoolFilterText.innerHTML = school
    subjectFilterText.innerHTML = subject
    courseFilterText.innerHTML = course

    buildGradeOptions()
    loadSchoolOptions()

    if(school != 'none' ) {
        updateHomeHeader(school)
        loadSubjectOptions() 

        if(subject != 'none' ) {
            userDB.collection('schools').doc(school).collection('courses').doc(subject).get().then(function(courses) {
                let courseData = courses.data()
                loadCourseOptions(courseData)

                if(course != 'none') {
                    if( courseData[course].hasOwnProperty('tutors') && Object.keys(courseData[course].tutors).length > 0) {
                        let tutorData = courseData[course].tutors
                        loadTutors(tutorData)
                    } else {
                        loadTutorRequestForm()
                    }
                }
            })
        }
    }
}


//Filtering
var grade,
    school,
    subject,
    course

function loadFilters() {
    gradeFilterArea.style.display = 'none'
    schoolFilterArea.style.display = 'none'
    subjectFilterArea.style.display = 'none'
    courseFilterArea.style.display = 'none'

    gradeFilterText.innerHTML = 'Grade Level..'
    schoolFilterText.innerHTML = 'School..'
    subjectFilterText.innerHTML = 'Subject..'
    courseFilterText.innerHTML = 'Course..'

    tutorsHomeSubheader.style.display = 'none'

    buildGradeOptions()
}
//Load Filter from preferences




let headerSchool = document.getElementById('header-school')
let headerNumTutors = document.getElementById('header-num-tutors')
let headerNumCourses = document.getElementById('header-num-courses')
let headerCoursesWith = document.getElementById('header-courses-with')
function updateHomeHeader(schoolPath) {
    var tutorsArray = []
    var countOfTutors = 0
    var coursesCount = 0
    var coursesWithTutors = 0
    var schoolTitle
    userDB.collection('schools').doc(schoolPath).get().then(function(doc) {
        schoolTitle = doc.data().title
        headerSchool.innerHTML = schoolTitle

        userDB.collection("schools").doc(schoolPath).collection('courses').onSnapshot(function(subjects) {
            subjects.forEach(function(subject) {
                var courseDict = subject.data()
                for ( var course in courseDict ) {
                    if (courseDict.hasOwnProperty(course)) {
                        coursesCount += 1
                        if( courseDict[course].info.numTutors != 0) {
                            coursesWithTutors += 1
                        }
                        for (var tutor in courseDict[course].tutors) {
                            if (!tutorsArray.includes(tutor)) {
                                tutorsArray.push(tutor)
                            }
                        }
                    }
                }
            })
            countOfTutors = tutorsArray.length
            headerNumTutors.innerHTML =  countOfTutors 
            headerNumCourses.innerHTML = coursesCount 
            headerCoursesWith.innerHTML = coursesWithTutors 
            $('#home-header').fadeIn()
        })
    })
}

//Grade Filters
let gradeFilterBlock = document.getElementById('grade-filter-block')
let gradeFilterArea = document.getElementById('grade-filter-area')
let gradeFilterText = document.getElementById('grade-filter-text')
let gradeFilterChevron = document.getElementById('grade-filter-chevron')

gradeFilterBlock.addEventListener('click', () => {
    if(gradeFilterArea.style.display == 'none') {
        $('#grade-filter-area').fadeIn(() => {
            gradeFilterChevron.setAttribute('class', 'filter-chevron-down')
        })
    } else {
        $('#grade-filter-area').fadeOut(() => {
            gradeFilterChevron.setAttribute('class', 'filter-chevron')
        })
    }
})

function buildGradeOptions() {
    while(gradeFilterArea.firstChild) {
        gradeFilterArea.removeChild(gradeFilterArea.firstChild)
    }

    let middleSchoolButton = document.createElement('div')
    middleSchoolButton.setAttribute('class', 'home-filter-option')
    middleSchoolButton.innerHTML = 'Middle School'
    gradeFilterArea.appendChild(middleSchoolButton)
    middleSchoolButton.addEventListener('click', () => {
        grade = 'middle school'
        gradeFilterText.innerHTML = 'Middle School'
        buildSchoolOptions()
    })

    let highSchoolButton = document.createElement('div')
    highSchoolButton.setAttribute('class', 'home-filter-option')
    highSchoolButton.innerHTML = 'High School'
    gradeFilterArea.appendChild(highSchoolButton)
    highSchoolButton.addEventListener('click', () => {
        grade = 'high school'
        gradeFilterText.innerHTML = 'High School'
        buildSchoolOptions()
    })

    let collegeButton = document.createElement('div')
    collegeButton.setAttribute('class', 'home-filter-option')
    collegeButton.innerHTML = 'College'
    gradeFilterArea.appendChild(collegeButton)
    collegeButton.addEventListener('click', () => {
        $('#grade-filter-area').fadeOut()
        gradeFilterText.innerHTML = 'College'
        resetFilters('College', 'none', 'none', 'none')
        loadSchoolOptions()
    })
}

//School Filters
let schoolFilterBlock = document.getElementById('school-filter-block')
let schoolFilterArea = document.getElementById('school-filter-area')
let schoolFilterText = document.getElementById('school-filter-text')
let schoolFilterChevron = document.getElementById('school-filter-chevron')

schoolFilterBlock.addEventListener('click', () => {
    if(schoolFilterArea.style.display == 'none') {
        $('#school-filter-area').fadeIn(() => {
            schoolFilterChevron.setAttribute('class', 'filter-chevron-down')
        })
    } else {
        $('#school-filter-area').fadeOut(() => {
            schoolFilterChevron.setAttribute('class', 'filter-chevron-down')
        })
    }
})

function loadSchoolOptions() {
    while(schoolFilterArea.firstChild) {
        schoolFilterArea.removeChild(schoolFilterArea.firstChild)
    }

    userDB.collection('schools').get().then(function(schools) {
        schools.forEach(function(doc) {
            const schoolData = doc.data()
            const schoolPath = doc.id
            buildSchoolOption(schoolPath, schoolData)
        })
    })
}

function buildSchoolOption(schoolPath, schoolData) {
    let schoolOption = document.createElement('div')
    schoolOption.setAttribute('class', 'home-filter-option')
    schoolOption.innerHTML = schoolData.title 
    schoolFilterArea.appendChild(schoolOption)

    schoolOption.addEventListener('click', () => {
        $('#school-filter-area').fadeOut()
        schoolFilterText.innerHTML = schoolData.title 
        updateHomeHeader(schoolPath)
        resetFilters(grade, schoolPath, 'none', 'none')
        loadSubjectOptions(schoolPath)
    })
}

//Subject Options
let subjectFilterBlock = document.getElementById('subject-filter-block')
let subjectFilterArea = document.getElementById('subject-filter-area')
let subjectFilterText = document.getElementById('subject-filter-text')
let subjectFilterChevron = document.getElementById('subject-filter-chevron')

subjectFilterBlock.addEventListener('click', () => {
    if(subjectFilterArea.style.display == 'none') {
        $('#subject-filter-area').fadeIn( () => {
            subjectFilterChevron.setAttribute('class', 'filter-chevron-down')
        })
    } else {
        $('#subject-filter-area').fadeOut(() => {
            subjectFilterChevron.setAttribute('class', 'filter-chevron-down')
        })
    }
})

function loadSubjectOptions() {
    while(subjectFilterArea.firstChild) {
        subjectFilterArea.removeChild(subjectFilterArea.firstChild)
    }

    userDB.collection('schools').doc(school).collection('courses').get().then(function(subjects) {
        subjects.forEach(function(subject) {
            buildSubjectOption(subject.id, subject.data())
        })
    })
}

function buildSubjectOption(subjectTitle, subjectData) {
    let subjectOption = document.createElement('div')
    subjectOption.setAttribute('class', 'home-filter-option')
    subjectOption.innerHTML = subjectTitle
    subjectFilterArea.appendChild(subjectOption)

    subjectOption.addEventListener('click', () => {
        $('#subject-filter-area').fadeOut()
        subjectFilterText.innerHTML = subjectTitle
        resetFilters(grade, school, subjectTitle, 'none')
        loadCourseOptions(subjectData)
    })
}

//Course Options
let courseFilterBlock = document.getElementById('course-filter-block')
let courseFilterArea = document.getElementById('course-filter-area')
let courseFilterText = document.getElementById('course-filter-text')
let courseFilterChevron = document.getElementById('course-filter-chevron')

courseFilterBlock.addEventListener('click', () => {
    if(courseFilterArea.style.display == 'none') {
        $('#course-filter-area').fadeIn( () => {
            courseFilterChevron.setAttribute('class', 'filter-chevron-down')
        })
    } else {
        $('#course-filter-area').fadeOut( () => {
            courseFilterChevron.setAttribute('class', 'filter-chevron-down')
        })
    }
})

function loadCourseOptions(subjectData) {
    while(courseFilterArea.firstChild) {
        courseFilterArea.removeChild(courseFilterArea.firstChild)
    }

    for (const [courseName, courseInfo] of Object.entries(subjectData)) {
        buildCourseOption(courseName, courseInfo)
    }
}

function buildCourseOption(courseName, courseInfo) {
    let courseOption = document.createElement('div')
    courseOption.setAttribute('class', 'home-filter-option')
    courseOption.innerHTML = courseName
    courseFilterArea.appendChild(courseOption)

    courseOption.addEventListener('click', () => {
        $('#course-filter-area').fadeOut()
        $('#tutors-home-subheader').fadeIn()
        tutorsHomeSubheader.innerHTML = `All tutors for ${courseName}`
        courseFilterText.innerHTML = courseName
        resetFilters(grade, school, subject, courseName)

        if( courseInfo.hasOwnProperty('tutors') ) {
            loadTutors(courseInfo.tutors)
        } else {
            $('#tutor-request-container').fadeIn()
        }
    })
}

function resetFilters(gradeChange, schoolChange, subjectChange, courseChange) {
    console.log(grade, school, subject, course)
    grade = gradeChange
    school = schoolChange
    subject = subjectChange
    course = courseChange

    gradeFilterText.innerHTML = gradeChange
    let updateDict = {}
    if(schoolChange == 'none') {
        while(schoolFilterArea.firstChild) {
            schoolFilterArea.removeChild(schoolFilterArea.firstChild)
        }
        while(subjectFilterArea.firstChild) {
            subjectFilterArea.removeChild(subjectFilterArea.firstChild)
        }
        while(courseFilterArea.firstChild) {
            courseFilterArea.removeChild(courseFilterArea.firstChild)
        }
        schoolFilterText.innerHTML = 'School..'
        subjectFilterText.innerHTML = 'Subject..'
        courseFilterText.innerHTML = 'Course..'

        let updatePath = 'preferences'
        let preferencesDict = {
            'grade' : gradeChange,
            'school' : 'none',
            'subject' : 'none',
            'course' : 'none'
        }
        updateDict[updatePath] = preferencesDict
        userDB.collection('userTest').doc(globalUserId).update(updateDict)
        
    } else if(subjectChange == 'none') {
        while(subjectFilterArea.firstChild) {
            subjectFilterArea.removeChild(subjectFilterArea.firstChild)
        }
        while(courseFilterArea.firstChild) {
            courseFilterArea.removeChild(courseFilterArea.firstChild)
        }
        subjectFilterText.innerHTML = 'Subject..'
        courseFilterText.innerHTML = 'Course..'

        let updatePath = 'preferences'
        let preferencesDict = {
            'grade' : gradeChange,
            'school' : schoolChange,
            'subject' : 'none',
            'course' : 'none'
        }
        updateDict[updatePath] = preferencesDict
        userDB.collection('userTest').doc(globalUserId).update(updateDict)

    } else if (courseChange == 'none') {
        while(courseFilterArea.firstChild) {
            courseFilterArea.removeChild(courseFilterArea.firstChild)
        }
        courseFilterText.innerHTML = 'Course..'

        let updatePath = 'preferences'
        let preferencesDict = {
            'grade' : gradeChange,
            'school' : schoolChange,
            'subject' : subjectChange,
            'course' : 'none'
        }
        updateDict[updatePath] = preferencesDict
        userDB.collection('userTest').doc(globalUserId).update(updateDict)
    } else {
        let updatePath = 'preferences'
        let preferencesDict = {
            'grade' : gradeChange,
            'school' : schoolChange,
            'subject' : subjectChange,
            'course' : courseChange
        }
        updateDict[updatePath] = preferencesDict
        userDB.collection('userTest').doc(globalUserId).update(updateDict)
    }
}

var tutorPreviewsContainer = document.getElementById('tutor-previews-container')
function loadTutors(tutorsForCourse) {
    tutorRequestContainer.style.display = 'none'

    while (tutorPreviewsContainer.firstChild) {
        tutorPreviewsContainer.removeChild(tutorPreviewsContainer.firstChild)
    }
    
    for (const [tutorID, value] of Object.entries(tutorsForCourse)) {
        userDB.collection('userTest').doc(tutorID).get().then(function(doc) {
            const tutorData = doc.data()

            buildTutorPreview(tutorID, tutorData)
        })
    }
}


function buildTutorPreview(tutorID, tutorData) {
    var tutorPreviewsContainer = document.getElementById('tutor-previews-container')

    const tutorPreviewDiv = document.createElement('div')
    tutorPreviewDiv.setAttribute('class', 'tutor-preview-div')
    tutorPreviewDiv.setAttribute('onClick', `getTutorData("${tutorID}")`)
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



let noPinnedTutorsDiv = document.getElementById('no-pinned-tutors-div')
function loadPinnedTutors() {
    noPinnedTutorsDiv.style.display = 'none'

    while(pinnedTutorsArea.firstChild) {
        pinnedTutorsArea.removeChild(pinnedTutorsArea.firstChild)
    }
    let hasPinnedTutors = false
    if(corePinnedTutors != null) { 
        for (const [id, status] of Object.entries(corePinnedTutors)) {
            if(status != 'inactive') {
                hasPinnedTutors = true

                userDB.collection('userTest').doc(id).get().then(function(doc) {
                    
                    let tutorID = id
                    let tutorData = doc.data()
                    buildPinnedTutorBlock(tutorID, tutorData)
                })
            }
        }
        
        if (!hasPinnedTutors) {
            noPinnedTutorsDiv.style.display = 'flex'
        }

    } else {
        //User has never pinned a tutor before
        noPinnedTutorsDiv.style.display = 'flex'
    }
}

function buildPinnedTutorBlock(tutorID, tutorData) {
    let pinnedTutorBlock = document.createElement('div')
    pinnedTutorBlock.setAttribute('class', 'pinned-tutor-block')
    pinnedTutorsArea.appendChild(pinnedTutorBlock)
    
    let pinnedTutorHeader = document.createElement('div')
    pinnedTutorHeader.setAttribute('class', 'pinned-tutor-header')
    pinnedTutorBlock.appendChild(pinnedTutorHeader)

    let pinnedTutorImage = document.createElement('img')
    pinnedTutorImage.setAttribute('class', 'pinned-tutor-image')
    pinnedTutorImage.src = tutorData.profileImage
    pinnedTutorHeader.appendChild(pinnedTutorImage)

    let pinnedTutorInfo = document.createElement('div')
    pinnedTutorInfo.setAttribute('class', 'pinned-tutor-info')
    pinnedTutorHeader.appendChild(pinnedTutorInfo)

    let pinnedTutorName = document.createElement('div')
    pinnedTutorName.setAttribute('class', 'pinned-tutor-name')
    pinnedTutorName.innerHTML = tutorData.name
    pinnedTutorInfo.appendChild(pinnedTutorName)

    let pinnedTutorSchool = document.createElement('div')
    pinnedTutorSchool.setAttribute('class', 'pinned-tutor-school')
    pinnedTutorSchool.innerHTML = tutorData.school 
    pinnedTutorInfo.appendChild(pinnedTutorSchool)

    let pinnedButtonsDiv = document.createElement('div')
    pinnedButtonsDiv.setAttribute('class', 'pinned-buttons-div')
    pinnedTutorBlock.appendChild(pinnedButtonsDiv)

    let pinnedProfileButton = document.createElement('div')
    pinnedProfileButton.setAttribute('class', 'pinned-profile-button')
    pinnedProfileButton.addEventListener('click', () => {
        getTutorData(tutorID)
    })
    pinnedProfileButton.innerHTML = 'Go to Profile'
    pinnedButtonsDiv.appendChild(pinnedProfileButton)

    let pinnedBookButton = document.createElement('div')
    pinnedBookButton.setAttribute('class', 'pinned-book-button')
    pinnedBookButton.addEventListener('click', () => {
        document.getElementById('session-booking-page').style.display = 'flex'
        loadBookingPageFromData(tutorData, tutorID)
    })
    pinnedBookButton.innerHTML = 'Book Session'
    pinnedButtonsDiv.appendChild(pinnedBookButton)
}


//Tutor Request 
let tutorRequestContainer = document.getElementById('tutor-request-container')
tutorRequestContainer.style.display = 'none'
let tutorRequestForm = document.getElementById('tutor-request-form')
let tutorRequestConfirmation = document.getElementById('tutor-request-confirmation')
let closeTutorRequest = document.getElementById('close-tutor-request')

let tutorRequestSchool = document.getElementById('tutor-request-school')
let tutorRequestSubject = document.getElementById('tutor-request-subject')
let tutorRequestCourse = document.getElementById('tutor-request-course')
let tutorRequestAdditional = document.getElementById('tutor-request-additional')
let tutorRequestToggle = document.getElementById('tutor-request-toggle')
let submitTutorRequest = document.getElementById('submit-tutor-request')

var wantsToBeNotified = false
tutorRequestToggle.setAttribute('class', 'toggle')
tutorRequestToggle.addEventListener('click', () => {
    if(wantsToBeNotified == false) {
        wantsToBeNotified = true
        tutorRequestToggle.setAttribute('class', 'toggle-selected')
    } else {
        wantsToBeNotified = false
        tutorRequestToggle.setAttribute('class', 'toggle')
    }
})

submitTutorRequest.addEventListener('click', () => {
    let title = 'New Tutor Request'
    let schoolVal = tutorRequestSchool.value
    let subjectVal = tutorRequestSubject.value
    let courseVal = tutorRequestCourse.value

    let notificationString = wantsToBeNotified ? `They would like to be notified. Their ID is ${globalUserId}, email is ${coreEmail}` : 'They do not want to be notified.'
    var message = `${coreName} has requested a tutor for ${schoolVal}, ${subjectVal}, ${courseVal}. `
    let finalString = message + notificationString + ` Additional notes: ${tutorRequestAdditional.value}`
    console.log(finalString)

    sendEmailTo('support@tutortree.com', title, finalString)

    tutorRequestForm.style.display = 'none'
    $('#tutor-request-confirmation').fadeIn()
})

closeTutorRequest.addEventListener('click', () => {
    $('#tutor-request-container').fadeOut()
})

async function loadTutorRequestForm() {
    while (tutorPreviewsContainer.firstChild) {
        tutorPreviewsContainer.removeChild(tutorPreviewsContainer.firstChild)
    }

    console.log('No tutors')
    $('#tutor-request-container').fadeIn()
    tutorRequestForm.style.display = 'flex'
    tutorRequestConfirmation.style.display = 'none'

    tutorRequestSchool.value = await getSchoolFromPath(school)
    tutorRequestSubject.value = subject 
    tutorRequestCourse.value = course
    tutorRequestAdditional.value = ''
}



async function getSchoolFromPath(schoolPath) {
    let fullSchoolName 
    await userDB.collection('schools').doc(schoolPath).get().then(function(doc) {
        fullSchoolName = doc.data().title
    })

    return fullSchoolName
}

//Profile____________________________________________________________________________________________________________________________________________________

async function loadTutorProfile(data, ID) {
    let homePage = document.getElementById('home-page')
    homePage.style.display = 'none'
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


//Tab Navigation
var tab1 = document.getElementById('tab-1')
tab1.addEventListener('click', () => {
    changeTabClasses(1)
    $("html, body").animate({ scrollTop: $("#bio-section").offset().top }, 500);
})

var tab2 = document.getElementById('tab-2')
tab2.addEventListener('click', () => {
    changeTabClasses(2)
    $("html, body").animate({ scrollTop: $("#experience-section").offset().top }, 500);
})

var tab3 = document.getElementById('tab-3')
tab3.addEventListener('click', () => {
    changeTabClasses(3)
    $("html, body").animate({ scrollTop: $("#reviews-section").offset().top }, 500);
})

var tab4 = document.getElementById('tab-4')
tab4.addEventListener('click', () => {
    changeTabClasses(4)
    $("html, body").animate({ scrollTop: $("#availability-section").offset().top }, 500);
})

function changeTabClasses(id) {
    for ( i = 1; i < 5; i++ ) {
        if( id == i) {
            document.getElementById(`tab-${i}`).setAttribute('class', 'profile-tab-selected')
        } else {
            document.getElementById(`tab-${i}`).setAttribute('class', 'profile-tab-unselected')
        }
    }
}



function loadButtons(data, tutorID) {
    //load pin tutor button
    loadisTutorPinned(tutorID)
    
    //load like button
    loadisTutorLiked(tutorID)

    //load report button

    //load message button
    document.getElementById('message-button').addEventListener('click', () => {
        openMessageModal(data, tutorID)
    })

    //load book session button
    const sessionBookingPage = document.getElementById('session-booking-page')
    const bookSessionButton = document.getElementById('book-session-button')

    bookSessionButton.addEventListener('click', () => {
    	sessionBookingPage.style.display = 'flex'
    	tutorProfile.style.display = 'none'
	
	loadBookingPageFromData(data, tutorID)
    })
}

let pinTutorButton = document.getElementById('pin-tutor')
function loadisTutorPinned(tutorID) {
    console.log(corePinnedTutors)
    if(corePinnedTutors != null) { 
        for (const [id, status] of Object.entries(corePinnedTutors)) {
            console.log('pinned id', id)
            //User has this tutor pinned currently
            if ( id == tutorID && status == 'active') {
                pinTutorButton.setAttribute('class', 'pin-tutor-active')
                pinTutorButton.setAttribute('onClick', `pinTutor("${tutorID}",${true})`)
            //User has never pinned tutor before and does not have them pinned currently
            } else {
                pinTutorButton.setAttribute('class', 'pin-tutor')
                pinTutorButton.setAttribute('onClick', `pinTutor("${tutorID}",${false})`)
            }
        } 

    //User has never pinned a tutor before
    } else {
        pinTutorButton.setAttribute('class', 'pin-tutor')
        pinTutorButton.setAttribute('onClick', `pinTutor("${tutorID}",${false})`)
    }
}

function pinTutor(tutorID, isPinned) {
    let pinDict = {}
    let pinPath = 'pinnedTutors.' + tutorID
    pinDict[pinPath] = (isPinned ? 'inactive' : 'active')

    if(isPinned) {
        userDB.collection('userTest').doc(globalUserId).update(pinDict).then( () => {
            loadPinnedTutors()
            pinTutorButton.setAttribute('class', 'pin-tutor')
            pinTutorButton.setAttribute('onClick', `pinTutor("${tutorID}",${false})`)
        })

    } else {
        userDB.collection('userTest').doc(globalUserId).update(pinDict).then( () => {
            loadPinnedTutors()
            pinTutorButton.setAttribute('class', 'pin-tutor-active')
            pinTutorButton.setAttribute('onClick', `pinTutor("${tutorID}",${true})`)
        })
    }
}

let likeTutorButton = document.getElementById('like-tutor-button')
function loadisTutorLiked(tutorID) {
    console.log(coreLikedTutors)
    if(coreLikedTutors != null) { 
        for (const [id, status] of Object.entries(coreLikedTutors)) {
            //User has this tutor liked currently
            if(id == tutorID && status == 'active') {
                likeTutorButton.setAttribute('class', 'pin-tutor-active')
                likeTutorButton.setAttribute('onClick', `likeTutor("${tutorID}",${true})`)
            } else {
                likeTutorButton.setAttribute('class', 'pin-tutor')
                likeTutorButton.setAttribute('onClick', `likeTutor("${tutorID}",${false})`)
            }
        } 

    //User has never liked a tutor before
    } else {
        likeTutorButton.setAttribute('class', 'pin-tutor')
        likeTutorButton.setAttribute('onClick', `likeTutor("${tutorID}",${false})`)
    }
}


function likeTutor(tutorID, isLiked) {
    let likeDict = {}
    let likePath = 'likedTutors.' + tutorID
    likeDict[likePath] = (isLiked ? 'inactive' : 'active')

    if(isLiked) {
        userDB.collection('userTest').doc(globalUserId).update(likeDict).then( () => {
            updateTutorsLikes(tutorID, false, globalUserId)
            likeTutorButton.setAttribute('class', 'pin-tutor')
            likeTutorButton.setAttribute('onClick', `likeTutor("${tutorID}",${false})`)
        })

    } else {
        userDB.collection('userTest').doc(globalUserId).update(likeDict).then( () => {
            updateTutorsLikes(tutorID, true, globalUserId)
            likeTutorButton.setAttribute('class', 'pin-tutor-active')
            likeTutorButton.setAttribute('onClick', `likeTutor("${tutorID}",${true})`)
        })
    }
}

function updateTutorsLikes(tutorID, isIncrementing, likedBy) {
    //decrementing if false:
    var user = likedBy
    var userDict = {}

    if(isIncrementing) {
        userDict[user] = 'active'
        var updateDict = {
            'numLikes' : firebase.firestore.FieldValue.increment(1)
        }
        updateDict['likedBy'] = userDict

        userDB.collection('userTest').doc(tutorID).update(updateDict)
    } else {
        userDict[user] = 'inactive'
        var updateDict = {
            'numLikes' : firebase.firestore.FieldValue.increment(-1)
        }
        updateDict['likedBy'] = userDict

        userDB.collection('userTest').doc(tutorID).update(updateDict)
    }
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

//Experience
var profileNoExperience = document.getElementById('profile-no-experience')
var profileExperienceContainer = document.getElementById('profile-experience-container')

function loadProfileExperience(tutorData) {
    while(profileExperienceContainer.firstChild) {
        profileExperienceContainer.removeChild(profileExperienceContainer.firstChild)
    }
    profileNoExperience.innerHTML = `${getFirstName(tutorData.name)} hasn't added any experience yet`
    profileNoExperience.style.display = 'block'

    userDB.collection('userTest').doc(globalUserId).get().then(function(doc) {
        var experienceData = doc.data().experience 

        for(var experience in experienceData) {
            if ( experienceData.hasOwnProperty(experience) ){
                profileNoExperience.style.display = 'none'

                var title = experienceData[experience].title
                var description = experienceData[experience].description
                buildProfileExperienceBlock(title, description)
            }
        }
    })
}

function buildProfileExperienceBlock(title, description) {
    var experienceDiv = document.createElement('div')
    experienceDiv.setAttribute('class', 'experience-div')
    profileExperienceContainer.appendChild(experienceDiv)

    var experienceHeaderDiv = document.createElement('div')
    experienceHeaderDiv.setAttribute('class', 'experience-header-div')
    experienceDiv.appendChild(experienceHeaderDiv)

    var experienceTitle = document.createElement('div')
    experienceTitle.setAttribute('class', 'experience-title-profile')
    experienceTitle.innerHTML = title
    experienceHeaderDiv.appendChild(experienceTitle)

    var experienceText = document.createElement('div')
    experienceText.setAttribute('class', 'experience-text-profile')
    experienceText.innerHTML = description
    experienceDiv.appendChild(experienceText)
}


//Reviews
var writeReviewButton = document.getElementById('write-review-button')
var writeReviewDiv = document.getElementById('write-review-div')
writeReviewButton.addEventListener('click', () => {
    $('#write-review-div').fadeIn()
})

var rating = 0

var starOne = document.getElementById('star-1')
starOne.addEventListener('mouseover', () => {
    updateStars(1)
})
var starTwo = document.getElementById('star-2')
starTwo.addEventListener('mouseover', () => {
    updateStars(2)
})
var starThree = document.getElementById('star-3')
starThree.addEventListener('mouseover', () => {
    updateStars(3)
})
var starFour = document.getElementById('star-4')
starFour.addEventListener('mouseover', () => {
    updateStars(4)
})
var starFive = document.getElementById('star-5')
starFive.addEventListener('mouseover', () => {
    updateStars(5)
})

function updateStars(index) {
    for( i = 1; i <= 5; i++) {
        if( i <= index) {
            document.getElementById(`star-${i}`).setAttribute('class', 'review-star-selected')
            rating = i
            console.log(rating)
        } else{ 
            document.getElementById(`star-${i}`).setAttribute('class', 'review-star-unselected')
        }
    }
}

var writeReviewHeader = document.getElementById('write-review-header')
let reviewScreen = document.getElementById('review-screen')
function setReviewInitialState(tutorData, tutorID) {
    noReviewsText.innerHTML = `${getFirstName(tutorData.name)} doesn't have any reviews yet`
    noReviewsText.style.display = 'none'

    for( i = 1; i <= 5; i++) {
        document.getElementById(`star-${i}`).setAttribute('class', 'review-star-unselected')
    }

    let confirmationScreen = document.getElementById('review-confirmation-screen')
    writeReviewDiv.style.display = 'none'
    confirmationScreen.style.display = 'none'
    reviewScreen.style.display = 'flex'

    writeReviewHeader.innerHTML = `Leave a review for ${tutorData.name}`

    var submitReviewButton = document.getElementById('submit-review-button')
    submitReviewButtonClone = submitReviewButton.cloneNode(true)
    submitReviewButton.parentNode.replaceChild(submitReviewButtonClone, submitReviewButton)
    submitReviewButtonClone.addEventListener('click', () => {
        submitReview(tutorData, tutorID)
    })
}

function submitReview(tutorData, tutorID) {
    let currentDate = new Date()
    let currentDateInt = currentDate / 1000
    let dateObject = getFormattedDate(currentDateInt)
    let month = currentDate.getMonth()
    let year = currentDate.getFullYear()
    let dateString = months[month] + ' ' +dateObject[2] + ', ' + year
    var reviewDict = {
        'reviewer' : globalUserId,
        'date' : currentDateInt,
        'dateString' : dateString,
        'rating' : rating,
        'review' : document.getElementById('write-review-text').value,
        'reviewerName' : coreName
    }


    let randomID = createTransactionID()
    userDB.collection('userTest').doc(tutorID).collection('reviews').doc(randomID).set(reviewDict).then(() => {
        var tutorsName = tutorData.name 
        const nameArray = tutorsName.split(" ")
        const firstName = nameArray[0]
        var reviewConfirmationText = document.getElementById('review-confirmation-text')
        reviewConfirmationText.innerHTML = `Thanks for reviewing ${firstName}!`
        reviewScreen.style.display = 'none'

        $('#review-confirmation-screen').fadeIn().delay(5000).fadeOut("slow")
    })
}


let allReviewsArea = document.getElementById('all-reviews-area')
let noReviewsText = document.getElementById('no-reviews-text')


function loadReviews(tutorData, tutorID) {
    setReviewInitialState(tutorData, tutorID)

    while(allReviewsArea.firstChild) {
        allReviewsArea.removeChild(allReviewsArea.firstChild)
    }

    userDB.collection('userTest').doc(tutorID).collection('reviews').get().then(function(reviews) {
        if( reviews.size > 0) {
            reviews.forEach(function(review) {
                let reviewData = review.data()
    
                userDB.collection('userTest').doc(reviewData.reviewer).get().then(function(doc) {
                    let reviewersImage = doc.data().profileImage
                    buildReviewBlock(reviewData, reviewersImage)
                })
            })
        } else {
            noReviewsText.style.display = 'block'
        }
    })


}

function buildReviewBlock(data, image) {
    let reviewContainer = document.createElement('div')
    reviewContainer.setAttribute('class', 'review-container')
    allReviewsArea.append(reviewContainer)
    
    let reviewHeader = document.createElement('div')
    reviewHeader.setAttribute('class', 'review-header')
    reviewContainer.append(reviewHeader)

    let reviewImage = document.createElement('img')
    reviewImage.setAttribute('class', 'review-image')
    reviewImage.src = image
    reviewHeader.append(reviewImage)

    let reviewInfo = document.createElement('div')
    reviewInfo.setAttribute('class', 'review-info')
    reviewHeader.append(reviewInfo)

    let reviewName = document.createElement('div')
    reviewName.setAttribute('class', 'review-name')
    reviewName.innerHTML = data.reviewerName
    reviewInfo.append(reviewName)

    let reviewInfoLower = document.createElement('div')
    reviewInfoLower.setAttribute('class', 'review-info-lower')
    reviewInfo.append(reviewInfoLower)

    let numStars = parseInt(data.rating)
    for( i = 0; i < numStars; i++) {
        let reviewStar = document.createElement('div')
        reviewStar.setAttribute('class', 'review-star')
        reviewStar.innerHTML = ''
        reviewInfoLower.append(reviewStar)
    }
    let reviewDate = document.createElement('div')
    reviewDate.setAttribute('class', 'review-date')
    reviewDate.innerHTML = data.dateString
    reviewInfoLower.append(reviewDate)

    let reviewText = document.createElement('div')
    reviewText.setAttribute('class', 'review-text')
    reviewText.innerHTML = data.review
    reviewContainer.append(reviewText)
}

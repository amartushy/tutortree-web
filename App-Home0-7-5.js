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
	loadHomeNavigation()
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



const tutorProfile = document.getElementById('tutor-profile')
function loadHomeNavigation() {
	const homeBack = document.getElementById('home-back')
	
	homeBack.addEventListener('click', () => {
	    tutorProfile.style.display = 'none'
	    document.getElementById('home-page').style.display = 'flex'
	})
}


function getTutorData(tutorID) {
    tutorProfile.style.display = 'flex'
	let homePage = document.getElementById('home-page')
	homePage.style.display = 'none'

    userDB.collection('userTest').doc(tutorID).get().then(function(doc) {
        const data = doc.data()

        loadTutorProfile(data, tutorID)

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


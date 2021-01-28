//Global Variables______________________________________________________________________________________________________
var coreDict = {}
let schoolDB = firebase.firestore().collection('schools')
let userDB = firebase.firestore().collection('userTest')


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
    userDB.doc(globalUserId).onSnapshot(function(doc) {
        coreDict = doc.data()

        loadHeader()
        loadAllSchools()
    })
}

function loadHeader() {

    var profileTab = document.getElementById('profile')

    while( profileTab.firstChild) {
        profileTab.removeChild(profileTab.lastChild)
    }

    var usersPhoto = document.createElement('img')
    usersPhoto.setAttribute('class', 'header-image')
    usersPhoto.src = coreDict['profileImage']
    profileTab.appendChild(usersPhoto)

    var profileText = document.createElement('div')
    profileText.setAttribute('class', 'header-text')
    profileText.innerHTML = 'Profile'
    profileTab.appendChild(profileText)
}

//Navigation________________________________________________________________________________________________________________________
//Progress Bar
const progressBar = document.getElementById('progress-bar')

//Navigation Buttons
const schoolNext = document.getElementById('school-next')
const gradesBack = document.getElementById('grades-back')
const gradesNext = document.getElementById('grades-next')
const coursesBack = document.getElementById('courses-back')
const coursesNext = document.getElementById('courses-next')
const availabilityBack = document.getElementById('availability-back')
const availabilityNext = document.getElementById('availability-next')
const aboutBack = document.getElementById('about-back')
const aboutNext = document.getElementById('about-next')
const verificationBack = document.getElementById('verification-back')
const verificationNext = document.getElementById('verification-next')
const scheduleBack = document.getElementById('schedule-back')
const scheduleNext = document.getElementById('schedule-next')
const completionButton = document.getElementById('completion-button')

//Application Sections
const schoolSection = document.getElementById('school-section')
const gradesSection = document.getElementById('grades-section')
const coursesSection = document.getElementById('courses-section')
const availabilitySection = document.getElementById('availability-section')
const aboutSection = document.getElementById('about-section')
const verificationSection = document.getElementById('verification-section')
const scheduleSection = document.getElementById('schedule-section')
const confirmationSection = document.getElementById('confirmation-section')

//Set initial section displays 
gradesSection.style.display = 'none'
coursesSection.style.display = 'none'
availabilitySection.style.display = 'none'
aboutSection.style.display = 'none'
verificationSection.style.display = 'none'
scheduleSection.style.display = 'none'
confirmationSection.style.display = 'none'

//Navigation Button Functions
schoolNext.addEventListener('click', () => {
    updateApplicantsSchool()
    animateSectionsNext('school', 'grades')
})
gradesBack.addEventListener('click', () => {
    animateSectionsBack('grades', 'school')
})
gradesNext.addEventListener('click', () => {
    updateApplicantGradeOptions()
    animateSectionsNext('grades', 'courses')
})
coursesBack.addEventListener('click', () => {
    animateSectionsBack('courses', 'grades')
})
coursesNext.addEventListener('click', () => {
    animateSectionsNext('courses', 'availability')
    loadAvailability()
})
availabilityBack.addEventListener('click', () => {
    animateSectionsBack('availability', 'courses')
})
availabilityNext.addEventListener('click', () => {
    animateSectionsNext('availability', 'about')
})
aboutBack.addEventListener('click', () => {
    animateSectionsBack('about', 'availability')
})
aboutNext.addEventListener('click', () => {
    animateSectionsNext('about', 'verification')
})
verificationBack.addEventListener('click', () => {
    animateSectionsBack('verification', 'about')
})
verificationNext.addEventListener('click', () => {
    animateSectionsNext('verification', 'schedule')
})
scheduleBack.addEventListener('click', () => {
    animateSectionsBack('schedule', 'verification')
})
scheduleNext.addEventListener('click', () => {
    animateSectionsNext('schedule', 'confirmation')
})

function animateSectionsNext(sectionOne, sectionTwo) {
    $(`#${sectionOne}-section`).animate({right: '2000px'}, 400, function () {
        $(`#${sectionOne}-section`).fadeOut()
        $(`#${sectionTwo}-section`).animate({left: '0'}, 400, function () {
            $(`#${sectionTwo}-section`).fadeIn()
        })
    })
}
function animateSectionsBack(sectionOne, sectionTwo) {
    $(`#${sectionOne}-section`).animate({left: '2000px'}, 400, function () {
        $(`#${sectionOne}-section`).fadeOut()
        $(`#${sectionTwo}-section`).animate({right: '0'}, 400, function () {
            $(`#${sectionTwo}-section`).fadeIn()
        })
    })
}


//Application Functions_____________________________________________________________________________________

//School Screen
let allSchoolsContainer = document.getElementById('all-schools-container')
let schoolNavBlock = document.getElementById('school-nav-block')
let applicantSchoolText = document.getElementById('applicant-school-text')
let allSchoolIDs = []


function loadAllSchools() {
    schoolNavBlock.style.display = 'none'

    while (allSchoolsContainer.firstChild) {
        allSchoolsContainer.removeChild(allSchoolsContainer.firstChild)
    }

    schoolDB.get().then(function(schools) {
        schools.forEach(function(doc) {
            allSchoolIDs.push(doc.id)
            var schoolData = doc.data()

            var coursesSchoolButton = document.createElement('div')
            coursesSchoolButton.setAttribute('class', 'courses-school-button')
            coursesSchoolButton.setAttribute('id', `courses-school-button-${doc.id}`)
            coursesSchoolButton.addEventListener('click', () => {
                applicantSchoolText.innerHTML = schoolData.title 
                tutorsSchool = doc.id
                tutorsSchoolTitle = schoolData.title

                updateSchoolClasses(doc.id)
                $('#school-nav-block').fadeIn()
            })
            allSchoolsContainer.appendChild(coursesSchoolButton)

            var coursesSchoolImage = document.createElement('img')
            coursesSchoolImage.setAttribute('class', 'courses-school-image')
            coursesSchoolImage.src = schoolData.icon 
            coursesSchoolButton.appendChild(coursesSchoolImage)

            var coursesSchoolText = document.createElement('div')
            coursesSchoolText.setAttribute('class', 'courses-school-text')
            coursesSchoolText.innerHTML = schoolData.title 
            coursesSchoolButton.appendChild(coursesSchoolText)
        })
    })
}

var tutorsSchool
var tutorsSchoolTitle
function updateApplicantsSchool() {
    //update core school path
    let schoolUpdate = {}
    schoolUpdate['school'] = tutorsSchool
    userDB.doc(globalUserId).update( schoolUpdate )
    
    // update application schoolname and school path
    let applicationUpdate = {}
    applicationUpdate['applicationFields.schoolName'] = tutorsSchool
    applicationUpdate['school'] = tutorsSchool
    userDB.doc(globalUserId).collection('tutorApplication').doc('application').update( applicationUpdate )
}

function updateSchoolClasses(school) {
    allSchoolIDs.forEach(function(id) {
        var targetElement = document.getElementById(`courses-school-button-${id}`)

        if(id == school) {
            targetElement.setAttribute('class', 'courses-school-button-selected')
        } else {
            targetElement.setAttribute('class', 'courses-school-button')
        }
    })
}




//Grade Options Screen
gradesNext.style.display = 'none'

let middleSchoolButton = document.getElementById('middle-school-button')
let highSchoolButton = document.getElementById('high-school-button')
let collegeButton = document.getElementById('college-button')

middleSchoolButton.setAttribute('class', 'grade-option')
highSchoolButton.setAttribute('class', 'grade-option-middle')
collegeButton.setAttribute('class', 'grade-option')

middleSchoolButton.addEventListener('click', () => {
    if(middleSchoolButton.classList.contains('grade-option-selected')) {
        middleSchoolButton.setAttribute('class', 'grade-option')
        delete applicantSchoolPreferences['middleSchool']
    } else {
        middleSchoolButton.setAttribute('class', 'grade-option-selected')
        applicantSchoolPreferences['middleSchool'] = 'Middle School'
    }
    $('#grades-next').fadeIn() 
})

highSchoolButton.addEventListener('click', () => {
    if(highSchoolButton.classList.contains('grade-option-middle-selected')) {
        highSchoolButton.setAttribute('class', 'grade-option-middle')
        delete applicantSchoolPreferences['highSchool']
    } else {
        highSchoolButton.setAttribute('class', 'grade-option-middle-selected')
        applicantSchoolPreferences['highSchool'] = 'High School'
    }
    $('#grades-next').fadeIn()
})

collegeButton.addEventListener('click', () => {
    if(collegeButton.classList.contains('grade-option-selected')) {
        collegeButton.setAttribute('class', 'grade-option')
        delete applicantSchoolPreferences[tutorsSchool]
    } else {
        collegeButton.setAttribute('class', 'grade-option-selected')
        applicantSchoolPreferences[tutorsSchool] = tutorsSchoolTitle
    }
    $('#grades-next').fadeIn()
})

let applicantSchoolPreferences = {}
function updateApplicantGradeOptions() {
    let updateDict = {}
    updateDict['schoolPreferences'] = applicantSchoolPreferences
    userDB.doc(globalUserId).update( updateDict ).then(function() {
        loadCourseOptions()
    })
}



//Courses Screen__________________________________________________________________________________________________________________________
var addCollegeButton = document.getElementById('add-college-button')
var chooseCoursesArea = document.getElementById('choose-courses-area')

function loadCourseOptions() {
    while(chooseCoursesArea.firstChild) {
        chooseCoursesArea.removeChild(chooseCoursesArea.firstChild)
    }
    loadNewSchools()

    for (var schoolID in coreDict['schoolPreferences']) {
        if(coreDict['schoolPreferences'].hasOwnProperty(schoolID)) {

            if(schoolID != 'middleSchool' &&  schoolID != 'highSchool') {
                schoolDB.doc(schoolID).get().then(function(school) {
                    buildSchool(school.id, school.data())
                })
            }
        }
    }
}

function buildSchool(school, schoolData) {
    var collegeContainer = document.createElement('div')
    collegeContainer.setAttribute('class', 'college-container')
    chooseCoursesArea.appendChild(collegeContainer)

    var schoolBlock = document.createElement('div')
    schoolBlock.setAttribute('class', 'school-block')
    schoolBlock.addEventListener('click', () => {
        var courseContainer = document.getElementById(`courses-container-${school}`)
        if(courseContainer.style.display == 'none') {
            $(`#courses-container-${school}`).fadeIn()
        } else {
            $(`#courses-container-${school}`).fadeOut()
        }
    })
    collegeContainer.appendChild(schoolBlock)

    var schoolHeader = document.createElement('div')
    schoolHeader.setAttribute('class', 'filter-header')
    schoolBlock.appendChild(schoolHeader)

    var schoolHeaderLogoContainer = document.createElement('div')
    schoolHeaderLogoContainer.setAttribute('class', 'school-header-logo-container')
    schoolHeader.appendChild(schoolHeaderLogoContainer)

    var schoolHeaderLogo = document.createElement('img')
    schoolHeaderLogo.setAttribute('class', 'school-header-logo')
    schoolHeaderLogo.src = schoolData.icon 
    schoolHeaderLogoContainer.appendChild(schoolHeaderLogo)

    var schoolHeaderText = document.createElement('div')
    schoolHeaderText.setAttribute('class', 'school-header-text')
    schoolHeaderText.innerHTML = schoolData.title
    schoolHeaderLogoContainer.appendChild(schoolHeaderText)

    var schoolChevron = document.createElement('div')
    schoolChevron.setAttribute('class', 'filter-chevron')
    schoolChevron.innerHTML = ''
    schoolHeader.appendChild(schoolChevron)

    var coursesContainer = document.createElement('div')
    coursesContainer.setAttribute('class', 'courses-container')
    coursesContainer.setAttribute('id', `courses-container-${school}`)
    collegeContainer.appendChild(coursesContainer)
    coursesContainer.style.display = 'none'

    schoolDB.doc(school).collection('courses').onSnapshot(function(subject) {
        subject.forEach(function(doc) {
            buildSubjectBlock(school, doc.id, doc.data())
        })
    })
}


function buildSubjectBlock(school, subject, courseDict) {
    var subjectID = subject.replace(/\s+/g, '');

    var courseContainer = document.getElementById(`courses-container-${school}`)

    var courseDiv = document.createElement('div')
    courseDiv.setAttribute('class', 'course-div')
    courseContainer.appendChild(courseDiv)

    var courseHeader = document.createElement('div')
    courseHeader.setAttribute('class', 'course-header')
    courseHeader.addEventListener('click', () => {
        var courseContainer = document.getElementById(`course-container-${subjectID}`)
        if(courseContainer.style.display == 'none') {
            $(`#course-container-${subjectID}`).fadeIn()
        } else {
            $(`#course-container-${subjectID}`).fadeOut()
        }
    })
    courseDiv.appendChild(courseHeader)

    var courseHeaderText = document.createElement('div')
    courseHeaderText.setAttribute('class', 'course-header-text')
    courseHeaderText.innerHTML = subject
    courseHeader.appendChild(courseHeaderText)

    var courseChevron = document.createElement('div')
    courseChevron.setAttribute('class', 'course-chevron')
    courseChevron.innerHTML = ''
    courseHeader.appendChild(courseChevron)

    var courseBlockContainer = document.createElement('course-block-container')
    courseBlockContainer.setAttribute('class', 'course-block-container')
    courseBlockContainer.setAttribute('id', `course-container-${subjectID}`)
    courseBlockContainer.style.display = 'none'
    courseDiv.appendChild(courseBlockContainer)

    for ( var course in courseDict ) {
        if (courseDict.hasOwnProperty(course)) {
            var courseBlock = document.createElement('div')
            courseBlock.setAttribute('class', 'course-block')
            courseBlock.setAttribute('id', `${school}-${subject}-${course}`)
            courseBlock.setAttribute('onClick', 'updateTutorsCourses("' +school+ '","'+ subject + '","' + course  + '")')

            courseBlock.innerHTML = course 
            courseBlockContainer.appendChild(courseBlock)
        }
    }
}

var applicantsCourses = {}
function updateTutorsCourses(school, subject, course) {

    var courseBlock = document.getElementById(`${school}-${subject}-${course}`)
    
    if( applicantsCourses.hasOwnProperty(school) ){
        if ( applicantsCourses[school].hasOwnProperty(subject) ){
            if ( applicantsCourses[school][subject].hasOwnProperty(course)) {
                delete applicantsCourses[school][subject][course]
                courseBlock.setAttribute('class', 'course-block')
            } else {
                applicantsCourses[school][subject][course] = course
                courseBlock.setAttribute('class', 'course-block-selected')
            }
        } else {
            let courseDict = {}
            courseDict[course] = course
            applicantsCourses[school][subject] = courseDict
            courseBlock.setAttribute('class', 'course-block-selected')
        }
    } else {
        let updateDict = {}
        let courseDict = {}
        courseDict[course] = course
        updateDict[subject] = courseDict
        applicantsCourses[school] = updateDict
        courseBlock.setAttribute('class', 'course-block-selected')
    }

    console.log(applicantsCourses)
}




//Add Additional Schools
var allSchoolsArea = document.getElementById('all-schools-area')
var coursesAllSchoolsContainer = document.getElementById('courses-all-schools-container')
var addSchoolButton = document.getElementById('add-school-button')

var addSchoolBlock = document.getElementById('add-school-block')
addSchoolBlock.addEventListener('click', () => {
    $('#all-schools-area').fadeIn()
})

//Request School
var requestSchoolButton = document.getElementById('request-school-button')
var addSchoolContainer = document.getElementById('add-school-container')
var requestConfirmation = document.getElementById('request-confirmation')
var addSchoolName = document.getElementById('add-school-name')
var addSchoolCourses = document.getElementById('add-school-courses')
var addSchoolToggle = document.getElementById('add-school-toggle')
var addSchoolCancel = document.getElementById('add-school-cancel')
var addSchoolSubmit = document.getElementById('add-school-submit')
var isNotify

requestSchoolButton.addEventListener('click', () => {
    $('#add-school-container').fadeIn()
})
addSchoolCancel.addEventListener('click', () => {
    $('#add-school-container').fadeOut()
})
addSchoolToggle.addEventListener('click', () => {
    if(isNotify == false) {
        isNotify = true
        addSchoolToggle.setAttribute('class', 'toggle-selected')
    } else {
        isNotify = false
        addSchoolToggle.setAttribute('class', 'toggle')
    }
})

addSchoolSubmit.addEventListener('click', () => {
    var schoolName = addSchoolName.value 
    var courses = addSchoolCourses.value
    
    if(schoolName == '') {
        showErrorMessage("Please enter the school's name")
    } else if (courses == '') {
        showErrorMessage("Please enter what courses you'd like to tutor")
    } else {
        var message = 'School Name: ' + schoolName + ', Courses Message: ' + courses + ' Tutor Info: ' + coreName +', '+coreEmail+', notify: '+isNotify
        sendEmailTo('support@tutortree.com', 'New School Request', message)
        $('#add-school-container').fadeOut(200, () => {
            $('#request-confirmation').fadeIn().delay(5000).fadeOut("slow")
        })
    }
})

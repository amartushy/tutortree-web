
//Navigation_____________________________________________________________________________________________________________
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
    animateSectionsNext('school', 'grades')
})
gradesBack.addEventListener('click', () => {
    animateSectionsBack('grades', 'school')
})
gradesNext.addEventListener('click', () => {
    animateSectionsNext('grades', 'courses')
})
coursesBack.addEventListener('click', () => {
    animateSectionsBack('courses', 'grades')
})
coursesNext.addEventListener('click', () => {
    animateSectionsNext('courses', 'availability')
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
    $(`#${sectionOne}-section`).animate({right: '2000px'}, 500, function () {
        $(`#${sectionOne}-section`).fadeOut()
        $(`#${sectionTwo}-section`).animate({left: '0'}, 500, function () {
            $(`#${sectionTwo}-section`).fadeIn()
        })
    })
}
function animateSectionsBack(sectionOne, sectionTwo) {
    $(`#${sectionOne}-section`).animate({left: '2000px'}, 500, function () {
        $(`#${sectionOne}-section`).fadeOut()
        $(`#${sectionTwo}-section`).animate({right: '0'}, 500, function () {
            $(`#${sectionTwo}-section`).fadeIn()
        })
    })
}

//Update Dictionaries____________________________________________________________________________________________________________
var applicationDict = {
    'applicationFields' : {
        'courses' : '',
        'firstName' : '',
        'groups' : '',
        'howHeard' : '',
        'lastName' : '',
        'major' : '',
        'referredBy' : '',
        'schoolName' : '',
        'whyTutor' : '',
        'year' : ''
    },
    'applicationPoints' : {
        'groupsPoints' : 0,
        'majorPoints' : 0,
        'whyTutorPoints' : 0,
        'yearPoints' : 0
    },
    'assessmentScore' : 0,
    'completedInterview' : false,
    'didRequestInterview' : false,
    'didSubmitPreInterview' : false,
    'email' : '',
    'facultyFile' : 'No file',
    'interviewScore' : 0,
    'meghanNotes' : 'No notes yet',
    'school' : '',
    'timeSubmitted' : 0,
    'transcriptFile' : 'No file',
    'uploadedFaculty' : false,
    'uploadedTranscript' : false
}

// Deprecated?
// var assessmentDict = {

// }

var interviewDict = {
    'interviewNotes' : {
        'challengingNotes' : 'No notes yet',
        'confidenceNotes' : 'No notes yet',
        'explainNotes' : 'No notes yet',
        'helpNotes' : 'No notes yet',
        'onTimeNotes' : 'No notes yet',
        'onlineNotes' : 'No notes yet',
        'preparedNotes' : 'No notes yet',
        'questionNotes' : 'No notes yet',
        'situationNotes' : 'No notes yet',
        'troubleNotes' : 'No notes yet'
    },
    'interviewScores' : {
        'challengingScore' : 0,
        'confidenceScore' : 0,
        'explainScore' : 0,
        'helpScore' : 0,
        'onTimeScore' : 0,
        'onlineScore' : 0,
        'preparedScore' : 0,
        'questionScore' : 0,
        'situationScore' : 0,
        'troubleScore' : 0
    }
}

var coreDict = {
    'agreedTOS' : false,
    'availability' : {
        'Sunday' : 0,
        'Monday' : 0,
        'Tuesday' : 0,
        'Wednesday' : 0,
        'Thursday' : 0,
        'Friday' : 0,
        'Saturday' : 0
    },
    'bio' : "This Tutor hasn't added a bio yet",
    'currentBalance' : 0,
    'email' : '',
    'hasBeenReferred' : false,
    'isAdmin' : false,
    'isDarkModeOn' : false,
    'isEmailOn' : false,
    'isSMSOn' : false,
    'isTutor' : false,
    'major' : 'No major set',
    'maxHPW' : 30,
    'name' : "",
    'phoneNumber' : 123456789,
    'preferences' : {
        'grade' : '',
        'school' : '',
        'subject' : '',
        'course' : ''
    },
    'pricePHH' : 10,
    'profileImage' : "https://firebasestorage.googleapis.com/v0/b/tutortree-68061.appspot.com/o/Logos%2FTTLogo600px.png?alt=media&token=bb275980-c106-497a-bc38-0b93d20907ca",
    'pushToken' : '',
    'referralCode' : '',
    'school' : '',
    'schoolPreferences' : {

    },
    'tutorApplicantStatus' : 'pending'
}

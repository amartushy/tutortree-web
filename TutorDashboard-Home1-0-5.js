//Home Elements
var schoolHeaderHome = document.getElementById('school-header-home')
var featuredTutorsArea = document.getElementById('featured-tutors-area')
var tutorsOnCampus = document.getElementById('tutors-on-campus')

//Tutor Modal Element
var tutorModal = document.getElementById('tutor-modal')
var otherImageBlock = document.getElementById('other-image-block')
var otherName = document.getElementById('other-name')
var otherSessionsText = document.getElementById('other-sessions-text')
var otherAverageText = document.getElementById('other-average-text')
var otherHourlyText = document.getElementById('other-hourly-text')
var otherBio = document.getElementById('other-bio')


//Home Functions _____________________________________________________________________________
home.addEventListener('click', function(){
    loadHome()
})

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

        featuredTutorRating.innerHTML = await getRatingForUser(featuredID)

        featuredTutorBlock.addEventListener('click', function(){
            showTutorModal(featuredID)
        })

    })
}

await function showTutorModal(tutorID) {
    tutorModal.style.display = 'flex'

    var name
    var profileImage
    var bio
    var average = await getRatingForUser(tutorID)
    var sessions = await getCountOfSessions(tutorID)

    userDB.collection('userTest').doc(tutorID).get().then(function(doc) {
        tutorData = doc.data()

        name = tutorData.name
        profileImage = tutorData.profileImage
        bio = tutorData.bio
        hourly = tutorData.pricePHH *2

        //create Photo element because setting src doesn't work :/
		otherImageBlock.removeChild(otherImageBlock.firstChild)
        var tutorsProfilePhoto = document.createElement('img') 
        tutorsProfilePhoto.setAttribute('class', 'other-tutor-photo')
        tutorsProfilePhoto.src = profileImage
        otherImageBlock.appendChild(tutorsProfilePhoto)

        otherName.innerHTML = name
        otherSessionsText.innerHTML = sessions
        otherAverageText.innerHTML = average
        otherHourlyText.innerHTML = hourly
        otherBio.innerHTML = bio

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

    if (rating == 0) {
        return ('NEW')
    } else {
        return sessions
    }
}

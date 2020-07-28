//Ambassadors information
var email = document.getElementById('ambassador-email')
var firstName = document.getElementById('ambassador-email')
var lastName = document.getElementById('ambassador-email')
var phoneNumber = document.getElementById('ambassador-email')
var password = document.getElementById('ambassador-email')
var school = document.getElementById('ambassador-email')
var year = document.getElementById('ambassador-email')
var major = document.getElementById('ambassador-email')
var nearCampus = document.getElementById('ambassador-email')
var organizations = document.getElementById('ambassador-email')
var offCampus = document.getElementById('ambassador-email')
var socialMedia = document.getElementById('ambassador-email')
var followers = document.getElementById('ambassador-email')
var socialHandle = document.getElementById('ambassador-email')
var knowEmployees = document.getElementById('ambassador-email')
var howHeard = document.getElementById('ambassador-email')

//Navigation Forms
var basicInfoForm = document.getElementById('ambassador-basic')
var aboutYouForm = document.getElementById('ambassador-about')
var socialMediaForm = document.getElementById('ambassador-social')
var almostDoneForm = document.getElementById('ambassador-almost')

//Navigation Buttons
var basicNextButton = document.getElementById('ambassador-next-basic')
basicNextButton.addEventListener('click', function() {
		basicInfoForm.style.display = "none"
		aboutYouForm.style.display = "flex"
})
var aboutBackbutton = document.getElementById('ambassador-back-about')
basicNextButton.addEventListener('click', function() {
		aboutYouForm.style.display = "none"
		basicInfoForm.style.display = "flex"
})
var aboutNextButton = document.getElementById('ambassador-next-about')
basicNextButton.addEventListener('click', function() {
		aboutYouForm.style.display = "none"
		socialMediaForm.style.display = "flex"
})
var socialBackButton = document.getElementById('ambassador-back-social')
basicNextButton.addEventListener('click', function() {
		socialMediaForm.style.display = "none"
		aboutYouForm.style.display = "flex"
})
var socialNextButton = document.getElementById('ambassador-next-social')
basicNextButton.addEventListener('click', function() {
		socialMediaForm.style.display = "none"
		almostDoneForm.style.display = "flex"
})
var almostBackButton = document.getElementById('ambassador-back-almost')
basicNextButton.addEventListener('click', function() {
		almostDoneForm.style.display = "none"
		socialMediaForm.style.display = "flex"
})











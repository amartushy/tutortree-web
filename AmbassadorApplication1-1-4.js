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
basicNextButton.setAttribute('onClick', 'showForm(1)')

var aboutBackbutton = document.getElementById('ambassador-back-about')
aboutBackbutton.setAttribute('onClick', 'showForm(0)')

var aboutNextButton = document.getElementById('ambassador-next-about')
aboutNextButton.setAttribute('onClick', 'showForm(2)')

var socialBackButton = document.getElementById('ambassador-back-social')
socialBackButton.setAttribute('onClick', 'showForm(1)')

var socialNextButton = document.getElementById('ambassador-next-social')
socialNextButton.setAttribute('onClick', 'showForm(3)')

var almostBackButton = document.getElementById('ambassador-back-almost')
almostBackButton.setAttribute('onClick', 'showForm(2)')

function showForm(formInt) {
	var formsArray = [basicInfoForm, aboutYouForm, socialMediaForm, almostDoneForm]
	
	for (i=0; i < formsArray.length; i++) {
		if (i == formInt) {
			formsArray[i].style.display = "flex"
		} else {
			formsArray[i].style.dispay = "none"
		}
	}
}










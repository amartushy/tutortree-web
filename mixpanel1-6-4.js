/*

This script organizes all event and user tracking functions for mixpanel. 

It is split into a few sections, separated by user journey:

1) Tutor Signup, Hiring & Vetting Process
2) Ambassador Signup, Hiring & Vetting Process
3) Student Signup Process

//test by duplicating the sign up pages and 


*/

/////////////////////////////////// TUTOR PROCESS ////////////////////////////////////

//This funciton executes when a user loads the tutor sign up page

function mpTutorSignupPageViewed(){
	mixpanel.track("Tutor Sign Up Page View");
}

//This funciton executes when a user signs up for a tutor account


function mpTutorSignUp(user){
	mixpanel.identify();
	
	//tracks the event of tutor signing up
	mixpanel.track("Tutor Sign Up", {
		'How Heard' : user.howHeard,
		'School Name' : user.school
	})
	
	mixpanel.people.set({
		"School Name": user.school,
        	"$first_name": user.firstName,
        	"$last_name": user.lastName,
		"$name" : user.firstName + " " + user.lastName,
        	"$email": user.email,
        	"$phone": user.phoneNumber,
        	"How Heard": user.howHeard,
		"Major": user.major,
		"Courses Seeking to Tutor": user.courses,
		"Academic Year": user.year,
        	"Tutor User": true,
        	"Tutor Interview Requested": false,
        	"Tutor Interview Completed": false,
        	"Submitted Transcript": false,
        	"Submitted Faculty Rec": false,
		"Reached Resolution Stage": false,
		"Tutor Application Stage": "Account Created",
		"Tutor Application Resolution": "Not yet offered",
        	"Tutor Accepted Position": false,
		"Tutor Application Date": new Date().toISOString(),
		"Referral": user.referredBy,
		"Interest in Tutoring": user.whyTutor,
		"Groups Involved": user.groups
	})
}

function mpExistingTutorSignUp(user){
	mixpanel.alias(user.email);
	
	//tracks the event of tutor signing up
	mixpanel.track("Tutor Sign Up", {
		'How Heard' : user.howHeard,
		'School Name' : user.school
	})
	
	mixpanel.people.set({
		"School Name": user.school,
        	"$first_name": user.firstName,
        	"$last_name": user.lastName,
		"$name" : user.firstName + " " + user.lastName,
        	"$email": user.email,
        	"$phone": user.phoneNumber,
        	"How Heard": user.howHeard,
		"Major": user.major,
		"Courses Seeking to Tutor": user.courses,
		"Academic Year": user.year,
        	"Tutor User": true,
        	"Tutor Interview Requested": false,
        	"Tutor Interview Completed": false,
        	"Submitted Transcript": false,
        	"Submitted Faculty Rec": false,
		"Reached Resolution Stage": false,
		"Tutor Application Stage": "Account Created",
		"Tutor Application Resolution": "Not yet offered",
        	"Tutor Accepted Position": false,
		"Tutor Application Date": new Date().toISOString(),
		"Referral": user.referredBy,
		"Interest in Tutoring": user.whyTutor,
		"Groups Involved": user.groups
	})
}


//This funciton executes when a tutor user clicks the request virtual interview button

function mpRequestVirtualInterview(){
	mixpanel.identify();
	
	mixpanel.track("Tutor Interview Requested");

	mixpanel.people.set({
		"Tutor Interview Requested": true,
		"Tutor Application Stage": "Interview Requested",		
		"Tutor Interview Requested Date": new Date().toISOString()
	});

}

//This funciton executes when a tutor user uploads a file and clicks "submit transcript" button

function mpTranscriptUpload(){
	mixpanel.identify();	
	
	mixpanel.track("Submitted Transcript");

	mixpanel.people.set({
		"Submitted Transcript": true,
		"Tutor Application Stage": "Transcripts Submitted",		
		"Submitted Transcript Date": new Date().toISOString()
	});

}

//This funciton executes when a tutor user uploads their faculty rec and clicks "Submit Faculty Rec" button

function mpFacultyRecUpload(){
	mixpanel.identify();
	
	mixpanel.track("Submitted Faculty Rec", {
		"Faculty Rec Submitted by Tutor Prospect": true
	});

	mixpanel.people.set({
		"Submitted Faculty Rec": true,
		"Tutor Application Stage": "Faculty Rec Submitted",		
		"Submitted Faculty Rec Date": new Date().toISOString()
	});

}

function mpFacultyRecUploadByTutorCoordinator(email){
	mixpanel.identify(email)
	;	
	mixpanel.track("Submitted Faculty Rec", {
		"Faculty Rec Submitted by Tutor Prospect": false
	});

	mixpanel.people.set({
		"Submitted Faculty Rec": true,
		"Tutor Application Stage": "Faculty Rec Submitted",		
		"Submitted Faculty Rec Date": new Date().toISOString()
	});

}

//This funciton executes when Meghan updates the values in the tutor dashboard
//function called after entering values into the interview # field

function mpInterviewCompleted(applicantsID, email){

	mixpanel.identify(email);
	
	mixpanel.people.set({
		"Tutor Interview Completed": true,
		"Tutor Application Stage": "Interview Completed",		
		"Tutor Interview Completed Date": new Date().toISOString()
	});	

	
	mixpanel.track("Tutor Interview Completed");

}

function mpReverseInterviewCompleted(applicantsID, email){
	
	mixpanel.identify(email);

	mixpanel.people.set({
		"Tutor Interview Completed": false,
		"Tutor Application Stage": "Reversed Interview",
		"Tutor Interview Completed Date": null
	});
	
	mixpanel.track("Tutor Reverse Interview Completed");

}

//This funciton executes when a tutor user is approvaed but still might need to complete some steps to be granted access
//Approved button

function mpIsFirstApprovedTutorAppResolution(email){
	mixpanel.identify(email);
	
	mixpanel.track("Tutor Application Resolution", {
		"Tutor Application Resolution" : "Extended Offer"
	});
	
	mixpanel.people.set({
		"Tutor Application Resolution" : "Extended Offer",
		"Tutor Application Stage": "Extended Offer",		
		"Reached Resolution Stage": true,
		"Resolution Stage Date": new Date().toISOString()
	});

}

//This funciton executes when a tutor user is waitlisted
//Wait listed button

function mpIsWaitListedTutorAppResolution(email){
	mixpanel.identify(email);
	
	mixpanel.track("Tutor Application Resolution", {
		"Tutor Application Resolution" : "Wait Listed"
	});
	
	mixpanel.people.set({
		"Tutor Application Resolution" : "Wait Listed",
		"Tutor Application Stage": "Wait Listed",		
		"Reached Resolution Stage": true,
		"Resolution Stage Date": new Date().toISOString()
	});

}

//This funciton executes when a tutor user is rejected
//Rejcted button

function mpIsRejectedTutorAppResolution(email){
	mixpanel.identify(email);
	
	mixpanel.track("Tutor Application Resolution", {
		"Tutor Application Resolution" : "Rejected"
	});
	
	mixpanel.people.set({
		"Tutor Application Resolution" : "Rejected",
		"Tutor Application Stage": "Rejected",		
		"Reached Resolution Stage": true,
		"Resolution Stage Date": new Date().toISOString()
	});

}

function mpUserWebsiteLogin(email, tutorApplicant){
	mixpanel.identify(email);
	
	mixpanel.track("User Signed into Site", {
		"Is Tutor" : tutorApplicant
	})
	
	mixpanel.people.set({
		"User Logged into Website" : true
	});

}


/////////////////////////////////// AMBASSADOR PROCESS ////////////////////////////////////

//This funciton executes when a user views the ambassador sign up page

function mpAmbassadorSignupPageViewed(){
	mixpanel.track("Ambassador Sign Up Page Viewed");
}


//This funciton executes when a user signs up for an ambassador 

function mpAmbassadorAccountCreated(user){
	mixpanel.alias(user.email);

	mixpanel.track("Ambassador Sign Up",{
		"School Name": user.school,
		"How Heard": user.howHeardField
	});
	//
	mixpanel.people.set({
		"School Name": user.school,
        	"$first_name": user.firstName,
        	"$last_name": user.lastName,
        	"$email": user.email,
        	"$phone": user.phoneNumber,
        	"How Heard": user.howHeardField,
        	"Lives Near Campus": user.livesNearCampus,
        	"Organization Involvement": user.organizations,
        	"Favorite Off Campus Location": user.favoriteOffCampus,
        	"Largest Social Media Following Service": user.socialMediaField,
        	"Number of Followers at Largerst Social Media Service": user.numberOfFollowers,
        	"Knows Anyone at TutorTree": user.knowsEmployees,
        	"Social Handle": user.socialHandle,
        	"Ambassador User": true,
        	"Ambassador Hiring Status": "Not yet Interviewed",
		"Academic Year": user.year,
		"Major": user.major
	});

}


//This funciton executes when a user loads the sign up page

function mpAmbassadorReviewed(email, acceptedOrRejected){
	mixpanel.identify(email);
	
	mixpanel.track("Ambassador Reviewed");

	mixpanel.people.set({
		"Ambassador Hiring Status": acceptedOrRejected
	});
}


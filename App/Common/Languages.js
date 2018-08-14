// import LocalizedStrings from 'react-native-localization'

/* API
 setLanguage(languageCode) - to force manually a particular language
 getLanguage() - to get the current displayed language
 getInterfaceLanguage() - to get the current device interface language
 formatString() - to format the passed string replacing its placeholders with the other arguments strings
 */

const Languages = {
	en: {
		//Root (Home)
		home: 'Home',
		readlater: 'Read Later',
		category: 'Category',
		back: ' Back',
		textFilter: 'Recent',

		//Login Form
		passwordUp: 'PASSWORD',
		passwordnor: 'password',
		forgotPassword: 'Forget password',
		for: 'Forgot Password',
		login: 'Sign In',
		loginSuccess: "Sign In Successfull",
		noAccount: 'Do not have an account?',
		signup: 'Sign Up',
		signupSuccess: "Sign Up Successfull",

		// MenuSide
		news: 'News',
		contact: 'Contact',
		aboutus: 'About Us',
		setting: 'Setting',
		search: 'Search',
		logout: "Logout",

		// Post
		post: 'Post',
		posts: 'Posts',
		feature: 'Feature articles',
		days: 'days',
		editorchoice: 'Editor Choice',

		// PostDetail
		comment: 'Comment',
		yourcomment: 'Your Comment',
		relatedPost: 'Related Post',

		all: 'All',
		forLife: 'for lifestyle people',
		powerBy: 'Power by Carnival',
		video: 'Video',
		fontSize: 'Content font size',
		email: 'EMAIL',
		enterEmail: 'Enter your email',
		enterPassword: 'Type your password',
		photo: 'Photo',
		clear: 'Clear All',
		by: "by",
		name: 'NAME',
		enterName: 'Enter name',
		send: 'Send',
		commentSubmit: 'Your Comment is sent and waiting for approving',
		recent: 'Recent Posts',

		//Layout
		cardView: 'Card ',
		simpleView: 'List View',
		twoColumnView: 'Two Column ',
		threeColumnView: 'Three Column ',
		listView: 'List View',
		default: 'Default',
		advanceView: 'Advance ',

		//readlater
		textBookMark: 'Bookmarks',
		textPosts: 'Posts',
		noBookmark: 'There is no bookmark item',
    ago: 'ago',
    allCategory: 'All Category',
	},


	///Put other languages here
};

let Language = Languages['en'];

export default Language

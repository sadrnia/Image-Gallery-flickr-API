Description:
Simple Image gallery search with Flickr API that allows a user to enter text in a search field, and which then displays a gallery of images from Flickr.
 Search Image gallery made of single html page which is responsive and comprising three main components:
-	Header (Page title, search Form, submit and showing result tag)
-	List of thumbnails below the form and show up to 60 images on each page.
-	Image Preview which provide large view of Image with next and previous button.
Modules:
-	The Main Module: It contains only extend and buildUrl methods.
-	The Image Module: defines two parameters, List of photos and DOM element which shows large size of image, next and previous method.
-	The Flickr Module:  defines the code that uses the Flickr API.
-	The General Module: Event handlers for the buttons of the gallery, when a user clicks one of the links in the pager, when the user searches for some given tag.


# Popup Help
A simple popup help showing list of topics and the help content. Implemented using Backbone.js and Twitter Bootstrap

## Features
* Direct linking supported, you can open help popup and it directly shows the specified content
* Add new help topic/content easily. Help content files are loaded dynamically
* Customize and style the popup using Twitter Bootstrap

## How to use
* Add popuphelp.js to a subfolder of your web app project. You can name the subfolder `popuphelp` or anything you like.
* Show the popup by just creating popup using JavaScript:
 
   `window.open('popuphelp/', 'popup-help', 'width=1024,height=768;')`
* If you want to show specific help topic 'help01':

   `window.open('popuphelp/#help01', 'popup-help', 'width=1024,height=768;')`

## How to add a new help topic
* Create an HTML file on folder `topics`, containing the help text.
* If you need to add image or asset, add it to folder `topics/img`
* Add an entry at `topics.json` with properties:
    * `id` : unique string identifier, also used for direct linking
    * `contentUrl` : referring to the HTML content
    * `label` : Text to display on topic list on help the sidebar
* Note: By default, `welcome.html` will be displayed as default topic

## Demo
[Demo page](http://abiyasa.github.com/popuphelp.js/)

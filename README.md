# Popup Help
A simple popup help showing list of topics and the help content. Implemented using Backbone.js and Twitter Bootstrap

## Features
* Direct linking supported, you can open help popup and it directly shows the specified content
* Add new help topic/content easily. Help content files are loaded dynamically
* Customize and style the popup using Twitter Bootstrap

## How to use
* Add/extract this popup help to your web app project
* Create a simple javascript to show the popup: TBD

## How to add a new help topic
* Create an HTML file on folder `topics`, containing the help text.
* If you need to add image or asset, add it to folder `topics/img`
* Add an entry at `topics.json` with properties:
    * `id` : unique string identifier, also used for direct linking
    * `contentUrl` : referring to the HTML content
    * `label` : Text to display on topic list on help the sidebar
* Note: By default, `welcome.html` will be displayed as default topic

## Demo
* click here to show popup help with default topic: link (TBD)
* click here to show popup help with default topic: link (TBD)
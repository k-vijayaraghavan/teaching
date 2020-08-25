# Overview
This project is being distributed in the hopes that it would be helpful. I take no responsibilities for the use/misuse and/or the slow heat death of the universe.
This program opens a small (browser) window and displays your webcam. I am using this for my presentation & to project my document camera onto my screen.

# Distributables (exe/appimage)
The windows-exe and linux-appimage are found in the "build" folder.

# Install dependencies
I have not uploaded the node libraries (to save space). This has been tested on npm version version 12 [https://deb.nodesource.com/node_12.x].
To develop this program run:
$ npm install

To run the program
$ npm start


# Acknowledgments
This project was inspired by (and "borrows" some code from)camdesk project -- https://github.com/michaelsboost/CamDesk). That project is no longer being maintianed and there was a need to add the ability to change the resolution (that code used an older electron version and I couldnt get that to work).

This project also relies on (and "borrows" code from) "The WebRTC project" -- https://github.com/webrtc/samples

This project uses electron and used https://electronjs.org/docs/tutorial/quick-start as a guide

Icons: https://commons.wikimedia.org/wiki/File:Webcam_Icon.png [Source	FindIcons; Author	Mazenl77]

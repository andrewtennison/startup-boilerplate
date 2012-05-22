startup-boilerplate
===================

node.js, backbone, socket.IO, mongoDB, with Auth and other excitment backed in!

Inspitation
- https://github.com/cliftonc/express-mvc-bootstrap for MVC setup of node
- http://backbonetutorials.com/ for RequireJS implimentation of backbone


Ideas / features
- user.status should expire after a fixed amount of time, possibly related to "statusScale". How do I track and manage expiration of data? Possibly user.status is an array with "start" and "duration" properties, then when fetching status, if an expired status exists use a .pre to do cleanup, or if recently expired + user session still active, notify the user to update their status
- how to track users status for a list of friends? Possibly keep a copy of status in memory, then when requesting query against this list using user.friend list? PUB/SUB, so create a sub for all friends. When a friend changes status or is online (has session!) PUB('_id:status')
- create a node server to replace nginx, use to serve static assets from subdomain (http://engineering.linkedin.com/nodejs/blazing-fast-nodejs-10-performance-tips-linkedin-mobile)
- backbone single page app vs seo + rendered pages
	- make static work at basic level first. Then for App pages, render whole template with page specific content. bootstrap App with JSON content + some sort of state
	
Performance
- localstorage 
- appChached + iframe breaker
- GZIP
- r() to compile app
- move static assets to another node file server, with node proxy on front




Next Steps
- NON backbone version

v1 - we suggest venues based on users in your friends lists geo locations
v2 - manage a list of suggested / highlighted / voted locations accross a group of users


1. Locations
- location geo lat/long from postcode?

2. Status
- post status, array of status. If current still active, update. If prior is expired add new and delete old
- get geolocation and add to post info
- /status - get all friends statuses (+refresh button prior to websocket, or add polling)
- /status/id - get single friend status > check if friend for permission

3. 
- add friend > notify friend > friend accept > add to your friend list
- friend/id/add POST
- friend gets notification.friendRequest > action > friend/id/accept OR friend/id/reject POST
	- possibly friends user.friend list get updated friend.yourID.status = requested
	- friend also gets notification > simple text string taking them to /friends/request page

- on POST update original /user/id/ friend list + add original request friend 

4. permissions
- prevent anyone other than user/admin making updates to their settings, only allow certain settings to be edited (friends is internal)

5. websockets
- look at adding for user statuses + locations, possibly sub to friends status, pub your own status

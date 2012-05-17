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
- gzip

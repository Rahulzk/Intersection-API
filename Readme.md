It is an intersection API build using NodeJs,ExpressJs and a supporting package turf.js

When we hit the API request, it takes 5000 points in GeoJSON in its body and There are a set of 50 randomly spread lines (just start and end) on the plane and API will give us number of lines out of the 50 lines with ids (L01 - L50) intersect with the linestring.

// to run the app , we need to install all required package
1. npm install 

2. npm run dev

// to test API with postman

go to route 'http://localhost:3000/intersections'

pass lineString in its body as JSON raw data

then send request to server

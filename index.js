const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const turf = require('@turf/turf');



const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(bodyParser.json());


// read line from line.json

const data = fs.readFileSync('./lines.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // Handle the file data
    return data;
});

const lines = JSON.parse(data);
// console.log(typeof(lines),lines[0].line);


// Helper function to check if two line segments intersect
function doLineSegmentsIntersect(line1Start, line1End, line2Start, line2End) {
    // implementation for line intersection check using turf.js 
    const line1 = turf.lineString([line2Start, line2End]);
    const line2 = turf.lineString([line1Start,line1End]);
    const intersection = turf.booleanCrosses(line1, line2);
    return intersection;

}

// functoin to find intersection point
function findIntersectionPoint(line1Start, line1End, line2Start, line2End) {
    const [x1, y1] = line1Start;
    const [x2, y2] = line1End;
    const [x3, y3] = line2Start;
    const [x4, y4] = line2End;

    const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    // Check if the lines are parallel or coincident
    if (denominator === 0) {
        return null; // No intersection point
    }

    const px = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denominator;
    const py = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denominator;

    // Return the intersection point
    return [px, py];
}




// API endpoint
app.post('/intersections', (req, res) => {
    // Check the authenticity of the request ( header-based authentication )

    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    // Check if the request body contains a valid GeoJSON line string
    const lineString = req.body.lineString;
    // console.log(lineString.coordinates);
    if (!lineString || typeof lineString !== 'object' || lineString.type !== 'LineString' || !Array.isArray(lineString.coordinates)) {
        return res.status(400).json({ error: 'Invalid GeoJSON line string' });
    }

    // Find intersections with the given line string
    const intersections = [];
    let len = lines.length;
    for (let i = 0; i < len; i++) {

        if (doLineSegmentsIntersect(lineString.coordinates[0], lineString.coordinates[lineString.coordinates.length - 1], lines[i].line.coordinates[0], lines[i].line.coordinates[1])) {
            // intersections.push({ id: i + 1 });

            intersections.push({ id: i + 1, intersectionPoint: findIntersectionPoint(lineString.coordinates[0], lineString.coordinates[lineString.coordinates.length - 1], lines[i].line.coordinates[0], lines[i].line.coordinates[1]) });
        }
    }

    // Return the intersections or an empty array if no intersections found
    res.json(intersections);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});




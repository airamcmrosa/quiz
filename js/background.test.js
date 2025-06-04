import { Background } from './background.js';

function runBackgroundTests() {
    console.log("--- Running Background Logic Tests ---");

    const mockCanvas = { width: 800, height: 600 };


    // Test Case 1: Background should initialize with a set number of stars.
    try {
        const starCount = 200;
        const background = new Background(starCount, mockCanvas.width, mockCanvas.height);
        const expectedStarCount = starCount;
        const actualStarCount = background.stars.length;

        console.assert(actualStarCount === expectedStarCount, `Test Failed: Star count should be ${expectedStarCount}, but was ${actualStarCount}`);

        if (actualStarCount === expectedStarCount) {
            console.log("✅ Test Passed: Background initialization.");
        }
    } catch (e) {
        console.error("❌ Test Failed: Background initialization.", e);
    }

    // Test Case 2: Each star should have essential properties.
    try {
        const background = new Background(1, mockCanvas.width, mockCanvas.height);
        const star = background.stars[0];
        const properties = ['x', 'y', 'size', 'speed'];
        let allPropertiesExist = true;

        for (const prop of properties) {
            const hasProperty = star.hasOwnProperty(prop);
            const isNumber = typeof star[prop] === 'number';

            console.assert(hasProperty, `Test Failed: Star should have a '${prop}' property.`);
            console.assert(isNumber, `Test Failed: Star property '${prop}' should be a number.`);

            if (!hasProperty || !isNumber) {
                allPropertiesExist = false;
            }
        }

        if (allPropertiesExist) {
            console.log("✅ Test Passed: Star property creation.");
        }
    } catch (e) {
        console.error("❌ Test Failed: Star property creation.", e);
    }

    console.log("--- All Background Tests Finished ---");
}

runBackgroundTests();
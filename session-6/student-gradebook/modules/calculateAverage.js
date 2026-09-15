/**
 * Module: calculateAverage
 * Calculates average of an array of grades
 */

/**
 * Calculates the arithmetic mean of an array of numerical grades
 * @param {Array<number>} grades - Array of grade numbers
 * @returns {number} The calculated average (rounded to 2 decimal places)
 */
function calculateAverage(grades) {
  if (!Array.isArray(grades) || grades.length === 0) {
    return 0;
  }

  const sum = grades.reduce((acc, grade) => acc + grade, 0);
  const average = sum / grades.length;
  return Math.round((average + Number.EPSILON) * 100) / 100;
}

module.exports = calculateAverage;

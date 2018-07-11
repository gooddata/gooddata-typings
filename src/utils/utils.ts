/**
 * Tests if the provided object is empty, i.e., either null or undefined.
 * @param {any} object - the object to be tested
 * @returns {boolean} - true if object is either null or undefined, false if it is anything else
 */
export function isEmpty(object: any): boolean {
    return object === undefined || object === null;
}

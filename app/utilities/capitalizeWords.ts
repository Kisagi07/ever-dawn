/**
 * Capitalizes the first letter of each word in a given string.
 *
 * @param str - The input string to be transformed.
 * @returns A new string with the first letter of each word capitalized.
 */
export default function capitalizeWords(str: string) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

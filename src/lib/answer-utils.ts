/**
 * Normalizes text answers for comparison by:
 * - Converting to lowercase
 * - Trimming whitespace
 * - Normalizing internal whitespace (multiple spaces → single space)
 * - Removing extra characters that don't affect mathematical meaning
 */
export function normalizeAnswer(answer: string): string {
  if (!answer)
    return ''

  return answer
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\s*=\s*/g, '=') // Remove spaces around equals signs
    .replace(/\s*\+\s*/g, '+') // Remove spaces around plus signs
    .replace(/\s*-\s*/g, '-') // Remove spaces around minus signs
    .replace(/\s*\*\s*/g, '*') // Remove spaces around multiplication
    .replace(/\s*\/\s*/g, '/') // Remove spaces around division
    .replace(/\s*\(\s*/g, '(') // Remove spaces around parentheses
    .replace(/\s*\)\s*/g, ')')
}

/**
 * Checks if a user's answer matches any of the acceptable answers
 * using normalized comparison
 */
export function isAnswerCorrect(userAnswer: string | null | undefined, correctAnswers: string[] | null | undefined): boolean {
  if (!userAnswer || !correctAnswers || correctAnswers.length === 0) {
    return false
  }

  const normalizedUserAnswer = normalizeAnswer(userAnswer)

  return correctAnswers.some(correctAnswer =>
    normalizeAnswer(correctAnswer) === normalizedUserAnswer,
  )
}

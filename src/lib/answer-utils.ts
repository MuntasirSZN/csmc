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

  const text = String(answer).toLowerCase().trim()

  // Avoid potentially expensive regexes like /\s*=\s*/g (ReDoS-friendly on long whitespace runs)
  // by using deterministic replacements for common operators.
  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replaceAll(' = ', '=')
    .replaceAll('= ', '=')
    .replaceAll(' =', '=')
    .replaceAll(' + ', '+')
    .replaceAll('+ ', '+')
    .replaceAll(' +', '+')
    .replaceAll(' - ', '-')
    .replaceAll('- ', '-')
    .replaceAll(' -', '-')
    .replaceAll(' * ', '*')
    .replaceAll('* ', '*')
    .replaceAll(' *', '*')
    .replaceAll(' / ', '/')
    .replaceAll('/ ', '/')
    .replaceAll(' /', '/')
    .replaceAll('( ', '(')
    .replaceAll(' (', '(')
    .replaceAll(') ', ')')
    .replaceAll(' )', ')')
}

/**
 * Checks if a user's answer matches any of the acceptable answers
 * using normalized comparison
 */
export function isAnswerCorrect(
  userAnswer: string | null | undefined,
  correctAnswers: string[] | null | undefined,
): boolean {
  if (!userAnswer || !correctAnswers || correctAnswers.length === 0) {
    return false
  }

  const normalizedUserAnswer = normalizeAnswer(userAnswer)

  return correctAnswers.some(
    correctAnswer => normalizeAnswer(correctAnswer) === normalizedUserAnswer,
  )
}

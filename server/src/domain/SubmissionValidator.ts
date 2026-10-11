export const MIN_SUBMISSION_LENGTH = 50;
// Every submission is sent to a paid LLM call, so cap its size.
export const MAX_SUBMISSION_LENGTH = 10_000;
export const MAX_ASSUMPTIONS_LENGTH = 2_000;

/**
 * The deterministic, fail-fast check on a submission: required field present,
 * minimum length. Runs synchronously at the API boundary (POST /api/attempts)
 * before an Attempt is ever persisted or Gemini is invoked — a submission
 * that fails this never becomes an Attempt, so it can never show up mixed in
 * with real architectural feedback.
 *
 * Returns an error message if invalid, or null if the submission may proceed
 * to persistence + LLM evaluation.
 */
export function validateSubmissionText(text: unknown): string | null {
  if (typeof text !== 'string' || text.trim().length === 0) {
    return 'Design text is required.';
  }
  if (text.trim().length < MIN_SUBMISSION_LENGTH) {
    return `Design text must be at least ${MIN_SUBMISSION_LENGTH} characters (got ${text.trim().length}).`;
  }
  if (text.length > MAX_SUBMISSION_LENGTH) {
    return `Design text must be at most ${MAX_SUBMISSION_LENGTH} characters (got ${text.length}).`;
  }
  return null;
}

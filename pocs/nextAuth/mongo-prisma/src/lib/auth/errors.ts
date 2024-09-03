export async function parseCauthError(error: unknown) {
  if ((error as { code: string }).code === 'ETIMEDOUT') {
    return {
      error: 'Unable to connect to the database. Please try again later.',
    };
  } else if ((error as { code: string }).code === '503') {
    return {
      error: 'Service temporarily unavailable. Please try again later.',
    };
  }
  return { error: 'An unexpected error occurred. Please try again later.' };
}
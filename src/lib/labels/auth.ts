export const AUTH = {
  logIn: 'Log in',
  logOut: 'Log out',
  createAccount: 'Create account',
  register: 'Register',
  noAccountPrompt: "Don't have an account?",
  hasAccountPrompt: 'Already have an account?',
  passwordShow: 'Show',
  passwordHide: 'Hide',
  passwordMinLengthHint: 'At least 8 characters.',
  emailAlreadyExists: 'An account with this email already exists.',
  tooManyAttempts: (retryAfterSeconds: unknown) =>
    `Too many attempts. Try again in ${retryAfterSeconds ?? 'a few'} seconds.`,
} as const;

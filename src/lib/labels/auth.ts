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

  loginHeading: 'Welcome back',
  loginSubtitle: 'Log in to pick up where you left off.',
  registerHeading: 'Create your account',
  registerSubtitle: 'Start reporting and tracking incidents in under a minute.',
  emailLabel: 'Email',
  passwordLabel: 'Password',
  nameLabel: 'Name',
  emailPlaceholder: 'you@company.com',
  namePlaceholder: 'Your full name',
  signingIn: 'Signing in…',
  creatingAccount: 'Creating account…',
  showPassword: 'Show password',
  capsLockOn: 'Caps Lock is on.',
  clearanceNotice:
    'New accounts start at clearance 1. If you report a high-severity incident, you may not be able to view it afterwards — an investigator or manager can still act on it.',
  welcomeBack: (name: string) => `Welcome back, ${name}`,
  accountCreated: 'Account created — you are signed in.',
  checkHighlightedFields: 'Check the highlighted fields and try again.',

  logoutConfirm: {
    title: 'Log out?',
    body: "You'll need to log in again to pick up where you left off.",
    confirm: 'Log out',
  },

  strength: {
    meterLabel: 'Password strength',
    levels: {
      empty: 'Not set',
      weak: 'Weak',
      fair: 'Fair',
      good: 'Good',
      strong: 'Strong',
    },
    required: 'Required',
    checks: {
      minLength: 'At least 8 characters',
      mixedCase: 'Upper and lower case letters',
      number: 'A number',
      symbol: 'A symbol',
    },
    met: 'met',
    notMet: 'not met',
  },

  showcase: {
    regionLabel: 'Product highlights',
    previous: 'Previous highlight',
    next: 'Next highlight',
    pause: 'Pause highlights',
    play: 'Play highlights',
    goToSlide: (position: number, title: string) => `Show highlight ${position}: ${title}`,
    slideOf: (position: number, total: number) => `${position} of ${total}`,
    slides: [
      {
        id: 'report',
        title: 'Report in under a minute',
        body: 'Capture what happened, pick a type and severity, and get a reference number you can track.',
      },
      {
        id: 'triage',
        title: 'Triage without the noise',
        body: 'One queue to acknowledge, re-grade severity and assign the right investigator.',
      },
      {
        id: 'investigate',
        title: 'Investigate, then close with a root cause',
        body: 'Confidential notes, a full timeline, and a reviewed closure with corrective action.',
      },
      {
        id: 'escalate',
        title: 'Nothing slips past its SLA',
        body: 'Unacknowledged incidents escalate automatically, and clearance levels keep sensitive ones scoped.',
      },
    ],
  },
} as const;

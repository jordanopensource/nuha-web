export default {
  link: {
    statistics: 'Statistics',
    learnMore: 'Learn more',
  },

  header: {
    whatIsNuha: 'What is Nuha?',
    howItWorks: 'How it works?',
    signIn: 'Sign in',
    userMenu: {
      dashboard: 'Dashboard',
      settings: 'Settings',
      signOut: 'Sign out',
    },
  },

  intro: {
    text: 'An AI-enabled ',
    sub: 'Monitor of Online Gender Based Hate Speech',
  },

  waitlist: {
    join: 'Join the waitlist',
    enterEmail: 'Enter your email',
    email: 'Email',
    done: 'Done',
    close: 'Close',
    send: {
      success: 'Message was sent successfully!',
      fail: 'Something went wrong! Please try again later.',
    },
  },

  statistical: {
    info: "The General Aspect focuses on effective advocacy and campaigning towards online hate speech, especially those targeting women public spaces in Jordan including women activists, human rights defenders and journalists, social media influencers and women in, on quantitative data. Hence, JOSA Will be identifying at least 100 Women' activist in Jordan based on a specific selection criterion to  their social media accounts (Facebook and twitter) and hate-speech attacks they receive. JOSA researchers Will collect this data using different methods, classify it into different categories while taking into consideration the behaviors identified.",
    tooltip: {
      type: 'Type',
      percentage: 'Percentage',
    },
  },

  nuha: {
    title: 'What is Nuha?',
    body: 'Nuha, is an AI that aims to detect and classify hate speech against women in digital spaces, such as social media platforms. Nuha, which derives from the Arabic word for "mind" or "brain," represents a critical step forward in addressing the pervasive issue of cyber-gender-based and sexist hate speech against women.',
    work: {
      title: 'How it works?',
      body: 'Nuha model is being trained using a dataset obtained by monitoring 20 trending hashtags related to women and the feminist movement in Jordan, as well as 83 names of women activists and women influencers in Jordan. The dataset was collected from 112 Facebook posts and Twitter tweets and contains over 20,000 comments. The majority of the content collected was from Facebook, but more content is intended to be collected from Twitter pending access to the Twitter API. The process of data augmentation involved manipulating certain data samples to create additional but similar samples that could be used to train the Nuha model. Once the model has reached the highest F1 score possible.',
    },
  },

  data: {
    hateSpeech: 'Hate speech',
    positiveSpeech: 'Positive speech',
    unrelated: 'Unrelated to discussion',
    neutral: 'Neutral',
  },

  dashboard: {
    comment: {
      header: 'Insert the comment and its context',
      content: 'Insert comment',
      context: "Insert comment's context",
    },
    fileUpload: {
      header: 'Upload a file with suspected hate speeches',
      selectFile: 'Select a file',
      downloadTempalte: 'Download template',
      selected: 'Selected',
    },
    submit: 'Submit',
    or: 'OR',
  },
}

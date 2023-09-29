export default {
  homeHero: {
    title: 'Nuha',
    intro:
      'An open source AI-enabled tool to assist researchers in discovering online gender-based hate speech in Arabic',
    tryItOut: 'Try it out',
  },

  link: {
    statistics: 'Statistics',
    learnMore: 'Learn more',
  },

  header: {
    whatIsNuha: 'What is Nuha?',
    howItWorks: 'How it works?',
    login: 'Login',
    userMenu: {
      dashboard: 'Dashboard',
      settings: 'Settings',
      signOut: 'Sign out',
    },
  },
  footer: {
    copyright: "Jordan Open Source Association (JOSA) © 2021-2023",
    links: {
      about: "About the Project",
      github: "GitHub",
      terms: "Terms and Policies",
      privacy: "Privacy Policy"
    }
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
  methodology: {
    title: 'Methodology',
    description: 'Our text models are advanced language processing tools that can generate, classify, and summarize text with high levels of coherence and accuracy.'
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
    confidenceScore: 'Confidence Score',
    comment: 'Comment',
    type: 'Type',
    f1Score: 'F1 Score',
    downloadResults: 'Download Results',
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
    tab: {
      file: 'File',
      comment: 'Comment',
    },
    submit: 'Submit',
    or: 'OR',
  },

  status: {
    success: 'Success',
    failed: 'Failed',
    uploadWasSuccessful: 'Upload was successful',
    selectAFileToUpload: 'Select a file to upload',
    commentCantBeEmpty: 'Comment can not be empty',
  },

  login: {
    header: 'Login to Nuha',
    withGithub: 'Login using GitHub',
    withJosaId: 'Login using JOSA ID',
    withMagicEmail: 'Email me a magic link',
  },

  predictionResult: {
    commentTypeMsg: "Nuha has found that this post's comment is",
    f1ScoreMsg: 'Nuha is %s% confident about the prediction result.',
    title: 'Prediction Results',
    percentage: 'Percentage',
    count: 'Count',
    details: 'Details',
  },

  apiResponse: {
    missingComment: 'Invalid data: missing data `comment`',
    missingPost: 'Invalid data: missing data `post`',
    commentOnlyContainingNumbers:
      'Invalid data: comment is only containing numbers',
    postOnlyContainingNumbers: 'Invalid data: post is only containing numbers',
    commentContainsEmail: 'Invalid data: comment contains an email address',
    postContainsEmail: 'Invalid data: post contains an email address',
    commentContainsUrl: 'Invalid data: comment contains a URL',
    postContainsUrl: 'Invalid data: post contains a URL',
    invalidFileType: 'Invalid file type',
    emptyFile: 'The input file must have at least one row of data',
    invalidInputData: 'Invalid input data',
    internalError: 'Internal error!',
  },
}

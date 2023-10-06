export default {
  homeHero: {
    title: 'Nuha',
    intro:
      'An open source AI-enabled tool to assist researchers in discovering online gender-based hate speech in Arabic.',
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
    copyright: 'Jordan Open Source Association (JOSA) © 2021-2023',
    links: {
      about: 'About the Project',
      github: 'GitHub',
      terms: 'Terms and Policies',
      privacy: 'Privacy Policy',
    },
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
    description:
      'Our text models are advanced language processing tools that can generate, classify, and summarize text with high levels of coherence and accuracy.',
    aboutProject: 'About this project',
    aboutProjectDescription:
      'Nuha, is an AI that aims to detect and classify hate speech against women in digital spaces, such as social media platforms. Nuha, which derives from the Arabic word for "mind" or "brain," represents a critical step forward in addressing the pervasive issue of cyber-gender-based and sexist hate speech against women.',
    detailed: 'Detailed Methodology',
    detailedDescription:
      'Nuha model is being trained using a dataset obtained by monitoring 20 trending hashtags related to women and the feminist movement in Jordan, as well as 83 names of women activists and women influencers in Jordan.',
    ethical: 'Ethical considerations',
    ethicalDescription:
      'Nuha model is being trained using a dataset obtained by monitoring 20 trending hashtags related to women and the feminist movement in Jordan, as well as 83 names of women activists and women influencers in Jordan.',
    content: 'Content',
    figure: 'Figure',
    footnotes: 'Footnotes',
    sections: {
      about: {
        title: 'About this project',
        firstParagraph: {
          title: 'What is Nuha?',
          p1: 'Nuha, an artificial intelligence system, aspires to proficiently identify and categorize instances of hate speech targeted towards women within the realm of digital platforms, particularly within the domain of social media. This innovative AI solution, aptly named "Nuha" - originating from the Arabic lexicon, wherein it conveys the essence of the "mind" or "brain" - signifies a pivotal stride in confronting the enduring and ubiquitous problem of misogynistic and gender-biased hate speech in cyberspace.',
          p2: 'The contemporary digital landscape has ushered in an era of unprecedented connectivity and information dissemination, engendering a virtual realm where individuals from diverse backgrounds converge to share ideas, opinions, and experiences. Within this expansive digital realm, however, a disconcerting phenomenon has emerged - the proliferation of hate speech directed at women. This odious form of expression constitutes a severe violation of human rights and adversely impacts the well-being and participation of women in online spaces.',
          fig1: 'Life cycle of Machine Learning as adopted in Nuha.',
        },
        secondParagraph: {
          title: 'How Nuha can be helpful for researchers?',
          p1: "The advent of Nuha underscores the dire need for comprehensive, technologically-driven approaches to tackle the burgeoning challenge of online misogyny and gender-based hate speech. Discriminatory and hostile language, aimed squarely at women, threatens not only the emotional and psychological well-being of its targets but also hampers their ability to engage fully in digital discourse. In order to construct a nuanced understanding of Nuha's significance, it is imperative to delve into the multifaceted aspects of its development and operation, which are rooted in cutting-edge artificial intelligence and natural language processing.",
          p2: "Nuha's foundational framework draws extensively from the ever-evolving field of artificial intelligence, which encompasses a wide array of machine learning algorithms, neural networks, and data-driven methodologies. At its core, Nuha relies on advanced machine learning techniques to discern patterns, linguistic cues, and contextual nuances within digital content. This approach allows Nuha to distinguish between benign expressions of opinion and hate speech that directly targets women, offering a sophisticated and data-driven response to the ongoing crisis of gender-based online harassment.",
        },
        footnotes: {
          1: 'John Smith, "Artificial Intelligence Advancements in the 21st Century," Journal of Emerging Technologies 45, no. 3 (2022): 67-82, doi:10.1234/jet.2022.45.3.',
          2: 'Jane Doe, "Ethical Considerations in AI Development," AI Ethics Symposium Proceedings (Chicago: University of Chicago Press, 2021), 112.',
        },
      },
      detailed: {
        title: 'Detailed Methodology',
      },
      ethics: {
        title: 'Ethical Considerations',
      },
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
    confidenceScore: 'Confidence Score',
    comment: 'Comment',
    type: 'Type',
    f1Score: 'F1 Score',
    downloadResults: 'Download Results',
  },

  dashboard: {
    title: 'Nuha',
    description:
      'Our text models are advanced language processing tools that can generate, classify, and summarize text with high levels of coherence and accuracy.',
    steps: {
      step1: {
        name: 'Before you start',
        description:
          "1. The model analyses text in Arabic only.\n2. It's important to note that this AI model is still experimental, and not all of its generated results may be entirely factual.",
      },
      step2: {
        name: 'Analyse your text',
        description: 'Insert an Arabic text to be analyzed.',
      },
    },
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

  misc: {
    readMore: 'Read more',
  },
}

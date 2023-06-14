export default {
  link: {
    statistics: 'Statistics',
    learnMore: 'Learn more',
  },

  header: {
    whatIsNuha: 'What is Nuha?',
    howItWorks: 'How it works?',
  },

  intro: {
    text: 'An AI-enabled ',
    sub: 'Monitor of Online Gender Based Hate Speech',
  },

  waitlist: {
    join: 'Join the waitlist',
    enterEmail: 'Enter your email',
    done: 'Done',
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
      body: "JOSA conducted consultations with the TAMAM coalition, which is a group of local partners in Jordan that work on women's rights issues (CSOs, Academic Institutions, and individuals). \n\n The coalition played a key role in assisting with the gathering of the dataset that is being used to train the Nuha model. The dataset was obtained by monitoring 20 trending hashtags related to women and the feminist movement in Jordan, as well as 83 names of women activists and women influencers in Jordan. This resulted in the collection of over 20,000 comments from 112 Facebook posts and Twitter tweets. The majority of the content collected was from Facebook, but we intend to collect more content from Twitter, pending access to the Twitter API (refer to the limitations section for more details). \n\n The process of data augmentation involved manipulating certain data samples to create additional but similar samples that could be used to train the Nuha model. Specifically, we utilized an open source model called AraBERT (by the American University of Beirut) to substitute some words within the hate speech comments with semantically similar words. This method was adopted to artificially generate more hate speech samples and help to balance our dataset. \n\n Once the model has reached the highest F1 score possible, the next step will be to serve the tool by building a user-friendly interface and releasing Nuha. A more detailed and mature report on project Nuha, including the final results of the model, will be shared in the next regional report. ",
    },
  },

  data: {
    hateSpeech: 'Hate speech',
    positiveSpeech: 'Positive speech',
    unrelated: 'Unrelated to discussion',
    neutral: 'Neutral',
  },
}

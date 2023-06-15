export default {
  link: {
    statistics: 'الإحصائيات',
    learnMore: 'تعرف علينا',
  },

  header: {
    whatIsNuha: 'تعرف على نهى',
    howItWorks: 'كيف يعمل',
  },

  intro: {
    text: 'اداة مراقبة تستخدم الذكاء الاصطناعي ',
    sub: 'لتصنيف خطاب الكراهية القائم على الجنس عبر الانترنت',
  },

  waitlist: {
    join: 'سجل مسبقا',
    enterEmail: 'ادخل بريدك الالكتروني',
    done: 'تم',
    email: 'البريد الإلكتروني',
    send: {
      success: 'تم الإشتراك بنجاح!',
      fail: 'عفوا, حصل خلل ما! الرجاء المحاولة فيما بعد.',
    },
  },

  statistical: {
    info: 'تركز الجانب العام على الدعوة والحملات الفعالة ضد خطاب الكراهية عبر الإنترنت، وخاصة تلك التي تستهدف المرأة في الأماكن العامة في الأردن بما في ذلك ناشطات حقوق الإنسان والصحفيات والمؤثرات على وسائل التواصل الاجتماعي والنساء في البيانات الكمية. وبالتالي، ستقوم JOSA بتحديد ما لا يقل عن 100 ناشطة نسائية في الأردن بناءً على معيار اختيار محدد لحساباتهن على وسائل التواصل الاجتماعي (Facebook و Twitter) والهجمات التي تتعرض لها من خطاب الكراهية. سيقوم باحثو JOSA بجمع هذه البيانات باستخدام طرق مختلفة، وتصنيفها إلى فئات مختلفة مع مراعاة السلوك المحدد.',
    tooltip: {
      type: 'النوع',
      percentage: 'النسبة المئوية',
    },
  },
  nuha: {
    title: 'من هي نهى؟',
    body: '“نهى” هو نظام ذكاء اصطناعي يهدف إلى الكشف عن الخطاب الكراهية وتصنيفه ضد النساء في المساحات الرقمية، مثل منصات التواصل الاجتماعي. يمثل “نهى”، والذي يستمد اسمه من الكلمة العربية لـ “العقل” أو “الدماغ”، خطوة حاسمة نحو معالجة المشكلة المنتشرة للغاية من خطاب الكراهية الجنساني والجنسي ضد النساء في الإنترنت.',
    work: {
      title: ' كيف تعمل؟ ',
      body: 'أجرت جوسا استشارات مع تحالف تمام وهو مجموعة من الشركاء المحليين في الأردن الذين يعملون على قضايا حقوق المرأة (مؤسسات المجتمع المدني والمؤسسات الأكاديمية والأفراد). \n\n . \n\n عملية تكبير البيانات تنطوي على تلاعب بعينات البيانات المعينة لإنشاء عينات إضافية ولكن مماثلة يمكن استخدامها لتدريب نموذج نهى. على وجه التحديد ، استخدمنا نموذجًا مفتوح المصدر يسمى AraBERT (من جامعة بيروت الأمريكية) لاستبدال بعض الكلمات داخل تعليقات الكراهية بكلمات مشابهة من حيث المعنى. تم اعتماد هذه الطريقة لتوليد عينات أكثر من التحريض على الكراهية اصطناعيًا والمساعدة في توازن مجموعة البيانات الخاصة بنا. \n\n بمجرد أن يصل النموذج إلى أعلى درجة F1 ممكنة ، سيكون الخطوة التالية هي خدمة الأداة من خلال بناء واجهة سهلة الاستخدام وإطلاق نهى. سيتم مشاركة تقرير أكثر تفصيلاً ونضجًا حول مشروع نهى ، بما في ذلك النتائج النهائية للنموذج ، في التقرير الإقليمي التالي.',
    },
  },
  data: {
    hateSpeech: 'خطاب الكراهية',
    positiveSpeech: 'خطاب إيجابي',
    unrelated: 'لا علاقة لها بالسياق',
    neutral: 'محايد',
  },
}

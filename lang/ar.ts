export default {
  link: {
    statistics: 'الإحصائيات',
    learnMore: 'تعرف علينا',
  },

  header: {
    whatIsNuha: 'تعرف على نهى',
    howItWorks: 'كيف يعمل',
    signIn: 'تسجيل الدخول',
    userMenu: {
      dashboard: 'لوحة المراقبة',
      settings: 'الإعدادات',
      signOut: 'تسجيل الخروج',
    },
  },

  intro: {
    text: 'اداة مراقبة تستخدم الذكاء الاصطناعي ',
    sub: 'لتصنيف خطاب الكراهية القائم على الجنس عبر الانترنت',
  },

  waitlist: {
    join: 'سجل مسبقا',
    enterEmail: 'ادخل بريدك الالكتروني',
    done: 'تم',
    close: 'أغلق',
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
      body: 'يتم تدريب نموذج نهى باستخدام مجموعة بيانات تم الحصول عليها من خلال مراقبة 20 وسمًا رائجًا يتعلق بالنساء والحركة النسوية في الأردن ، بالإضافة إلى 83 اسمًا لناشطات النساء والمؤثرات النسائيات في الأردن. تم جمع مجموعة البيانات من 112 منشورًا على Facebook وتغريدات Twitter وتحتوي على أكثر من 20،000 تعليق. كان معظم المحتوى المجمع من Facebook ، ولكن من المقرر جمع المزيد من المحتوى من Twitter في انتظار الوصول إلى واجهة برمجة التطبيقات Twitter. تضمن عملية تكبير البيانات التلاعب ببعض عينات البيانات لإنشاء عينات إضافية ولكن مشابهة يمكن استخدامها لتدريب نموذج نهى. بمجرد أن يصل النموذج إلى أعلى درجة F1 ممكنة.',
    },
  },
  data: {
    hateSpeech: 'خطاب الكراهية',
    positiveSpeech: 'خطاب إيجابي',
    unrelated: 'لا علاقة لها بالسياق',
    neutral: 'محايد',
  },

  dashboard: {
    comment: {
      header: 'أدخل التعليق وسياقه',
      content: 'أدخل التعليق',
      context: 'أدخل سياق التعليق',
    },
    fileUpload: {
      header: 'قم بتحميل ملف يشتبه في أنه يحتوي على خطابات كراهية',
      selectFile: 'حدد ملف',
      downloadTempalte: 'تنزيل نموذج',
      selected: 'تم اختيار',
    },
    tab: {
      file: "ملف",
      comment: "تعليق",
    },
    submit: 'سلم',
    or: 'أو',
  },
}

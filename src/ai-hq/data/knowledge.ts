/**
 * Knowledge base for the AI employees' chat. No AI model is involved: a
 * visitor's question is matched to the closest entry here (see
 * services/knowledgeMatcher.ts). Replies are written in Taglish.
 *
 * It is niche-neutral on purpose. The HQ is meant for any kind of business,
 * so general answers live in SHARED, each employee's specialty lives in
 * BY_AGENT, and NICHES lets every employee give an example for a specific
 * industry.
 *
 * To teach the employees something new, add an entry. `keywords` are the
 * words or short phrases, English or Tagalog, that should lead to it.
 * Prices and timelines are deliberately not stated: they route to Liezl.
 */
export interface KnowledgeEntry {
  id: string;
  /** If set, this exact question is offered as a one-tap suggestion. */
  q?: string;
  keywords: string[];
  a: string;
}

export const GREETING: Record<string, string> = {
  sophia: "Hi! Ako si Sophia, ang AI Receptionist. Ako ang unang sumasagot sa bawat bagong lead, nagka-qualify, at nagbo-book ng appointment. Ano'ng gusto mong malaman?",
  olivia: "Hello, si Olivia ito, AI Sales Specialist. Ako ang nag-aasikaso ng pipeline kapag qualified na ang lead. Tanong ka lang.",
  ava: "Hi, ako si Ava, AI Marketing Specialist. Email at SMS campaigns ang hawak ko para hindi lumamig ang mga lead. Ano'ng gusto mong i-explain ko?",
  chloe: "Hello, si Chloe, AI Operations Specialist. Binabantayan ko ang mga workflow at fina-flag ko agad kapag may pumalya. Ano'ng gusto mong makita?",
  mia: "Hi, ako si Mia, AI Executive Assistant. Tasks, calendar, at reports ng owner ang inaayos ko. Paano ako makakatulong?",
};

/** Topics every employee can answer. */
export const SHARED: KnowledgeEntry[] = [
  {
    id: "niches",
    keywords: ["niche", "industry", "industriya", "anong business", "klase ng business", "type of business", "lahat ng business", "any business"],
    a: "Open kami sa lahat ng niche. Basta may leads, appointments, o follow-ups ang business mo, gagana ang system: clinics, salons, real estate, restaurants, home services, coaches, online shops, at iba pa. Sabihin mo lang ang niche mo at bibigyan kita ng example.",
  },
  {
    id: "what-is-ghl",
    keywords: ["gohighlevel", "highlevel", "ghl", "sub-account", "sub account", "subaccount", "crm", "ano ang system", "what is this"],
    a: "GoHighLevel ang platform sa likod nito. Bawat business ay may sariling sub-account: isang lugar para sa contacts, pipelines, calendars, website at funnels, at mga automation. Kami ang mga AI employee na gumagalaw sa loob ng sub-account na iyon.",
  },
  {
    id: "inclusions",
    q: "Ano'ng kasama sa setup?",
    keywords: ["kasama", "included", "inclusion", "services", "serbisyo", "offer", "package", "ano ang ginagawa", "what do you offer", "features"],
    a: "Karaniwang kasama ang CRM setup, sales pipeline, booking calendar, website o funnel, email at SMS follow-ups, at mga workflow automation. Pwede ring dagdagan ng AI agents para sa chat at calls. Ina-adjust ito ni Liezl depende sa kailangan ng business mo.",
  },
  {
    id: "pricing",
    q: "Magkano ang setup?",
    keywords: ["magkano", "presyo", "price", "pricing", "rate", "rates", "cost", "bayad", "budget", "mahal", "fee", "quote", "how much"],
    a: "Depende sa scope ang presyo, kaya walang fixed na rate dito. I-message mo si Liezl kung ano ang kailangan ng business mo at bibigyan ka niya ng quote. Nasa Executive Office ang contact details niya.",
  },
  {
    id: "timeline",
    keywords: ["gaano katagal", "how long", "timeline", "ilang araw", "ilang linggo", "kailan matatapos", "turnaround", "deadline", "gaano kabilis"],
    a: "Depende sa laki ng setup. Mas mabilis ang simpleng CRM at calendar kaysa sa buong system na may website, funnels, at automations. Si Liezl ang magbibigay ng totoong timeline kapag nakita na niya ang kailangan mo.",
  },
  {
    id: "start",
    keywords: ["paano magsimula", "magsimula", "simulan", "get started", "how to start", "onboard", "onboarding", "process", "proseso", "next step", "unang hakbang"],
    a: "Simple lang: una, kakausapin ka ni Liezl para maintindihan ang business at ang kasalukuyang proseso mo. Sunod, ise-setup niya ang sub-account, pipeline, calendar, at automations. Tapos ite-test muna lahat bago i-turn over sa iyo, kasama ang walkthrough.",
  },
  {
    id: "contact",
    keywords: ["contact", "kontak", "kausapin", "makausap", "email", "tawag", "call", "book a call", "mag-inquire", "inquire", "hire", "reach"],
    a: "Pwede mong kausapin si Liezl nang direkta. Pumunta sa Executive Office dito sa HQ at buksan ang Contact tab para sa email at phone niya, o gamitin ang contact form sa portfolio.",
  },
  {
    id: "tech-skills",
    keywords: ["marunong", "technical", "techie", "tech-savvy", "mahirap", "madali", "training", "turuan", "matutunan", "hindi ako marunong", "beginner"],
    a: "Hindi mo kailangang maging techie. Si Liezl ang gagawa ng setup, at ituturo niya sa iyo at sa team mo kung paano gamitin ang mga kailangan lang ninyo araw-araw, gaya ng pagtingin ng leads at pag-check ng calendar.",
  },
  {
    id: "migration",
    keywords: ["lumipat", "lipat", "migrate", "migration", "import", "excel", "spreadsheet", "google sheets", "existing crm", "lumang system", "dati naming"],
    a: "Pwede. Kung nasa Excel, Google Sheets, o ibang CRM ang contacts mo ngayon, pwedeng i-import ang mga iyon sa bagong sub-account, kasama ang paglilinis ng duplicates at paglalagay ng tamang tags.",
  },
  {
    id: "is-real",
    keywords: ["totoo ka ba", "tao ka ba", "totoong ai", "real ai", "are you real", "robot", "bot ka ba", "chatgpt", "openai", "scripted", "demo lang"],
    a: "Honest answer: demo ito. Galing sa inihandang knowledge base ang mga sagot ko, hindi sa live na AI. Sa totoong setup, GoHighLevel Conversation AI o Voice AI ang gumagawa nito, naka-train sa impormasyon ng business mo.",
  },
  {
    id: "language",
    keywords: ["taglish", "tagalog", "filipino", "english", "language", "wika", "bisaya", "cebuano"],
    a: "Taglish ang gamit ko dito sa demo. Sa totoong setup, ia-adjust ang tono at wika ng AI sa mga customer mo: English, Tagalog, o Taglish, depende sa kung paano ka nakikipag-usap sa kanila.",
  },
  {
    id: "control",
    keywords: ["mali", "magkamali", "mistake", "kontrol", "control", "bantay", "safe", "tiwala", "trust", "delikado", "risk"],
    a: "Ikaw pa rin ang may kontrol. Ang mga sensitibong aksyon, gaya ng bulk messages o pagbura ng records, ay naghihintay muna ng approval ng tao. Si Chloe naman ang nagbabantay kung may pumalyang workflow.",
  },
  {
    id: "channels",
    keywords: ["facebook", "messenger", "instagram", "ig", "sms", "text", "whatsapp", "viber", "chat widget", "channel", "saan papasok"],
    a: "Pwedeng pumasok ang leads mula sa website form, chat widget, Facebook at Instagram messages, SMS, email, at tawag, at lahat ay napupunta sa iisang inbox. Depende sa setup at sa bansa mo ang available na channels, kaya kinukumpirma muna ito ni Liezl.",
  },
  {
    id: "after-hours",
    q: "Paano kapag sarado na ang office?",
    keywords: ["after hours", "sarado", "gabi", "madaling araw", "weekend", "24/7", "24 7", "tulog", "holiday", "missed call", "hindi nasagot"],
    a: "Sumasagot pa rin ang system. Ang missed call ay nakakatanggap ng text back sa loob ng isang minuto, at ang bagong form submission ay nasasagot agad, kaya walang lead na naghihintay hanggang umaga.",
  },
  {
    id: "small-business",
    keywords: ["maliit", "small business", "solo", "mag-isa", "startup", "bago pa lang", "kakasimula", "walang staff", "freelancer"],
    a: "Mas malaking tulong ito sa maliit na team. Kapag ikaw lang o kakaunti kayo, ang automation ang sumasalo ng paulit-ulit na trabaho: pag-reply, pag-follow up, at pag-remind, para makapag-focus ka sa mismong serbisyo mo.",
  },
  {
    id: "who-is-liezl",
    keywords: ["sino si liezl", "liezl", "sino gumawa", "who built", "who made", "owner", "may-ari"],
    a: "Si Liezl Jamindang ang gumawa ng HQ na ito. GoHighLevel Specialist siya: CRM, pipelines, workflows, websites, funnels, calendars, at AI agents ang ginagawa niya. Makikilala mo siya sa Executive Office.",
  },
  {
    id: "hello",
    keywords: ["hi", "hello", "hey", "kumusta", "kamusta", "musta", "good morning", "good afternoon", "good evening", "magandang"],
    a: "Hello! Salamat sa pagbisita sa AI HQ. Pwede mo akong tanungin tungkol sa trabaho ko, sa setup, o kung paano ito gagana sa niche mo.",
  },
  {
    id: "thanks",
    keywords: ["salamat", "thanks", "thank you", "ty", "ok na", "sige", "noted"],
    a: "Walang anuman! Kung may iba ka pang tanong, nandito lang ako. Pwede mo ring i-try ang Run live demo para makita kung paano gumagalaw ang isang lead sa buong system.",
  },
];

/** Each employee's own specialty. */
export const BY_AGENT: Record<string, KnowledgeEntry[]> = {
  sophia: [
    {
      id: "follow-up",
      q: "Paano gumagana ang lead follow-up system mo?",
      keywords: ["follow-up", "follow up", "followup", "lead", "paano gumagana", "how does", "system mo"],
      a: "Kapag may bagong lead na pumasok sa CRM, sinasagot ko agad, kinukuha ko ang qualification info, ina-update ko ang contact record, at nilalagay ko ang qualified na opportunity sa tamang pipeline.",
    },
    {
      id: "qualify",
      keywords: ["qualify", "qualif", "qualified", "tanong", "questions", "screen", "sinasala"],
      a: "May maikling set ng tanong na pinipili ng business, gaya ng serbisyong kailangan, timeline, at budget. Nase-save ang mga sagot sa custom fields ng contact, at may tag kung qualified o hindi ang lead.",
    },
    {
      id: "book",
      q: "Kaya mo bang mag-book ng appointments?",
      keywords: ["book", "mag-book", "appointment", "calendar", "schedule", "iskedyul", "reservation", "slot"],
      a: "Oo. Kapag qualified na ang lead, inaalok ko ang mga bakanteng oras mula sa connected calendar, ginagawa ko ang appointment, at kusang lumalabas ang confirmation at reminder messages.",
    },
    {
      id: "no-show",
      keywords: ["no-show", "no show", "hindi sumipot", "di sumipot", "cancel", "reschedule", "nag-cancel"],
      a: "May reminders bago ang appointment para bumaba ang no-shows. Kapag hindi pa rin sumipot ang customer, pwede akong mag-alok ng bagong schedule, pero dadaan muna iyon sa approval kung maramihan.",
    },
  ],
  olivia: [
    {
      id: "pipeline",
      q: "Paano mo mina-manage ang pipeline?",
      keywords: ["pipeline", "manage", "stage", "opportunit", "deal", "sales process"],
      a: "Bawat qualified lead ay nagiging opportunity na may value at owner. Mino-move ko ito sa bawat stage habang may nangyayari: contacted, qualified, appointment booked, closed. Bawat galaw ay pwedeng mag-trigger ng susunod na follow-up.",
    },
    {
      id: "stalled",
      q: "Ano'ng nangyayari sa deal na hindi gumagalaw?",
      keywords: ["stall", "stuck", "hindi gumagalaw", "di gumagalaw", "natengga", "cold", "walang reply", "sumasagot", "nagre-reply", "nagrereply", "na-seen", "seenzone", "ghost"],
      a: "Kapag matagal nang nasa iisang stage ang opportunity, fina-flag ko ito, nire-restart ko ang follow-up sequence, at gumagawa ako ng task para may taong pumasok. Walang deal na nakakalimutan.",
    },
    {
      id: "handoff",
      keywords: ["human", "tao", "hand off", "handoff", "ipasa", "team", "notify", "abiso", "sales rep"],
      a: "Nagpapadala ako ng internal notification na may contact, summary ng usapan, at suggested next step, tapos nag-a-assign ako ng task na may due date sa tamang tao.",
    },
    {
      id: "close",
      keywords: ["close", "isara", "benta", "sales", "convert", "conversion", "proposal", "invoice"],
      a: "Hindi ako ang nagko-close ng mismong benta, tao pa rin iyon. Ang trabaho ko ay siguraduhing walang lead na nahuhulog: tamang stage, tamang follow-up, at may paalala sa team kapag oras nang kumilos.",
    },
  ],
  ava: [
    {
      id: "nurture",
      q: "Paano gumagana ang lead nurturing?",
      keywords: ["nurtur", "campaign", "email", "sequence", "drip", "newsletter"],
      a: "Ang mga lead na hindi pa handa ay pumapasok sa naka-time na sequence ng emails at texts. May tamang pagitan ang bawat message, at kusang humihinto ang sequence kapag nag-reply o nag-book na ang lead.",
    },
    {
      id: "compliance",
      keywords: ["complian", "a2p", "10dlc", "opt", "spam", "permission", "consent", "bawal", "legal"],
      a: "Sa mga nag-opt in lang ako nagme-message, at sinusunod ang opt-out replies. Para sa SMS sa US, kailangan muna ng A2P 10DLC brand at campaign registration. Iba-iba ang patakaran kada bansa, kaya tsine-check ito ni Liezl bago mag-send.",
    },
    {
      id: "trigger",
      q: "Ano'ng nagti-trigger ng campaign?",
      keywords: ["trigger", "nagti-trigger", "start", "nagsisimula", "kailan nagse-send", "automatic"],
      a: "Kahit anong event sa CRM ay pwedeng trigger: na-submit na form, nadagdag na tag, na-book na appointment, o nagbagong pipeline stage. Nakikinig ang workflow doon at sinisimulan ang tamang messages.",
    },
    {
      id: "reviews",
      keywords: ["review", "reviews", "rating", "feedback", "testimonial", "reputation"],
      a: "Pagkatapos ng serbisyo, pwede akong mag-send ng review request sa customer. Malaking tulong ito sa reputation ng business, lalo na sa mga local na negosyo.",
    },
    {
      id: "promo",
      keywords: ["promo", "sale", "discount", "balikan", "reactivat", "lumang customer", "dating customer", "old customers", "bumalik"],
      a: "May reactivation campaigns para sa mga dating customer: maikling message na may dahilan para bumalik, gaya ng promo o reminder. Dahil maramihan ito, humihingi muna ako ng approval bago mag-send.",
    },
  ],
  chloe: [
    {
      id: "monitor",
      q: "Ano'ng binabantayan mo?",
      keywords: ["monitor", "binabantayan", "bantay", "watch", "check", "track", "tina-track"],
      a: "Lahat ng active na workflow, ang mga task na naka-assign sa mga tao, at lahat ng dapat sanang nangyari pero hindi, gaya ng reminder na hindi nag-send.",
    },
    {
      id: "fail",
      q: "Ano'ng nangyayari kapag pumalya ang workflow?",
      keywords: ["fail", "pumalya", "palya", "error", "sira", "nasira", "broken", "alert", "hindi gumana", "bug"],
      a: "Naglalabas ako ng alert na may pangalan ng workflow, kung saang step pumalya, at kung sinong contacts ang apektado. Tao ang magdedesisyon kung aayusin o ire-rerun, hindi ako.",
    },
    {
      id: "summary",
      keywords: ["summary", "report", "daily", "araw-araw", "buod", "ulat"],
      a: "Sa daily summary: bagong leads, na-book na appointments, gumalaw na opportunities, tumakbong workflows, at maikling listahan ng mga bagay na kailangan ng tao ngayong araw.",
    },
    {
      id: "tasks",
      keywords: ["task", "tasks", "gawain", "to-do", "todo", "pending", "overdue"],
      a: "Tina-track ko ang lahat ng open tasks at kung kanino naka-assign. Kapag may lumampas na sa due date, lumalabas iyon sa summary para hindi makalimutan.",
    },
  ],
  mia: [
    {
      id: "approval",
      q: "Ano'ng kailangan mo ng approval?",
      keywords: ["approv", "permission", "pahintulot", "payag", "sensitive", "sensitibo"],
      a: "Lahat ng may totoong epekto: bulk messages, pagbura ng records, pagbabago ng automation settings, o paglipat ng high-value opportunities. Inihahanda ko ang aksyon at hinihintay ko ang oo ng tao.",
    },
    {
      id: "reports",
      q: "Paano ka naghahanda ng reports?",
      keywords: ["report", "reports", "ulat", "brief", "summary", "numbers", "numero", "weekly"],
      a: "Kinukuha ko ang numbers ng linggo mula sa CRM, ikinukumpara sa nakaraang linggo, at sumusulat ako ng maikling brief: priorities, risks, at next actions.",
    },
    {
      id: "coordinate",
      keywords: ["coordinat", "team", "sama-sama", "magkakasama", "others", "ibang ai", "nagtutulungan"],
      a: "Ipinapasa ni Sophia ang qualified leads kay Olivia, pinapainit ni Ava ang iba pa, at tsine-check ni Chloe na tumakbo ang bawat step. Ako naman ang nag-a-update sa owner at nangongolekta ng mga desisyong kailangan ng tao.",
    },
    {
      id: "calendar",
      keywords: ["calendar", "schedule", "iskedyul", "meeting", "appointment", "oras"],
      a: "Inaayos ko ang calendar ng owner: iniiwasan ang magkasabay na meetings, naglalagay ng paalala, at inihahanda ang kailangan bago ang bawat tawag.",
    },
  ],
};

/** Suggested questions shown as chips, per employee. Each must match an entry's `q`, or be a niche example. */
export const SUGGESTIONS: Record<string, string[]> = {
  sophia: ["Paano gumagana ang lead follow-up system mo?", "Kaya mo bang mag-book ng appointments?", "Pwede ba ito sa dental clinic?", "Magkano ang setup?"],
  olivia: ["Paano mo mina-manage ang pipeline?", "Ano'ng nangyayari sa deal na hindi gumagalaw?", "Pwede ba ito sa real estate?", "Ano'ng kasama sa setup?"],
  ava: ["Paano gumagana ang lead nurturing?", "Ano'ng nagti-trigger ng campaign?", "Pwede ba ito sa salon?", "Magkano ang setup?"],
  chloe: ["Ano'ng binabantayan mo?", "Ano'ng nangyayari kapag pumalya ang workflow?", "Pwede ba ito sa restaurant?", "Paano kapag sarado na ang office?"],
  mia: ["Ano'ng kailangan mo ng approval?", "Paano ka naghahanda ng reports?", "Pwede ba ito sa online shop?", "Ano'ng kasama sa setup?"],
};

export interface Niche {
  id: string;
  /** How the niche is named mid-sentence. */
  label: string;
  keywords: string[];
  /** Fits "kapag may ___". */
  lead: string;
  /** Fits "iba-book ko ang ___". */
  book: string;
  /** Fits "mag-run ng ___". */
  nurture: string;
}

export const NICHES: Niche[] = [
  { id: "dental", label: "dental o medical clinic", keywords: ["dental", "dentist", "dentista", "clinic", "klinika", "doctor", "doktor", "medical", "derma", "ospital", "pasyente", "patient"],
    lead: "bagong patient inquiry", book: "consultation o checkup", nurture: "recall reminders, gaya ng cleaning tuwing anim na buwan" },
  { id: "beauty", label: "salon, spa, o beauty business", keywords: ["salon", "spa", "med spa", "beauty", "parlor", "barber", "nails", "lash", "aesthetic", "facial", "wellness"],
    lead: "nagtatanong tungkol sa isang treatment", book: "treatment o free consultation", nurture: "rebooking reminders at birthday promos" },
  { id: "real-estate", label: "real estate", keywords: ["real estate", "realty", "broker", "property", "condo", "bahay at lupa", "house and lot", "rental", "paupahan"],
    lead: "buyer o renter inquiry", book: "property viewing", nurture: "updates sa bagong listings para sa mga hindi pa bumibili" },
  { id: "food", label: "restaurant o cafe", keywords: ["restaurant", "resto", "cafe", "coffee", "kainan", "food", "catering", "bakery", "milk tea"],
    lead: "reservation o catering inquiry", book: "table reservation", nurture: "promos at paanyaya sa mga dating customer" },
  { id: "fitness", label: "gym, fitness, o coaching business", keywords: ["gym", "fitness", "coach", "coaching", "trainer", "yoga", "pilates", "consultant", "mentor"],
    lead: "nag-inquire tungkol sa program", book: "trial session o discovery call", nurture: "check-ins at renewal reminders" },
  { id: "home", label: "home services", keywords: ["plumbing", "plumber", "tubero", "hvac", "aircon", "roofing", "bubong", "landscap", "cleaning", "electrician", "kontratista", "contractor", "repair", "construction", "pest"],
    lead: "humihingi ng estimate", book: "site visit o inspection", nurture: "maintenance reminders at follow-up sa mga quote na hindi pa nasasagot" },
  { id: "auto", label: "automotive business", keywords: ["auto", "car", "kotse", "sasakyan", "talyer", "detailing", "car wash", "mekaniko", "motor"],
    lead: "service inquiry", book: "service appointment", nurture: "paalala para sa susunod na maintenance" },
  { id: "ecommerce", label: "online shop", keywords: ["online shop", "online store", "e-commerce", "ecommerce", "shopee", "lazada", "tiktok shop", "reseller", "tindahan", "product", "paninda"],
    lead: "nagtatanong tungkol sa product o order", book: "order confirmation o callback", nurture: "abandoned cart reminders at repeat-order promos" },
  { id: "professional", label: "professional services", keywords: ["law", "lawyer", "abogado", "accounting", "accountant", "bookkeep", "insurance", "financial", "agency", "ahensya", "travel", "visa"],
    lead: "bagong client inquiry", book: "consultation", nurture: "follow-ups sa mga proposal at paalala sa mga deadline" },
  { id: "pets", label: "pet care business", keywords: ["pet", "vet", "veterinar", "grooming", "aso", "pusa", "dog", "cat"],
    lead: "pet owner na nag-inquire", book: "grooming o vet appointment", nurture: "vaccine at grooming reminders" },
  { id: "education", label: "school o tutorial center", keywords: ["school", "paaralan", "tutor", "tutorial", "review center", "enroll", "training center", "academy", "klase"],
    lead: "enrollment inquiry", book: "assessment o trial class", nurture: "paalala sa enrollment at updates para sa mga magulang" },
];

/** How each employee explains their job for a given niche. */
export const NICHE_ANSWER: Record<string, (n: Niche) => string> = {
  sophia: (n) => `Pwede. Para sa ${n.label}: kapag may ${n.lead}, sasagutin ko agad, itatanong ko ang ilang qualifying questions, tapos iba-book ko ang ${n.book} sa calendar mo.`,
  olivia: (n) => `Pwede. Sa ${n.label}, bawat ${n.lead} ay nagiging opportunity sa pipeline. Mino-move ko ito hanggang ma-confirm ang ${n.book}, at may follow-up kapag hindi sumasagot ang lead.`,
  ava: (n) => `Pwede. Para sa ${n.label}, kaya kong mag-run ng ${n.nurture}, gamit ang email at SMS, para hindi mo na mano-manong tine-text ang bawat isa.`,
  chloe: (n) => `Pwede. Sa ${n.label}, binabantayan ko kung tumakbo ang lahat: nasagot ba ang bawat ${n.lead}, at na-send ba ang reminder para sa ${n.book}. Kapag may pumalya, fina-flag ko agad.`,
  mia: (n) => `Pwede. Para sa ${n.label}, inaayos ko ang schedule at tasks ng owner, at naghahanda ako ng weekly report: ilan ang pumasok na leads at ilan ang umabot sa ${n.book}.`,
};

export const FALLBACK =
  "Pasensya, wala pa iyan sa knowledge base ko sa demo na ito. Subukan mo ang isa sa mga suggested questions sa ibaba, o sabihin mo ang niche mo para mabigyan kita ng example.";

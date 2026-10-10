/**
 * Knowledge base for the AI employees' chat. No AI model is involved: a
 * visitor's question is matched to the closest entry here (see
 * services/knowledgeMatcher.ts).
 *
 * LANGUAGE: every answer is written twice. `en` is the default. `tl` is
 * conyo Taglish, used only when the visitor's own message contains Tagalog.
 *
 * NICHES: the HQ is meant for any kind of business. General answers live in
 * SHARED, each employee's specialty lives in BY_AGENT, and NICHES lets every
 * employee give an example for a specific industry.
 *
 * To teach the employees something new, add an entry. `keywords` are the
 * words or short phrases, English or Tagalog, that should lead to it.
 * Prices and timelines are deliberately not stated: they route to Liezl.
 */
export type Lang = "en" | "tl";
type Both = Record<Lang, string>;

export interface KnowledgeEntry {
  id: string;
  /** If set, this question is offered as a one-tap suggestion. */
  q?: Both;
  keywords: string[];
  a: Both;
}

/** The first message is always English. */
export const GREETING: Record<string, string> = {
  sophia: "Hi, I'm Sophia, the AI Receptionist. I greet every new lead, qualify them and book the appointment. What would you like to know?",
  olivia: "Hello, I'm Olivia, the AI Sales Specialist. I keep the pipeline moving once a lead is qualified. Ask me how.",
  ava: "Hi, I'm Ava, the AI Marketing Specialist. I run the email and SMS campaigns that keep leads warm. What can I explain?",
  chloe: "Hello, I'm Chloe, the AI Operations Specialist. I watch the workflows and flag anything that breaks. What would you like to see?",
  ethan: "Hi, I'm Ethan, the AI Web Developer. I build websites and funnels that bring in leads, not just pages that look nice. What are you planning to build?",
  mia: "Hi, I'm Mia, the AI Executive Assistant. I keep the owner's tasks, calendar and reports in order. How can I help?",
};

/** Topics every employee can answer. */
export const SHARED: KnowledgeEntry[] = [
  {
    id: "niches",
    keywords: ["niche", "industry", "industries", "industriya", "anong business", "klase ng business", "type of business", "kind of business", "lahat ng business", "any business"],
    a: {
      en: "We're open to every niche. If your business has leads, appointments or follow-ups, the system fits: clinics, salons, real estate, restaurants, home services, coaches, online shops and more. Tell me your niche and I'll give you an example.",
      tl: "Open kami sa all niches! As long as may leads, appointments, or follow-ups yung business mo, it works: clinics, salons, real estate, restaurants, home services, coaches, online shops, and more. Just tell me your niche and I'll give you an example.",
    },
  },
  {
    id: "automate-everything",
    q: { en: "Can this replace my VAs?", tl: "Kaya ba nitong palitan yung VAs ko?" },
    keywords: [
      "automate", "automated", "automation", "automatic", "everything automated", "fully automated", "hands-free", "hands free",
      "replace", "va", "vas", "virtual assistant", "virtual assistants", "assistant", "staff", "employees", "team ko", "tauhan",
      "palitan", "tanggalin", "hire", "hiring", "sweldo", "salary", "payroll", "save money", "makatipid", "less staff",
    ],
    a: {
      en: "A lot of it, yes. The repetitive work is the easiest to hand over: replying to new leads, qualifying them, booking, reminders, follow-ups, pipeline updates and reports. What still needs a person is judgment: closing deals, handling unusual requests, and approving sensitive actions. Most owners end up with a smaller team doing higher-value work, not zero people. Tell me your niche and what your VAs handle today, and I'll show you which parts we'd take over.",
      tl: "Yes, marami diyan kaya! Pinaka-easy i-hand over yung repetitive work: replying to new leads, qualifying, booking, reminders, follow-ups, pipeline updates, and reports. Yung need pa rin ng tao is judgment: closing deals, unusual requests, and approving sensitive actions. Usually, mas maliit na team na lang doing higher-value work, hindi totally zero people. Tell me your niche and kung ano yung hawak ng VAs mo ngayon, and I'll show you which parts yung kaya naming saluhin.",
    },
  },
  {
    id: "have-business",
    keywords: ["i have a business", "my business", "own a business", "business owner", "may business ako", "may negosyo", "negosyo ko", "business ko", "what can you do", "can you help", "matutulungan", "tulungan"],
    a: {
      en: "Great, that's who this is built for. Tell me what kind of business it is and what eats most of your time, like answering inquiries, booking, or chasing follow-ups, and I'll show you how we'd handle it.",
      tl: "Nice, para sa'yo talaga 'to! Tell me what kind of business siya and kung ano yung pinaka-kumakain ng time mo, like answering inquiries, booking, or follow-ups, and I'll show you kung paano namin siya iha-handle.",
    },
  },
  {
    id: "what-is-ghl",
    keywords: ["gohighlevel", "highlevel", "ghl", "sub-account", "sub account", "subaccount", "crm", "ano ang system", "what is this", "platform"],
    a: {
      en: "GoHighLevel is the platform behind this. Each business gets its own sub-account: one place for contacts, pipelines, calendars, the website and funnels, and the automations. We're the AI employees working inside that sub-account.",
      tl: "GoHighLevel yung platform behind this. Each business has its own sub-account, so nasa isang place lang yung contacts, pipelines, calendars, website and funnels, pati yung automations. Kami yung AI employees na nagwo-work inside that sub-account.",
    },
  },
  {
    id: "inclusions",
    q: { en: "What's included in a setup?", tl: "Ano yung kasama sa setup?" },
    keywords: ["kasama", "included", "include", "inclusion", "services", "serbisyo", "offer", "package", "ano ang ginagawa", "what do you offer", "features"],
    a: {
      en: "A setup usually covers the CRM, a sales pipeline, a booking calendar, a website or funnel, email and SMS follow-ups, and workflow automations. AI agents for chat and calls can be added. Liezl adjusts it to what your business needs.",
      tl: "Usually kasama yung CRM setup, sales pipeline, booking calendar, website or funnel, email and SMS follow-ups, and workflow automations. You can add AI agents din for chat and calls. Ina-adjust ni Liezl depending on what your business needs.",
    },
  },
  {
    id: "pricing",
    q: { en: "How much does a setup cost?", tl: "Magkano yung setup?" },
    keywords: ["magkano", "presyo", "price", "pricing", "rate", "rates", "cost", "costs", "bayad", "budget", "mahal", "fee", "quote", "how much"],
    a: {
      en: "Pricing depends on the scope, so there's no fixed rate here. Message Liezl with what your business needs and she'll send you a quote. Her contact details are in the Executive Office.",
      tl: "Depends kasi sa scope yung price, so walang fixed rate here. Just message Liezl kung ano yung need ng business mo and she'll send you a quote. Nasa Executive Office yung contact details niya.",
    },
  },
  {
    id: "timeline",
    keywords: ["gaano katagal", "how long", "timeline", "ilang araw", "ilang linggo", "kailan matatapos", "turnaround", "deadline", "gaano kabilis", "how fast", "how soon"],
    a: {
      en: "It depends on the size of the setup. A simple CRM and calendar is quicker than a full system with a website, funnels and automations. Liezl gives the real timeline once she's seen what you need.",
      tl: "Depends sa size ng setup. Mas mabilis yung simple CRM and calendar compared sa full system na may website, funnels, and automations. Si Liezl yung magbibigay ng actual timeline once makita niya yung need mo.",
    },
  },
  {
    id: "start",
    keywords: ["paano magsimula", "magsimula", "simulan", "get started", "how to start", "how do i start", "onboard", "onboarding", "process", "proseso", "next step", "unang hakbang"],
    a: {
      en: "It's simple. First, Liezl talks with you to understand the business and how you work today. Next, she sets up the sub-account, pipeline, calendar and automations. Then everything is tested before it's handed over, with a walkthrough.",
      tl: "Super simple lang. First, kakausapin ka ni Liezl to understand your business and yung current process mo. Then she sets up the sub-account, pipeline, calendar, and automations. Tapos tine-test muna everything before i-turn over sa'yo, with a walkthrough pa.",
    },
  },
  {
    id: "contact",
    keywords: ["contact", "kontak", "kausapin", "makausap", "email", "tawag", "call", "book a call", "mag-inquire", "inquire", "hire", "reach"],
    a: {
      en: "You can talk to Liezl directly. Go to the Executive Office here in the HQ and open the Contact tab for her email and phone, or use the contact form in her portfolio.",
      tl: "You can talk to Liezl directly naman. Go to the Executive Office dito sa HQ and open the Contact tab for her email and phone, or use the contact form sa portfolio niya.",
    },
  },
  {
    id: "tech-skills",
    keywords: ["marunong", "technical", "techie", "tech-savvy", "tech savvy", "mahirap", "madali", "training", "turuan", "matutunan", "beginner", "hard to use", "easy to use"],
    a: {
      en: "You don't need to be technical. Liezl does the setup and shows you and your team only the parts you'll use day to day, such as viewing leads and checking the calendar.",
      tl: "No need to be techie! Si Liezl yung gagawa ng setup, tapos she'll teach you and your team yung mga kailangan niyo lang daily, like viewing leads and checking the calendar.",
    },
  },
  {
    id: "migration",
    keywords: ["lumipat", "lilipat", "lipat", "migrate", "migration", "import", "excel", "spreadsheet", "google sheets", "existing crm", "lumang system", "switch from"],
    a: {
      en: "Yes. If your contacts live in Excel, Google Sheets or another CRM today, they can be imported into the new sub-account, with duplicates cleaned up and the right tags applied.",
      tl: "Yes, pwede! If nasa Excel, Google Sheets, or ibang CRM yung contacts mo now, we can import them sa new sub-account, with duplicates cleaned up and the right tags pa.",
    },
  },
  {
    id: "is-real",
    keywords: ["totoo ka", "tao ka", "totoong ai", "real ai", "are you real", "are you a bot", "robot", "bot ka", "chatgpt", "openai", "scripted", "demo lang"],
    a: {
      en: "Honest answer: this is a demo. My replies come from a prepared knowledge base, not a live AI. In a real setup, GoHighLevel Conversation AI or Voice AI does this, trained on your business's information.",
      tl: "Honestly, demo lang 'to. Yung answers ko galing sa prepared knowledge base, not a live AI. Sa real setup, GoHighLevel Conversation AI or Voice AI yung gumagawa nito, trained sa info ng business mo.",
    },
  },
  {
    id: "language",
    keywords: ["taglish", "tagalog", "filipino", "english", "language", "wika", "bisaya", "cebuano", "conyo"],
    a: {
      en: "I start in English and switch to Taglish when you type in Tagalog. In a real setup, the AI's tone and language are tuned to how you talk to your own customers.",
      tl: "I start in English, tapos nag-switch ako to Taglish pag nag-Tagalog ka. Sa real setup, ina-adjust yung tone and language ng AI based sa kung paano ka makipag-usap sa customers mo.",
    },
  },
  {
    id: "control",
    keywords: ["mali", "magkamali", "mistake", "mistakes", "kontrol", "control", "safe", "tiwala", "trust", "delikado", "risk", "wrong"],
    a: {
      en: "You stay in control. Sensitive actions, like bulk messages or deleting records, wait for a person's approval first, and you get an email or Slack notification when one is waiting. Chloe also watches for any workflow that fails.",
      tl: "Ikaw pa rin yung in control. Yung sensitive actions, like bulk messages or deleting records, naghihintay muna ng approval ng tao, and may email or Slack notification ka pag may naghihintay. Plus si Chloe yung nagbabantay if may workflow na nag-fail.",
    },
  },
  {
    id: "channels",
    keywords: ["facebook", "messenger", "instagram", "sms", "whatsapp", "viber", "chat widget", "channel", "channels", "saan papasok"],
    a: {
      en: "Leads can come in from a website form, a chat widget, Facebook and Instagram messages, SMS, email and calls, and they all land in one inbox. Which channels are available depends on the setup and your country, so Liezl confirms that first.",
      tl: "Leads can come from website forms, chat widget, Facebook and Instagram messages, SMS, email, and calls, tapos lahat pumapasok sa isang inbox lang. Depends sa setup and sa country mo yung available channels, so kino-confirm muna ni Liezl.",
    },
  },
  {
    id: "after-hours",
    q: { en: "What happens after office hours?", tl: "Paano pag closed na yung office?" },
    keywords: ["after hours", "office hours", "sarado", "closed", "gabi", "madaling araw", "weekend", "24/7", "tulog", "holiday", "missed call", "hindi nasagot", "at night"],
    a: {
      en: "The system still replies. A missed call gets a text back within a minute, and a new form submission is answered right away, so no lead waits until morning.",
      tl: "The system still replies kahit closed na. Yung missed call, may text back within a minute, and yung new form submission, nasasagot agad. So walang lead na naghihintay until morning.",
    },
  },
  {
    id: "small-business",
    keywords: ["maliit", "small business", "solo", "mag-isa", "startup", "bago pa lang", "kakasimula", "walang staff", "freelancer", "one person"],
    a: {
      en: "It helps a small team even more. When it's just you or a few people, automation takes the repetitive work, the replying, following up and reminding, so you can focus on the service itself.",
      tl: "Mas helpful nga siya for small teams! Pag ikaw lang or konti lang kayo, yung automation yung sumasalo ng repetitive work, like replying, following up, and reminding. So you can focus sa mismong service mo.",
    },
  },
  {
    id: "who-is-liezl",
    keywords: ["sino si liezl", "liezl", "sino gumawa", "who built", "who made", "owner", "may-ari"],
    a: {
      en: "Liezl Jamindang built this HQ. She's a GoHighLevel Specialist who works on CRM, pipelines, workflows, websites, funnels, calendars and AI agents. You can meet her in the Executive Office.",
      tl: "Si Liezl Jamindang yung gumawa ng HQ na 'to. GoHighLevel Specialist siya: CRM, pipelines, workflows, websites, funnels, calendars, and AI agents yung ginagawa niya. You can meet her sa Executive Office.",
    },
  },
  {
    id: "hello",
    keywords: ["hi", "hello", "hey", "kumusta", "kamusta", "musta", "good morning", "good afternoon", "good evening", "magandang"],
    a: {
      en: "Hello! Thanks for visiting the AI HQ. Ask me about my work, the setup, or how this would run in your niche.",
      tl: "Hello! Thanks for visiting the AI HQ. You can ask me about my work, yung setup, or kung paano 'to mag-work sa niche mo.",
    },
  },
  {
    id: "thanks",
    keywords: ["salamat", "thanks", "thank you", "ok na", "noted"],
    a: {
      en: "You're welcome! I'm here if you have more questions. You can also try Run live demo to watch one lead move through the whole system.",
      tl: "You're welcome! Nandito lang ako if may questions ka pa. Try mo rin yung Run live demo to see kung paano gumagalaw yung isang lead sa buong system.",
    },
  },
];

/** Each employee's own specialty. */
export const BY_AGENT: Record<string, KnowledgeEntry[]> = {
  sophia: [
    {
      id: "follow-up",
      q: { en: "How does your lead follow-up system work?", tl: "Paano nagwo-work yung lead follow-up system mo?" },
      keywords: ["follow-up", "follow up", "followup", "lead", "paano gumagana", "how does", "system mo"],
      a: {
        en: "When a new lead enters the CRM, I respond immediately, gather qualification information, update the contact record, and route qualified opportunities into the correct pipeline.",
        tl: "So pag may new lead na pumasok sa CRM, I reply agad, I get their qualification info, ina-update ko yung contact record, tapos nilalagay ko yung qualified opportunity sa right pipeline.",
      },
    },
    {
      id: "qualify",
      keywords: ["qualify", "qualif", "qualified", "tanong", "questions", "screen", "sinasala"],
      a: {
        en: "I ask a short set of questions the business chooses, such as the service needed, timeline and budget. The answers are saved to custom fields on the contact, and a tag marks the lead as qualified or not.",
        tl: "May short set of questions na pinipili ng business, like yung service na need, timeline, and budget. Nase-save yung answers sa custom fields ng contact, tapos may tag if qualified or not yung lead.",
      },
    },
    {
      id: "book",
      q: { en: "Can you book appointments?", tl: "Kaya mo bang mag-book ng appointments?" },
      keywords: ["book", "mag-book", "appointment", "appointments", "calendar", "schedule", "iskedyul", "reservation", "slot"],
      a: {
        en: "Yes. Once a lead qualifies I offer open times from the connected calendar, create the appointment, and the confirmation and reminder messages go out automatically.",
        tl: "Yes, kaya! Once qualified na yung lead, I offer yung open slots from the connected calendar, I create the appointment, tapos automatic nang lumalabas yung confirmation and reminder messages.",
      },
    },
    {
      id: "no-show",
      keywords: ["no-show", "no show", "sumipot", "cancel", "cancelled", "reschedule", "nag-cancel", "didn't show"],
      a: {
        en: "Reminders go out before the appointment to cut down no-shows. If the customer still doesn't come, I can offer a new time, though that goes through approval first when it's a batch.",
        tl: "May reminders before the appointment para less yung no-shows. Pag hindi pa rin sumipot yung customer, I can offer a new schedule, pero dadaan muna sa approval if maramihan.",
      },
    },
  ],
  olivia: [
    {
      id: "pipeline",
      q: { en: "How do you manage the pipeline?", tl: "Paano mo mina-manage yung pipeline?" },
      keywords: ["pipeline", "manage", "stage", "stages", "opportunit", "deal", "sales process"],
      a: {
        en: "Each qualified lead becomes an opportunity with a value and an owner. I move it between stages as things happen: contacted, qualified, appointment booked, closed. Every move can trigger the next follow-up.",
        tl: "Every qualified lead becomes an opportunity na may value and owner. I move it per stage habang may nangyayari: contacted, qualified, appointment booked, closed. Every move can trigger yung next follow-up.",
      },
    },
    {
      id: "stalled",
      q: { en: "What happens to a stalled deal?", tl: "Paano pag hindi na gumagalaw yung deal?" },
      keywords: ["stall", "stalled", "stuck", "gumagalaw", "natengga", "cold", "walang reply", "sumasagot", "nagre-reply", "nagrereply", "na-seen", "seenzone", "ghost", "no reply", "stopped replying"],
      a: {
        en: "If an opportunity sits in one stage too long, I flag it, restart a follow-up sequence, and create a task for a person to step in. Nothing sits forgotten.",
        tl: "Pag matagal nang stuck sa isang stage yung opportunity, I flag it, nire-restart ko yung follow-up sequence, tapos I create a task para may taong mag-step in. So walang deal na nakakalimutan.",
      },
    },
    {
      id: "handoff",
      keywords: ["human", "hand off", "handoff", "ipasa", "team", "notify", "abiso", "sales rep"],
      a: {
        en: "I send an internal notification with the contact, the conversation summary and the suggested next step, then assign a task with a due date to the right person.",
        tl: "I send an internal notification na may contact, summary ng convo, and suggested next step, tapos I assign a task with a due date sa right person.",
      },
    },
    {
      id: "close",
      keywords: ["close", "isara", "benta", "sales", "convert", "conversion", "proposal", "invoice"],
      a: {
        en: "I don't close the sale itself. A person still does that. My job is making sure no lead falls through: the right stage, the right follow-up, and a nudge to the team when it's time to act.",
        tl: "Hindi ako yung nagko-close ng mismong sale, tao pa rin yun. My job is to make sure walang lead na nahuhulog: right stage, right follow-up, and may reminder sa team pag time na to act.",
      },
    },
  ],
  ava: [
    {
      id: "nurture",
      q: { en: "How does lead nurturing work?", tl: "Paano nagwo-work yung lead nurturing?" },
      keywords: ["nurtur", "campaign", "campaigns", "email", "sequence", "drip", "newsletter"],
      a: {
        en: "Leads who aren't ready yet enter a timed sequence of emails and texts. Each message waits for the right delay, and the sequence stops by itself the moment the lead replies or books.",
        tl: "Yung leads na hindi pa ready, pumapasok sila sa timed sequence ng emails and texts. May right delay every message, tapos kusa siyang nag-stop once mag-reply or mag-book yung lead.",
      },
    },
    {
      id: "compliance",
      keywords: ["complian", "a2p", "10dlc", "opt", "spam", "permission", "consent", "bawal", "legal", "allowed"],
      a: {
        en: "I only message contacts who opted in, and every message honors opt-out replies. For SMS in the US, A2P 10DLC brand and campaign registration comes first. Rules differ by country, so Liezl checks them before anything sends.",
        tl: "I only message yung nag-opt in, and sinusunod yung opt-out replies. For SMS sa US, need muna ng A2P 10DLC brand and campaign registration. Iba-iba yung rules per country, so chine-check muna ni Liezl before mag-send.",
      },
    },
    {
      id: "trigger",
      q: { en: "What triggers a campaign?", tl: "Ano yung nagti-trigger ng campaign?" },
      keywords: ["trigger", "triggers", "nagti-trigger", "start", "nagsisimula", "automatic"],
      a: {
        en: "A trigger is any event in the CRM: a form submitted, a tag added, an appointment booked, a pipeline stage changed. The workflow listens for it and starts the right messages.",
        tl: "Any event sa CRM can be a trigger: form submitted, tag added, appointment booked, or nag-change yung pipeline stage. Nakikinig yung workflow doon, tapos it starts the right messages.",
      },
    },
    {
      id: "reviews",
      keywords: ["review", "reviews", "rating", "feedback", "testimonial", "reputation"],
      a: {
        en: "After a service, I can send the customer a review request. It's a real help for a business's reputation, especially a local one.",
        tl: "After ng service, I can send a review request sa customer. Super helpful siya sa reputation ng business, especially for local businesses.",
      },
    },
    {
      id: "promo",
      keywords: ["promo", "sale", "discount", "balikan", "reactivat", "lumang customer", "dating customer", "old customers", "past customers", "bumalik", "win back"],
      a: {
        en: "There are reactivation campaigns for past customers: a short message with a reason to come back, like a promo or a reminder. Because it goes to many people, I ask for approval before sending.",
        tl: "May reactivation campaigns for past customers: short message lang na may reason to come back, like a promo or reminder. Since maramihan siya, I ask for approval muna before mag-send.",
      },
    },
  ],
  chloe: [
    {
      id: "monitor",
      q: { en: "What do you monitor?", tl: "Ano yung binabantayan mo?" },
      keywords: ["monitor", "binabantayan", "bantay", "watch", "check", "track", "tina-track"],
      a: {
        en: "Every active workflow, the tasks assigned to people, and anything that should have happened but didn't, like a reminder that never sent.",
        tl: "Lahat ng active workflows, yung tasks na naka-assign sa people, and anything na dapat nangyari pero hindi, like a reminder na hindi nag-send.",
      },
    },
    {
      id: "fail",
      q: { en: "What happens when a workflow fails?", tl: "Paano pag nag-fail yung workflow?" },
      keywords: ["fail", "fails", "failed", "nag-fail", "pumalya", "palya", "error", "errors", "sira", "nasira", "broken", "broke", "breaks", "alert", "hindi gumana", "not working", "stopped working", "bug"],
      a: {
        en: "I raise an alert with the workflow name, the step that failed and the contacts affected. Fixing or re-running it is a person's decision, not mine.",
        tl: "I raise an alert na may workflow name, kung saang step nag-fail, and kung sinong contacts yung affected. Tao yung magde-decide if ifi-fix or ire-rerun, not me.",
      },
    },
    {
      id: "summary",
      keywords: ["summary", "report", "daily", "araw-araw", "buod", "ulat"],
      a: {
        en: "The daily summary covers new leads, appointments booked, opportunities moved, workflows that ran, and the short list of items that need a person today.",
        tl: "Sa daily summary: new leads, appointments booked, opportunities na gumalaw, workflows na nag-run, and a short list ng things na need ng tao today.",
      },
    },
    {
      id: "tasks",
      keywords: ["task", "tasks", "gawain", "to-do", "todo", "pending", "overdue"],
      a: {
        en: "I track every open task and who it's assigned to. Anything past its due date shows up in the summary so it isn't forgotten.",
        tl: "I track all open tasks and kung kanino naka-assign. Pag may lumampas na sa due date, lumalabas siya sa summary para hindi makalimutan.",
      },
    },
  ],
  ethan: [
    {
      id: "not-simple",
      q: { en: "How is this different from a simple website?", tl: "Ano yung difference nito sa simple website?" },
      keywords: ["simple website", "basic website", "difference", "different", "pinagkaiba", "bakit ikaw", "why you", "just a website", "ordinary", "template", "brochure"],
      a: {
        en: "A simple website is a brochure: it sits there. What I build is part of the sales system. Every page has one job, every form and calendar feeds the CRM, the follow-up starts by itself, and tracking shows which pages bring in leads so we keep improving them.",
        tl: "Yung simple website, parang brochure lang, nandun lang siya. Yung ginagawa ko, part siya ng sales system. Every page may one job, every form and calendar pumapasok sa CRM, kusa nang nag-start yung follow-up, tapos may tracking para makita which pages yung nagdadala ng leads, so we keep improving.",
      },
    },
    {
      id: "site-vs-funnel",
      q: { en: "Do I need a website or a funnel?", tl: "Website ba or funnel yung kailangan ko?" },
      keywords: ["funnel", "funnels", "landing page", "website or", "sales page", "opt-in", "squeeze"],
      a: {
        en: "Often both. A website tells the whole story of the business and helps people find you. A funnel does one thing: it takes a visitor from an ad or a link to one action, like booking or buying, with no menu to wander off into. I usually pair a site with a funnel for each main offer.",
        tl: "Usually both! Yung website, sinasabi niya yung whole story ng business and tumutulong na mahanap ka. Yung funnel, isa lang yung job: dalhin yung visitor from an ad or link to one action, like booking or buying, walang menu na pwedeng paglibangan. I usually pair a site with a funnel for each main offer.",
      },
    },
    {
      id: "custom-code",
      keywords: ["custom code", "code", "coding", "html", "css", "javascript", "animation", "interactive", "custom design", "unique", "advanced"],
      a: {
        en: "Yes. When the builder's blocks aren't enough, I write custom HTML, CSS and JavaScript inside GoHighLevel: interactive sections, calculators, quizzes, animations, even a full dashboard. This HQ and Liezl's portfolio are both custom-coded.",
        tl: "Yes! Pag kulang yung blocks ng builder, I write custom HTML, CSS, and JavaScript inside GoHighLevel: interactive sections, calculators, quizzes, animations, pati full dashboard. Itong HQ and yung portfolio ni Liezl, parehong custom-coded.",
      },
    },
    {
      id: "conversion",
      keywords: ["convert", "conversion", "conversions", "more leads", "more sales", "mas maraming lead", "benta", "cta", "call to action", "copy", "headline", "walang nag-iinquire"],
      a: {
        en: "I design for the action, not the scroll. That means one clear offer above the fold, proof right beside it, a short form or a calendar instead of a long one, a button that says what happens next, and nothing on the page that doesn't help the visitor decide.",
        tl: "I design for the action, not for scrolling lang. So one clear offer sa taas, proof right beside it, short form or calendar instead of mahaba, button na sinasabi kung ano yung next, and walang kahit ano sa page na hindi tumutulong sa visitor mag-decide.",
      },
    },
    {
      id: "mobile",
      keywords: ["mobile", "phone", "cellphone", "responsive", "tablet", "small screen"],
      a: {
        en: "Most visitors arrive on a phone, so I build the mobile layout on purpose instead of letting the desktop one shrink: bigger tap targets, shorter sections, and forms that are easy to fill with a thumb. I check every page at phone, tablet and desktop sizes before it goes live.",
        tl: "Most visitors naka-phone, so sinasadya ko yung mobile layout, hindi lang pinapaliit yung desktop: bigger tap targets, shorter sections, and forms na madaling i-fill gamit thumb. I check every page sa phone, tablet, and desktop sizes before mag-live.",
      },
    },
    {
      id: "speed",
      keywords: ["speed", "fast", "slow", "is slow", "mabagal", "mabilis", "load", "loads", "loading", "performance", "lag"],
      a: {
        en: "A slow page loses people before they read a word. I compress images, load heavy parts only when they're needed, keep scripts light, and avoid stacking effects that make phones stutter.",
        tl: "Pag slow yung page, umaalis na yung tao before pa makabasa. I compress images, nilo-load ko lang yung heavy parts pag kailangan na, light lang yung scripts, and iniiwasan ko yung patong-patong na effects na nagpapa-lag sa phone.",
      },
    },
    {
      id: "seo",
      keywords: ["seo", "google", "search", "rank", "ranking", "mahanap", "keywords", "meta"],
      a: {
        en: "I set up the on-page basics properly: page titles and descriptions, clean headings, image alt text, fast loading and mobile-friendly layouts, plus the business details search engines look for. Ranking also depends on content and time, so I won't promise a position.",
        tl: "Inaayos ko nang maayos yung on-page basics: page titles and descriptions, clean headings, image alt text, fast loading, mobile-friendly layouts, plus yung business details na hinahanap ng search engines. Depends din sa content and time yung ranking, so hindi ako magpa-promise ng position.",
      },
    },
    {
      id: "crm-connect",
      keywords: ["form", "forms", "survey", "quiz", "integrat", "connect to the crm", "naka-connect", "calendar", "booking", "embed"],
      a: {
        en: "Every form, survey, quiz and calendar on the site is wired into the CRM. A submission creates the contact, tags where it came from, places the opportunity in the pipeline and starts the follow-up, so nothing is copied by hand.",
        tl: "Every form, survey, quiz, and calendar sa site naka-wire sa CRM. Pag may nag-submit, nagki-create ng contact, tina-tag kung saan galing, nilalagay yung opportunity sa pipeline, and nag-start na yung follow-up. So walang mano-manong copy-paste.",
      },
    },
    {
      id: "store",
      keywords: ["store", "shop", "e-commerce", "ecommerce", "payment", "payments", "checkout", "cart", "product", "products", "order", "bayad online", "sell online"],
      a: {
        en: "Yes. I build online stores with product pages, a cart and checkout, and order forms inside funnels for a single offer. Payments connect through a payment provider, and each order can trigger its own receipt and follow-up.",
        tl: "Yes! I build online stores na may product pages, cart, and checkout, pati order forms inside funnels for a single offer. Naka-connect yung payments through a payment provider, and every order pwedeng mag-trigger ng sariling receipt and follow-up.",
      },
    },
    {
      id: "domain",
      keywords: ["domain", "domains", "connect my domain", "dns", "ssl", "https", "url", "subdomain", "namecheap", "godaddy", "hosting", "host"],
      a: {
        en: "I connect your own domain or a subdomain, set the DNS records, and make sure SSL is active so the site loads on https. Hosting is included in the platform, so there's no separate server to manage.",
        tl: "Kino-connect ko yung own domain mo or subdomain, sine-set ko yung DNS records, and sinisigurado kong active yung SSL para https yung site. Kasama na yung hosting sa platform, so walang separate server na kailangan i-manage.",
      },
    },
    {
      id: "tracking",
      keywords: ["tracking", "analytics", "pixel", "ga4", "google analytics", "meta pixel", "data", "measure", "split test", "a/b", "ab test", "testing"],
      a: {
        en: "I add tracking so decisions come from numbers: analytics and ad pixels on the right pages, and conversion events on forms and bookings. In funnels I run split tests, two versions of a page shown to real visitors, and keep the one that converts better.",
        tl: "Naglalagay ako ng tracking para numbers yung basis ng decisions: analytics and ad pixels sa right pages, and conversion events sa forms and bookings. Sa funnels, nagra-run ako ng split tests, two versions ng page na pinapakita sa real visitors, tapos kini-keep yung mas nagko-convert.",
      },
    },
    {
      id: "redesign",
      keywords: ["redesign", "existing website", "old website", "lumang website", "wordpress", "wix", "squarespace", "shopify", "migrate", "rebuild", "revamp", "may website na"],
      a: {
        en: "I can rebuild an existing site from WordPress, Wix or another builder inside GoHighLevel. I keep what works, your content and your brand, fix the structure, and connect everything to the CRM. Old links are pointed to the new pages so visitors and search engines don't hit dead ends.",
        tl: "Kaya kong i-rebuild yung existing site mo from WordPress, Wix, or ibang builder inside GoHighLevel. I keep what works, yung content and brand mo, inaayos ko yung structure, and kino-connect ko lahat sa CRM. Yung old links, pino-point ko sa new pages para walang dead ends for visitors and search engines.",
      },
    },
    {
      id: "content",
      keywords: ["content", "copywriting", "text", "images", "photos", "logo", "branding", "brand", "design", "kulay", "colors", "fonts"],
      a: {
        en: "I start from your brand: colors, fonts, logo and tone. If you have copy and photos, I shape them to fit the page. If you don't, I draft the structure and headlines for you to fill in, so the build isn't stuck waiting on content.",
        tl: "I start sa brand mo: colors, fonts, logo, and tone. If may copy and photos ka na, ina-adjust ko to fit the page. If wala pa, I draft yung structure and headlines na ifi-fill in mo, para hindi na-stuck yung build waiting sa content.",
      },
    },
    {
      id: "maintenance",
      keywords: ["maintenance", "update", "updates", "edit", "edits", "changes", "baguhin", "after launch", "support", "ako na mag-edit"],
      a: {
        en: "After launch you can edit text and images yourself in the builder, and I'll show you how. Bigger changes, new pages or new funnels go back through Liezl, and I keep checking the numbers to suggest what to improve next.",
        tl: "After launch, you can edit text and images yourself sa builder, and ituturo ko kung paano. Yung bigger changes, new pages, or new funnels, dadaan ulit kay Liezl. And I keep checking the numbers to suggest kung ano yung next na i-improve.",
      },
    },
    {
      id: "accessibility",
      keywords: ["accessib", "contrast", "readable", "screen reader", "pwd", "keyboard"],
      a: {
        en: "I build for everyone who visits: readable text contrast, proper headings, labels on every form field, buttons that work from the keyboard, and reduced motion for people who ask for it. It also happens to make sites clearer for all visitors.",
        tl: "I build for everyone na bibisita: readable text contrast, proper headings, labels sa every form field, buttons na gumagana sa keyboard, and reduced motion for people na nag-request. Bonus, mas clear din yung site for all visitors.",
      },
    },
  ],
  mia: [
    {
      id: "approval",
      q: { en: "What do you need approval for?", tl: "Saan mo kailangan ng approval?" },
      keywords: ["approv", "permission", "pahintulot", "payag", "sensitive", "sensitibo", "notify", "notification", "slack", "alert me"],
      a: {
        en: "Anything with real consequences: bulk messages, deleting records, changing automation settings, or moving high-value opportunities. I prepare the action, notify the owner by email or Slack, and wait for a yes.",
        tl: "Anything na may real effect: bulk messages, deleting records, changing automation settings, or moving high-value opportunities. I prepare the action, nagno-notify ako sa owner via email or Slack, tapos I wait for the yes ng tao.",
      },
    },
    {
      id: "reports",
      q: { en: "How do you prepare reports?", tl: "Paano ka nagpe-prepare ng reports?" },
      keywords: ["report", "reports", "ulat", "brief", "summary", "numbers", "numero", "weekly"],
      a: {
        en: "I pull the week's numbers from the CRM, compare them with last week, and write a short brief covering priorities, risks and next actions.",
        tl: "I pull yung numbers ng week from the CRM, I compare sa last week, tapos I write a short brief: priorities, risks, and next actions.",
      },
    },
    {
      id: "coordinate",
      keywords: ["coordinat", "team", "sama-sama", "magkakasama", "others", "ibang ai", "nagtutulungan", "work together"],
      a: {
        en: "Ethan builds the pages that bring leads in. Sophia answers them and hands the qualified ones to Olivia, Ava keeps the rest warm, and Chloe checks that every step ran. I keep the owner informed and collect the decisions that need a person.",
        tl: "Si Ethan yung nagbi-build ng pages na nagdadala ng leads. Si Sophia yung sumasagot and nagpapasa ng qualified leads kay Olivia, si Ava yung nagki-keep warm sa iba, and si Chloe yung nagche-check na nag-run every step. Ako naman yung nag-a-update sa owner and nagko-collect ng decisions na need ng tao.",
      },
    },
    {
      id: "calendar",
      keywords: ["calendar", "schedule", "iskedyul", "meeting", "meetings", "appointment", "oras"],
      a: {
        en: "I keep the owner's calendar in order: no double-booked meetings, reminders in place, and what's needed prepared before each call.",
        tl: "I fix the owner's calendar: walang double-booked meetings, may reminders, and naka-prepare na yung need before every call.",
      },
    },
  ],
};

/** Suggested questions, by entry id. "niche:<id>" asks about that niche. */
export const SUGGESTIONS: Record<string, string[]> = {
  sophia: ["follow-up", "automate-everything", "niche:dental", "pricing"],
  olivia: ["pipeline", "stalled", "niche:real-estate", "inclusions"],
  ava: ["nurture", "trigger", "niche:beauty", "pricing"],
  chloe: ["monitor", "fail", "niche:food", "after-hours"],
  ethan: ["not-simple", "site-vs-funnel", "niche:home", "pricing"],
  mia: ["approval", "reports", "niche:ecommerce", "inclusions"],
};

/**
 * Industries the employees can give an example for. The describing fields are
 * English noun phrases; conyo Taglish keeps its nouns in English, so the same
 * wording serves both languages.
 */
export interface Niche {
  id: string;
  /** Named mid-sentence, with its article: "a dental or medical clinic". */
  label: string;
  /** Short name for the suggestion chip: "a dental clinic". */
  chip: string;
  keywords: string[];
  /** Singular, no article: "new patient inquiry". */
  lead: string;
  /** No article: "consultation or checkup". */
  book: string;
  /** What Ava would run: "recall reminders, like ...". */
  nurture: string;
}

export const NICHES: Niche[] = [
  { id: "dental", label: "a dental or medical clinic", chip: "a dental clinic", keywords: ["dental", "dentist", "dentista", "clinic", "klinika", "doctor", "doktor", "medical", "derma", "ospital", "hospital", "pasyente", "patient", "patients"],
    lead: "new patient inquiry", book: "consultation or checkup", nurture: "recall reminders, like a cleaning every six months" },
  { id: "beauty", label: "a salon, spa or beauty business", chip: "a salon", keywords: ["salon", "spa", "med spa", "beauty", "parlor", "barber", "nails", "lash", "aesthetic", "facial", "wellness"],
    lead: "treatment inquiry", book: "treatment or free consultation", nurture: "rebooking reminders and birthday promos" },
  { id: "real-estate", label: "real estate", chip: "real estate", keywords: ["real estate", "realty", "broker", "property", "properties", "condo", "bahay at lupa", "house and lot", "rental", "paupahan"],
    lead: "buyer or renter inquiry", book: "property viewing", nurture: "new-listing updates for people who haven't bought yet" },
  { id: "food", label: "a restaurant or cafe", chip: "a restaurant", keywords: ["restaurant", "resto", "cafe", "coffee", "kainan", "food", "catering", "bakery", "milk tea"],
    lead: "reservation or catering inquiry", book: "table reservation", nurture: "promos and invitations for past customers" },
  { id: "fitness", label: "a gym, fitness or coaching business", chip: "a gym", keywords: ["gym", "fitness", "coach", "coaching", "trainer", "yoga", "pilates", "consultant", "mentor"],
    lead: "program inquiry", book: "trial session or discovery call", nurture: "check-ins and renewal reminders" },
  { id: "home", label: "a home services business", chip: "home services", keywords: ["plumbing", "plumber", "tubero", "hvac", "aircon", "roofing", "bubong", "landscap", "cleaning", "electrician", "kontratista", "contractor", "repair", "construction", "pest", "home service"],
    lead: "request for an estimate", book: "site visit or inspection", nurture: "maintenance reminders and follow-ups on unanswered quotes" },
  { id: "auto", label: "an automotive business", chip: "an auto shop", keywords: ["auto", "automotive", "car", "cars", "kotse", "sasakyan", "talyer", "detailing", "car wash", "mekaniko", "mechanic", "motor"],
    lead: "service inquiry", book: "service appointment", nurture: "reminders for the next maintenance visit" },
  { id: "ecommerce", label: "an online shop", chip: "an online shop", keywords: ["online shop", "online store", "e-commerce", "ecommerce", "shopee", "lazada", "tiktok shop", "reseller", "tindahan", "product", "products", "paninda"],
    lead: "product or order question", book: "order confirmation or callback", nurture: "abandoned-cart reminders and repeat-order promos" },
  { id: "professional", label: "a professional services firm", chip: "a law or accounting firm", keywords: ["law", "lawyer", "abogado", "accounting", "accountant", "bookkeep", "insurance", "financial", "agency", "ahensya", "travel", "visa"],
    lead: "new client inquiry", book: "consultation", nurture: "proposal follow-ups and deadline reminders" },
  { id: "pets", label: "a pet care business", chip: "a pet care business", keywords: ["pet", "pets", "vet", "veterinar", "grooming", "aso", "pusa", "dog", "cat"],
    lead: "pet owner inquiry", book: "grooming or vet appointment", nurture: "vaccine and grooming reminders" },
  { id: "education", label: "a school or tutorial center", chip: "a tutorial center", keywords: ["school", "paaralan", "tutor", "tutorial", "review center", "enroll", "enrollment", "training center", "academy", "klase"],
    lead: "enrollment inquiry", book: "assessment or trial class", nurture: "enrollment reminders and updates for parents" },
];

const an = (phrase: string) => (/^[aeiou]/i.test(phrase) ? "an" : "a");
/** "a dental or medical clinic" -> "dental or medical clinic", for Taglish sentences that don't take the article. */
const bare = (label: string) => label.replace(/^an? /, "");

/** How each employee explains their job for a given niche, in each language. */
export const NICHE_ANSWER: Record<string, Record<Lang, (n: Niche) => string>> = {
  sophia: {
    en: (n) => `Yes. For ${n.label}: when ${an(n.lead)} ${n.lead} comes in, I reply right away, ask a few qualifying questions, then book the ${n.book} on your calendar.`,
    tl: (n) => `Yes, pwede! For ${bare(n.label)}: pag may ${n.lead}, I reply agad, then I ask a few qualifying questions, tapos I book the ${n.book} sa calendar mo.`,
  },
  olivia: {
    en: (n) => `Yes. For ${n.label}, every ${n.lead} becomes an opportunity in the pipeline. I move it along until the ${n.book} is confirmed, with a follow-up whenever the lead goes quiet.`,
    tl: (n) => `Pwede! Sa ${bare(n.label)}, every ${n.lead} becomes an opportunity sa pipeline. I move it along hanggang ma-confirm yung ${n.book}, and may follow-up pag hindi nag-reply yung lead.`,
  },
  ava: {
    en: (n) => `Yes. For ${n.label}, I can run ${n.nurture}, by email and SMS, so you're not messaging each person by hand.`,
    tl: (n) => `Pwede naman! For ${bare(n.label)}, I can run ${n.nurture}, via email and SMS, so hindi mo na kailangan i-message isa-isa.`,
  },
  chloe: {
    en: (n) => `Yes. For ${n.label}, I check that everything ran: whether every ${n.lead} got a reply, and whether the reminder for the ${n.book} went out. If something fails, I flag it right away.`,
    tl: (n) => `Pwede! Sa ${bare(n.label)}, I check kung nag-run lahat: na-replyan ba every ${n.lead}, and na-send ba yung reminder for the ${n.book}. Pag may nag-fail, I flag it agad.`,
  },
  ethan: {
    en: (n) => `Yes. For ${n.label}, I'd build pages where ${an(n.lead)} ${n.lead} turns into ${an(n.book)} ${n.book} in a few taps: a clear offer, proof beside it, and a form or calendar wired straight into the CRM.`,
    tl: (n) => `Pwede! For ${bare(n.label)}, I'd build pages kung saan yung ${n.lead} nagiging ${n.book} in a few taps lang: clear offer, proof beside it, and form or calendar na naka-wire straight sa CRM.`,
  },
  mia: {
    en: (n) => `Yes. For ${n.label}, I keep the owner's schedule and tasks in order and prepare a weekly report: how many leads came in and how many reached ${an(n.book)} ${n.book}.`,
    tl: (n) => `Pwede! For ${bare(n.label)}, I fix the owner's schedule and tasks, tapos I prepare a weekly report: ilan yung leads na pumasok and ilan yung umabot sa ${n.book}.`,
  },
};

/** The question a niche suggestion chip asks. */
export const NICHE_QUESTION: Record<Lang, (n: Niche) => string> = {
  en: (n) => `Would this work for ${n.chip}?`,
  tl: (n) => `Pwede ba 'to sa ${bare(n.chip)}?`,
};

export const FALLBACK: Both = {
  en: "Sorry, that isn't in my knowledge base for this demo yet. Try one of the suggested questions below, or tell me your niche and I'll give you an example.",
  tl: "Sorry, wala pa yan sa knowledge base ko for this demo. Try mo yung suggested questions below, or sabihin mo yung niche mo and I'll give you an example.",
};

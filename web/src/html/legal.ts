import { EXAMS } from '../../../src/engine';
import { HUB_COPY } from '../content';
import { CONTACT, hubPath } from '../site';
import { page } from './layout';
import { esc } from './util';

const UPDATED = '26 November 2026';

function legal(path: string, title: string, description: string, h1: string, html: string): string {
  return page({
    path,
    title,
    description,
    body: `<section><div class="wrap narrow prose"><h1>${esc(h1)}</h1><p class="faint">Last updated ${UPDATED}</p>${html}</div></section>`,
  });
}

export function privacyPage(): string {
  return legal(
    '/privacy',
    'Privacy Policy | CalmExam',
    'How CalmExam handles your data in the app and on calmexam.com: no account, no ads, no selling, subscriptions handled by the app stores and RevenueCat, install attribution by AppsFlyer, AI explanations processed on Cloudflare Workers AI.',
    'Privacy policy',
    `<p>This policy covers the CalmExam app for iOS and Android, calmexam.com and its API. We keep it short and honest, and we collect as little as we can.</p>
<h2>The CalmExam app</h2>
<p>The app works without an account. Your exam choice, exam date, study plan, practice history and answers are stored only on your device. They are not sent to us, and deleting the app deletes them.</p>
<p>The app shows no ads, and we never sell your data. To learn which of our own ads, links or app store listings brought you to the app, we use install attribution, described below.</p>
<h2>Install attribution (AppsFlyer)</h2>
<p>We use AppsFlyer, a mobile measurement service, to find out whether you installed CalmExam after seeing one of our ads (for example on Google, Meta, TikTok or Apple Search Ads) or found it on your own. This helps us stop paying for ads that don't reach students.</p>
<p>When you open the app, AppsFlyer receives device and app information: a random AppsFlyer install id, the app vendor identifier (IDFV) on iPhone, the device model, operating system and app version, language, your IP address (used to estimate your country, not your precise location) and when the app was installed and opened. RevenueCat also tells AppsFlyer about subscription events (trial started, purchase, renewal, refund, with price and currency) so we can see which ads lead to subscriptions. AppsFlyer matches this with the ad networks we run campaigns on and reports the result to us, for example "this install came from a Meta ad". RevenueCat stores that result with your anonymous subscription record.</p>
<p><strong>iPhone and iPad:</strong> the app asks for permission to track through Apple's App Tracking Transparency prompt. Only if you allow it does AppsFlyer receive your device's advertising identifier (IDFA) and match you to ads in other companies' apps. If you choose "Ask App Not to Track", the IDFA is not shared, and attribution relies only on Apple's privacy-preserving SKAdNetwork and Apple Search Ads reports, which do not identify you. You can change this any time in Settings &gt; Privacy &amp; Security &gt; Tracking.</p>
<p><strong>Android:</strong> AppsFlyer receives the Google Play install referrer and your device's advertising ID. You can delete or reset your advertising ID in Settings &gt; Privacy &gt; Ads (or Settings &gt; Google &gt; Ads), which stops it from being shared.</p>
<p>AppsFlyer processes this data on our behalf under its own <a href="https://www.appsflyer.com/legal/privacy-policy/">privacy policy</a>. We do not use it to build advertising profiles or to show you ads, and we do not link it to your name or email.</p>
<h2>Subscriptions</h2>
<p>CalmExam Pro is sold through Apple's App Store and Google Play, which handle payment. We never see your card or payment details. We use RevenueCat to check whether you have an active subscription. To do this RevenueCat receives a random, anonymous app user id, your purchase and subscription history, and basic device and app information such as the platform, app version and store country. RevenueCat processes this on our behalf under its own <a href="https://www.revenuecat.com/privacy">privacy policy</a>; we do not link it to your name or email.</p>
<h2>Waitlist</h2>
<p>When you join the waitlist we store your email address, the exam and phone platform you chose, the page you signed up from, an approximate country (derived by Cloudflare from your connection, not your exact location) and the time you signed up. This is stored in a Cloudflare D1 database.</p>
<p>We use it only to tell you when the CalmExam app launches and to understand which exams and platforms to support first. We do not sell, rent or share your email with anyone, and we do not add you to marketing lists.</p>
<h2>"Explain my mistake"</h2>
<p>When you ask for an explanation, the app or your browser sends the problem's id, the answer you chose and (on the website, if you typed one) a short question to our server. The server rebuilds the verified problem and sends the problem, your chosen answer and the verified steps to an AI model running on Cloudflare Workers AI to write the explanation. We do not store these requests or attach them to your identity.</p>
<h2>Practice and analytics</h2>
<p>Practice sets work without an account. Your answers are checked in your browser and are not sent to us. The website does not use advertising trackers or third-party analytics cookies. Like any website, our hosting provider (Cloudflare) processes standard request data such as IP addresses to deliver and protect the site. Fonts are loaded from Google Fonts.</p>
<h2>Your choices</h2>
<p>You can ask us to delete your waitlist entry, your subscription records at RevenueCat or your attribution data at AppsFlyer, or to tell you what we hold about you, at any time by emailing <a href="mailto:${CONTACT}">${CONTACT}</a>. To cancel a subscription, use your App Store or Google Play subscription settings. We will delete waitlist data once it is no longer needed for the launch announcement.</p>
<h2>Children</h2>
<p>CalmExam is meant for students preparing for high-school and A-Level exams and is not directed at children under 13. If you are under 13 (or the minimum age in your country), please ask a parent or guardian before using the app or joining the waitlist.</p>
<h2>Changes</h2>
<p>If this policy changes, we will update this page and the date above.</p>
<h2>Contact</h2>
<p><a href="mailto:${CONTACT}">${CONTACT}</a></p>`,
  );
}

export function termsPage(): string {
  return legal(
    '/terms',
    'Terms of Use | CalmExam',
    'The terms for using the CalmExam app, CalmExam Pro subscriptions and calmexam.com.',
    'Terms of use',
    `<p>By using the CalmExam app or calmexam.com you agree to these terms.</p>
<h2>The service</h2>
<p>CalmExam provides free, original math practice problems for SAT Math, AP Calculus AB and A-Level Maths, with answers and steps produced by our problem generator, and optional AI-written explanations of mistakes. You may use the practice for personal study, and teachers may use it with their students. Practice in the app is free and unlimited.</p>
<h2>CalmExam Pro</h2>
<p>CalmExam Pro is an optional auto-renewing subscription, offered yearly or monthly, that unlocks unlimited "Explain my mistake" and the full study plan. Prices are shown in the app before you buy. New subscribers may get a free trial; if you don't cancel at least 24 hours before the trial ends, the subscription starts and you are charged.</p>
<p>Payment is taken by Apple's App Store or Google Play. The subscription renews automatically at the same price for the same period unless you cancel at least 24 hours before the end of the current period. You can cancel or manage it at any time in your App Store or Google Play subscription settings; you keep Pro until the end of the period you paid for. Refunds are handled by Apple or Google under their policies.</p>
<h2>Accuracy</h2>
<p>We build every answer and solution with a generator designed to keep the answer consistent with the question, and we work hard to keep it correct. AI explanations are generated text and can occasionally be imperfect; the verified answer and steps shown with each problem take priority. If you think something is wrong, tell us at <a href="mailto:${CONTACT}">${CONTACT}</a> and we will fix it.</p>
<h2>No affiliation or guarantee</h2>
<p>CalmExam is independent and not affiliated with the College Board or any UK exam board. Practice can help, but we cannot guarantee any particular exam score or grade.</p>
<h2>Acceptable use</h2>
<p>Please don't attempt to overload, scrape at scale or misuse the app, site or API, or use the explanation feature to generate unrelated content. We may limit or block abusive traffic.</p>
<h2>Content</h2>
<p>The app and site design, text and problem generator are owned by CalmExam. The service is provided "as is" without warranties, to the extent permitted by law.</p>
<h2>Contact</h2>
<p><a href="mailto:${CONTACT}">${CONTACT}</a></p>`,
  );
}

export function notFoundPage(): string {
  const links = EXAMS.map((e) => `<li><a href="${hubPath(e.id)}">${esc(HUB_COPY[e.id].h1)}</a></li>`).join('');
  return page({
    path: '/404',
    title: 'Page not found | CalmExam',
    description: 'This page does not exist.',
    noindex: true,
    body: `<section><div class="wrap narrow"><h1>This page took a wrong turn</h1>
<p class="lead">The page you're looking for doesn't exist. Here are some calm places to continue:</p>
<ul>${links}<li><a href="/">CalmExam home</a></li></ul></div></section>`,
  });
}

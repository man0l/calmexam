# Apple Ads: Gulf (SA, AE) and South Korea SAT listings

Prepared 2026-11-22. Keyword volumes are Ubersuggest Google monthly searches (web, not App Store), so read them as relative demand. Confirm popularity and suggested bids in the Apple Ads console per country before spending.

## Which listing each storefront indexes

| Storefront | Default language | Second language | CalmExam listing it will use |
|---|---|---|---|
| Saudi Arabia | English (UK) | Arabic | `en-GB` (A-Level-led) + new `ar-SA` (SAT-led) |
| UAE | English (UK) | Arabic | `en-GB` + `ar-SA` |
| South Korea | Korean | English (UK) | new `ko` (SAT-led) + `en-GB` |

Live today (1.0.0): name "CalmExam", subtitle "Calm, verified math practice", no SAT words in name, subtitle or keywords. In Korea no subtitle shows because there is no Korean listing. Pro prices: SAR 34.99 / 199.99, AED 29.99 / 199.99, ₩12,000 / ₩77,000 (monthly / yearly).

## Keyword data (Ubersuggest)

**UAE (English):** sat practice test 1,600 · sat practice tests 1,300 · sat math 390 · test sat math 390 · math sat practice test 320 · sat practice 260 · sat math questions 260 · sat math practice 110 · sat practice questions 110 · digital sat 40. Google CPC for SAT terms is $2–4.

**Saudi Arabia (English):** sat practice test 720 · sat math questions 210 · sat math 140 · sat math practice test 140 · sat practice test math 110 · sat practice 90 · digital sat 70 · digital sat practice test 50.

**Saudi Arabia (Arabic):** اختبار سات 210. Note: قدرات / قياس قدرات (Qudurat, the Saudi aptitude test) is huge (74k–201k) but CalmExam does not cover it, so it is deliberately left out of the listing and campaigns.

**South Korea:** sat 8,100 (noisy: also supplements and Korean CSAT) · sat math 590 · sat question bank 480 · sat 기출문제 480 · math sat 390 · sat 수학 260 · sat practice 210 · sat 수학 기출문제 210 · digital sat 140 · sat 수학 문제 140 · sat math problem 170 · sat 문제집 90 · sat 모의고사 70. Brand terms (Bluebook, Khan, Desmos, 해커스) are excluded; Apple's guidelines bar other companies' trademarks in metadata.

## Listings added to `store/ios/metadata.json`

- `ar-SA`: name "CalmExam: SAT Math Practice", subtitle "تدريب رياضيات SAT الرقمي", keywords with سات, اختبار, أسئلة and English digital, psat, algebra, bank, score. The `en-GB` listing is unchanged, so Gulf A-Level students still match.
- `ko`: name "CalmExam: SAT 수학 문제 연습", subtitle "디지털 SAT Math 무제한 연습", keywords 모의고사, 문제은행, 미적분, 해설, 풀이 and English digital, psat, bank. The description says the app is in English.

Both descriptions keep the subscription terms and the College Board disclaimer. No localized screenshots, so App Store shows the primary-language set.

## Suggested exact-match keywords for the first campaign

**Gulf (SA + AE, one campaign per country):** sat math, sat practice, sat practice test, sat math practice, sat math questions, digital sat, digital sat math, sat prep, sat math practice test, اختبار سات, سات.

**South Korea:** sat math, sat 수학, sat 수학 문제, sat 문제, sat practice, digital sat, 디지털 sat, sat question bank, sat 문제은행, sat 모의고사, sat prep.

Add `CalmExam` as a brand exact-match keyword in every campaign, and a Search Match discovery ad group with a low bid cap to find terms not listed here.

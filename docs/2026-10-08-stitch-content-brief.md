# Vendy Ltd: content and image brief for UI design (Google Stitch)

Everything a designer needs to redesign vendy.ltd. **All text below is final and must appear exactly as written** (including its typos and odd grammar). **All images listed are the only images available.** The visual design is open.

## 0. Ready-to-paste prompt

> Design a responsive website (mobile 375px and desktop 1440px) for **Vendy Ltd**, a Dhaka, Bangladesh company that designs and builds wall-mounted vending machines for hygiene products (menstrual pads), with mobile-payment, RFID and coin options. Audience: buyers at garment factories, corporate offices, NGOs and housing societies, plus partners checking credibility. Main goal: let a buyer compare the four machine models (model code, capacity, weight, price) and contact the company. Pages: Home, About Us, Our Team, Tutorials, FAQ's, Vending Machine FAQ's, Contact Us, 404. Use only the text and images in the brief below, unchanged. Brand colours come from the logo: green `#0C6048` and red `#E41824`. The product photos are loud (teal, magenta, pink, white) so keep the surrounding UI calm. Avoid generic startup templates, avoid purple gradients, avoid uniform rounded-card grids. It should feel like a confident local hardware maker, not a SaaS landing page.

## 1. The company

- **Name:** Vendy Ltd. Logo tagline (inside the logo image): "Vending out of the cocoon".
- **What:** builds Vending Machines locally in Bangladesh. Steel bodies, built-in Wi-Fi, cashless / RFID / coin payment. Current products are hygiene (menstrual pad) machines.
- **Language:** English site. Some images contain Bangla text (machine labels, one slider poster). The ৳ (taka) sign is used for prices, so the font must support U+09F3.
- **Primary action on every page:** contact. The site has no form. "Send a message" opens an external Google Form in a new tab. Phone and email are also shown.

## 2. Sitemap and navigation

Main menu, in this order (8 items):

| Label | URL |
|---|---|
| Home | `/` |
| Products | `/#products` (section on Home) |
| About Us | `/about/` |
| Resources | `/#resources` (section on Home) |
| Tutorials | `/tutorials/` |
| FAQ’s | `/faqs/` |
| Our Team | `/our-team/` |
| Contact Us | `/contact-us/` |

Header also has a button: **Send a message** (opens Google Form). Footer repeats phone, email, address, a **Contact Us** button and copyright.

Extra page (not in the menu, reached from product "Learn More"): `/vending_details/`. Plus a `404` page.

### Global content (header and footer)

- Logo image: `logo.png` (see images).
- Button: **Send a message**
- Footer address: 13055, Islambag, Satarkul, Uttor Badda, Satarkul Road, Behind the Chapra Masjid [Islambag Jameah Masjid], Dhaka 1212, Dhaka 1212.
- Footer phone: +880 1714-890252
- Footer email: info@vendy.ltd
- Footer button: **Contact Us**
- Footer copyright line: `Copyright@Vendy.Ltd`

## 3. Pages and content

### 3.1 Home `/`

Sections in current order: Products → image slider → Resources → Contact band. A redesign may reorder these.

#### Products (heading: **Products**, anchor `#products`)

Four machines. Each has a photo, a model code, a full name, a heading **Key features:**, a feature list (bold lead-in + sentence), a label **Price** with the amount, and a button **Learn More** that goes to `/vending_details/`.

**Model code:** FTu25  
**Full name:** FTu25 LC Folding Tray Model  
**Price:** ৳ 35,000  
**Photo:** `/assets/img/product-ftu25.webp`

Key features:

- **Tray Based Magazine:** Equipped with plastic tray magazine that can hold up to 25 pads, ensuring consistent and reliable dispensing.
- **Built-in Wi-Fi Connectivity:** Stay connected and monitor the machine remotely with its built-in Wi-Fi connectivity, allowing for seamless integration and management.
- **Durable Steel Body:** Crafted with a robust steel body, the Shelf folded model is designed for durability and long-lasting performance.
- **Convenient Installation:** Designed for wall installation, it saves space and ensures convenient access in any location.
- **Multiple Payment Methods:** Purchase products effortlessly using cashless methods, or RFID cards, one time scratch card catering to various user preferences and increasing accessibility.

**Model code:** HVu120  
**Full name:** HVu120 Hygiene Vendy Spiral Model  
**Price:** ৳ 60,000  
**Photo:** `/assets/img/product-hvu120.webp`

Key features:

- **Single Spiral Magazine:** Equipped with a seal spiral magazine that can hold up to 120 pads, ensuring consistent and reliable dispensing.
- **Built-in Wi-Fi Connectivity:** Stay connected and monitor the machine remotely with its built-in Wi-Fi connectivity, allowing for seamless integration and management.
- **Durable Steel Body:** Crafted with a robust steel body, the HVU120 is designed for durability and long-lasting performance.
- **Compact and Lightweight:** Weighing just 45 kg, this machine is easy to install and relocate as needed.
- **Convenient Installation:** Designed for wall installation, it saves space and ensures convenient access in any location.
- **Multiple Payment Methods:** Purchase products effortlessly using coin, cashless methods, or RFID cards, catering to various user preferences and increasing accessibility.

**Model code:** HVu20  
**Full name:** HVu20 Hygiene Vendy Spiral Model  
**Price:** ৳ 25,000  
**Photo:** `/assets/img/product-hvu20.webp`

Key features:

- **Single Spiral Magazine:** Equipped with a single spiral magazine that can hold up to 20 pads, ensuring consistent and reliable dispensing.
- **Built-in Wi-Fi Connectivity:** Stay connected and monitor the machine remotely with its built-in Wi-Fi connectivity, allowing for seamless integration and management.
- **Durable Steel Body:** Crafted with a robust steel body, the HVu20 is designed for durability and long-lasting performance.
- **Compact and Lightweight:** Weighing just 10 kg, this machine is easy to install and relocate as needed.
- **Convenient Installation:** Designed for wall installation, it saves space and ensures convenient access in any location.
- **Multiple Payment Methods:** Purchase products effortlessly using coin, cashless methods, or RFID cards, catering to various user preferences and increasing accessibility.

**Model code:** HVu40/60  
**Full name:** Hvu40/60 Hygiene Vendy Spiral Model  
**Price:** ৳ 40,000  
**Photo:** `/assets/img/product-hvu40-60.webp`

Key features:

- **Double Spiral Magazine:** Equipped with a double spiral magazine that can hold up to 40 pads, ensuring consistent and reliable dispensing.
- **Built-in Wi-Fi Connectivity:** Stay connected and monitor the machine remotely with its built-in Wi-Fi connectivity, allowing for seamless integration and management.
- **Durable Steel Body:** Crafted with a robust steel body, the HVu40/60 is designed for durability and long-lasting performance.
- **Compact and Lightweight:** Weighing just 27 kg, this machine is easy to install and relocate as needed.
- **Convenient Installation:** Designed for wall installation, it saves space and ensures convenient access in any location.
- **Multiple Payment Methods:** Purchase products effortlessly using coin, cashless methods, or RFID cards, catering to various user preferences and increasing accessibility.

#### Image slider (5 slides, no heading)

Posters shown one at a time with previous/next, dots and autoplay. Each image's text is baked into the picture, so it must not be cropped or covered. Caption/alt text:

1. `/assets/img/hero-1.webp`: "Vendy being built"
1. `/assets/img/hero-2.webp`: "Vendy being used with office ID"
1. `/assets/img/hero-3.webp`: "Vendy for corporate female staff"
1. `/assets/img/hero-4.webp`: "Vendy for garment makers"
1. `/assets/img/hero-5.webp`: "Vendy at dark night"

#### Resources (heading: **Resources**, anchor `#resources`)

Links: **Tutorials** (`/tutorials/`), **FAQ’s** (`/faqs/`), **Vending Machine FAQ’s** (`/vending_details/`).

#### Contact band

- Heading: **Contact Us**
- Text: Please do not hesitate to get in touch with us. Feel free to ask any question you may have.
- Phone: +880 1714-890252 (tel link)
- Email: info@vendy.ltd (mailto link)
- Button: **Send a message**

### 3.2 About Us `/about/`

- Page title: **About Us**
- Image: `about-machine.webp` (pink machine) beside the text
- Image: `hero-1.webp` ("Vendy being built") optional second figure

Body text (3 paragraphs):

> Vendy is an initiative to develop a complete Vending Machine Eco System locally to enable the local business entities to deliver necessary and beneficial products through vending machines into its community. MFS (mobile financial service) based payment mechanism, IoT enabled electronic buildup and software-driven systems to make Vendy a smarter, affordable and efficient vending machine for the local market.

> For instance, in the garments, workplaces women don’t have emergency access to hygienic products. Also, the old-school vending machine system is not always helpful due to coins or changes issue. In Bangladesh, the usages of Coins are not popular whereas the mobile payment system has widely been adopted. Hence, Vendy is the initiative to mitigate the gap to enable the entrepreneur to offer a product to consumers doorsteps throughout 24/7.

> On the initial level, Vendy targets the residential areas where setting up a retail store or tea stall is strictly prohibited; the corporate houses, academic building and so on.

### 3.3 Our Team `/our-team/`

Page title: **Meet Our Team**. Order and grouping:

**Founder (featured, larger):**

- Md. Sharif Muktadir | Founder & CEO | "Serial Entrepreneur with 22 years of professional experience." | photo `team-muktadir.webp`

**(no group heading):**

- Sajib Karmaker | Team Lead | "As a former Research Assistant at BRAC University’s Energy Research Unit, his path at Vendy Ltd. from IoT & Embedded System Engineer to Lead Engineer, IoT & Electronics, emphasizes his extraordinary talent and devotion." | photo `team-sajib.webp`

**IT Team:**

- Md. Marfi Chaowdhury | Software Engineer | "He possess a diverse skill set encompassing programming languages like C, C++, Python, and development tools such as MySQL and SQLite. His experience ranges from developing automated mailing systems to crafting intricate advertisement management systems" | photo `team-marfi.webp`
- Md. Shamim Ashraf Singdho | Jr. Software Engineer | "He demonstrates adeptness in HTML, CSS, JavaScript, PHP, MySQL, and CodeIgniter, showcasing a comprehensive understanding of web development fundamentals. His ability to design and implement intricate web solutions is promising." | photo `team-shamim.webp`
- Rudro Mozumdar | Jr. Software Engineer | "He specializing in Flutter, Kotlin, and Java, he excels in app development and competitive programming. Known for punctuality, teamwork, and a fast-learning attitude, he is currently working on a vending machine control app and a Flutter desktop app." | photo `team-rudro.webp`

**Electrical Team:**

- Md. Mehedi Hasan | Assistant Engineer | "Demonstrates a profound mastery of assembly of electrical components, soldering techniques, infusing circuits with 200 plus projects under his name." | photo `team-mehedi.webp`

### 3.4 Tutorials `/tutorials/`

Page title: **Tutorials**. Three tutorials, each a YouTube video (thumbnail with play button; the player loads on click) plus intro text and 3 steps.

**Tutorial 1** (video id `1HD-lsE6JA0`, title "Vendy demonstration video", thumbnail `https://i.ytimg.com/vi/1HD-lsE6JA0/hqdefault.jpg` 480×360)

> On this video, we are giving a demonstration of our product. The steps are describing below:

- Step 1: Simply inserted a 5 Taka coin
- Step 2: In the reference please type the product code and the quantity. (For Example “A” product “1” Quantity: A1)
- Step 3: Receive you product from the dispenser.

**Tutorial 2** (video id `TrdgfJmwOsA`, title "Vendy short product video", thumbnail `https://i.ytimg.com/vi/TrdgfJmwOsA/hqdefault.jpg` 480×360)

> On this video, we are showing a short OVC of our product. The steps are describing below:

- Step 1: Simply inserted a 5 Taka coin
- Step 2: In the reference please type the product code and the quantity. (For Example “A” product “1” Quantity: A1)
- Step 3: Receive you product from the dispenser.

**Tutorial 3** (video id `0l2Mu6smr90`, title "How easy it is to use Vendy", thumbnail `https://i.ytimg.com/vi/0l2Mu6smr90/hqdefault.jpg` 480×360)

> On this video, we are showing how easy it is to use our vending machine. Even a child can use our machine without any issue. The steps are describing below:

- Step 1: Simply inserted a 10 Taka note
- Step 2: In the reference please type the product code and the quantity. (For Example “A” product “1” Quantity: A1)
- Step 3: Receive you product from the dispenser.

### 3.5 FAQ’s `/faqs/` and Vending Machine FAQ’s `/vending_details/`

Both pages are a title plus a Google Doc embedded in an iframe (the client edits the docs, so the embed stays; it scrolls inside its frame). Give the frame a tall, wide area. Include a link **Open full document ↗** to the full doc.

- `/faqs/` title: **Frequently Asked Questions (FAQ’s)**
- `/vending_details/` title: **Frequently Asked Questions For Vending Machines (FAQ’s)** (the Doc content is mostly Bangla, with tables)

### 3.6 Contact Us `/contact-us/`

- Page title: **Contact Us**
- Intro: Please do not hesitate to get in touch with us. Feel free to ask any question you may have.
- Card heading: **Visit Us**
- Fields (label → value):

  - Vendy Ltd. → 13055, Islambag, Satarkul, Uttor Badda, Satarkul Road, Behind the Chapra Masjid [Islambag Jameah Masjid], Dhaka 1212, Dhaka 1212.
  - E-Mail → info@vendy.ltd
  - Phone → (+880) 1714-890252
  - Website → www.vendy.ltd
- Button: **E-Mail Us** (opens Google Form)
- Embedded Google Map of the office (iframe), pin at 23.783346, 90.392298 (Uttor Badda, Dhaka)

### 3.7 404

- Title: **Page not found**
- Text: The page you are looking for does not exist.
- Links: **Home**, **Products**, **Send a message**

## 4. Images

All files are in `src/static/assets/img/`. There is no other artwork. Do not invent new photos or illustrations (simple icons and shapes are fine).

| File | Size (px) | What it shows | Background / notes |
|---|---|---|---|
| `logo.png` | 160×48 | Green "VENDY" wordmark, red butterfly inside a green open square, tagline "Vending out of the cocoon" | Transparent. Green `#0C6048`, red `#E41824`. Needs a light background; on dark UI put it on a white tile. |
| `product-ftu25.webp` | 800×1067 | FTu25: tall white machine, teal front panel, tray magazine filled with red pad packs, keypad, QR, card reader, labelled "Smart Vendy Machine, model FTu25s.LC", 3/4 angle | Transparent background, lots of empty margin around the machine (machine is ~43% of width). |
| `product-hvu120.webp` | 800×1151 | HVu120: wide wall-mounted teal panel with Bangla title, six angled trays visible through a cut-out, keypad, QR, magenta dispenser drawer at the bottom | White background, slight tilt, machine fills most of the frame. |
| `product-hvu20.webp` | 800×1203 | HVu20: slim white machine, big pink circle on front, Bangla title, partner logos (DSC, Sweden, WaterAid), single spiral magazine, keypad, RFID and QR panels, key lock on the left, pink dispenser | White body on white background; machine is ~41% of width. |
| `product-hvu40-60.webp` | 800×1203 | HVu40/60: white wall panel with pink circle, Bangla title, two vertical spiral magazines, keypad, QR, pink dispenser, partner marks ("Amader Kalaroa Project", WaterAid) | White body on white background; machine is ~62% of width. |
| `about-machine.webp` | 700×630 | Close-up of an all-magenta machine front with trays, coin slot, dispenser and a butterfly mark | Full-bleed photo, low resolution (soft when enlarged). |
| `hero-1.webp` | 1600×740 | Build-story poster: strip of 5 panels "3D Drawing → Laser Cutting → Bending → Pre-Coloring → Final Product", footer text "Vendy is being built in the smart Vending machine Bangladesh" | Text baked in. Do not crop. Alt: "Vendy being built" |
| `hero-2.webp` | 1600×740 | Panel strip: machine and pad packaging, a hand holding a pad, green tile "Buying is that easy 24/7" with butterfly | Alt: "Vendy being used with office ID". Do not crop. |
| `hero-3.webp` | 1600×740 | Poster: woman in white blazer, quote "Workplace can be female-Hygiene Friendly if you adopt the Menstrual Hygiene Vendy", pink machine with labelled parts, bullet list of benefits (made in Bangladesh, one-time payment, customizable, cash/cashless/MFS/card payment, RFID employee-card purchase, stock alert and sales reporting, tool against social stigma), address and phone | Text baked in, small text. Alt: "Vendy for corporate female staff" |
| `hero-4.webp` | 1600×740 | Poster: Bangla bullet text over a pink machine diagram, garment factory women, smiling woman worker in teal uniform at right | Bangla text baked in. Alt: "Vendy for garment makers" |
| `hero-5.webp` | 1178×430 (wider, 2.74:1) | Dark night scene, a child at a lit red vending machine against a stone wall; Bangla copy on both sides ("Vendy means machine shop, 24 hours open…"), icons for QR scan, mobile payment, transaction complete; white contact tile with logo, email and two phone numbers | Dark. Bangla text baked in. Alt: "Vendy at dark night" |
| `team-muktadir.webp` | 480×480 | Founder, smiling man, dark hair, cream shirt, warm indoor light | Square portrait |
| `team-sajib.webp` | 480×479 | Man in sunglasses, red shirt and dark jacket, hills and sea behind, blue sky | Square, outdoors, bright |
| `team-marfi.webp` | 480×479 | Man in striped sweater, mountains and river behind, overcast | Square, outdoors, muted |
| `team-shamim.webp` | 480×480 | Young man in black suit, light shirt, indoors by an arched window | Square, indoors |
| `team-rudro.webp` | 480×480 | Man in olive shirt, green trees behind | Square, outdoors |
| `team-mehedi.webp` | 480×480 | Man in dark shirt, wooden panel wall behind | Square, indoors |

Photo quality is mixed (team photos are casual and differ in lighting and framing; a shared treatment such as a uniform crop or tone helps). Favicons and `apple-touch-icon.png`/`icon-192.png` exist (butterfly icon).

## 5. Contact, links and technical facts

- Phone: +880 1714-890252 (`tel:+8801714890252`)
- Email: info@vendy.ltd
- Website: www.vendy.ltd
- Address: 13055, Islambag, Satarkul, Uttor Badda, Satarkul Road, Behind the Chapra Masjid [Islambag Jameah Masjid], Dhaka 1212, Dhaka 1212.
- Google Form (Send a message / Contact Us / E-Mail Us): placeholder URL for now (`https://docs.google.com/forms/d/e/PLACEHOLDER_FORM_ID/viewform`), opens in a new tab.
- Google Docs embeds: 2 (FAQ pages). YouTube: 3 videos. Google Map: 1 embed.
- Static HTML/CSS/JS site, hosted on cPanel. No CMS, no login, no cart, no search, no blog.

## 6. Design constraints and goals

- Keep text and images exactly as given. New UI labels are fine only if tiny (e.g. a Pause button).
- Mobile first. 375px must work; the four-machine comparison is the most important thing to get right on a phone.
- Product photos have inconsistent backgrounds (one transparent, three white with white machine bodies). Plan for that: a neutral surface, tight crops, or a light tile behind each machine. A pure white machine on a white page disappears.
- Slider posters contain their own text. Show them whole, never cropped or overlaid with text.
- Red `#E41824` is the brand's action colour (contact). Green `#0C6048` is the brand's structure colour.
- Accessible: text contrast AA, 44px touch targets, visible focus, works at 320px.
- Current look to move away from: pale cream/grey page, four identical stacked product panels, big all-caps-free headings in a single heavy font, generic section rhythm. The client said the first redesign is "still not great", so propose something with a stronger point of view while keeping it credible for B2B buyers.
- Suggested variations to explore (pick any): (a) product-first catalogue with a comparison table of the four models; (b) bold brand-colour hero with the machine lineup; (c) editorial, story-led layout built around the hero posters and the "made in Bangladesh" build story; (d) dark, tech-forward showroom.

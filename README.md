# Relax & Cruz Spa website

Static site: plain HTML, CSS and one small script. No build step. Booking and payments stay on Square.

## Files

Every page is its own file at the top level. There are no page folders, so everything uploads to GitHub in one drag.

```
index.html               Homepage
laser-hair-removal.html  /laser-hair-removal
electrolysis.html        /electrolysis
ingrown-hair.html        /ingrown-hair
laser-for-men.html       /laser-for-men
facials-and-peels.html   /facials-and-peels
lymphatic-massage.html   /lymphatic-massage
massage.html             /massage
body-contouring.html     /body-contouring
shop.html                /shop
contact.html             /contact
styles.css               Shared styles for every page
main.js                  Mobile menu, offer popup, price finder (prices live here)
images/                  Photos and videos
logo.png, logo-white.png, favicon.png, apple-touch-icon.png, og-image.jpg
_redirects               Old URLs to new pages (Cloudflare Pages / Netlify)
_headers                 Security and caching headers
robots.txt, sitemap.xml
```

Cloudflare Pages and GitHub Pages both serve `contact.html` at `/contact`, so the addresses have no `.html` in them. Links between pages are written the same way (`href="contact"`, `href="./"` for home).

## Deploy (Cloudflare Pages)

1. Create a GitHub repo and push this folder to it.
2. In Cloudflare, go to Workers & Pages, then Create, then Pages, then Connect to Git, and pick the repo.
3. Build settings: framework preset **None**, build command **empty**, output directory **/**.
4. Deploy. You get a `*.pages.dev` preview address. Test everything there first.
5. Every push to the main branch redeploys automatically.

## GitHub Pages preview

The preview at `thetlfgroupllc-source.github.io/Relax-and-Cruz-Spa/` works because every path in the site is relative (`styles.css`, not `/styles.css`). Keep it that way on new pages.

`.nojekyll` stops GitHub from hiding the underscore files. GitHub Pages still ignores `_redirects` and `_headers`, so it's fine for previews but not for launch: the old URLs need real 301 redirects. At launch, connect the same repo to Cloudflare Pages and point the domain there.

## Before launch

- [ ] Hero photo: replace the placeholder in `index.html` (search `TODO`) with `/images/hero.jpg`
- [ ] Portrait of Crystal: replace the placeholder with `/images/crystal.jpg`
- [ ] Before and after photos: underarm and chin, plus the session counts
- [ ] Crystal's bio in her own words
- [x] Credentials: license numbers filled in; laser certification and supervising physician left off the site at Crystal's request (Oct 20, 2026).
- [ ] "Read the reviews" link: swap in her Google Business Profile reviews link
- [ ] Cherry: link it to her Cherry application page
- [ ] Square: free consult listed first, and prices that match `main.js`
- [ ] Build the service pages linked from the homepage (list below), or remove those links
- [ ] Crawl the old site and add any missing old URLs to `_redirects`
- [ ] Test every Book button and the phone link on a real phone

## Adding a page

Save it at the top level as `page-name.html`. Link shared files as `styles.css`, `main.js` and `images/...`, and link other pages without `.html` (`href="contact"`). Give it its own title, description and canonical URL (`https://www.relaxandcruzspa.com/page-name`), and add it to `sitemap.xml`.

## Updating prices

Open `main.js`. Prices are in `TIERS`, one line per size. Areas and their $499 eligibility notes are in `AREAS`. The homepage shows Underarms by default, so if Small prices change, also update the matching numbers in the price finder in `index.html`.

## Going live

1. In Cloudflare Pages, add the custom domain `www.relaxandcruzspa.com` (and the bare domain).
2. Update DNS where the domain is registered. If it was bought through Square, confirm you can edit DNS there or transfer it out first.
3. After the switch, update the website and booking links on her Google Business Profile, Yelp, Facebook and Instagram.
4. Submit `sitemap.xml` in Google Search Console.

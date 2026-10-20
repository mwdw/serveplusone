# Serve Plus One

Tennis data, short essays, analysis by Matthew Willis. Lives at [serveplusone.co](https://serveplusone.co).

## Adding a post

Each post is a folder inside `posts/`, containing your chart image(s) and a text file.

1. **Make a folder** named with the date, then the title:
   `2026-10-20 Why Sinner returns from so deep`
2. **Put your chart in it.** PNG or JPG, as big as you have. Several charts, or videos? Number them (`1.png`, `2.mp4`, `3.png`); they show in that order, and the first *image* is always the thumbnail. To place one between paragraphs, write its filename on its own line in `post.txt`.
3. **Add a text file** called `post.txt`. Copy the one in `posts/_example (copy this folder)`:

   ```
   Why Sinner returns from so deep

   One-sentence summary, shown under the thumbnail and in Google.

   The rest is the writing. As long or short as you like.
   Blank line between paragraphs. **bold**, *italics* and [links](https://…) work.

   Data: ATP 2025–26, first-serve returns
   Alt: What the chart shows, in a sentence or two.
   ```

   Tags are added automatically from what the post says, including the `Alt` description of the chart, so a good Alt line matters. The topic list lives in `src/lib/tags.ts`.

   The lines at the bottom are all optional. The full list is in `posts/_example (copy this folder)/README.txt`, and covers manual tags, pinning, hiding, essays, a link to X, and captions.

4. **Upload the folder**: on GitHub, open the `posts` folder, click **Add file**, then **Upload files**, drag your folder in, and press **Commit changes**. The site updates by itself about two minutes later.

**Editing a post:** open its `post.txt` on GitHub, click the pencil, change it, then **Commit changes**. To swap a chart, upload a new file with the same name into that folder.

**Videos:** MP4 is safest. GitHub's website accepts files up to 25 MB; for bigger ones use GitHub Desktop (up to 100 MB). Add `Autoplay: yes` to make a post's videos play silently on a loop, which suits short animated charts.

**Hiding or deleting:** add `Hide: yes` to the bottom of `post.txt`, or delete the folder.

---

## One-time setup (about 15 minutes)

1. **GitHub** stores the files. Make an account at [github.com](https://github.com), install [GitHub Desktop](https://desktop.github.com), then unzip `serveplusone.zip`. In GitHub Desktop, go to **File** and choose **Add local repository**, pick the `serveplusone` folder, click **create a repository**, then **Publish repository**.
2. **Cloudflare Pages** turns the files into the website. In the Cloudflare dashboard go to **Workers & Pages**, then **Create**, then the **Pages** tab, then **Connect to Git**. Pick `serveplusone`, choose the **Astro** framework preset (build command `npm run build`, output folder `dist`) and click **Save and Deploy**. You'll get an address like `serveplusone.pages.dev`.
3. **Connect serveplusone.co**: in the Pages project open **Custom domains**, then **Set up a custom domain**, and add `serveplusone.co`, then again for `www.serveplusone.co`. Because the domain is already on Cloudflare, it creates the DNS records and the HTTPS certificate for you.

To let someone else add posts, invite them to the GitHub repository (on GitHub: **Settings**, then **Collaborators**). They upload folders the same way.

---

## For developers

Static [Astro](https://astro.build) site, Node 22+. `npm install`, `npm run dev`, `npm run build`.

- Posts are read from `posts/*/` by `src/lib/posts.ts`. That covers the text format, the settings lines and the image ordering. Folders starting with `_` are ignored.
- Charts are optimised at build time to AVIF/WebP at several widths. Each post also gets a 1200×630 social card (`/og/<slug>.png`) and a Markdown copy (`/posts/<slug>.md`).
- SEO and AI search: canonical URLs, Open Graph and X cards, JSON-LD (WebSite, Person, Article/BlogPosting, ImageObject, BreadcrumbList), sitemap, RSS, `robots.txt`, `llms.txt` and `llms-full.txt`.
- Site name, tagline and profiles are in `src/site.config.ts`; the address is in `astro.config.mjs` (or a `SITE_URL` environment variable). `npm run brand` regenerates the favicon and default social card.
- Hosted on Cloudflare Pages (Node version in `.nvmrc`). Response headers are in `public/_headers`; old `mw-tennis-data` links (`/post.html?id=…`) are forwarded by `src/pages/post.astro`, because Pages redirects can't match on the `?id=` part.

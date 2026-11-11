# udayallu.com

My personal site, built as plain HTML and CSS with no build step. It's hosted for free on GitHub Pages, and the domain is registered at GoDaddy.

## Files

| File | Purpose |
|---|---|
| `index.html` | All the content: profile, about, research, experience, contact |
| `styles.css` | Styling for dark and light themes, animations, and phone layout |
| `script.js` | Interactions: theme toggle, `K` command menu, typing effect, counters, scroll animations, research filters, contact form. Edit the rotating phrases and time zone near the top of the file |
| `CNAME` | Tells GitHub Pages to serve the site at `udayallu.com` |
| `.nojekyll` | Tells GitHub to serve the files as-is |
| `photo.jpg` | *(add this yourself)* A square profile photo |
| `resume.pdf` | *(add this yourself)* Your CV, used by the "Download CV" button |

To edit the content, open `index.html` and search for `EDIT:`; each one marks a spot to fill in. To add a paper or project, copy an `<article class="work">` block and set `data-type` to `"paper"` or `"project"`. The `--h` value (0–360) sets its cover colour. To add a job, copy a `<div class="t-item">` block.

---

## Step 1: Put the site on GitHub (free)

1. Create a GitHub account at https://github.com/signup if you don't have one.
2. Create a **new public repository** named `udayallu.com` (any name works).
3. Push this folder to it:

```bash
cd ~/Documents/uday/udaydomain
git init -b main
git add .
git commit -m "Initial site"
git remote add origin https://github.com/YOUR-USERNAME/udayallu.com.git
git push -u origin main
```

4. In the repo, open **Settings → Pages**:
   - **Source:** Deploy from a branch
   - **Branch:** `main` / `/ (root)` → **Save**
   - **Custom domain:** `udayallu.com` → **Save**

## Step 2: Point the GoDaddy domain at GitHub

In GoDaddy, go to **My Products → udayallu.com → DNS → Manage DNS** and make these changes:

1. **Delete** the existing `A` record for `@` (it usually says "Parked"). Also turn off any **Domain Forwarding** for this domain.
2. **Add four `A` records**, each with Name `@`:

| Type | Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

3. **Edit the `CNAME` record for `www`** (create it if it's missing):

| Type | Name | Value |
|---|---|---|
| CNAME | www | YOUR-USERNAME.github.io |

DNS changes usually take effect within 10 to 60 minutes, and occasionally take up to 24 hours.

## Step 3: Turn on HTTPS

Go back to **Settings → Pages** on GitHub. Once the DNS check shows a green tick, tick **Enforce HTTPS**. GitHub issues a free SSL certificate for you, which can take a few minutes. After that, both `https://udayallu.com` and `https://www.udayallu.com` work.

(Optional, recommended) Verify the domain under your GitHub account **Settings → Pages → Add a domain**. This stops anyone else from claiming it on GitHub.

## Updating the site later

Edit the files, then run:

```bash
git add . && git commit -m "Update content" && git push
```

The live site updates in about a minute.

---

## Contact email

The contact section currently shows `hello@udayallu.com`. That address won't receive mail until you set it up. You have two options:

- **Simplest:** change it in `index.html` to an email you already use.
- **Free @udayallu.com address:** use [ImprovMX](https://improvmx.com) (free plan). It forwards `hello@udayallu.com` to your Gmail. You add the two MX records it gives you in GoDaddy DNS, and these don't affect the website records above.

## Preview locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

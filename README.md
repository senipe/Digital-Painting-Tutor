# Digital Painting Tutor

Static site for digital painting tutoring.

## Adding images

Drop image files (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`) into one of these folders:

| Folder | Used on the site |
|--------|------------------|
| `images/hero/` | Fading slideshow at the top of the home page |
| `images/my-work/` | "My Work" grid on the home page and portfolio gallery on About |

Then regenerate the manifest so the site picks them up:

```bash
node scripts/generate-manifest.js
```

Or on Windows without Node:

```powershell
.\scripts\generate-manifest.ps1
```

Or run `npm run update-images` (requires Node).

If you deploy via GitHub Pages, pushing new images to `images/` will auto-update `images-manifest.json` via GitHub Actions.

**Note:** If you have artwork in an old `My Work/` folder, move those files into `images/my-work/` and `images/hero/` as needed, then run the command above.

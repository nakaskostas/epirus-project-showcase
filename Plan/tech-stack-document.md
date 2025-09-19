# Tech Stack για Web App Παρουσίασης Έργων Περιφέρειας Ηπείρου

## Περίληψη Έργου
Δημιουργία αυτοματοποιημένου συστήματος όπου ένας LLM agent (Google Gemini) θα διαβάζει αρχεία έργων, θα τα οργανώνει και θα δημιουργεί αυτόματα static websites για την παρουσίασή τους, χωρίς χειροκίνητη συγγραφή κώδικα.

## Προτεινόμενο Tech Stack

### 1. Core Development Environment
- **VS Code** με **Google Gemini Integration**
- **Node.js v18+** & **npm/yarn** - Απαραίτητο για build tools και automation
- **Git** - Για version control και integration με GitHub
- **Python 3.9+** (optional) - Για επιπλέον scripting capabilities

### 2. Static Site Generator & Framework

#### Κύρια Πρόταση: **Astro**
**Πλεονεκτήματα:**
- Ιδανικό για static sites με έμφαση σε multimedia content
- Εξαιρετική υποστήριξη για image optimization
- Built-in lazy loading για performance
- Partial hydration για βέλτιστη απόδοση
- Island architecture για interactive components
- Υποστήριξη για multiple frameworks (React, Vue, Svelte)

**Εναλλακτικές Επιλογές:**
- **Next.js** (static export mode) - Για πιο complex applications
- **11ty** - Απλό και flexible
- **Vite + Vue/React** - Για custom solutions

### 3. File Processing & Automation

**Απαραίτητα NPM Packages:**

```json
{
  "dependencies": {
    "sharp": "^0.33.0",           // Επεξεργασία και optimization εικόνων
    "fluent-ffmpeg": "^2.1.2",    // Video processing και conversion
    "pdf-parse": "^1.1.1",        // Ανάγνωση PDF αρχείων
    "xlsx": "^0.18.5",            // Επεξεργασία Excel files
    "mammoth": "^1.6.0",          // Μετατροπή Word documents σε HTML
    "glob": "^10.3.0",            // File system pattern matching
    "fs-extra": "^11.1.1",        // Enhanced file operations
    "archiver": "^6.0.1",         // Διαχείριση compressed files
    "node-stream-zip": "^1.15.0", // Ανάγνωση ZIP files
    "chokidar": "^3.5.3"          // File system watching
  }
}
```

### 4. UI/Styling Framework

#### Κύρια Στοίχεια:
- **Tailwind CSS v3** - Utility-first CSS framework, ιδανικό για LLM-generated code
- **Shadcn/ui** - Modern component library με copy-paste components
- **DaisyUI** - Semantic component classes για Tailwind

#### Multimedia Components:
- **Swiper.js v11** - Modern touch slider για image galleries
- **PhotoSwipe v5** - Lightbox gallery για full-screen viewing
- **Video.js v8** - HTML5 video player με πλήρη customization
- **Plyr** - Εναλλακτικός lightweight video player
- **PDF.js** - Για inline PDF viewing

### 5. Build & Deployment

#### Hosting Platforms:
- **Cloudflare Pages** 
  - Unlimited bandwidth
  - Global CDN
  - Automatic builds από GitHub
  - Free SSL certificates

- **Vercel**
  - Zero-config deployment
  - Automatic preview deployments
  - Analytics integration

- **GitHub Pages**
  - Δωρεάν για public repositories
  - Direct integration με GitHub Actions

#### CI/CD:
- **GitHub Actions** για automated workflows
- **Husky** για pre-commit hooks
- **Prettier** & **ESLint** για code formatting

### 6. Project Structure Template

```
project-template/
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions workflow
├── scripts/
│   ├── scan-project.js          # Σκανάρισμα αρχικού folder
│   ├── organize-files.js        # ΒΗΜΑ 1: Οργάνωση αρχείων
│   ├── process-media.js         # Media optimization
│   ├── extract-content.js       # Εξαγωγή περιεχομένου από documents
│   └── generate-site.js         # ΒΗΜΑ 2: Δημιουργία site
├── src/
│   ├── components/
│   │   ├── Gallery.astro        # Component για εικόνες
│   │   ├── VideoPlayer.astro    # Component για videos
│   │   ├── DocumentViewer.astro # Component για documents
│   │   ├── Navigation.astro     # Anchor-based navigation
│   │   └── ProjectCard.astro    # Card για κάθε έργο
│   ├── layouts/
│   │   └── ProjectLayout.astro  # Main layout template
│   ├── pages/
│   │   └── index.astro          # Single page application
│   └── styles/
│       └── global.css           # Global styles με Tailwind
├── public/
│   └── assets/                 # Organized media files
│       ├── images/
│       │   ├── optimized/
│       │   └── thumbnails/
│       ├── videos/
│       ├── documents/
│       └── downloads/
├── config/
│   ├── site-config.json        # Ρυθμίσεις per project
│   └── media-presets.json      # Media optimization presets
├── templates/
│   └── component-templates/     # Templates για τον LLM agent
├── astro.config.mjs
├── tailwind.config.js
├── package.json
└── README.md
```

### 7. Automation Scripts για τον Agent

**Package.json Scripts Configuration:**

```json
{
  "name": "epirus-projects-presenter",
  "version": "1.0.0",
  "scripts": {
    "scan": "node scripts/scan-project.js",
    "organize": "node scripts/organize-files.js",
    "process:images": "node scripts/process-images.js",
    "process:videos": "node scripts/process-videos.js",
    "extract:content": "node scripts/extract-content.js",
    "generate": "node scripts/generate-site.js",
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "deploy": "npm run organize && npm run generate && npm run build",
    "deploy:cloudflare": "npm run deploy && wrangler pages publish dist",
    "clean": "rimraf dist .astro public/assets/*"
  }
}
```

### 8. CLI Tools για τον Agent

**Απαραίτητα Packages:**

- **Commander.js v11** - CLI framework για command-line interfaces
- **Inquirer.js v9** - Interactive command line prompts
- **Ora v7** - Elegant terminal spinners
- **Chalk v5** - Terminal string styling
- **Boxen v7** - Create boxes in terminal
- **CLI-Progress v3** - Progress bars για long operations

**Παράδειγμα CLI Structure:**

```javascript
project-cli
  init [source]      // Initialize νέο project
  scan [directory]   // Scan και analyze files
  organize           // Organize files (ΒΗΜΑ 1)
  generate           // Generate website (ΒΗΜΑ 2)
  build              // Build static site
  deploy [platform]  // Deploy to platform
  clean              // Clean generated files
```

### 9. Media Optimization Pipeline

#### Image Processing:
- **Input Formats**: JPEG, PNG, WebP, AVIF, SVG, TIFF, RAW
- **Output**: Optimized WebP/AVIF με fallback σε JPEG
- **Sizes**: Responsive images (mobile, tablet, desktop)
- **Lazy Loading**: Native lazy loading + progressive enhancement

#### Video Processing:
- **Input Formats**: MP4, AVI, MOV, MKV, WMV
- **Output**: H.264/H.265 MP4 + WebM για compatibility
- **Streaming**: HLS/DASH για large videos
- **Thumbnails**: Auto-generated video posters

#### Document Processing:
- **PDF**: Conversion σε images ή text extraction
- **Word/Excel**: HTML conversion με styling preservation
- **CAD Files**: Thumbnail generation + download links

### 10. Template Engine & Content Generation

- **Handlebars.js** - Logic-less templating
- **EJS** - Embedded JavaScript templates
- **Liquid** - Safe, customer-facing template language

### 11. Performance Optimization

- **Partytown** - Offload third-party scripts σε web worker
- **Workbox** - Service worker για offline functionality
- **Bundle Analyzer** - Webpack bundle analyzer
- **Lighthouse CI** - Automated performance testing

## Προτεινόμενη Ροή Εργασίας (Workflow)

### Φάση 1: Input & Analysis
1. **Source Detection**: Εντοπισμός πηγής αρχείων (GitHub, local, compressed)
2. **File Scanning**: Ανάλυση δομής και τύπων αρχείων
3. **Content Analysis**: Εξαγωγή metadata και categorization

### Φάση 2: Processing & Organization
1. **Media Optimization**: 
   - Resize και compress images
   - Convert videos σε web formats
   - Generate thumbnails
2. **Content Extraction**:
   - Parse text από documents
   - Extract data από spreadsheets
   - Generate summaries
3. **File Organization**: Δημιουργία νέας δομής folders

### Φάση 3: Site Generation
1. **Template Selection**: Επιλογή κατάλληλου template βάσει content
2. **Component Generation**: Δημιουργία Astro components
3. **Content Injection**: Εισαγωγή processed content
4. **Style Application**: Εφαρμογή Tailwind classes

### Φάση 4: Build & Deploy
1. **Static Build**: Compile σε HTML/CSS/JS
2. **Optimization**: Minification, bundling, tree-shaking
3. **Deployment**: Auto-deploy σε selected platform
4. **Verification**: Lighthouse tests και validation

## Συγκεκριμένες Συστάσεις για LLM Agent Integration

### 1. Structured Data Approach
```json
{
  "project": {
    "title": "Έργο Περιφέρειας",
    "description": "...",
    "media": {
      "images": [],
      "videos": [],
      "documents": []
    },
    "metadata": {
      "date": "2024-01",
      "category": "infrastructure",
      "status": "completed"
    }
  }
}
```

### 2. Component Templates για τον Agent
- Predefined Astro components με placeholders
- JSON schemas για data structure
- CSS utility classes predefined sets

### 3. Validation & Quality Control
- **HTML Validator**: W3C validation
- **Accessibility**: axe-core για WCAG compliance
- **SEO**: Schema.org structured data
- **Performance**: Core Web Vitals monitoring

### 4. Error Handling & Logging
- Comprehensive error catching
- Detailed logging για debugging
- Fallback mechanisms για missing content

## Security Considerations

1. **Input Sanitization**: Καθαρισμός όλων των user inputs
2. **File Type Validation**: Whitelist επιτρεπτών file types
3. **Size Limitations**: Limits σε file sizes
4. **CORS Configuration**: Proper CORS headers
5. **Environment Variables**: Secure API keys storage

## Deployment Checklist

- [ ] File organization completed
- [ ] Media files optimized
- [ ] Content extracted και formatted
- [ ] Site generated successfully
- [ ] Build process completed
- [ ] Performance tests passed
- [ ] Accessibility checks passed
- [ ] Deployment configuration verified
- [ ] DNS/Domain configuration (if applicable)
- [ ] SSL certificate active

## Estimated Timeline

- **Initial Setup**: 2-3 ώρες
- **Template Development**: 1-2 ημέρες
- **Agent Training/Prompting**: 2-3 ημέρες
- **Testing & Refinement**: 1-2 ημέρες
- **Per Project Processing**: 10-30 λεπτά (automated)

## Συμπέρασμα

Αυτό το tech stack παρέχει:
- ✅ Πλήρη automation capabilities
- ✅ Modern, responsive design
- ✅ Optimal performance
- ✅ Scalability για πολλαπλά έργα
- ✅ Minimal manual intervention
- ✅ Cost-effective deployment

Το σύστημα είναι σχεδιασμένο ώστε ο Gemini agent να μπορεί να το χειριστεί πλήρως μέσω CLI commands και automated scripts, επιτυγχάνοντας τον στόχο της μηδενικής χειροκίνητης συγγραφής κώδικα.
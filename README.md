# 🎬 ClickForge - AI YouTube Thumbnail Generator

Generate viral-optimized YouTube thumbnails with AI. Create 3 variations with different text hooks and styles, get CTR scores, and download instantly.

## 🚀 Features

- ✅ **Image Upload** - Drag & drop or click to upload base images
- ✅ **AI Text Hooks** - Generate 5 viral text suggestions with OpenAI
- ✅ **3 Variations** - Auto-generate 3 thumbnail versions
- ✅ **Viral Styles** - Bold Red, Neon Gradient, Shadow Dark, Bright Yellow
- ✅ **CTR Scoring** - Get engagement likelihood scores for each variation
- ✅ **Mobile Responsive** - Works seamlessly on all devices
- ✅ **Power Words Detection** - Analyzes emotional triggers and viral potential

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Image Processing**: Cloudinary
- **AI**: OpenAI GPT-3.5-turbo
- **Database**: Supabase (optional)
- **State**: React Hooks

## 📋 Prerequisites

Before you start, you'll need:

1. **Node.js 18+** - [Download](https://nodejs.org)
2. **Cloudinary Account** - [Sign up free](https://cloudinary.com)
3. **OpenAI API Key** - [Get key](https://platform.openai.com/api-keys)
4. **Supabase Account** (optional) - [Sign up](https://supabase.com)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ajaiacharyaa-dot/clickforge.git
cd clickforge
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create `.env.local` in the root directory:

```env
# Supabase (Optional)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cloudinary (Required)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OpenAI (Required)
OPENAI_API_KEY=sk-your_openai_key
```

### 4. Configure Cloudinary

1. Go to your [Cloudinary Dashboard](https://cloudinary.com/console)
2. Settings → Upload
3. Create unsigned upload preset: `clickforge_thumbnails`
4. Enable auto folder `/clickforge/`
5. Copy your Cloud Name

### 5. Get OpenAI API Key

1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create new secret key
3. Copy and paste into `.env.local`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
clickforge/
├── src/
│   ├── app/
│   │   ├── api/                 # API routes
│   │   │   ├── upload/          # Image upload
│   │   │   ├── generate-hooks/  # Text generation
│   │   │   ├── generate-thumbnail/  # Thumbnail creation
│   │   │   └── calculate-ctr/   # Scoring
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   └── globals.css          # Global styles
│   ├── components/              # React components
│   │   ├── Dashboard.tsx        # Main UI (3-step wizard)
│   │   ├── ImageUpload.tsx      # Upload component
│   │   ├── TitleInput.tsx       # Title input
│   │   ├── HookSuggestions.tsx  # Hook selection
│   │   ├── ThumbnailPreview.tsx # Thumbnail display
│   │   └── CTRScore.tsx         # Score display
│   ├── lib/                     # Utilities
│   │   ├── supabase.ts          # Supabase client
│   │   ├── cloudinary.ts        # Cloudinary integration
│   │   ├── ai.ts                # OpenAI integration
│   │   └── hooks.ts             # Helper data
│   └── types/                   # TypeScript types
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── .env.example
```

## 🎯 How to Use

### Step 1: Upload & Configure
1. Upload a base image (JPG, PNG)
2. Enter your video title
3. Click "Generate Text Hooks"

### Step 2: Select Hooks
1. Choose 3 text hooks from AI suggestions
2. Click "Generate Thumbnails"

### Step 3: Preview & Score
1. View 3 generated variations
2. See CTR scores for each
3. Choose your favorite

## 📊 CTR Scoring Algorithm

Score is calculated based on:

- **Text Impact (50%)** - Power words + emotional triggers
- **Style Impact (20%)** - Color contrast and visibility
- **Contrast (15%)** - Visual distinctiveness
- **Emotional Trigger (15%)** - Urgency, curiosity, exclusivity

### Power Words
`EXPOSED`, `INSANE`, `FINALLY`, `GONE WRONG`, `UNBELIEVABLE`

### Emotional Triggers
`SHOCKED`, `ANGRY`, `LOVE`, `HATE`, `FEAR`

## 🎨 Viral Styles

| Style | Color | Best For |
|-------|-------|----------|
| **Bold Red** | Red text + white stroke | High contrast |
| **Neon Gradient** | Yellow text + cyan stroke | Eye-catching |
| **Shadow Dark** | White text + black stroke | Readable |
| **Bright Yellow** | Yellow text + black stroke | Visibility |

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

1. Connect GitHub repo
2. Add environment variables
3. Deploy with 1 click

### Deploy to Railway

```bash
npm install -g railway
railway link
railway deploy
```

### Deploy to Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## 🔑 API Endpoints

### `POST /api/upload`
Upload image to Cloudinary
```json
Request: FormData { file }
Response: { success: true, data: { imageUrl } }
```

### `POST /api/generate-hooks`
Generate text hooks with OpenAI
```json
Request: { videoTitle: "string" }
Response: { success: true, data: { hooks: string[] } }
```

### `POST /api/generate-thumbnail`
Create 3 variations
```json
Request: { 
  imageUrl, 
  hooks: string[],
  styles: string[]
}
Response: { 
  success: true, 
  data: { variations: Variation[] }
}
```

### `POST /api/calculate-ctr`
Calculate CTR score
```json
Request: { text: string, style: string }
Response: { 
  success: true, 
  data: { 
    ctrScore: number, 
    factors: {...}
  }
}
```

## 🐛 Troubleshooting

### "Failed to upload image"
- Check Cloudinary upload preset exists
- Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is correct
- Check file size (max 10MB)

### "Failed to generate hooks"
- Verify OpenAI API key is valid
- Check account has credits
- Test with shorter title

### "Image transform failed"
- Ensure image URL is accessible
- Check Cloudinary security settings
- Verify fetch URL transformation is enabled

### Localhost not working
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
npm install

# Run dev server
npm run dev
```

## 📈 Future Features

- [ ] User authentication & accounts
- [ ] Save thumbnails to database
- [ ] Download as ZIP
- [ ] Batch processing (10+ at once)
- [ ] Advanced editor (text position, size, rotation)
- [ ] Template library
- [ ] Analytics dashboard
- [ ] Pro tier with more variations
- [ ] A/B testing recommendations
- [ ] Team collaboration

## 📄 License

MIT - Free to use and modify

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repo
2. Create feature branch (`git checkout -b feature/awesome`)
3. Commit changes (`git commit -m 'Add awesome feature'`)
4. Push to branch (`git push origin feature/awesome`)
5. Open Pull Request

## 💬 Support

- 📧 Email: support@clickforge.dev
- 🐦 Twitter: [@clickforge](https://twitter.com/clickforge)
- 💬 Discord: [Join community](https://discord.gg/clickforge)

---

**Made with ❤️ by** [ajaiacharyaa-dot](https://github.com/ajaiacharyaa-dot)

**Live Demo**: [clickforge.vercel.app](https://clickforge.vercel.app) (coming soon)

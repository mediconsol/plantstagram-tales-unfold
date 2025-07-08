
# 🌱 Plantgram Tales Unfold

A beautiful social media platform for plant lovers to share their daily plant stories and connect with fellow plant enthusiasts.

![Plant Social Media](https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop&crop=center)

## ✨ Features

### 🔐 **Authentication System**
- User registration and login
- GitHub OAuth integration
- Secure user profile management
- Row Level Security (RLS) with Supabase

### 📝 **Post Creation**
- Image upload with automatic compression
- Rich text descriptions with hashtag support
- Visual plant type selection with 12+ categories
- Location tagging
- Real-time form validation

### 📱 **Dynamic Feed**
- Real-time post updates
- Infinite scroll pagination
- Like and comment interactions
- Responsive grid layout

### 💬 **Social Features**
- Real-time commenting system
- Like/unlike functionality
- Share posts to social media platforms
- User profiles with avatars

### 🖼️ **Gallery Page**
- Advanced search and filtering
- Sort by newest, oldest, or popularity
- Grid and list view modes
- Plant type filtering

### 🌙 **Dark Mode Support**
- Light, dark, and system theme options
- Persistent theme preferences
- Nature-inspired color palette
- Smooth theme transitions

### 🔗 **Sharing Capabilities**
- Native Web Share API support
- Social media integration (Twitter, Facebook, KakaoTalk, LINE, etc.)
- Copy link functionality
- App-wide sharing

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful UI components
- **React Router** - Client-side routing
- **React Query** - Server state management

### **Backend & Database**
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **Supabase Storage** - File storage for images
- **Row Level Security** - Data security

### **Deployment**
- **Vercel** - Frontend hosting and deployment
- **GitHub Actions** - Continuous deployment
- **Custom Domain** - Professional domain setup

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mediconsol/plantstagram-tales-unfold.git
   cd plantstagram-tales-unfold
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the SQL schema from `database-schema.sql`
   - Set up storage bucket for images

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3500`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── auth/           # Authentication components
│   └── ...
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
├── types/              # TypeScript type definitions
├── data/               # Static data and constants
└── styles/             # Global styles
```

## 🌱 Plant Types Supported

- 🌵 Succulents
- 🌿 Foliage Plants
- 🌸 Flowering Plants
- 🌱 Herbs
- 🌵 Cacti
- 🌿 Ferns
- 🍎 Fruit Trees
- 🥬 Vegetables
- 🍃 Air Purifying Plants
- 🌿 Climbing Plants
- 🌳 Bonsai
- 🌺 Others

## 📱 Responsive Design

Plantgram is fully responsive and works beautifully on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop computers (1024px+)
- 🖥️ Large screens (1440px+)

## 🎨 Design System


### Color Palette
- **Primary**: Nature-inspired green tones
- **Secondary**: Earth and wood tones
- **Accent**: Warm sunset colors
- **Dark Mode**: Deep forest and moss colors

### Typography
- **Font**: Pretendard (Korean-optimized)
- **Hierarchy**: Clear heading and body text distinction
- **Accessibility**: High contrast ratios

## 🔒 Security Features

- **Row Level Security (RLS)** - Database-level security
- **Authentication** - Secure user authentication
- **Input Validation** - Client and server-side validation
- **Image Processing** - Safe image upload and processing
- **CORS Protection** - Cross-origin request security

## 🌍 Internationalization

Currently supports:
- 🇰🇷 Korean (Primary)
- 🇺🇸 English (Interface elements)

## 📈 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Image Optimization**: Automatic compression and resizing
- **Caching**: Intelligent caching with React Query
- **Bundle Size**: Optimized with Vite and tree-shaking
- **Loading States**: Smooth loading experiences

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏢 About MediConSol

Plantgram Tales Unfold is developed by **MediConSol**, a professional solution brand specializing in hospital management support.

- **Website**: [mediconsol.co.kr](https://mediconsol.co.kr)
- **Copyright**: © 2025 MediConSol. All rights reserved.

## 🙏 Acknowledgments

- **Supabase** - For the amazing backend platform
- **Vercel** - For seamless deployment
- **shadcn/ui** - For beautiful UI components
- **Tailwind CSS** - For the utility-first CSS framework
- **React Community** - For the incredible ecosystem

## 📞 Support

If you have any questions or need support:
- 📧 Email: admin@mediconsol.com
- 🌐 Website: [mediconsol.co.kr](https://mediconsol.co.kr)
- 📱 GitHub Issues: [Create an issue](https://github.com/mediconsol/plantstagram-tales-unfold/issues)

---

<div align="center">
  <p>Made with ❤️ for plant lovers 🌿</p>
  <p>© 2025 MediConSol. 무단 복제 및 재배포 금지.</p>
</div>

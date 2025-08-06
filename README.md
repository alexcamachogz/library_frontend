# 📚 Personal Library Management System

A modern, responsive web application for managing your personal book collection built with React, TypeScript, and modern UI components.

## ✨ Features

### 📖 Book Management
- **Add Books**: Add books by ISBN (automatic metadata fetching) or manual entry
- **Edit & Delete**: Full CRUD operations for your book collection  
- **Reading Status**: Track books as "To Read", "Reading", or "Completed"
- **Rich Metadata**: Store title, author(s), description, categories, page count, and cover images

### 🔍 Search & Filter
- **Smart Search**: Global search across all book fields
- **Advanced Filters**: Filter by title, author, category, and reading status
- **Alphabetical Sorting**: Sort your library A-Z or Z-A by title
- **Real-time Results**: Instant search as you type

### 📊 Statistics Dashboard
- **Reading Progress**: Visual progress tracking with percentages
- **Book Counts**: Total books, books read, currently reading, and to-read
- **Interactive Cards**: Color-coded statistics with progress indicators

### 🔐 Authentication
- **Google OAuth**: Secure authentication with Google accounts
- **Access Control**: Restricted access to authorized users only
- **Persistent Sessions**: Stay logged in across browser sessions

### 🌍 Internationalization (i18n)
- **Multi-language Support**: Complete English and Spanish translations
- **Smart Language Detection**: Automatic browser language detection
- **Seamless Switching**: Change language on-the-fly with language selector
- **200+ Translations**: Every UI element is properly translated

### 💫 User Experience
- **Responsive Design**: Beautiful UI that works on desktop, tablet, and mobile
- **Smooth Scrolling**: Auto-scroll to top when navigating pages
- **Loading States**: Elegant loading indicators and skeleton screens
- **Toast Notifications**: Real-time feedback for user actions
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components

### State Management & Data
- **TanStack Query** - Powerful data synchronization and caching
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

### Authentication & i18n
- **@react-oauth/google** - Google OAuth integration
- **react-i18next** - Internationalization framework
- **i18next-browser-languagedetector** - Automatic language detection

### UI & Icons
- **Lucide React** - Beautiful, customizable icons
- **Recharts** - Composable charting library for statistics
- **Sonner** - Modern toast notifications

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API server (not included in this repository)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd library-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Copy the Client ID to your `.env` file

### API Integration
The application expects a REST API with the following endpoints:

```
GET    /books                    # Get paginated books
POST   /books                    # Add book by ISBN
POST   /books/manual             # Add book manually
GET    /books/search             # Search books
GET    /books/status/{status}    # Get books by reading status
PUT    /books/{isbn}             # Update book
PUT    /books/{isbn}/status      # Update reading status
DELETE /books/{isbn}             # Delete book
GET    /books/statistics         # Get reading statistics
```

## 🎨 Customization

### Themes
The application uses CSS variables for theming. Customize colors in `src/index.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... other variables */
}
```

### Language Support
Add new languages by extending the i18n configuration in `src/lib/i18n.ts`:

```typescript
const resources = {
  en: { translation: { /* English translations */ } },
  es: { translation: { /* Spanish translations */ } },
  fr: { translation: { /* French translations */ } }, // Add new language
};
```

## 📱 Usage

### Adding Books
1. **By ISBN**: Click "Add Book" → "By ISBN" tab → Enter ISBN → Add
2. **Manual Entry**: Click "Add Book" → "Manual Entry" tab → Fill form → Add

### Search & Filter
1. Use the main search bar for quick searches
2. Click "Filters" for advanced search options:
   - Filter by title, author, category
   - Filter by reading status
   - Sort alphabetically (A-Z or Z-A)

### Managing Reading Status
- Click on the status badge on any book card to cycle through: "To Read" → "Reading" → "Completed"
- Or use the edit dialog for more detailed updates

### Language Switching
- Use the language selector in the top navigation
- Supports English and Spanish with automatic detection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use existing UI components from shadcn/ui
- Add translations for any new text
- Test on different screen sizes
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

If you have any questions or run into issues:

1. Check the [Issues](../../issues) section
2. Create a new issue with detailed information
3. Include browser version, OS, and steps to reproduce

## 🎯 Roadmap

- [ ] Book recommendations based on reading history
- [ ] Reading goals and progress tracking
- [ ] Book notes and reviews
- [ ] Export/import library data
- [ ] Dark mode support
- [ ] Offline reading list
- [ ] Social features (share books, reading lists)
- [ ] Mobile app with React Native

---

**Built with ❤️ using modern web technologies**
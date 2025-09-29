# 🚀 AI Prompt Library - Modern & Optimized

A modern, high-performance web application for managing and organizing AI prompts. Built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## ✨ Features

- 🔍 **Advanced Search & Filtering** - Find prompts by content, tags, categories
- 📱 **Responsive Design** - Works perfectly on all devices
- 🌙 **Dark Mode Support** - Beautiful UI in light and dark themes
- ⚡ **Real-time Operations** - Instant CRUD operations with optimistic updates
- 🔒 **Secure API** - Row Level Security with Supabase
- 🎯 **Accessibility First** - WCAG compliant with proper ARIA labels
- 📊 **Usage Analytics** - Track prompt usage with atomic counters
- 🎨 **Modern UI/UX** - Clean, minimal design with smooth animations

## 🏗️ Architecture

### **Frontend**
- **Next.js 14** - App Router with Server Components
- **TypeScript** - Strict type safety throughout
- **Tailwind CSS** - Utility-first styling with custom design system
- **Radix UI** - Accessible component primitives
- **React Hooks** - Custom hooks for state management

### **Backend**
- **Supabase** - PostgreSQL database with real-time subscriptions
- **API Routes** - RESTful API with proper error handling
- **Row Level Security** - Database-level security policies
- **Edge Functions** - Serverless functions for optimal performance

### **Performance**
- **Memoized Components** - Prevent unnecessary re-renders
- **Optimized Bundles** - Tree-shaking and code splitting
- **Lazy Loading** - Components loaded on demand
- **Caching Strategy** - Efficient data fetching and caching

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ai-prompt-library

# Install dependencies
pnpm install

# Copy environment variables
cp env.example .env.local

# Configure your environment variables
# Edit .env.local with your Supabase credentials
```

### Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Required for admin operations (delete prompts)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Database Setup

1. Create a new Supabase project
2. Run the SQL scripts in order:

```bash
# In Supabase SQL Editor, run these scripts:
scripts/001_create_prompts_table.sql
scripts/006_fix_anonymous_access.sql  
scripts/007_fix_delete_permissions.sql
scripts/009_add_increment_function.sql
```

### Development

```bash
# Start development server
pnpm dev

# Open http://localhost:3000
```

### Production Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 📁 Project Structure

```
ai-prompt-library/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── prompts/             # Prompt CRUD operations
│   ├── globals.css              # Global styles
│   └── page.tsx                 # Home page
├── components/                   # React Components
│   ├── ui/                      # Base UI components (Radix)
│   ├── prompt-card.tsx          # Prompt display component
│   ├── prompt-gallery.tsx       # Prompt grid with filters
│   └── search-filters.tsx       # Advanced search component
├── hooks/                        # Custom React hooks
│   ├── use-prompts.ts           # Prompt state management
│   └── use-toast.ts             # Toast notifications
├── lib/                         # Utilities and configurations
│   ├── api/                     # API client functions
│   ├── types/                   # TypeScript type definitions
│   ├── utils/                   # Utility functions
│   └── supabase/               # Supabase client configuration
└── scripts/                     # Database migration scripts
```

## 🎯 Key Components

### **PromptCard**
- Memoized for performance
- Accessible menu with keyboard navigation
- Optimistic updates for better UX
- Toast notifications for user feedback

### **PromptGallery**
- Advanced filtering and sorting
- Virtualized rendering for large datasets
- Real-time search with debouncing
- Responsive grid layout

### **Custom Hooks**
- `usePrompts` - Centralized prompt state management
- `useToast` - User notification system
- Optimized with `useCallback` and `useMemo`

## 🔧 API Reference

### **Prompts**

```typescript
// Get all prompts
GET /api/prompts

// Delete a prompt
DELETE /api/prompts/[id]

// Update a prompt  
PATCH /api/prompts/[id]

// Increment usage count
POST /api/prompts/[id]/usage
```

### **Response Format**

```typescript
interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
```

## 🎨 Styling Guide

### **Design System**
- **Colors**: Semantic color tokens with dark mode support
- **Typography**: Inter font with consistent scale
- **Spacing**: 4px base unit with consistent rhythm
- **Shadows**: Layered elevation system
- **Animations**: Subtle transitions with `cubic-bezier` easing

### **Component Patterns**
- Consistent prop interfaces
- Memoization for performance
- Accessible by default
- Mobile-first responsive design

## 🧪 Testing

```bash
# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Run linting with auto-fix
pnpm lint:fix

# Format code
pnpm format
```

## 📊 Performance Optimizations

### **React Optimizations**
- Component memoization with `React.memo()`
- Callback memoization with `useCallback()`
- Value memoization with `useMemo()`
- Proper dependency arrays

### **Bundle Optimizations**
- Tree-shaking enabled
- Dynamic imports for code splitting
- Optimized image loading
- Minimal third-party dependencies

### **Database Optimizations**
- Atomic operations for counters
- Proper indexing on frequently queried columns
- Connection pooling
- Query optimization

## 🔒 Security

### **Frontend Security**
- Input validation and sanitization
- XSS protection with proper escaping
- CSRF protection with SameSite cookies
- Content Security Policy headers

### **Backend Security**
- Row Level Security (RLS) policies
- API rate limiting
- Input validation on all endpoints
- Secure environment variable handling

## 🚀 Deployment

### **Vercel (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### **Environment Variables for Production**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
- `SUPABASE_SERVICE_ROLE_KEY`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### **Code Standards**
- Follow TypeScript strict mode
- Use ESLint and Prettier configurations
- Write meaningful commit messages
- Add JSDoc comments for complex functions

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [Lucide](https://lucide.dev/) - Beautiful icons

---

**Built with ❤️ for the AI community**

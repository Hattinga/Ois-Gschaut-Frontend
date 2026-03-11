# Ois Gschaut Frontend

A modern, production-ready React frontend application built with JSX, Vite, React Router, and Tailwind CSS.

## 🚀 Features

- **React 18** - Latest React version with hooks support
- **JSX** - Clean and simple component syntax without TypeScript
- **Vite** - Lightning-fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Responsive Design** - Mobile-first approach built-in to Tailwind
- **ESLint** - Code quality with React best practices
- **Environment Variables** - Secure configuration management
- **Custom Hooks** - Reusable logic (useFetch, useForm, useLocalStorage)
- **Utility Functions** - Helper functions for common tasks

## 📁 Project Structure

```
src/
├── assets/          # Images, fonts, and static files
├── components/      # Reusable React components
│   ├── Layout.jsx
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── Button.jsx
│   └── index.js     # Barrel export
├── pages/           # Page components
│   ├── Home.jsx
│   └── NotFound.jsx
├── styles/          # CSS files with Tailwind directives
│   ├── index.css    # Tailwind imports and component layer
│   ├── app.css      # App-specific styles
│   └── layout.css   # Layout-specific styles
├── hooks/           # Custom React hooks
│   └── index.js     # useFetch, useForm, useLocalStorage
├── utils/           # Utility functions
│   ├── api.js       # API call helpers
│   ├── helpers.js   # General helpers
│   └── index.js     # Barrel export
├── constants.js     # Application constants
├── App.jsx          # Main App component
└── main.jsx         # React entry point

public/
├── index.html       # HTML template
└── vite.svg         # Vite logo

Configuration Files:
├── vite.config.js           # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── eslint.config.js          # ESLint configuration
├── package.json              # Dependencies and scripts
├── .env                      # Local environment variables
├── .env.example              # Environment variables template
└── .gitignore                # Git ignore rules
```

## 🛠️ Installation

### Prerequisites

- Node.js 16+ and npm or yarn

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Ois-Gschaut-Frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## 📦 Scripts

```bash
# Development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
```

## 🌍 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=Ois Gschaut Frontend
VITE_ENVIRONMENT=development
```

## 🎨 Styling

This project uses **Tailwind CSS**, a utility-first CSS framework that helps you build modern designs without leaving your HTML.

- **Utility Classes** - Use pre-built classes like `flex`, `p-4`, `text-center`, etc.
- **Responsive Design** - Built-in responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`)
- **Component Layer** - Custom reusable component classes defined in `index.css`
- **Dark Mode** - Easy dark mode support with Tailwind
- **Customization** - Configure colors and spacing in `tailwind.config.js`

### Common Tailwind Utilities

```jsx
// Flexbox
<div className="flex gap-4 items-center justify-between">

// Responsive
<div className="p-4 md:p-8 lg:p-12">

// Colors
<button className="bg-indigo-600 text-white hover:bg-indigo-700">

// Space and sizing
<div className="w-full h-96 mb-4">

// Typography
<h1 className="text-4xl font-bold text-gray-900">
```

### Custom Component Classes

Defined in `src/styles/index.css`:

- `.btn` - Base button styles
- `.btn-primary` - Primary button variant
- `.btn-secondary` - Secondary button variant
- `.btn-danger` - Danger button variant

## 🪝 Custom Hooks

### useFetch

Fetch data from an API endpoint:

```tsx
const { data, loading, error } = useFetch<User[]>('/api/users')
```

### useForm

Manage form state with automatic change handlers:

```tsx
const { values, handleChange, reset } = useForm({
  name: '',
  email: '',
})
```

### useLocalStorage

Persist state to browser localStorage:

```tsx
const [theme, setTheme] = useLocalStorage('theme', 'light')
```

## 🔧 API Utilities

Use the built-in API utility functions:

```tsx
import { apiGet, apiPost, apiPut, apiDelete } from '@/utils'

// GET request
const users = await apiGet<User[]>('/users')

// POST request
const newUser = await apiPost<User>('/users', { name: 'John' })

// PUT request
const updated = await apiPut<User>('/users/1', { name: 'Jane' })

// DELETE request
await apiDelete('/users/1')
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production build.

### Deploy to Services

- **Vercel**: Push to GitHub, auto-deploy
- **Netlify**: Connect GitHub repository
- **AWS S3 + CloudFront**: Upload dist folder
- **Docker**: Create Dockerfile for containerization

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com)

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Jonas Hattinger / CodeIn4K

---

**Happy coding!** 🎉

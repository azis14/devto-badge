# Dev.to Badge

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)](https://nodejs.org/en)
[![Dev.to](https://img.shields.io/badge/Dev.to-0A0A0A?logo=devdotto&logoColor=white)](https://dev.to/)
[![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?logo=vercel&logoColor=white)](https://vercel.com)

Generate beautiful SVG badges for your Dev.to articles that can be embedded anywhere! Display your article's title, description, cover image, author info, reactions, and reading time in a customizable card format.

## ✨ Features

- 🎨 **Beautiful Design**: Clean, modern card design inspired by Tailwind CSS
- 🌓 **Theme Support**: Light and dark mode themes
- 📱 **Responsive**: Fixed 450x290px size perfect for README files
- 🖼️ **Cover Images**: Automatically includes article cover images
- 👤 **Author Info**: Shows author name and profile picture
- 📊 **Stats Display**: Reactions count and reading time
- 🏷️ **Tags**: Displays up to 3 article tags
- ⚡ **Fast**: Serverless function with 1-hour caching
- 🔒 **Secure**: Sanitizes all text content for safe SVG rendering

## 📖 Usage

Once deployed, you can generate badges using these methods:

### Method 1: Using Username and Slug

```markdown
![Dev.to Article](https://your-app.vercel.app/api?username=YOUR_USERNAME&slug=YOUR_ARTICLE_SLUG)
```

### Method 2: Using Full Article URL

```markdown
![Dev.to Article](https://your-app.vercel.app/api?url=https://dev.to/YOUR_USERNAME/YOUR_ARTICLE_SLUG)
```

### With Theme Support

Add `&theme=dark` for dark mode:

```markdown
![Dev.to Article](https://your-app.vercel.app/api?username=YOUR_USERNAME&slug=YOUR_ARTICLE_SLUG&theme=dark)
```

## 🎯 Examples

### Light Theme (Default)
```markdown
![Dev.to Article](https://your-app.vercel.app/api?username=ben&slug=what-s-new-in-devto-4f7j)
```

### Dark Theme
```markdown
![Dev.to Article](https://your-app.vercel.app/api?username=ben&slug=what-s-new-in-devto-4f7j&theme=dark)
```

## 🛠️ API Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `username` | string | Yes* | Dev.to username | `muhammadazis` |
| `slug` | string | Yes* | Article slug | `a-journey-to-be-a-pragmatic-programmer-524m` |
| `url` | string | Yes* | Full Dev.to article URL | `https://dev.to/muhammadazis/a-journey-to-be-a-pragmatic-programmer-524m` |
| `theme` | string | No | Theme mode (`light` or `dark`) | `dark` |

*Either provide `username` + `slug` OR `url`

## 🏗️ Local Development

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/devto-badge.git
cd devto-badge
```

2. Install dependencies:
```bash
npm install
```

3. Run locally with Vercel CLI:
```bash
npm install -g vercel
vercel dev
```

The API will be available at `http://localhost:3000/api`

## 📁 Project Structure

```
devto-badge/
├── api/
│   └── index.js      # Main serverless function
├── package.json      # Project dependencies
├── .gitignore       # Git ignore file
└── README.md        # This file
```

## 🎨 Customization

The badge design uses Tailwind-inspired color schemes:

### Light Theme Colors
- Background: `#ffffff`
- Border: `#e5e7eb`
- Title: `#111827`
- Description: `#4b5563`
- Author: `#374151`
- Stats: `#6b7280`
- Tags: `#4f46e5`

### Dark Theme Colors
- Background: `#1f2937`
- Border: `#374151`
- Title: `#f9fafb`
- Description: `#9ca3af`
- Author: `#d1d5db`
- Stats: `#9ca3af`
- Tags: `#818cf8`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Dev.to API](https://developers.forem.com/api) for providing article data
- [Vercel](https://vercel.com) for serverless hosting
- [Tailwind CSS](https://tailwindcss.com) for design inspiration

## 🐛 Known Issues

- Large cover images may take longer to load
- Some special characters in titles/descriptions may need additional escaping

## 📮 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/azis14/devto-badge/issues) on GitHub.

---

Made with ❤️ by the open-source community

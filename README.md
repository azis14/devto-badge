# Dev.to Badge

[![Sponsor](https://img.shields.io/badge/Sponsor-❤-ea4aaa?logo=github-sponsors)](https://github.com/sponsors/azis14)
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
- 🎛️ **Customizable Display**: Hide specific components as needed
- ⚡ **Fast**: Serverless function with 1-hour caching
- 🔒 **Secure**: Sanitizes all text content for safe SVG rendering

## 📖 Usage

The project is hosted on [Vercel](https://vercel.com). You can generate badges using these methods:

### Method 1: Using Username and Slug

```markdown
![Dev.to Article](https://devto-badge.vercel.app/api?username=YOUR_DEVTO_USERNAME&slug=YOUR_ARTICLE_SLUG)
```

### Method 2: Using Full Article URL

```markdown
![Dev.to Article](https://devto-badge.vercel.app/api?url=https://dev.to/YOUR_DEVTO_USERNAME/YOUR_ARTICLE_SLUG)
```

### With Theme Support

Add `&theme=dark` for dark mode:

```markdown
![Dev.to Article](https://devto-badge.vercel.app/api?username=YOUR_DEVTO_USERNAME&slug=YOUR_ARTICLE_SLUG&theme=dark)
```

### Hiding Components

Hide specific components using the `hide` parameter:

```markdown
![Dev.to Article](https://devto-badge.vercel.app/api?username=YOUR_DEVTO_USERNAME&slug=YOUR_ARTICLE_SLUG&hide=reactions,tags)
```

Available components to hide:
- `reactions` - Hide the reactions count
- `tags` - Hide the article tags
- `minreads` - Hide the reading time
- `image` - Hide the cover image

## 🎯 Examples

### Light Theme (Default)
```markdown
![Example 1](https://devto-badge.vercel.app/api?url=https://dev.to/muhammadazis/the-better-approach-to-learn-new-things-a92)
```
![Example 1](https://devto-badge.vercel.app/api?url=https://dev.to/muhammadazis/the-better-approach-to-learn-new-things-a92)

### Dark Theme
```markdown
![Example 2](https://devto-badge.vercel.app/api?username=muhammadazis&slug=3-main-aspects-to-boost-life-career-35h4&theme=dark)
```
![Example 2](https://devto-badge.vercel.app/api?username=muhammadazis&slug=3-main-aspects-to-boost-life-career-35h4&theme=dark)

## 🛠️ API Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `username` | string | Yes* | Dev.to username | `muhammadazis` |
| `slug` | string | Yes* | Article slug | `a-journey-to-be-a-pragmatic-programmer-524m` |
| `url` | string | Yes* | Full Dev.to article URL | `https://dev.to/muhammadazis/a-journey-to-be-a-pragmatic-programmer-524m` |
| `theme` | string | No | Theme mode (`light` or `dark`) | `dark` |
| `hide` | string | No | Comma-separated list of components to hide | `reactions,tags,minreads,image` |

*Either provide `username` + `slug` OR `url`

### Hide Parameter Options

The `hide` parameter accepts a comma-separated list of the following values:
- `reactions` - Hides the reactions count
- `tags` - Hides the article tags
- `minreads` - Hides the reading time
- `image` - Hides the cover image

**Note**: The title and description are mandatory and cannot be hidden.

## 🏗️ Local Development

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/azis14/devto-badge.git
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

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-E5E5E5?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://clicky.id/azis14/support/coffee)
[![More About Me](https://img.shields.io/badge/More%20About%20Me-E5E5E5?style=for-the-badge&logo=about.me&logoColor=black)](https://www.azis14.my.id/)

If you encounter any issues or have questions, please [open an issue](https://github.com/azis14/devto-badge/issues) on GitHub.

If you like this repo or think it useful, please leave a ⭐️ on it.

---

Made with ❤️ by the open-source community
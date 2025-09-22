# Factastic
Dynamic Quiz platform powered by Open Trivia DB.

A modern quiz application built with React, Vite, Tailwind CSS, Axios, and ChadCN UI components. This project supports both Deno and Node.js for flexible development and deployment.

## Features

- 🎯 Dynamic quiz generation using Open Trivia Database API
- 🎨 Modern UI with Tailwind CSS and ChadCN UI components
- ⚡ Fast development with Vite
- 📱 Responsive design
- 🏆 Score tracking and progress indication
- 🎮 Multiple question types and difficulty levels
- 🌐 Static site deployment on GitHub Pages

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: ChadCN UI (Radix primitives)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Runtime**: Deno/Node.js compatible
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites
- Deno 1.x+ or Node.js 18+

### With Deno (Recommended)
```bash
# Install Deno if not already installed
curl -fsSL https://deno.land/install.sh | sh

# Clone and run
git clone https://github.com/RickBarretto/Factastic.git
cd Factastic

# Development
deno task dev

# Build for production
deno task build

# Preview production build
deno task preview
```

### With Node.js
```bash
# Clone and run
git clone https://github.com/RickBarretto/Factastic.git
cd Factastic

# Install dependencies
npm install

# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This project is configured for automatic deployment to GitHub Pages via GitHub Actions. The deployment workflow:

1. Triggers on push to `main` branch
2. Builds the application using Node.js
3. Deploys to GitHub Pages

The app will be available at: `https://[username].github.io/Factastic/`

## API Integration

The application integrates with the [Open Trivia Database](https://opentdb.com/) API to fetch quiz questions. Features include:

- Customizable number of questions (1-50)
- Multiple difficulty levels (Easy, Medium, Hard)
- Various question types (Multiple Choice, True/False)
- Different categories support

## Project Structure

```
src/
├── components/
│   ├── ui/           # ChadCN UI components
│   └── QuizApp.tsx   # Main quiz application
├── lib/
│   ├── api.ts        # API integration with Axios
│   └── utils.ts      # Utility functions
├── types/
│   └── quiz.ts       # TypeScript type definitions
├── App.tsx           # Root component
├── main.tsx          # Application entry point
└── index.css         # Global styles with Tailwind
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the BSD 3-Clause License - see the [LICENSE](LICENSE) file for details.

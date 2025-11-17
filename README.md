A comprehensive online government service portal with modern UI design, accessibility features, and responsive layout.

## Features

- 🏛️ **Main Dashboard** - Categorized services with quick access and statistics
- 📋 **Service Directory** - Advanced filtering and search functionality
- 📝 **Service Application** - Step-by-step multi-form application process
- 🌐 **Multi-language Support** - English, Sinhala, and Tamil
- 📱 **Responsive Design** - Works on all devices
- ♿ **Accessible** - Built with accessibility in mind

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
├── App.tsx                      # Main application with routing
├── components/
│   ├── Header.tsx              # Navigation header
│   ├── MainDashboard.tsx       # Dashboard with service categories
│   ├── ServiceDirectory.tsx    # Service listing with filters
│   ├── ServiceApplication.tsx  # Multi-step application form
│   └── ui/                     # Reusable UI components (shadcn/ui)
├── styles/
│   └── globals.css            # Tailwind CSS configuration
└── main.tsx                    # Application entry point
```

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool
- **shadcn/ui** - UI component library
- **Lucide React** - Icons

## License

This project is for demonstration purposes.
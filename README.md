# MovieFlix - Movie Recommendation Application

A modern, responsive movie discovery application built with Next.js, TypeScript, and The Movie Database (TMDb) API.

## Features

- **Movie Discovery**: Browse trending movies (daily/weekly) and popular films
- **Detailed Movie Information**: View comprehensive details including cast, genres, ratings, and plot summaries
- **Favorites System**: Save movies to your personal favorites list with localStorage persistence
- **Responsive Design**: Optimized for mobile, tablet, and desktop viewing
- **Modern UI**: Clean interface with smooth animations and hover effects
- **Dynamic Routing**: Individual pages for each movie with detailed information
- **Error Handling**: Comprehensive error states and loading indicators

## Tech Stack

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Styling**: Styled Components
- **Icons**: Font Awesome
- **API**: The Movie Database (TMDb) API
- **State Management**: React Context API
- **HTTP Client**: Axios

## Prerequisites

Before running this application, you need:

1. **Node.js** (version 16 or higher)
2. **TMDb API Key** - Get one from [The Movie Database](https://developers.themoviedb.org/3/getting-started/introduction)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd movieflix
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your TMDb API key:

```env
NEXT_PUBLIC_TMDB_API_KEY=your_actual_tmdb_api_key_here
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx          # Home page
│   ├── movies/
│   │   └── [id]/
│   │       └── page.tsx   # Dynamic movie detail page
│   └── favorites/
│       └── page.tsx       # Favorites page
├── components/            # Reusable React components
│   ├── Layout/           # Layout components
│   ├── Movies/           # Movie-related components
│   └── UI/              # General UI components
├── contexts/             # React Context providers
├── types/               # TypeScript type definitions
├── utils/               # Utility functions and API calls
├── .env.local.example   # Environment variables template
└── README.md           # This file
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting

## API Integration

This application uses The Movie Database (TMDb) API to fetch movie data. The API provides:

- Trending movies (daily/weekly)
- Popular movies
- Movie details with cast and crew information
- High-quality movie posters and backdrop images

### API Endpoints Used

- `/trending/movie/{time_window}` - Get trending movies
- `/movie/popular` - Get popular movies
- `/movie/{movie_id}` - Get detailed movie information
- `/movie/{movie_id}/recommendations` - Get movie recommendations

## Features in Detail

### Home Page
- Displays trending movies with toggle between daily and weekly trends
- Shows popular movies section
- Responsive grid layout adapting to different screen sizes

### Movie Detail Page
- Dynamic routing with movie ID parameter
- Comprehensive movie information including runtime, genres, and cast
- Add/remove favorites functionality
- Back navigation button

### Favorites Page
- Persistent favorites using localStorage
- Remove individual movies or clear all favorites
- Empty state with helpful messaging
- Responsive card layout

### Responsive Design
- Mobile-first approach
- Breakpoints: 480px (mobile), 768px (tablet), 1024px+ (desktop)
- Flexible grid systems and scalable typography

## Deployment

### Vercel (Recommended)

1. Push your code to a Git repository
2. Import the project in [Vercel](https://vercel.com)
3. Add your `NEXT_PUBLIC_TMDB_API_KEY` environment variable in Vercel's dashboard
4. Deploy automatically

### Other Platforms

The application is configured for static export and can be deployed to any static hosting service:

```bash
npm run build
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_TMDB_API_KEY` | Your TMDb API key | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [The Movie Database (TMDb)](https://www.themoviedb.org/) for providing the movie data API
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Styled Components](https://styled-components.com/) for CSS-in-JS styling solution
- [Font Awesome](https://fontawesome.com/) for the beautiful icons

## Troubleshooting

### Common Issues

1. **API Key Error**: Make sure your `.env.local` file contains the correct TMDb API key
2. **Build Errors**: Ensure all dependencies are installed with `npm install`
3. **Images Not Loading**: Check that your API key has proper permissions

### Getting Help

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your API key is correct and active
3. Ensure you have a stable internet connection
4. Check the TMDb API status at [status.themoviedb.org](https://status.themoviedb.org/)

---

Built with ❤️ using Next.js and TypeScript
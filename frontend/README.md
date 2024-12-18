# VoteRide

VoteRide is a web application that connects voters with volunteer drivers to ensure everyone has access to polling locations. The platform facilitates free rides to polling stations, making democracy more accessible to all.

## Features

- **Dual User Roles**: Support for both drivers and riders
- **Real-time Location Tracking**: Integration with Google Maps for accurate location services
- **Secure Authentication**: User authentication and authorization system
- **Interactive Dashboard**: Dedicated dashboards for both drivers and riders
- **Ride Management**: Schedule, track, and manage rides
- **Community Features**: Driver leaderboard and community engagement tools

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Maps**: Google Maps JavaScript API
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Maps API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/voteride.git
cd voteride
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. Start the development server:
```bash
npm run dev
```

### Test Accounts

For testing purposes, you can use these credentials:

**Driver Account**:
- Email: driver@example.com
- Password: driverpass

**Rider Account**:
- Email: rider@example.com
- Password: riderpass

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/       # React Context providers
├── data/          # Mock data and services
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── services/      # API services
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google Maps Platform](https://developers.google.com/maps)
- [Lucide Icons](https://lucide.dev/)
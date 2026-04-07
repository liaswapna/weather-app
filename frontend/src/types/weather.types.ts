// Current weather data from backend API
export interface CurrentWeather {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

// Single day forecast data
export interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
}

// Complete forecast with multiple days
export interface Forecast {
  city: string;
  days: ForecastDay[];
}

// Component state management interface
export interface WeatherState {
  current: CurrentWeather | null;
  forecast: Forecast | null;
  loading: boolean;
  error: string | null;
  searchedCity: string;
}

// SearchBar component props
export interface SearchBarProps {
  onSearch: (city: string) => void;
  loading: boolean;
}

// WeatherCard component props
export interface WeatherCardProps {
  weather: CurrentWeather;
}

// ForecastCard component props
export interface ForecastCardProps {
  forecast: Forecast;
}

// ErrorDisplay component props
export interface ErrorDisplayProps {
  error: string;
  onDismiss: () => void;
}

// LoadingSpinner component props (no props needed, but good practice to define)
export interface LoadingSpinnerProps {
  message?: string;
}

// ErrorBoundary component props
export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

// ErrorBoundary state
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

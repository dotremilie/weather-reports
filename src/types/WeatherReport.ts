export default interface WeatherReport {
    id: string;
    temperature: number;
    unit: TemperatureUnit;
    city: string;
    date: string;
}

export type TemperatureUnit = 'C' | 'F' | 'K';

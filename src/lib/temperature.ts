import {TemperatureUnit} from "@/types/WeatherReport";
import {round} from "@popperjs/core/lib/utils/math";

export const celsiusToFahrenheit = (celsius: number) => {
    return celsius * 9 / 5 + 32;
}

export const celsiusToKelvin = (celsius: number) => {
    return celsius + 273.15;
}

export const fahrenheitToCelsius = (fahrenheit: number) => {
    return (fahrenheit - 32) * 5 / 9;
}

export const fahrenheitToKelvin = (fahrenheit: number) => {
    return (fahrenheit + 459.67) * 5 / 9;
}

export const kelvinToCelsius = (kelvin: number) => {
    return kelvin - 273.15;
}

export const kelvinToFahrenheit = (kelvin: number) => {
    return kelvin * 9 / 5 - 459.67;
}

export const convertTemperature = (
    temperature: number,
    from: TemperatureUnit,
    to: TemperatureUnit
) => {
    if (from === to) return round(temperature);

    const conversions: Record<TemperatureUnit, Record<TemperatureUnit, (temp: number) => number>> = {
        C: { C: (temp) => temp, F: celsiusToFahrenheit, K: celsiusToKelvin },
        F: { F: (temp) => temp, C: fahrenheitToCelsius, K: fahrenheitToKelvin },
        K: { K: (temp) => temp, C: kelvinToCelsius, F: kelvinToFahrenheit },
    };

    return round(conversions[from][to](temperature));
};

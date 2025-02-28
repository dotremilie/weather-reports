import WeatherReport from "@/types/WeatherReport";

export const postReport = async (report: Omit<WeatherReport, 'id'>) => {
    const response = await fetch('http://localhost:8000/api/reports', {
        method: 'POST',
        body: JSON.stringify(report),
        headers: {
            'Content-Type': 'application/json',
        }
    })

    if (!response.ok) {
        throw new Error('Failed to put report');
    }

    return response.json() as Promise<WeatherReport>;
}

export const putReport = async (report: WeatherReport) => {
    const response = await fetch(`http://localhost:8000/api/reports/${report.id}`, {
        method: 'PUT',
        body: JSON.stringify(report),
        headers: {
            'Content-Type': 'application/json',
        }
    })

    if (!response.ok) {
        throw new Error('Failed to put report');
    }


    return response.json();
}

export const deleteReport = async (id: string) => {
    const response = await fetch(`http://localhost:8000/api/reports/${id}`, {
        method: 'DELETE',
    })

    if (!response.ok) {
        throw new Error('Failed to delete report');
    }

    return response.json();
}

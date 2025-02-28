import React, {FC} from 'react';
import WeatherReportForm from "@/components/reports/WeatherReportForm";
import {redirect} from "next/navigation";
import WeatherReport from "@/types/WeatherReport";

interface EditReportPageProps {
    params: Promise<{ id: string }>;
}

const EditReportPage: FC<EditReportPageProps> = async ({params}) => {
    const id = (await params).id;

    if (!id) {
        redirect('/reports');
    }

    const response = await fetch(`http://localhost:8000/api/reports/${id}`);

    if (!response.ok) {
        redirect('/reports');
    }

    const report = await response.json() as WeatherReport;

    return (
        <WeatherReportForm report={report} />
    );
};

export default EditReportPage;

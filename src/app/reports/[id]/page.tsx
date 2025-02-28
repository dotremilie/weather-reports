import React, {FC} from 'react';
import {redirect} from "next/navigation";
import WeatherReport from "@/types/WeatherReport";
import WeatherReportView from "@/components/reports/WeatherReportView";

interface ReportPageProps {
    params: Promise<{ id: string }>;
}

const ReportPage: FC<ReportPageProps> = async ({params}) => {
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
        <WeatherReportView report={report} />
    );
};

export default ReportPage;

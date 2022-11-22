export type Report = {
    id: number;
    create_date: string;
    name: string;
    title: string;
    description: string;
    sql_code: string;
    reportType: 'primary' | 'child';
    parent_report_id: string;
    parameters: ReportParameter[];
};

export type ReportParameter = {
    id: string;
    report_id: string;
    param_type: string;
    param_code: string;
    param_name: string;
    combo_sql: string;
};

export type ReportList = {
    reports: Report[];
    total: number;
};

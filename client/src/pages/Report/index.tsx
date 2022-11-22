import { Layout, Pagination, Spin, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import { useQuery } from 'react-query';

import { exportReportXlsx, formReport, getReport } from '../../api/reports';
import { ReportHeader } from '../../components';

type T = {
    columns: any[];
    data: any[];
    total: number;
};

const Reports: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [authToken] = useLocalStorage('AUTH_TOKEN', undefined);
    const [parameters, setParameters] = useState<Record<string, string | number>>();

    const { data: currentReport, isLoading } = useQuery(
        ['currentReport', { authToken, reportId: id }],
        getReport
    );

    const { data: table, refetch } = useQuery<T | undefined>(
        ['formReport'],
        () => authToken && id && formReport(authToken, id, parameters, page),
        { enabled: false }
    );

    useEffect(() => {
        window.addEventListener('keydown', onEscPress);
        return () => window.removeEventListener('keydown', onEscPress);
    }, []);

    useEffect(() => {
        refetch();
    }, [parameters, page]);

    const onEscPress = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            goBack();
        }
    };

    const goBack = () => {
        navigate(-1);
    };

    const onReportForm = (parameters: Record<string, string | number>) => {
        setParameters(parameters);
    };

    const onExport = async (values: Record<string, string | number>) => {
        if (authToken && id) {
            await exportReportXlsx(authToken, id, currentReport.title, values);
        }
    };

    return (
        <Spin spinning={isLoading}>
            <Layout style={{ minHeight: '100vh' }}>
                {currentReport && id && (
                    <ReportHeader
                        currentReport={currentReport}
                        onBack={goBack}
                        onReportForm={onReportForm}
                        onExport={onExport}
                    />
                )}
                <Table
                    pagination={false}
                    columns={table?.columns}
                    dataSource={table?.data}
                    bordered
                />
                <Pagination
                    pageSize={10}
                    total={table?.total}
                    current={page}
                    onChange={(page) => setPage(page)}
                />
            </Layout>
        </Spin>
    );
};

export default Reports;

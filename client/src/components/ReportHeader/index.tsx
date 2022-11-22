import { Button, Descriptions, Form, Input, PageHeader, DatePicker, InputNumber } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Report, ReportParameter } from '../../types/global';
import AddModal from './AddModal';
import CustomSelect from './CustomSelect';
import DeleteModal from './DeleteModal';
import './index.css';

type FilterValues = Record<string, string | number>;

interface HeaderProps {
    onBack: () => void;
    onExport?: (values: Record<string, string | number>) => void;
    onReportForm: (values: FilterValues) => void;
    currentReport: { report: Report; parameters: ReportParameter[] };
}

const ReportHeader: React.FC<HeaderProps> = ({ onBack, onReportForm, onExport, currentReport }) => {
    const [form] = useForm();

    const getParameterField = (
        param_name: string,
        param_type: string,
        param_code: string,
        combo_sql?: string
    ) => {
        switch (param_type) {
            case 'text':
                return <Input placeholder={param_name} />;
            case 'date':
                return <DatePicker style={{ width: '100%' }} />;
            case 'combo':
                return (
                    combo_sql && (
                        <CustomSelect
                            onChange={(value) => form.setFieldValue(param_code, value)}
                            name={param_code}
                            comboSql={combo_sql}
                        />
                    )
                );
            case 'number':
                return <InputNumber style={{ width: '100%' }} />;
        }
    };

    const extras = [
        <AddModal reportId={`${currentReport.report.id}`} key="1" />,
        <DeleteModal
            reportId={`${currentReport.report.id}`}
            parameters={currentReport.parameters}
            key="2"
        />,
        onExport && (
            <Button key="3" onClick={() => onExport(form.getFieldsValue())} type="primary">
                Export
            </Button>
        ),
    ];

    return (
        <PageHeader onBack={onBack} title={currentReport.report.title} extra={extras}>
            <Descriptions size="small" column={1}>
                <Descriptions.Item>{currentReport.report.description}</Descriptions.Item>
            </Descriptions>
            <Form
                className="report-header-form"
                form={form}
                layout="vertical"
                onFinish={onReportForm}
            >
                {currentReport?.parameters.map(
                    ({ param_code, param_name, param_type, combo_sql }, key) => {
                        return (
                            <Form.Item
                                name={`${param_code}.${param_type}`}
                                label={param_name}
                                key={key}
                            >
                                {getParameterField(param_name, param_type, param_code, combo_sql)}
                            </Form.Item>
                        );
                    }
                )}
            </Form>
            <Button onClick={() => form.submit()} type="primary">
                Form Report
            </Button>
            <Button style={{ marginLeft: '2em' }} onClick={() => form.resetFields()}>
                Clear Parameters
            </Button>
        </PageHeader>
    );
};

export default ReportHeader;

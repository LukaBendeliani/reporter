import { Button, Form, Input, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { getPrimaryReports, postReport } from '../../api/reports';
import type { Report } from '../../types/global';

const AddModal: React.FC = () => {
    const [authToken] = useLocalStorage('AUTH_TOKEN', undefined)!;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [primaryReports, setPrimaryReports] = useState([]);
    const [isParentReportDisabled, setParentReportDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        (async () => {
            try {
                if (authToken) {
                    const reports = await getPrimaryReports(authToken);
                    setPrimaryReports(
                        reports.map((r: Report) => ({ label: r.title, value: r.id }))
                    );
                }
            } catch (error) {}
        })();
    }, []);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        form.submit();
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const onFinish = async (values: Report) => {
        try {
            if (authToken) {
                setLoading(true);
                await postReport(authToken, values);
                setLoading(false);
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const onValuesChange = ({ report_type }: { report_type: number }) => {
        report_type && setParentReportDisabled(report_type === 1);
    };

    const defaultField = { type: 'text', disabled: loading, options: undefined };

    const fields = [
        {
            ...defaultField,
            name: 'name',
            label: 'Name',
        },
        {
            ...defaultField,
            name: 'title',
            label: 'Title',
        },
        {
            ...defaultField,
            name: 'description',
            label: 'Description',
        },
        {
            ...defaultField,
            name: 'sql_code',
            label: 'SQL query',
        },
        {
            ...defaultField,
            name: 'report_type',
            label: 'Report type',
            type: 'select',
            options: [
                { label: 'Primary', value: 1 },
                { label: 'Child', value: 2 },
            ],
        },
        {
            ...defaultField,
            name: 'parent_report_id',
            label: 'Parent Report',
            type: 'select',
            options: primaryReports,
            disabled: isParentReportDisabled,
        },
    ];

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Add Report
            </Button>
            <Modal title="Add Parameter" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    onValuesChange={onValuesChange}
                    form={form}
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                >
                    {fields.map(({ name, label, type, options, disabled }, key) => {
                        return (
                            <Form.Item
                                key={key}
                                name={name}
                                label={label}
                                rules={[
                                    {
                                        required: !disabled,
                                        message: `Please ${
                                            type === 'select' ? 'select' : 'enter'
                                        } ${label}!`,
                                    },
                                ]}
                            >
                                {type === 'select' ? (
                                    <Select disabled={disabled} options={options} />
                                ) : (
                                    <Input />
                                )}
                            </Form.Item>
                        );
                    })}
                </Form>
            </Modal>
        </>
    );
};

export default AddModal;

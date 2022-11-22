import { Button, Form, Input, Modal, Select } from 'antd';
import { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { useQueryClient } from 'react-query';
import { postParam } from '../../api/reportParams';
import { ReportParameter } from '../../types/global';

const { Option } = Select;

interface AddModalProps {
    reportId: string;
}

const AddModal: React.FC<AddModalProps> = ({ reportId }) => {
    const [authToken] = useLocalStorage('AUTH_TOKEN', undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCombo, setIsCombo] = useState(false);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

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

    const onFinish = async (values: ReportParameter) => {
        try {
            if (authToken) {
                await postParam(authToken, reportId, values);
                queryClient.invalidateQueries('currentReport');
                form.resetFields();
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const onValuesChange = ({ param_type }: { param_type: string }) => {
        param_type && setIsCombo(param_type === 'combo');
    };

    const inputTypes = ['combo', 'date', 'text', 'number'];

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Add Parameter
            </Button>
            <Modal title="Add Parameter" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    form={form}
                    onFinish={onFinish}
                    onValuesChange={onValuesChange}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item name="param_type" label="Param Type" rules={[{ required: true }]}>
                        <Select>
                            {inputTypes.map((inputType, key) => (
                                <Option key={key} value={inputType}>
                                    {inputType}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="param_name" label="Param Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="param_code" label="Param Code" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item rules={[{ required: isCombo }]} name="combo_sql" label="Combo SQL">
                        <Input disabled={!isCombo} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AddModal;

import { Button, List, Modal, Spin, Typography } from 'antd';
import { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { useQueryClient } from 'react-query';
import { DeleteOutlined } from '@ant-design/icons';
import { deleteParam } from '../../api/reportParams';

interface AddModalProps {
    reportId: string;
    parameters: any;
}

const DeleteModal: React.FC<AddModalProps> = ({ reportId, parameters }) => {
    const [authToken] = useLocalStorage('AUTH_TOKEN', undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const deleteParameter = async (id: string) => {
        try {
            if (authToken) {
                setLoading(true);
                await deleteParam(authToken, id);
                queryClient.invalidateQueries('currentReport');
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Delete Parameters
            </Button>
            <Modal
                title="Delete Parameters"
                okText="Close"
                cancelText
                open={isModalOpen}
                onOk={handleCancel}
                onCancel={handleCancel}
            >
                <Spin spinning={loading}>
                    <List
                        bordered
                        dataSource={parameters}
                        renderItem={(item: any) => (
                            <List.Item>
                                <Typography.Text>{item.param_name}</Typography.Text>
                                <Button
                                    type="primary"
                                    danger
                                    onClick={() => deleteParameter(item.id)}
                                >
                                    <DeleteOutlined />
                                </Button>
                            </List.Item>
                        )}
                    />
                </Spin>
            </Modal>
        </>
    );
};

export default DeleteModal;

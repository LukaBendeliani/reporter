import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Typography } from 'antd';
import { useLocalStorage } from 'usehooks-ts';

import { useProfileGuard } from '../../hooks/usePorfileGuard';

import './index.css';
import { signIn } from '../../api/auth';

const { Text } = Typography;

const SignIn: React.FC = () => {
    useProfileGuard();

    const [errorMessage, setErrorMessage] = useState('');
    const [, setAuthToken] = useLocalStorage('AUTH_TOKEN', undefined);

    const onFinish = async (values: any) => {
        try {
            const { accessToken } = await signIn(values);
            setAuthToken(accessToken);
        } catch (e) {
            setErrorMessage(`${e}`);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        if (errorMessage) {
            const timeout = setTimeout(() => setErrorMessage(''), 3000);
            return () => clearTimeout(timeout);
        }
    }, [errorMessage]);

    return (
        <div className="signInContainer">
            {errorMessage && (
                <Text className="signInErrorMessage" type="danger">
                    {errorMessage}
                </Text>
            )}

            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 24 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input size="large" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password size="large" />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit" size="large">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
export default SignIn;

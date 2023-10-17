'use client';

import {useCallback, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Button, Form, Input, message} from 'antd';
import {ThemeContent} from '@/components';
import styles from './styles.module.scss';
import axios from "axios";

const fields: any[] = [
    {
        type: 'input',
        label: 'USERNAME',
        name: 'username',
        rules: [{required: true, message: 'Please enter your username!'}],
        cProps: {
            maxLength: 10,
        },
    },
    {
        type: 'password',
        label: 'PASSWORD',
        name: 'password',
        rules: [{required: true, message: 'Please enter your password! \''}],
        cProps: {
            maxLength: 20,
        },
    },
    {
        type: 'password',
        label: 'CONFIRM PASSWORD',
        name: 'password2',
        dependencies: ['password'],
        rules: [
            {
                required: true,
                message: 'Please enter your password again!',
            },
            ({getFieldValue}: any) => ({
                validator(_: any, value: any) {
                    if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                    }
                    return Promise.reject(new Error('Two different passwords!'));
                },
            }),
        ],
        cProps: {
            maxLength: 20,
        },
    },
];

const Login = () => {
    const router = useRouter();
    const formRef = useRef<any>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = useCallback(async () => {
        try {
            await formRef?.current?.validateFields();
            const {username, password} = formRef?.current?.getFieldsValue();

            setLoading(true);
            await axios.post('api/register', {
                username,
                password,
            }).then(() => {
                message.success('Successful registration!');
                router.push('/login');
            }).catch((error) => {
                message.error('Failed registration! '+error);
            });
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }, [router]);

    return (
        <ThemeContent>
            <div className={styles.register}>
                <div className={styles.registerBox}>
                    <Form labelCol={{span: 6}} requiredMark={false} ref={formRef} fields={fields}>
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[{ required: true, message: 'Please enter your username' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please enter your password' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Form>
                    <Button loading={loading} type="primary" block onClick={handleSubmit}>
                        Sign in
                    </Button>
                    <div className={styles.footer}>
                        <Button block onClick={() => router.back()}>
                            Back
                        </Button>
                    </div>
                    <div className={styles.h}></div>
                </div>
            </div>
        </ThemeContent>
    );
};

export default Login;

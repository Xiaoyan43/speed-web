'use client';

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {Button, Form, Input, message} from 'antd';
import { ThemeContent } from '@/components';
import { saveToken, saveUserInfo, saveRole } from '../action';
import styles from './styles.module.scss';
import axios from "axios";

const fields: any[] = [
  {
    type: 'input',
    label: 'USERNAME',
    name: 'username',
    rules: [{ required: true, message: 'Please enter your username!' }],
  },
  {
    type: 'password',
    label: 'PASSWORD',
    name: 'password',
    rules: [{ required: true, message: 'Please enter your password!' }],
  },
];

const Login = () => {
  const router = useRouter();

  const formRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    try {
      await formRef?.current?.validateFields();
      const _values = formRef?.current?.getFieldsValue();
      setLoading(true);
      await axios.post('api/login', _values).then((info) => {
        message.success('Successful Sign In!');
        const {data} = info
        saveToken(data.token);
        saveUserInfo(data.userInfo);
        saveRole(data.role)
        router.push('/');
      }).catch((error) => {
        message.error('Failed SignIn! '+error);
      });
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [router]);

  return (
    <ThemeContent>
      <div className={styles.login}>
        <div className={styles.loginBox}>
          <h4 className={styles.title}>Welcome Login</h4>
          <Form labelCol={{ span: 6 }} requiredMark={false} ref={formRef} fields={fields} >
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
          <div className={styles.linkBox}>
            <Link className={styles.link} href="/">
              Index
            </Link>
            <Link className={styles.link} href="/register">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </ThemeContent>
  );
};

export default Login;

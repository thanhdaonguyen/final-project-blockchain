'use client';
import React from 'react';
import {
  Button,
  Form,
  FormProps,
  Input,
  notification,
  Typography,
} from 'antd';
import Link from 'next/link';
import { BACKEND_URL } from '@/utils/env';
import { useRouter } from 'next/navigation';
import { generateKey, exportKeyToString } from './cryptoTools'

const { Title, Text } = Typography;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

type FieldType = {
  nameUniversity?: string;
  password?: string;
  location?: string;
};

const storeLoginData = (data: any) => {
  localStorage.setItem('loginData', JSON.stringify(data));
}

const retreiveLoginData = () => {
  const data = localStorage.getItem('loginData');
  if (data) {
    return JSON.parse(data);
  }
  return null;
}

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {

    let { privateKey, publicKey } = await generateKey();
    const privateKeyString = await exportKeyToString(privateKey);
    const publicKeyString = await exportKeyToString(publicKey);

    console.log('Received values of form: ', values);
    const requestBody = {
      name: values.nameUniversity,
      password: values.password,
      location: values.location,
      description: "University",
      publicKey: publicKeyString,
      privateKey: privateKeyString,
    };
    console.log('BACKEND_URL =', BACKEND_URL);
    const res = await fetch(`${BACKEND_URL}/api/universities/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    const data = await res.json();
    if (res.status !== 200 && res.status !== 201) {
      notification.error({ message: 'Error', description: data.error });
      return;
    }
    storeLoginData({
      isAuthenticated : true,
      privateKey: data.privateKey,
      publicKey: data.publicKey,
      universityName: data.nameUniversity,
    })
    notification.success({ message: 'Success', description: 'You have successfully register university! Redirect to Homepage'});
    console.log("Redirecting to /home...");
    console.log('Current location:', window.location.href);
    router.push("/dashboard");
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div style={{ padding: '40px 0', backgroundColor: '#f9f9f9' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>Register</Title>
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          initialValues={{ prefix: '86' }}
          style={{ maxWidth: '100%' }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          scrollToFirstError
        >
          <Form.Item
            name="nameUniversity"
            label="University's Name"
            rules={[
              {
                required: true,
                message: "Please input University Name",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[
              {
                required: true,
                message: 'Please input your location!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Register
            </Button>
          </Form.Item>
            <Text>
            You already have account? 
            <Link href="/register" passHref>
            Login
            </Link>
        </Text>
        </Form>
      </div>
    </div>
  );
};

export default Register;



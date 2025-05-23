"use client";

import React, { useState } from 'react';
import { Button, Input, Card, Typography, Form, message, Upload } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Title } = Typography;

// Define types for certificate data
interface Certificate {
    certificateId: string;
    studentPK: string;
    universityName: string;
    issueDate: string;
}

const IssueCertificate: React.FC = () => {
    const [newCertificate, setNewCertificate] = useState<Certificate>({
        certificateId: '',
        studentPK: '',
        universityName: '',
        issueDate: '',
    });
    const [certificates, setCertificates] = useState<Certificate[]>([]);

    // Handle form input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setNewCertificate({ ...newCertificate, [field]: e.target.value });
    };

    const [filelist, setFileList] = useState<any[]>([]);

    const handleUploadChange: UploadProps['onChange'] = ({ fileList }) => {
        setFileList(fileList);
    };


    // Generate a new certificate and add it to the list
    const handleIssueCertificate = async () => {
        if (!newCertificate.studentPK || !newCertificate.universityName || !newCertificate.issueDate) {
            message.error('Please fill out all the fields.');
            return;
        }

        if (filelist.length === 0) {
            message.error('Please upload a certificate file');
            return;
        }

        const uploadedFile = filelist[0].originFileObj;
        const reader = new FileReader();

        reader.onload = async () => {
            const result = reader.result;
          
            if (typeof result === 'string') {
              const base64String = result.split(',')[1];
              console.log('Base64 String: ', base64String);
              const decoded = atob(base64String);
              console.log('📄 Decoded content:', JSON.stringify(decoded));
          
              const requestBody = {
                studentPublicKey: newCertificate.studentPK,
                universityName: newCertificate.universityName,
                dateOfIssuing: newCertificate.issueDate,
                encodedFile: decoded,
              };
          
              try {
                const res = await fetch("http://localhost:3000/api/universities/certificate-file", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(requestBody)
                });
                const text = await res.text();
                console.error("API response:", text);
          
                if (!res.ok) throw new Error("Failed to issue certificate");
          
                message.success('Certificate issued successfully!');
                setNewCertificate({
                  certificateId: '',
                  studentPK: '',
                  universityName: '',
                  issueDate: '',
                });
                setFileList([]);
              } catch (err) {
                console.error(err);
                message.error("Upload failed");
              }
          
            } else {
              message.error("Unexpected file read format.");
            }
          };
    reader.readAsDataURL(uploadedFile)
};

return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: 'auto' }}>
        <Title level={2}>Issue a New Certificate</Title>

        <Card title="Create New Certificate" style={{ marginBottom: '20px' }}>
            <Form layout="vertical">
                <Form.Item label="Student Public Key">
                    <Input
                        value={newCertificate.studentPK}
                        onChange={(e) => handleInputChange(e, 'studentPK')}
                        placeholder="Enter the student's public key"
                    />
                </Form.Item>

                <Form.Item label="University's Name">
                    <Input
                        value={newCertificate.universityName}
                        onChange={(e) => handleInputChange(e, 'universityName')}
                        placeholder="Enter the university's name"
                    />
                </Form.Item>

                <Form.Item label="Issue Date">
                    <Input
                        value={newCertificate.issueDate}
                        onChange={(e) => handleInputChange(e, 'issueDate')}
                        placeholder="Enter the issue date"
                    />
                </Form.Item>

                <Form.Item label="Upload Certificate File">
                    <Upload
                        beforeUpload={() => false} // Ngăn upload tự động
                        fileList={filelist}
                        onChange={handleUploadChange}
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                </Form.Item>

                <Button
                    type="primary"
                    onClick={handleIssueCertificate}
                    style={{ width: '100%' }}
                >
                    Issue Certificate
                </Button>
            </Form>
        </Card>
    </div>
);
};

export default IssueCertificate;


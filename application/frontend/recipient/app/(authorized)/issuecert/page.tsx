"use client";

import React, { useState } from 'react';
import { Button, Input, Card, Typography, Form, message, Upload} from 'antd';
import { v4 as uuidv4 } from 'uuid'; 
import {UploadOutlined} from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Title} = Typography;

// Define types for certificate data
interface Certificate {
  certificateId: string;
  studentPK: string;
  universityPK: string;
  issueDate: string;
}

const IssueCertificate: React.FC = () => {
  const [newCertificate, setNewCertificate] = useState<Certificate>({
    certificateId: '',
    studentPK: '',
    universityPK: '',
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
    if (!newCertificate.studentPK || !newCertificate.universityPK || !newCertificate.issueDate) {
      message.error('Please fill out all the fields.');
      return;
    }

    if(filelist.length === 0) {
        message.error('Please upload a certificate file');
        return;
    }

    const uploadedFile = filelist[0].originFileObj;
    const reader = new FileReader();

    reader.onload = async () => {
        const base64String = reader.result.split(',')[1];
        
        const requestBody = {
            certUUID: uuidv4(),
            ksEncryptedFile: base64String,
            studentEncryptedKS1: "student_ks1",
            studentEncryptedKS2: "student_ks2",
            universityEncryptedKS1: "university_ks1",
            universityEncryptedKS2: "university_ks2",
            universityPrivateKey: "university_private_key"
        };

        try {
            const res = await fetch("http://localhost:3000/api/universities/certificate-file", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody)
            });

            if(!res.ok) throw new Error("Failed to issue certificate");

            message.success('Certificate issued successfully!');
            setNewCertificate({
                certificateId: '',
                studentPK: '',
                universityPK: '',
                issueDate: '',
              });
            setFileList([]);
        } catch (err) {
            console.error(err);
            message.error("Upload failed");
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

          <Form.Item label="University Public Key">
            <Input
              value={newCertificate.universityPK}
              onChange={(e) => handleInputChange(e, 'universityPK')}
              placeholder="Enter the university's public key"
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


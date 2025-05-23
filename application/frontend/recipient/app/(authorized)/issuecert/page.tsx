"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Card, Typography, Form, message, Upload, Select } from "antd";
import { v4 as uuidv4 } from "uuid";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { University, getUniversities } from '@/utils/getUniversities';

const { Title } = Typography;

// Define types for certificate data
interface Certificate {
    certificateId: string;
    studentPK: string;
    universityName: string;
    issueDate: string;
}

const IssueCertificate: React.FC = () => {

    const [universities, setUniversities] = useState<{ value: number, label: string }[]>([]);
    
      useEffect(() => {
        getUniversities().then(data => {
          setUniversities(data.map(c => {
            return {
              value: c.id,
              label: c.name,
            };
          }));
        });
      }, []);
    

    // const loginData = JSON.parse(localStorage.getItem("loginData") || "{}");

    const [newCertificate, setNewCertificate] = useState<Certificate>({
        certificateId: "",
        studentPK: "",
        universityName: "",
        issueDate: "",
    });
    const [certificates, setCertificates] = useState<Certificate[]>([]);

    // Handle form input change
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: string
    ) => {
        setNewCertificate({ ...newCertificate, [field]: e.target.value });
    };

    const [filelist, setFileList] = useState<any[]>([]);

    const handleUploadChange: UploadProps["onChange"] = ({ fileList }) => {
        setFileList(fileList);
    };

    // Generate a new certificate and add it to the list
    const handleIssueCertificate = async () => {
        if (
            !newCertificate.studentPK ||
            !newCertificate.universityName ||
            !newCertificate.issueDate
        ) {
            message.error("Please fill out all the fields.");
            return;
        }

        if (filelist.length === 0) {
            message.error("Please upload a certificate file");
            return;
        }

        const uploadedFile = filelist[0].originFileObj;
        const reader = new FileReader();

        reader.onload = async () => {
            const result = reader.result;

            if (typeof result === "string") {
                const base64String = result.split(",")[1];

                const requestBody = {
                    studentPublicKey: newCertificate.studentPK,
                    universityName: newCertificate.universityName,
                    dateOfIssuing: newCertificate.issueDate,
                    encodedFile: base64String,
                };

                try {
                    const res = await fetch(
                        "http://localhost:3000/api/universities/certificate-file",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(requestBody),
                        }
                    );
                    const text = await res.text();
                    console.error("API response:", text);

                    if (!res.ok) throw new Error("Failed to issue certificate");

                    message.success("Certificate issued successfully!");
                    setNewCertificate({
                        certificateId: "",
                        studentPK: "",
                        universityName: "",
                        issueDate: "",
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
        reader.readAsDataURL(uploadedFile);
    };

    return (
        <div style={{ padding: "30px", maxWidth: "800px", margin: "auto" }}>
            <Title level={2}>Issue a New Certificate</Title>

            <Card
                title="Create New Certificate"
                style={{ marginBottom: "20px" }}
            >
                <Form layout="vertical">

                    <Form.Item
                        label="University"
                        rules={[{ required: true, message: 'Please select your university!' }]}
                    >
                        <Select options={universities} />
                    </Form.Item>

                    <Form.Item label="Issue Date">
                        <Input
                            value={newCertificate.issueDate}
                            onChange={(e) => handleInputChange(e, "issueDate")}
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
                            <Button icon={<UploadOutlined />}>
                                Click to Upload
                            </Button>
                        </Upload>
                    </Form.Item>

                    <Button
                        type="primary"
                        onClick={handleIssueCertificate}
                        style={{ width: "100%" }}
                    >
                        Issue Certificate
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default IssueCertificate;

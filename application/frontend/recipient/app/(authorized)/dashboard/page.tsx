"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
    Button,
    Modal,
    QRCode,
    Table,
    Typography,
    Input,
    Card,
    Divider,
    notification,
} from "antd";
import { BACKEND_URL } from "@/utils/env";
// import { useAuth } from '@/components/AuthProvider';
import { decode as base64Decode } from "base64-arraybuffer";

const { Title, Text } = Typography;
const { Search } = Input;

// Define types for certificate data
interface Certificate {
    certHash: string;
    certUUID: string;
    studentPublicKey: string;
    universityPublicKey: string;
    dateOfIssuing: string;
    universitySignature: string;
    studentSignature: string;
    plainTextFileData: string;
    universityName: string;
}

const Dashboard: React.FC = () => {
    const [isModalShareOpen, setIsModalShareOpen] = useState<boolean>(true);
    const [isCheckModalOpen, setIsModalCheckOpen] = useState<boolean>(false);
    const [selectedCheckCertificate, setSelectedCheckCertificate] =
        useState<Certificate | null>(null);
    const [selectedCheckFileData, setSelectedCheckFileData] =
        useState<string | null>(null);
    const [universityName, setUniversityName] = useState<string | null>(null);
    const [selectedShareCertificate, setSelectedShareCertificate] =
        useState<Certificate | null>(null);
    const [loginData, setLoginData] = useState<any>(JSON.parse("{}")); // State to store login data
    // Safely retrieve login data from localStorage on the client side
    useEffect(() => {
        const stringLoginData = localStorage.getItem("loginData");
        console.log(stringLoginData);
        if (stringLoginData) {
            setLoginData(JSON.parse(stringLoginData));
        } else {
            notification.error({
                message: "Error",
                description: "No login data in localStorage",
            });
        }
    }, []);

    // Demo data for multiple certificates
    const [certificates, setCertificates] = useState<Certificate[]>([]);

    const reloadCertificates = useCallback(() => {
        console.log("loginData1", loginData);
        if (!loginData.isAuthenticated) {
            notification.error({
                message: "Error",
                description: "You are not authenticated",
            });
            return;
        }

        const base64PublicKeyString = btoa(loginData.publicKey);
        console.log("base64PublicKeyString", base64PublicKeyString);
        fetch(`${BACKEND_URL}/api/students/certificates`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                publicKey: base64PublicKeyString,
            }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await res.json();
                setCertificates(data);
            })
            .catch((e) => {
                notification.error({
                    message: "Error",
                    description: e.message,
                });
            });
    }, [loginData, setCertificates]);

    useEffect(() => {
        if (loginData.isAuthenticated) {
            reloadCertificates();
        }
    }, [loginData, reloadCertificates]);

    // Columns definition for the Ant Design Table
    const columns = [
        {
            title: "UUID",
            dataIndex: "certUUID",
            key: "certUUID",
            width: 30,
        },
        {
            title: "Issue Date",
            dataIndex: "dateOfIssuing",
            key: "dateOfIssuing",
            width: 30,
        },
        {
            title: "Check Cert",
            key: "action1",
            width: 20,
            render: (text: any, record: Certificate) => (
                <Button type="primary" onClick={() => handleCheckCert(record)}>
                    Check
                </Button>
            ),
        },
        {
            title: "Share Cert",
            key: "action2",
            width: 20,
            render: (text: any, record: Certificate) => (
                <Button type="primary" onClick={() => handleShare(record)}>
                    Share
                </Button>
            ),
        },
    ];

    const handleShare = (certificate: Certificate): void => {
        setSelectedShareCertificate(certificate);
        setIsModalShareOpen(true);
        console.log("certificate", certificate);
        console.log("selectedShareCertificate", selectedShareCertificate);
    };

    const handleCheckCert = async (certificate: Certificate): Promise<void> => {
        await fetch(
            `${BACKEND_URL}/api/students/certificates/${certificate.certUUID}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    publicKey: certificate.studentPublicKey,
                }),
            }
        ).then(async (res) => {
            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }
            const data = await res.json();
            console.log("data", data);
            setSelectedCheckFileData(data.plain_text_file_data);
            setUniversityName(data.university_name);
        });
        
        setSelectedCheckCertificate(certificate);
        setIsModalCheckOpen(true);
    };

    const handleOk = (): void => {
        setIsModalShareOpen(false);
    };

    const handleCancel = (): void => {
        setIsModalShareOpen(false);
    };

    const handleCheckModalOpen = (): void => {
        setIsModalCheckOpen(true);
    };
    const handleCheckModalClose = (): void => {
        setIsModalCheckOpen(false);
    };

    return (
        <div style={{ padding: "20px" }}>
            <Title level={2}>
                {loginData.isAuthenticated
                    ? loginData.fullName
                    : "Unauthenticated"}
            </Title>
            <Button
                type="primary"
                style={{ marginBottom: "20px" }}
                onClick={() => {
                    reloadCertificates();
                }}
            >
                Reload Certificates
            </Button>

            {/* Table to display certificates */}
            <Table
                columns={columns}
                dataSource={certificates}
                rowKey="certificateId"
                pagination={false} // Disable pagination, you can enable it if needed
                scroll={{ x: "max-content" }} // Enable horizontal scrolling
            />

            {/* {selectedShareCertificate && ( */}
            {true && (
                <Modal
                    title="Share Certificate"
                    open={isModalShareOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Close
                        </Button>,
                    ]}
                >
                    <QRCode
                        // value={`https://example.com/certificate/${selectedShareCertificate.certUUID}`}
                        value={`localhost:3002/?certUUID=${selectedShareCertificate?.certUUID}`}
                    />
                    <div
                        style={{
                            marginTop: "10px",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Text copyable>
                            localhost:3002/?certUUID=
                            {/* {certificates[1].certUUID} */}
                            {selectedShareCertificate?.certUUID}
                        </Text>
                    </div>
                </Modal>
            )}

            <Modal
                title={
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <span>Check Certificate File</span>
                    </div>
                }
                open={isCheckModalOpen}
                onCancel={handleCheckModalClose}
                width={700}
                style={{ top: 20 }}
                footer={[
                    <Button
                        key="close"
                        onClick={handleCheckModalClose}
                        size="large"
                    >
                        Close
                    </Button>,
                ]}
            >
                <Divider />

                <Card
                    title="Certificate Details"
                    style={{ marginBottom: "20px", borderRadius: "6px" }}
                >
                    <pre
                        style={{
                            whiteSpace: "pre-wrap",
                            wordWrap: "break-word",
                            background: "#f5f5f5",
                            padding: "16px",
                            borderRadius: "6px",
                            maxHeight: "400px",
                            overflow: "auto",
                            border: "1px solid #e8e8e8",
                        }}
                    >
                        Certificate ID: {selectedCheckCertificate?.certUUID}
                        {"\n"}
                        Date of Issue: {selectedCheckCertificate?.dateOfIssuing}
                        {"\n"}
                        University Name: {universityName}
                    </pre>
                </Card>

                <Card
                    title="Certificate Details"
                    style={{ marginBottom: "20px", borderRadius: "6px" }}
                >
                    <pre
                        style={{
                            whiteSpace: "pre-wrap",
                            wordWrap: "break-word",
                            background: "#f5f5f5",
                            padding: "16px",
                            borderRadius: "6px",
                            maxHeight: "400px",
                            overflow: "auto",
                            border: "1px solid #e8e8e8",
                        }}
                    >
                        {selectedCheckFileData}
                    </pre>
                </Card>
            </Modal>
        </div>
    );
};

export default Dashboard;

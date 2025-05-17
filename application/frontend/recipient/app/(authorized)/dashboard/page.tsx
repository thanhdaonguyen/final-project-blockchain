"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
    Button,
    Modal,
    QRCode,
    Table,
    Typography,
    Input,
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
}

const Dashboard: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
    const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loginData, setLoginData] = useState<any>(JSON.parse("{}")); // State to store login data
    // Safely retrieve login data from localStorage on the client side
    useEffect(() => {
        const stringLoginData = localStorage.getItem("loginData");
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

        if (searchQuery) {
            fetch(`${BACKEND_URL}/api/students/certificates/${searchQuery}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    privateKey: loginData.privateKey,
                }),
            })
                .then(async (res) => {
                    const data = await res.json();
                    // console.log("Response body:", data);

                    if (!res.ok) {
                        throw new Error("Failed to fetch data");
                    }

                    setCertificates([data, data]);
                })
                .catch((e) => {
                    console.log(e);
                });
        } else {
            fetch(`${BACKEND_URL}/api/students/certificates`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    privateKey: loginData.privateKey,
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
        }
    }, [searchQuery, loginData, setCertificates]);

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
            title: "Hash",
            dataIndex: "certHash",
            key: "certHash",
            width: 200,
        },
        {
            title: "Issue Date",
            dataIndex: "dateOfIssuing",
            key: "dateOfIssuing",
            width: 30,
        },
        {
            title: "University Public Key",
            dataIndex: "universityPublicKey",
            key: "universityPublicKey",
            width: 200,
        },
        {
            title: "Action",
            key: "action",
            width: 20,
            render: (text: any, record: Certificate) => (
                <Button type="primary" onClick={() => handleDownload(record)}>
                    Download
                </Button>
            ),
        },
    ];

    const handleDownload = (certificate: Certificate): void => {
        if (!loginData.isAuthenticated) {
            notification.error({
                message: "Error",
                description: "You are not authenticated",
            });
            return;
        }

        fetch(
            `${BACKEND_URL}/api/students/certificates/${certificate.certUUID}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    privateKey: loginData.privateKey,
                }),
            }
        )
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await res.json();
                const arrayBuffer = base64Decode(data.base64File);
                console.log("base64File", data.base64File);
                console.log("arrayBuffer", arrayBuffer);
                const blob = new Blob([arrayBuffer], {
                    type: "application/octet-stream",
                });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${certificate.certUUID}.txt`;
                a.click();
            })
            .catch((e) => {
                notification.error({
                    message: "Error",
                    description: e.message,
                });
            });
    };

    const handleOk = (): void => {
        setIsModalOpen(false);
    };

    const handleCancel = (): void => {
        setIsModalOpen(false);
    };

    return (
        <div style={{ padding: "20px" }}>
            <Title level={2}>
                {loginData.isAuthenticated
                    ? loginData.fullName
                    : "Unauthenticated"}
            </Title>
            <Title level={4}>
                {"Public Key: " +
                    (loginData.isAuthenticated
                        ? loginData.publicKey
                        : "Unauthorized")}
            </Title>

            {/* Search Input */}
            <Search
                placeholder="Search by Certificate ID"
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                    console.log("searchQuery", searchQuery);
                }}
                style={{ marginBottom: "20px", width: "100%" }}
                // onSearch={(value) => {reloadCertificates()}}
            />

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

            {/* {selectedCertificate && ( */}
            {true && (
                <Modal
                    title="Share Certificate"
                    open={isModalOpen}

                    //open={true}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Close
                        </Button>,
                    ]}
                >
                    <QRCode
                        // value={`https://example.com/certificate/${selectedCertificate.certUUID}`}
                        value={`https://example.com/certificate/hihi`}
                    />
                    <div
                        style={{
                            marginTop: "10px",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Text copyable>
                            https://verify.com/
                            {/* {certificates[1].certUUID} */}
                            {/* {selectedCertificate.certificateId} */}
                        </Text>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Dashboard;

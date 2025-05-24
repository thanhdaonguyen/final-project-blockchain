"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BACKEND_URL } from "@/utils/env";
import {
    Button,
    Input,
    Typography,
    Row,
    Col,
    Card,
    message,
    Modal,
    Spin,
    Upload,
    Space,
    Divider,
    notification,
} from "antd";
import {
    UploadOutlined,
    CheckCircleOutlined,
    FileTextOutlined,
    SafetyCertificateOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import {
    generateKey,
    exportKeyToString,
    importKeyFromString,
    bufferSourceToString,
    stringToBufferSource,
    isCorrectHash,
    verifySignature,
    signData,
} from "./cryptoTools";
import { sign } from "crypto";
const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

const Verifier: React.FC = () => {
    const searchParams = useSearchParams();
    const certUUID = searchParams.get("certUUID"); //
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<string>("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [isVerified, setIsVerified] = useState(false);
    const [studentPublicKey, setStudentPublicKey] = useState<string | null>(
        null
    );
    const [universityPublicKey, setUniversityPublicKey] = useState<
        string | null
    >(null);
    const [universitySignature, setUniversitySignature] = useState<
        string | null
    >(null);
    const [studentSignature, setStudentSignature] = useState<string | null>(
        null
    );
    // Information to check verification
    const [metaData, setMetaData] = useState<{ [key: string]: any }>({
        name: "John Doe",
        age: 30,
        university: "XYZ University",
    });
    useEffect(() => {
        if (!certUUID) return;
        const fetchCertificateData = async () => {
            try {
                const response = await fetch(
                    `${BACKEND_URL}/api/students/certificates/${certUUID}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ certUUID }),
                    }
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch certificate data");
                }
                const data = await response.json();
                console.log("data:", data);
                setMetaData({
                    University: data.university_name,
                    Date_Of_Issue: data.date_of_issue,
                });
                setStudentPublicKey(data.student_public_key);
                setStudentSignature(data.student_signature);
                setUniversityPublicKey(data.university_public_key);
                setUniversitySignature(data.university_signature);
            } catch (error) {
                console.error("Error fetching certificate data:", error);
            }
        };
        fetchCertificateData();
    }, [certUUID]);

    let certHash,
        setCertHash: string | null = null;

    // Verification logic

    const handleVerify = async (): Promise<void> => {
        if (!uploadedFile) {
            message.warning("Please upload a certificate file first.");
            return;
        }
        setIsVerifying(true);
        // Here I need to query the database to get:
        // + studentPublicKey
        // + universityPublicKey

        // Here I need to query the blockchain to get:
        // + certHash
        // + metadata
        // + universitySignature
        // + studentSignature

        // simulate fetching data from the blockchain
        certHash = "hahaha";

        let verifyUniversitySignatureResult = await verifySignature(
            universityPublicKey as string,
            universitySignature as string,
            uploadedFile as string
        );
        let verifyStudentSignatureResult = await verifySignature(
            studentPublicKey as string,
            studentSignature as string,
            uploadedFile as string
        );
        let verifyHashResult = true;
        // let verifyHashResult = await isCorrectHash(
        //     certHash as string,
        //     uploadedFile as string
        // );

        console.log("Hash verification result: ", verifyHashResult);
        console.log(
            "University signature verification result: ",
            verifyUniversitySignatureResult
        );
        console.log(
            "Student signature verification result: ",
            verifyStudentSignatureResult
        );
        let result =
            verifyHashResult &&
            verifyUniversitySignatureResult &&
            verifyStudentSignatureResult;
        if (result) {
            setIsVerifying(false);
            setIsVerified(true);
            handleModalOpen();
        } else {
            setIsVerifying(false);
            setIsVerified(false);
            handleModalOpen();
        }
    };
    // Modal controls
    const handleModalOpen = (): void => {
        setIsModalOpen(true);
    };

    const handleModalClose = (): void => {
        setIsModalOpen(false);
    };

    const customUpload = {
        beforeUpload: (file: File) => {
            return false;
        },
    };

    return (
        <div
            className="verifier-container"
            style={{
                padding: "32px",
                maxWidth: "1200px",
                margin: "0 auto",
                background: "#f5f7fa",
                minHeight: "100vh",
            }}
        >
            <Card
                style={{
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    background: "white",
                }}
            >
                <Row align="middle" style={{ marginBottom: "24px" }}>
                    <Col>
                        <SafetyCertificateOutlined
                            style={{
                                fontSize: "28px",
                                color: "#1890ff",
                                marginRight: "16px",
                            }}
                        />
                    </Col>
                    <Col>
                        <Title level={2} style={{ margin: 0 }}>
                            Certificate Verification Portal
                        </Title>
                    </Col>
                </Row>

                <Divider />

                <Row gutter={[32, 32]}>
                    <Col xs={24} md={12}>
                        <Card
                            title={
                                <Space>
                                    <FileTextOutlined />
                                    <span>Certificate Validator</span>
                                </Space>
                            }
                            style={{
                                height: "100%",
                                borderRadius: "8px",
                                border: "1px solid #e6f7ff",
                                background: "#fafcff",
                            }}
                        >
                            <Paragraph>
                                Upload your certificate file to verify its
                                authenticity. The system will validate the
                                certificate against our secure database.
                            </Paragraph>

                            <div
                                style={{
                                    marginBottom: "20px",
                                    display: "flex",
                                    gap: "8px",
                                    flexDirection: "column",
                                }}
                            >
                                <div>
                                    <Text strong>Certificate UUID: </Text>
                                    <Text code>{certUUID}</Text>
                                </div>
                                {Object.keys(metaData).length > 0 &&
                                    Object.entries(metaData).map(
                                        ([key, value]) => (
                                            <div
                                                key={key}
                                                style={{ marginBottom: "4px" }}
                                            >
                                                <Text strong>{key} </Text>
                                                <Text code>
                                                    {String(value)}
                                                </Text>
                                            </div>
                                        )
                                    )}
                            </div>

                            <Dragger
                                {...customUpload}
                                style={{
                                    padding: "20px",
                                    background: "white",
                                    border: "1px dashed #d9d9d9",
                                    borderRadius: "8px",
                                    marginBottom: "20px",
                                }}
                                multiple={false}
                                showUploadList={false}
                                accept=".txt,.pdf,.json"
                                beforeUpload={(file) => {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                        const fileContent = event.target
                                            ?.result as string;

                                        console.log(
                                            "File content: ",
                                            fileContent
                                        );
                                        setUploadedFile(fileContent); // Store the file content
                                        setFileName(file.name); // Store the file name
                                        console.log(
                                            `File "${file.name}" uploaded successfully.`
                                        );
                                    };
                                    reader.onerror = () => {
                                        console.log("File reading error");
                                    };
                                    reader.readAsText(file); // Read the file as text
                                    return false; // Prevent default upload behavior
                                }}
                            >
                                <p className="ant-upload-drag-icon">
                                    <UploadOutlined
                                        style={{
                                            fontSize: "32px",
                                            color: "#1890ff",
                                        }}
                                    />
                                </p>
                                <p className="ant-upload-text">
                                    Click or drag file to this area to upload
                                </p>
                                <p className="ant-upload-hint">
                                    Support for single file upload. Strict
                                    validation will be performed.
                                </p>
                            </Dragger>

                            {fileName && (
                                <div
                                    style={{
                                        margin: "16px 0",
                                        padding: "8px 12px",
                                        background: "#f6ffed",
                                        border: "1px solid #b7eb8f",
                                        borderRadius: "4px",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <FileTextOutlined
                                        style={{
                                            marginRight: "8px",
                                            color: "#52c41a",
                                        }}
                                    />
                                    <Text ellipsis style={{ flex: 1 }}>
                                        {fileName}
                                    </Text>
                                </div>
                            )}

                            <Button
                                type="primary"
                                size="large"
                                icon={
                                    isVerifying ? null : <CheckCircleOutlined />
                                }
                                onClick={handleVerify}
                                loading={isVerifying}
                                disabled={!uploadedFile}
                                block
                                style={{
                                    height: "48px",
                                    borderRadius: "6px",
                                    fontWeight: 500,
                                    marginTop: "16px",
                                }}
                            >
                                {isVerifying
                                    ? "Verifying..."
                                    : "Verify Certificate"}
                            </Button>
                        </Card>
                    </Col>

                    <Col xs={24} md={12}>
                        <Card
                            title={
                                <Space>
                                    <SafetyCertificateOutlined />
                                    <span>Verification Information</span>
                                </Space>
                            }
                            style={{
                                height: "100%",
                                borderRadius: "8px",
                                border: "1px solid #e6f7ff",
                                background: "#fafcff",
                            }}
                        >
                            <Paragraph>
                                Our certificate verification system ensures that
                                your certificates are authentic and have not
                                been tampered with. Each certificate contains a
                                unique identifier that can be verified against
                                our secure database.
                            </Paragraph>

                            <Divider dashed />

                            <Space
                                direction="vertical"
                                size="large"
                                style={{ width: "100%" }}
                            >
                                <div>
                                    <Text strong>What to expect:</Text>
                                    <ul
                                        style={{
                                            paddingLeft: "20px",
                                            marginTop: "8px",
                                        }}
                                    >
                                        <li>
                                            Instant verification of authenticity
                                        </li>
                                        <li>
                                            Detailed certificate information
                                        </li>
                                        <li>Verification timestamp</li>
                                        <li>Security validation report</li>
                                    </ul>
                                </div>

                                <div>
                                    <Text strong>Supported file formats:</Text>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "8px",
                                            marginTop: "8px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                padding: "4px 12px",
                                                background: "#e6f7ff",
                                                borderRadius: "4px",
                                            }}
                                        >
                                            TXT
                                        </div>
                                        <div
                                            style={{
                                                padding: "4px 12px",
                                                background: "#e6f7ff",
                                                borderRadius: "4px",
                                            }}
                                        >
                                            PDF
                                        </div>
                                        <div
                                            style={{
                                                padding: "4px 12px",
                                                background: "#e6f7ff",
                                                borderRadius: "4px",
                                            }}
                                        >
                                            JSON
                                        </div>
                                    </div>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </Card>

            {/* Modal to display verification result */}
            <Modal
                title={
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <CheckCircleOutlined
                            style={{
                                color: "#52c41a",
                                fontSize: "20px",
                                marginRight: "12px",
                            }}
                        />
                        <span>Certificate Verification Result</span>
                    </div>
                }
                open={isModalOpen}
                onCancel={handleModalClose}
                width={700}
                style={{ top: 20 }}
                footer={[
                    <Button key="close" onClick={handleModalClose} size="large">
                        Close
                    </Button>,
                ]}
            >
                <Divider />

                {isVerified && (
                    <div
                        style={{
                            marginBottom: "20px",
                            padding: "12px",
                            background: "#f6ffed",
                            border: "1px solid #b7eb8f",
                            borderRadius: "6px",
                        }}
                    >
                        <Text strong style={{ color: "#52c41a" }}>
                            <CheckCircleOutlined /> Certificate successfully
                            verified!
                        </Text>
                    </div>
                )}

                {!isVerified && (
                    <div
                        style={{
                            marginBottom: "20px",
                            padding: "12px",
                            background: "#fff1f0",
                            border: "1px solid #ffa39e",
                            borderRadius: "6px",
                        }}
                    >
                        <Text strong style={{ color: "#ff4d4f" }}>
                            <CloseCircleOutlined style={{ color: "#ff4d4f" }} />{" "}
                            Certificate verification failed!
                        </Text>
                    </div>
                )}

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
                        {uploadedFile as string}
                    </pre>
                </Card>
            </Modal>
        </div>
    );
};

export default Verifier;

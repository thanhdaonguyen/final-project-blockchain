"use client";

import React, { useState, useEffect } from "react";
import {
    Button,
    Input,
    Card,
    Typography,
    Form,
    message,
    Upload,
    Select,
    DatePicker,
    Modal,
    notification,
    Divider,
} from "antd";
import {
    UploadOutlined,
    CheckCircleOutlined,
    FileTextOutlined,
    SafetyCertificateOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import type { UploadProps } from "antd";
import { University, getUniversities } from "@/utils/getUniversities";
import { signData, verifySignature } from "./cryptoTools"

const { Title } = Typography;

// Define types for certificate data
interface Certificate {
    certificateId: string;
    studentPK: string;
    universityName: string;
    issueDate: string;
}

const IssueCertificate: React.FC = () => {
    // certUUID: uuidv4(),
    // universityName: "uni",
    // dateOfIssue: new Date().toISOString(),
    // encodedFile: base64String,
    // universitySignature: "uniSignature",
    // studentSignature: "studentSignature",
    // studentPublicKey: loginData.publicKey,
    // isOnChain: false,
    const [certUUID, setCertUUID] = useState<string>("");
    const [universityName, setUniversityName] = useState<string>("");
    const [dateOfIssue, setDateOfIssue] = useState<string>("");
    const [encodedFile, setEncodedFile] = useState<string>("");
    const [universitySignature, setUniversitySignature] = useState<string>("");
    const [studentSignature, setStudentSignature] = useState<string>("");
    const [studentPublicKey, setStudentPublicKey] = useState<string>("");
    const [studentPrivateKey, setStudentPrivateKey] = useState<string>("");
    const [isOnChain, setIsOnChain] = useState<boolean>(false);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [universities, setUniversities] = useState<
        { value: number; label: string }[]
    >([]);

    const handleModalClose = () => {
        setIsModalOpen(false);
    };
    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const [loginData, setLoginData] = useState<any>(JSON.parse("{}")); // State to store login data
    // Safely retrieve login data from localStorage on the client side
    useEffect(() => {
        const stringLoginData = localStorage.getItem("loginData");
        const loginDataObject = stringLoginData
            ? JSON.parse(stringLoginData)
            : null;
        console.log(stringLoginData);
        if (stringLoginData) {
            setLoginData(JSON.parse(stringLoginData));
        } else {
            notification.error({
                message: "Error",
                description: "No login data in localStorage",
            });
        }
        setStudentPublicKey(loginDataObject?.publicKey || "");
        setStudentPrivateKey(loginDataObject?.privateKey || "");
    }, []);

    useEffect(() => {
        getUniversities().then((data) => {
            setUniversities(
                data.map((c) => {
                    return {
                        value: c.id,
                        label: c.name,
                    };
                })
            );
        });
    }, []);

    const [filelist, setFileList] = useState<any[]>([]);

    const handleUploadChange: UploadProps["onChange"] = ({ fileList }) => {
        setFileList(fileList);

        if (fileList.length > 0 && fileList[0].originFileObj) {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result;
                setEncodedFile(result as string); // Set the plain text content
                // console.log("Plain text file content:", result); // Debugging log
            };
            reader.readAsText(fileList[0].originFileObj); // Read the file as plain text
        } else {
            setEncodedFile(""); // Clear the state if no file is selected
        }
    };

    const handleUniversityChange = (value: string) => {
        setUniversityName(value); // Update the state with the selected university name
        console.log("Selected University:", value); // Debugging log
    };
    const handleDateChange = (
        date: moment.Moment | null,
        dateString: string | string[]
    ) => {
        let formattedDate = "";
        if (Array.isArray(dateString)) {
            formattedDate = dateString[0] || "";
        } else {
            formattedDate = dateString;
        }
        if (date) {
            setDateOfIssue(formattedDate); // Update the state with the formatted date string
            console.log("Selected Date:", formattedDate); // Debugging log
        } else {
            setDateOfIssue(""); // Clear the state if no date is selected
            console.log("Date cleared");
        }
    };

    // Generate a new certificate and add it to the list
    const handleIssueCertificate = async () => {

        const newCertUUID = uuidv4();
        setCertUUID(newCertUUID);

        const newSignature = await signData(
            studentPrivateKey,
            encodedFile
        );
        setStudentSignature(newSignature as string);

        // const isSignatureValid = await verifySignature(
        //     studentPublicKey,
        //     newSignature as string,
        //     encodedFile
        // );

        // console.log("Signature valid:", isSignatureValid);

        if (filelist.length === 0) {
            message.error("Please upload a certificate file");
            return;
        }


        const requestBody = {
            certUUID: newCertUUID,
            universityName: universityName,
            dateOfIssue: dateOfIssue,
            encodedFile: encodedFile,
            universitySignature: "uniSignature",
            studentSignature: newSignature,
            studentPublicKey: studentPublicKey,
            isOnChain: false,
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
        } catch (err) {
            console.error(err);
            message.error("Upload failed");
        }

        handleModalOpen();
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
                        rules={[
                            {
                                required: true,
                                message: "Please select your university!",
                            },
                        ]}
                    >
                        <Select
                            options={universities}
                            onChange={handleUniversityChange}
                        />
                    </Form.Item>

                    <Form.Item
                        name="dateOfIssue"
                        label="Date of Issue"
                        rules={[
                            {
                                type: "date",
                                required: true,
                                message: "Please input date of issue!",
                            },
                        ]}
                    >
                        <DatePicker onChange={handleDateChange} />
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
                        Certificate ID: {certUUID}
                        {"\n"}
                        Date of Issue: {dateOfIssue}
                        {"\n"}
                        University Name:{" "}
                        {
                            universities.find(
                                (u) => u.value.toString() == universityName
                            )?.label
                        }
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
                        {encodedFile as string}
                    </pre>
                </Card>
            </Modal>
        </div>
    );
};

export default IssueCertificate;

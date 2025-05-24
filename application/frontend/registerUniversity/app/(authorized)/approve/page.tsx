

'use client';
import React, { useEffect, useState } from 'react';
import { Button, Modal, QRCode, Table, Typography, Input, message, Space, Tag, Divider, Card,  } from 'antd';
import { BACKEND_URL } from "@/utils/env";
import { getHash, signData } from './cryptoTools'


const { Title, Text } = Typography;
const { Search } = Input;

interface Certificate {
  cert_uuid: string;
  is_on_chain: boolean;
  plain_text_file_data: string;
  student_public_key: string;
  university_public_key: string;
  university_name: string;
  date_of_issue: string;
  university_signature: string;
  student_signature: string;
}

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [showTable, setShowTable] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [loginData, setLoginData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('loginData');
    if (data) {
      setLoginData(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/universities/certificates/not_on_chain`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setCertificates(data);
      } catch (error) {
        message.error('Failed to fetch certificates');
        console.error(error);
      }
    };

    fetchCertificates();
  }, []);


	// CertHash            string `json:"certHash"`
	// UniversitySignature string `json:"universitySignature"`
	// StudentSignature    string `json:"studentSignature"`
	// DateOfIssuing       string `json:"dateOfIssuing"`
	// CertUUID            string `json:"certUUID"`
	// UniversityPublicKey string `json:"universityPK"`
	// StudentPublicKey    string `json:"studentPK"`

  const handleApprove = async (certificate: Certificate) => {
    console.log('Approving certificate:', certificate);
    setLoading(true);

    const newCertHash = await getHash(certificate.plain_text_file_data);
    console.log('New certificate hash:', newCertHash);
    const newUniversitySignature = await signData(
      loginData.privateKey,
      certificate.plain_text_file_data
    );

    console.log("Date of Issuing:", certificate.date_of_issue);

    const requestBody = {
      certHash: newCertHash,
      universitySignature: newUniversitySignature,
      studentSignature: certificate.student_signature, // Placeholder, replace with actual student signature
      dateOfIssuing: certificate.date_of_issue, // Placeholder, replace with actual date of issuing
      certUUID: certificate.cert_uuid,
      universityPK: loginData.publicKey,
      studentPK: certificate.student_public_key,
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/universities/certificate-file/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error('Approval failed');

      console.log('Certificate approved and added to blockchain');

      const res = await fetch(`${BACKEND_URL}/api/universities/certificates/not_on_chain`);
      const data = await res.json();
      setCertificates(data);
    } catch (error) {
      message.error('Failed to approve certificate');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    {
      title: 'Certificate ID',
      dataIndex: 'cert_uuid',
      key: 'cert_uuid',
    },
    {
      title: 'University',
      dataIndex: 'university_name',
      key: 'university_name',
    },
    {
      title: 'Examine Cert',
      key: 'action',
      render: (text: any, record: Certificate) => (
        <Button
          type="default"
          onClick={() => handleExamine(record)}
        >
          Examine
        </Button>
      ),
    },
    {
      title: 'Approve?',
      key: 'action',
      render: (text: any, record: Certificate) => (
        <Button 
          type="primary" 
          onClick={() => handleApprove(record)}
          disabled={record.is_on_chain}
          loading={loading}
        >
          {record.is_on_chain ? 'Approved' : 'Approve'}
        </Button>
      ),
    },
  ];

  const filteredCertificates = (certificates || []).filter(
    (certificate) =>
      certificate.university_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      certificate.cert_uuid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      certificate.student_public_key?.toLowerCase().includes(searchQuery.toLowerCase())                             
  );

  const handleExamine = (certificate: Certificate): void => {
    setSelectedCertificate(certificate);
    handleOk()
  };

  const handleOk = (): void => {
    setIsModalOpen(true);
  };

  const handleCancel = (): void => {
    setIsModalOpen(false);
  };

  const toggleTable = (): void => {
    setShowTable(!showTable);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Certificates Pending Approval</Title>

      <Space style={{ marginBottom: 20 }}>
        <Button type="primary" onClick={toggleTable}>
          {showTable ? 'Hide Table' : 'Show Table'}
        </Button>
        
        <Search
          placeholder="Search by University, Certificate ID or Public Key"
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: 300 }}
        />
      </Space>

      {showTable && (
        <Table
          columns={columns}
          dataSource={filteredCertificates}
          rowKey="cert_uuid"
          pagination={false}
          locale={{ emptyText: 'No certificates found' }}
        />
      )}

      {selectedCertificate && (
        <Modal
                title={
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <span>Examine Certificate File</span>
                    </div>
                }
                open={isModalOpen}
                onCancel={handleCancel}
                width={700}
                style={{ top: 20 }}
                footer={[
                    <Button
                        key="close"
                        onClick={handleCancel}
                        size="large"
                    >
                        Close
                    </Button>,
                ]}
            >
                <Divider />

                <Card
                    title="Certificate Meta Data"
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
                        Certificate ID: {selectedCertificate?.cert_uuid}
                        {"\n"}
                        Date of Issue: {selectedCertificate?.date_of_issue}
                        {"\n"}
                        University Name: {selectedCertificate?.university_name}
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
                        {selectedCertificate.plain_text_file_data}
                    </pre>
                </Card>
            </Modal>
      )}
    </div>
  );
};

export default Dashboard;
// 'use client';
// import React, { useState } from 'react';
// import { Button, Modal, QRCode, Table, Typography, Input } from 'antd';

// const { Title, Text } = Typography;
// const { Search } = Input;

// // Define types for certificate data
// interface Certificate {
//   certificateId: string;
//   recipientName: string;
//   issueDate: string;
//   validity: string;
// }


// const Dashboard: React.FC = () => {
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
//   const [searchQuery, setSearchQuery] = useState<string>('');

//   // Demo data for multiple certificates
//   const certificates: Certificate[] = [
//     {
//       certificateId: '123456',
//       recipientName: 'John Doe',
//       issueDate: 'March 2025',
//       validity: 'Lifetime',
//     },
//     {
//       certificateId: '789012',
//       recipientName: 'Emily Johnson',
//       issueDate: 'January 2025',
//       validity: 'Lifetime',
//     },
//     {
//       certificateId: '345678',
//       recipientName: 'Michael Brown',
//       issueDate: 'July 2024',
//       validity: '1 Year',
//     },
//     {
//       certificateId: '901234',
//       recipientName: 'Sophia Lee',
//       issueDate: 'December 2024',
//       validity: 'Lifetime',
//     },
//   ];

//     // Columns definition for the Ant Design Table
//     const columns = [
//       {
//         title: 'Certificate ID',
//         dataIndex: 'certificateId',
//         key: 'certificateId',
//       },
//       {
//         title: 'Recipient Name',
//         dataIndex: 'recipientName',
//         key: 'recipientName',
//       },
//       {
//         title: 'Issue Date',
//         dataIndex: 'issueDate',
//         key: 'issueDate',
//       },
//       {
//         title: 'Validity',
//         dataIndex: 'validity',
//         key: 'validity',
//       },
//       {
//         title: 'Action',
//         key: 'action',
//         render: (text: any, record: Certificate) => (
//           <Button type="primary" onClick={() => handleShare(record)}>
//             Share
//           </Button>
//         ),
//       },
//     ];
//   // Filter certificates based on the search query
//   const filteredCertificates = certificates.filter(
//     (certificate) =>
//       certificate.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       certificate.certificateId.includes(searchQuery)
//   );

//   const handleShare = (certificate: Certificate): void => {
//     setSelectedCertificate(certificate);
//     setIsModalOpen(true);
//   };

//   const handleOk = (): void => {
//     setIsModalOpen(false);
//   };

//   const handleCancel = (): void => {
//     setIsModalOpen(false);
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <Title level={2}>Certificates Issued</Title>

//       {/* Search Input */}
//       <Search
//         placeholder="Search by Recipient Name, or Certificate ID"
//         onChange={(e) => setSearchQuery(e.target.value)}
//         style={{ marginBottom: '20px', width: '100%' }}
//       />

//       {/* Table to display certificates */}
//       <Table
//         columns={columns}
//         dataSource={filteredCertificates}
//         rowKey="certificateId"
//         pagination={false} // Disable pagination, you can enable it if needed
//       />

//       {selectedCertificate && (
//         <Modal
//           title="Share Certificate"
//           open={isModalOpen}
//           onOk={handleOk}
//           onCancel={handleCancel}
//           footer={[
//             <Button key="back" onClick={handleCancel}>
//               Close
//             </Button>
//           ]}
//         >
//           <QRCode value={`https://example.com/certificate/${selectedCertificate.certificateId}`} />
//           <Text>Scan this QR code to view or share your certificate.</Text>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default Dashboard;


'use client';
import React, { useEffect, useState } from 'react';
import { Button, Modal, QRCode, Table, Typography, Input, message, Space, Tag } from 'antd';
import { BACKEND_URL } from "@/utils/env";


const { Title, Text } = Typography;
const { Search } = Input;

interface Certificate {
  cert_uuid: string;
  is_on_chain: boolean;
  plain_text_file_data: string;
  student_public_key: string;
  universityPublicKey: string;
  university_name: string;
}

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [showTable, setShowTable] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

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

  const handleApprove = async (certificate : Certificate) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/universities/certificates/appove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cert_uuid: certificate.cert_uuid }),
      });

      if (!response.ok) throw new Error('Approval failed');

      message.success('Certificate approved and added to blockchain');

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
      title: 'Student Public Key',
      dataIndex: 'student_public_key',
      key: 'student_public_key',
      render: (text: string) => text.substring(0, 10) + '...', // Hiển thị rút gọn
    },
    {
      title: 'Plain Text',
      dataIndex: 'plain_text_file_data',
      key: 'plain_text_file_data',
      render: (text: string) => text.substring(0, 10) + '...', // Hiển thị rút gọn
    },
    {
      title: 'On Chain',
      dataIndex: 'is_on_chain',
      key: 'is_on_chain',
      render: (isOnChain: boolean) => (
        <Tag color={isOnChain ? 'green' : 'red'}>
          {isOnChain ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Action',
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

  const handleShare = (certificate: Certificate): void => {
    setSelectedCertificate(certificate);
    setIsModalOpen(true);
  };

  const handleOk = (): void => {
    setIsModalOpen(false);
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
          title="Share Certificate"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Close
            </Button>
          ]}
        >
          <QRCode value={`https://example.com/certificate/${selectedCertificate.cert_uuid}`} />
          <Text>Scan this QR code to view or share your certificate.</Text>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
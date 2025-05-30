// 'use client';
// import React, { useEffect, useState } from 'react';
// import { Button, Modal, QRCode, Table, Typography, Input, message } from 'antd';
// import axios from 'axios';

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
//   const [certificates, setCertificates] = useState<Certificate[]>([]);

//   useEffect(() => {
//     const fetchCertificates = async () => {
//       try {
//         const response = await axios.get('/api/certificates/on_chain');
//         setCertificates(response.data);
//       } catch (error) {
//         message.error('Failed to fetch certificates');
//         console.error(error);
//       }
//     };

//     fetchCertificates();
//   }, []);

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

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/universities/certificates/on_chain`);
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
      title: 'Student Public Key',
      dataIndex: 'student_public_key',
      key: 'student_public_key',
      render: (text: string) => text.substring(0, 10) + '...', // Hiển thị rút gọn
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: Certificate) => (
        <Button type="primary" onClick={() => handleShare(record)}>
          Share
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
      <Title level={2}>Certificates Issued</Title>

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
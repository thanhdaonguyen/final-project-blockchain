package data

type CertificateOutput struct {
	CertHash            string `json:"certHash"`
	CertUUID            string `json:"certUUID"`
	StudentPublicKey    string `json:"studentPublicKey"`
	UniversityPublicKey string `json:"universityPublicKey"`
	DateOfIssuing       string `json:"dateOfIssuing"`
}

type CertificateOutputFull struct {
	CertificateOutput
	Base64File string `json:"base64File"`
}

// Certificate as stored in the blockchain
type BlockchainCertificateOutput struct {
	CertHash            string `json:"certHash"`
	UniversitySignature string `json:"universitySignature"`
	StudentSignature    string `json:"studentSignature"`
	DateOfIssuing       string `json:"dateOfIssuing"`
	CertUUID            string `json:"certUUID"`
	UniversityPublicKey string `json:"universityPK"`
	StudentPublicKey    string `json:"studentPK"`
}

// Certificate file upload from university
type CertificateFileUpload struct {
	StudentPublicKey               string `json:"studentPublicKey"`
	UniversityName   string `json:"universityName"`
	DateOfIssuing string `json:"dateOfIssuing"`
	EncodedFile        string `json:"encodedFile"`
}

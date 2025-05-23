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
	CertUUID            string `json:"certUUID"`
	UniversityName      string `json:"universityName"`
	DateOfIssue         string `json:"dateOfIssue"`
	EncodedFile         string `json:"encodedFile"`
	UniversitySignature string `json:"universitySignature"`
	StudentSignature    string `json:"studentSignature"`
	StudentPublicKey    string `json:"studentPublicKey"`
	IsOnChain           bool   `json:"isOnChain"`
}



type CertificateFileOutput struct {
	CertUUID            string `json:"cert_uuid"`
	StudentPublicKey	string `json:"student_public_key"`
	UniversityName		string `json:"university_name"`
	UniversityPublicKey string `json:"university_public_key`
	PlantextFileData	string `json:"plain_text_file_data"`
	IsOnChain           bool   `json:"is_on_chain"`
}

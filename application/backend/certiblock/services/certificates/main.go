package certificates

import (
	"CertiBlock/application/backend/certiblock/base"
	"CertiBlock/application/backend/certiblock/base/data"
	educert "CertiBlock/application/backend/gateway"
	"encoding/json"
)

func GetAllCertificatesByStudent(context *base.ApplicationContext, studentPublicKeyString string) (*[]data.BlockchainCertificateOutput, error) {


	result, err := educert.GetAllCertificatesByStudent(context.Contract, studentPublicKeyString)
	if err != nil {
		return nil, err
	}

	if len(result) == 0 {
		list := []data.BlockchainCertificateOutput{}
		return &list, nil
	}

	var certificates []data.BlockchainCertificateOutput
	err = json.Unmarshal([]byte(result), &certificates)
	if err != nil {
		return nil, err
	}

	var output []data.BlockchainCertificateOutput
	for _, cert := range certificates {
		output = append(output, data.BlockchainCertificateOutput{
			CertHash:            cert.CertHash,
			CertUUID:            cert.CertUUID,
			StudentPublicKey:    cert.StudentPublicKey,
			UniversityPublicKey: cert.UniversityPublicKey,
			DateOfIssuing:       cert.DateOfIssuing,
			UniversitySignature: cert.UniversitySignature,
			StudentSignature:    cert.StudentSignature,
			
		})
	}

	return &output, nil
}





func GetOneCertificate(context *base.ApplicationContext, studentPrivateKeyString string, certUUID string) (*data.OneCertificateOutputFull, error) {
	

	row := context.DB.QueryRow("SELECT `uuid`, `student_public_key`, `university_name`, `university_public_key`, `date_of_issue`, `student_signature`, `university_signature`, `plain_text_file_data` FROM certificates2 WHERE uuid = ?", certUUID)
	if row.Err() != nil {
		return nil, row.Err()
	}
	
	certificate := data.OneCertificateOutputFull{}
	err := row.Scan(&certificate.CertUUID, &certificate.StudentPublicKey, &certificate.UniversityName, &certificate.UniversityPublicKey, &certificate.DateOfIssue, &certificate.StudentSignature, &certificate.UniversitySignature, &certificate.PlantextFileData)
	if err != nil {
		return nil, err
	}

	return &certificate, nil
}


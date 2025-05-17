package universities

import (
	"CertiBlock/application/backend/certiblock/base"
	"CertiBlock/application/backend/certiblock/base/data"
	"CertiBlock/application/shared/utils"
	"fmt"
	"errors"
)

func SaveCertificateFile(context *base.ApplicationContext, fileUpload *data.CertificateFileUpload) (*string, error) {
	universityPrivateKey := fileUpload.UniversityPrivateKey
	/*universityPublicKey*/ _, err := utils.ComputePublicKeyString(universityPrivateKey)
	if err != nil {
		return nil, fmt.Errorf("error computing public key: %w", err)
	}

	_, err = context.DB.Exec(
		"INSERT INTO certificates (uuid, university_encrypted_ks_1, university_encrypted_ks_2, student_encrypted_ks_1, student_encrypted_ks_2, ks_encrypted_file) VALUES (?, ?, ?, ?, ?, ?)",
		fileUpload.CertUUID,
		fileUpload.UniversityEncryptedKS1,
		fileUpload.UniversityEncryptedKS2,
		fileUpload.StudentEncryptedKS1,
		fileUpload.StudentEncryptedKS2,
		fileUpload.KSEncryptedFile,
	)
	if err != nil {
		return nil, fmt.Errorf("error inserting cert file: %w", err)
	}

	return nil, nil
}


func SaveUniversity(context *base.ApplicationContext, UniversityInput *data.UniversityInput) (*data.UniversityOutput, error) {
	privateKeyUniv := utils.HashSHA512(UniversityInput.Name+UniversityInput.Password+UniversityInput.Location+UniversityInput.Description)

	publicKeyUniv, err := utils.ComputePublicKeyString(privateKeyUniv)
	if err != nil {
		return nil, fmt.Errorf("error computing public key of Univ: %w", err)
	}

	row := context.DB.QueryRow("SELECT public_key FROM universities WHERE public_key = ?", publicKeyUniv)
	var existingPublicKey string
	err = row.Scan(&existingPublicKey)
	if err == nil {
		return nil, errors.New("University already registered")
	}


	_, err = context.DB.Exec(
		"INSERT INTO universities (name_university, public_key, private_key, location_university, description_university) VALUES (?, ?, ?, ?, ?)",
		UniversityInput.Name,
		publicKeyUniv,
		privateKeyUniv,
		UniversityInput.Location,
		UniversityInput.Description,
	)
	if err != nil {
		return nil, fmt.Errorf("error inserting university: %w", err)
	}

	return &data.UniversityOutput{
		Name: UniversityInput.Name,
		PrivateKey: privateKeyUniv,
		PublicKey:  publicKeyUniv,
	}, nil
}
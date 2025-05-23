package universities

import (
	"CertiBlock/application/backend/certiblock/base"
	"CertiBlock/application/backend/certiblock/base/data"
	"CertiBlock/application/shared/utils"
	"fmt"
	"errors"
	"github.com/google/uuid"
)

func SaveCertificateFile(context *base.ApplicationContext, fileUpload *data.CertificateFileUpload) (*string, error) {
	var universityPublicKey string
	err := context.DB.QueryRow(
		"SELECT public_key FROM universities WHERE name_university = ?",
		fileUpload.UniversityName,
	).Scan(&universityPublicKey)
	if err != nil {
		return nil, fmt.Errorf("error computing public key: %w", err)
	}

	certUUID := uuid.NewString();

	ks := utils.GenerateSecureRandomString(64)

	studentEncryptedKS1, studentEncryptedKS2, err := utils.ElGamalEncryptString(fileUpload.StudentPublicKey, ks)
	if err != nil {
		return nil, fmt.Errorf("failed to encrypt KS using student public key: %w", err)
	}
	
	universityEncryptedKS1, universityEncryptedKS2, err := utils.ElGamalEncryptString(universityPublicKey, ks)
	if err != nil {
		return nil, fmt.Errorf("failed to encrypt KS using university public key: %w", err)
	}
	
	ksEncryptedFile, err := utils.VigenereEncryptString(ks, fileUpload.EncodedFile)
	if err != nil {
		return nil, errors.New("failed to encrypt file using KS")
	}

	encryptedFileSize := len(ksEncryptedFile)
	fmt.Printf("Encrypted file size: %d\n", encryptedFileSize)
	if encryptedFileSize > 66386403 {
		return nil, errors.New("file too large. Maximum size is about 26MB (MySQL limitation)")
	}

	_, err = context.DB.Exec(
		"INSERT INTO certificates (uuid, university_encrypted_ks_1, university_encrypted_ks_2, student_encrypted_ks_1, student_encrypted_ks_2, ks_encrypted_file) VALUES (?, ?, ?, ?, ?, ?)",
		certUUID,
		universityEncryptedKS1,
		universityEncryptedKS2,
		studentEncryptedKS1,
		studentEncryptedKS2,
		ksEncryptedFile,
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
package universities

import (
	"CertiBlock/application/backend/certiblock/base"
	"CertiBlock/application/backend/certiblock/base/data"
	"CertiBlock/application/shared/utils"
	"CertiBlock/application/backend/gateway"
	"fmt"
	"errors"
	// "github.com/google/uuid"
)

func SaveCertificateFile(context *base.ApplicationContext, fileUpload *data.CertificateFileUpload) (*string, error) {
	// var universityPublicKey string
	// err := context.DB.QueryRow(
	// 	"SELECT public_key FROM universities WHERE name_university = ?",
	// 	fileUpload.UniversityName,
	// ).Scan(&universityPublicKey)
	// if err != nil {
	// 	return nil, fmt.Errorf("error finding public key: %w", err)
	// }

	universityPublicKey := "uniPubKey"

	isOnChain := true

	_, err := context.DB.Exec(
		"INSERT INTO certificates2 (uuid, university_name, date_of_issue, plain_text_file_data, university_signature, student_signature, student_public_key, university_public_key, is_on_chain) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
		fileUpload.CertUUID,
		fileUpload.UniversityName,
		fileUpload.DateOfIssue,
		fileUpload.EncodedFile,
		fileUpload.UniversitySignature,
		fileUpload.StudentSignature,
		fileUpload.StudentPublicKey,
		universityPublicKey,
		isOnChain,
	)

	if err != nil {
		return nil, fmt.Errorf("error inserting cert file: %w", err)
	}

	return nil, nil
}

func GetCertificatesOnChain(context *base.ApplicationContext) ([]data.CertificateFileOutput, error) {

	query := `
	SELECT uuid, student_public_key, university_name, university_public_key, plain_text_file_data, is_on_chain
	FROM certificates2
	WHERE is_on_chain = 1
	`

	rows, err := context.DB.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query certificates: %w", err)
	}
	defer rows.Close()

	var results []data.CertificateFileOutput
	for rows.Next() {
		var cert data.CertificateFileOutput
		err := rows.Scan(
			&cert.CertUUID,
			&cert.StudentPublicKey,
			&cert.UniversityName,
			&cert.UniversityPublicKey,
			&cert.PlantextFileData,
			&cert.IsOnChain,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}

		results = append(results, cert)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows error: %w", err)
	}
	return results, nil

}

func GetCertificatesNotOnChain(context *base.ApplicationContext) ([]data.CertificateFileOutput, error) {
	query := `
	SELECT uuid, student_public_key, university_name, university_public_key, plain_text_file_data, is_on_chain
	FROM certificates2
	WHERE is_on_chain = 0
	`

	rows, err := context.DB.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query certificates: %w", err)
	}
	defer rows.Close()

	var results []data.CertificateFileOutput
	for rows.Next() {
		var cert data.CertificateFileOutput
		err := rows.Scan(
			&cert.CertUUID,
			&cert.StudentPublicKey,
			&cert.UniversityName,
			&cert.UniversityPublicKey,
			&cert.PlantextFileData,
			&cert.IsOnChain,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}

		results = append(results, cert)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows error: %w", err)
	}
	return results, nil
	
}

func SaveUniversity(context *base.ApplicationContext, UniversityInput *data.UniversityInput) (*data.UniversityOutput, error) {
	privateKeyUniv := utils.HashSHA512(UniversityInput.Name+UniversityInput.Password+UniversityInput.Location)

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

	_, err := gateway.RegisterUniversity(
		context.Contract,
		UniversityInput.Name,
		publicKeyUniv,
		UniversityInput.Location,
		"",
	)
	if err != nil {
		return nil, fmt.Errorf("failed to register university on blockchain: %w", err)
	}


	_, err = context.DB.Exec(
		"INSERT INTO universities (name_university, public_key, private_key, location_university) VALUES (?, ?, ?, ?)",
		UniversityInput.Name,
		publicKeyUniv,
		privateKeyUniv,
		UniversityInput.Location,
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

func GetAll(context *base.ApplicationContext) ([]data.University, error) {
	// query universities
	rows, err := context.DB.Query("SELECT `id`, `name_university` FROM `universities`")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// iterate over rows
	universities := []data.University{}
	for rows.Next() {
		university := data.University{}
		err := rows.Scan(&university.ID, &university.Name)
		if err != nil {
			return nil, err
		}
		universities = append(universities, university)
	}

	// return universities
	return universities, nil
}


func GetById(context *base.ApplicationContext, id int) (*data.University, error) {
	// query university
	row := context.DB.QueryRow("SELECT `id`, `name_university` FROM `universities` WHERE `id` = ?;", id)
	if row.Err() != nil {
		return nil, row.Err()
	}

	university := data.University{}
	err := row.Scan(&university.ID, &university.Name)
	if err != nil {
		return nil, err
	}

	// return university
	return &university, nil
}

func ApproveCertificateToBlockChain(context *base.ApplicationContext, cert *data.CertificateFileOutput) (string, error){
	_, err := gateway.

}
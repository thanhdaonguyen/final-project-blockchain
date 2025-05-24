package universities

import (
	"CertiBlock/application/backend/certiblock/base"
	"CertiBlock/application/backend/certiblock/base/data"
	"encoding/base64"
	gateway "CertiBlock/application/backend/gateway"
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

	isOnChain := false

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
	SELECT uuid, student_public_key, university_name, university_public_key, plain_text_file_data, is_on_chain, university_signature, student_signature, date_of_issue
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
			&cert.UniversitySignature,
			&cert.StudentSignature,
			&cert.DateOfIssue,

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

	nameUniversity := UniversityInput.Name
	passwordUniv := UniversityInput.Password
	privateKeyUniv := UniversityInput.PrivateKey
	publicKeyUniv := UniversityInput.PublicKey
	locationUniv := UniversityInput.Location
	descriptionUniv := UniversityInput.Description

	row := context.DB.QueryRow("SELECT * FROM universities WHERE nameUniversity = ? AND passwordUniv = ?", publicKeyUniv, passwordUniv)
	var existingPublicKey string
	err := row.Scan(&existingPublicKey)
	if err == nil {
		return nil, errors.New("University already registered")
	}

	_, err = gateway.RegisterUniversity(
		context.Contract,
		nameUniversity,
		publicKeyUniv,
		locationUniv,
		descriptionUniv,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to register university on blockchain: %w", err)
	}


	_, err = context.DB.Exec(
		"INSERT INTO universities (name_university, password, public_key, private_key, location_university, description_university) VALUES (?, ?, ?, ?, ?, ?)",
		nameUniversity,
		passwordUniv,
		publicKeyUniv,
		privateKeyUniv,
		locationUniv,
		descriptionUniv,
	)
	if err != nil {
		return nil, fmt.Errorf("error inserting university: %w", err)
	}

	return &data.UniversityOutput{
		Name: nameUniversity,
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

func ApproveCertificateToBlockChain(context *base.ApplicationContext, cert *data.BlockchainCertificateOutput) (string, error){

	fmt.Println("studentPublicKey", cert.StudentPublicKey)
	fmt.Println("universityPublicKey", cert.UniversityPublicKey)
	base64StudentPublicKey := base64.StdEncoding.EncodeToString([]byte(cert.StudentPublicKey))
	fmt.Println("base64StudentPublicKey", base64StudentPublicKey)
	_, err := gateway.IssueCertificate(
		context.Contract,
		cert.CertHash,
		cert.UniversitySignature,
		cert.StudentSignature,
		cert.DateOfIssuing,
		cert.CertUUID,
		cert.UniversityPublicKey,
		base64StudentPublicKey,
	)
	if err != nil {
		return "", err
	}

	// fmt.Println("cert.CertUUID", cert.CertUUID)
	// fmt.Println("cert.UniversitySignature", cert.UniversitySignature)
	// fmt.Println("cert.StudentSignature", cert.StudentSignature)
	// fmt.Println("cert.DateOfIssuing", cert.DateOfIssuing)
	// fmt.Println("cert.UniversityPublicKey", cert.UniversityPublicKey)
	// fmt.Println("cert.StudentPublicKey", cert.StudentPublicKey)
	// fmt.Println("cert.CertHash", cert.CertHash)
	// fmt.Println("cert.DateOfIssuing", cert.DateOfIssuing)

	_, err = context.DB.Exec("UPDATE certiblock.certificates2 SET is_on_chain = 1, university_signature = ?, university_public_key = ? WHERE uuid = ?", cert.UniversitySignature, cert.UniversityPublicKey, cert.CertUUID)
	if err != nil {
		return "", err
	}


	return "", nil
}


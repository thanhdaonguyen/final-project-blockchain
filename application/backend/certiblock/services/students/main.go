package students

import (
	"CertiBlock/application/backend/certiblock/base"
	"CertiBlock/application/backend/certiblock/base/data"
	"CertiBlock/application/backend/certiblock/services/countries"
	// "CertiBlock/application/shared/utils"
	"fmt"

	"errors"
)

    

func RegisterStudent(context *base.ApplicationContext, studentInput *data.StudentInput) (*data.StudentOutput, error) {
	country, err := countries.GetById(context, studentInput.CountryID)
	if err != nil || country == nil {
		return nil, errors.New("country not found")
	}

	
	nin := studentInput.NIN
	countryID := studentInput.CountryID
	privateKey := studentInput.PrivateKey
	publicKey := studentInput.PublicKey
	dateOfBirth := studentInput.DateOfBirth
	fullName := studentInput.FullName
	password := studentInput.Password


	row := context.DB.QueryRow("SELECT nin FROM students WHERE public_key = ?", nin)
	var existingNin string
	err = row.Scan(&existingNin)
	if err == nil {
		return nil, errors.New("student already registered")
	}

	_, err = context.DB.Exec(
		"INSERT INTO students (nin, country_id, date_of_birth, full_name, password, private_key, public_key) VALUES (?, ?, ?, ?, ?, ?, ?)",
		nin,
		countryID,
		dateOfBirth,
		fullName,
		password,
		privateKey,
		publicKey,

	)
	if err != nil {
		return nil, fmt.Errorf("error inserting student: %w", err)
	}

	return &data.StudentOutput{
		PrivateKey: privateKey,
		PublicKey:  publicKey,
		FullName:   studentInput.FullName,
	}, nil
}



package blockchain

import (
	"CertiBlock/application/backend/certiblock/base"

	educert "CertiBlock/application/backend/gateway"

	"encoding/json"
)

func GetAllFromBlockchain(context *base.ApplicationContext) (*[]any, error) {
	result, err := educert.QueryAllCertificates(context.Contract)
	if err != nil {
		return nil, err
	}

	if len(result) == 0 {
		empty := []any{}
		return &empty, nil
	}

	var certificates []any
	err = json.Unmarshal([]byte(result), &certificates)
	if err != nil {
		return nil, err
	}

	// Convert []BlockchainCertificateOutput to []any
	output := make([]any, len(certificates))
	for i, cert := range certificates {
		output[i] = cert
	}

	return &output, nil
}

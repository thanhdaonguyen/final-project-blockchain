package data

type UniversityInput struct {
	Name   string    `json:"name"`
	Password    string `json:"password"`
	Location    string `json:"location"`
	Description string `json:"description"`
}

type UniversityOutput struct {
	Name string `json:"name"`
	PrivateKey string `json:"privateKey"`
	PublicKey  string `json:"publicKey"`
}


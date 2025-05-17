// package main

// import (
// 	"context"
// 	"fmt"

// 	"github.com/hyperledger/fabric-gateway/pkg/client"
// 	"google.golang.org/grpc"
// )
// // App struct
// type App struct {
// 	ctx context.Context
// 	gw      *client.Gateway
// 	conn    *grpc.ClientConn
// 	contract *client.Contract
// }

// // NewApp creates a new App application struct
// func NewApp() *App {
// 	return &App{}
// }

// // startup is called when the app starts. The context is saved
// // so we can call the runtime methods
// func (a *App) startup(ctx context.Context) {
// 	a.ctx = ctx
// }

// // Greet returns a greeting for the given name
// func (a *App) Greet(name string) string {
// 	return fmt.Sprintf("Hello %s, It's show time!", name)
// }

// func (a *App) Connect() {
// 	var err error
// 	a.gw, a.conn, err = NewGateway()
// 	if err != nil {
// 		panic(fmt.Errorf("failed to initialize gateway: %w", err))
// 	}
// 	network := a.gw.GetNetwork("mychannel")
// 	a.contract = network.GetContract("certicontract")
// }

// func (a *App) InitLedger(){
// 		// Khởi tạo ledger
// 	result, err := InitLedger(a.contract)
// 	if err != nil {
// 		fmt.Printf("Failed to initialize ledger: %v\n", err)
// 		return
// 	}
// 	fmt.Println("Ledger initialized:", result)
// }

// func (a *App) GetAll() string{
// 	result := QueryAllCertificates(a.ctx, a.contract)
// 	return result
// }

package main

import (
	"CertiBlock/application/shared/utils"
	"bytes"
	"context"
	// "encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	// "os"

	// "github.com/wailsapp/wails/v2/pkg/runtime"

	"github.com/gin-gonic/gin"
	// "github.com/google/uuid"
	"github.com/hyperledger/fabric-gateway/pkg/client"
	"google.golang.org/grpc"
	// "CertiBlock/application/backend/certiblock/base"
	// "CertiBlock/application/backend/certiblock/services/database"
	// "CertiBlock/application/backend/certiblock/configurations"
	// "CertiBlock/application/backend/certiblock/services/universities"
	// "CertiBlock/application/backend/certiblock/base/data"
)

// App struct
type App struct {
	ctx      context.Context
	gw       *client.Gateway
	conn     *grpc.ClientConn
	contract *client.Contract
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// Startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

// Shutdown closes the Gateway and gRPC connections
func (a *App) Shutdown() string {
	if a.gw != nil {
		a.gw.Close()
	}
	if a.conn != nil {
		a.conn.Close()
	}

	return "Disconnected from Fabric Gateway"
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// Connect establishes a connection to the Fabric Gateway
func (a *App) Connect() string {
	var err error
	a.gw, a.conn, err = NewGateway()
	if err != nil {
		return fmt.Sprintf("Error: Failed to initialize gateway: %v", err)
	}
	network := a.gw.GetNetwork("mychannel")
	a.contract = network.GetContract("certicontract")
	return "Connected to Fabric Gateway and chaincode 'certicontract' on channel 'mychannel'"
}


// RegisterUniversity registers a new university
func (a *App) RegisterUniversity(universityName, universityPassword, universityLocation, universityDescription string) string {
	// input := &data.UniversityInput{
	// 	Name:        name,
	// 	Password:    password,
	// 	Location:    location,
	// 	Description: description,
	// }
	// result, err := universities.RegisterUniversity(a.backendContext, input)
	// if err != nil {
	// 	return fmt.Sprintf("Error: Failed to register university: %v", err)
	// }

	// return fmt.Sprintf("University registered successfully!\nPublic Key: %s\nPrivate Key: %s", result.PublicKey, result.PrivateKey)


	// return fmt.Sprintf("University registered successfully: %s", result)

	privateKeyUniv := utils.HashSHA512(universityName+universityPassword+universityLocation+universityDescription)
	// if err != nil {
	// 	return fmt.Sprintf("Error: Failed to hash private key of university: %v", err)
	// }
	fmt.Println("EEEE1")

	publicKeyUniv, err := utils.ComputePublicKeyString(privateKeyUniv)
	if err != nil {
		return fmt.Sprintf("Error: Failed to compute public key of university: %v", err)
	}
	fmt.Println("EEEE2")

	payload := gin.H{
		"name": universityName,
		"password" : universityPassword,
		"location": universityLocation,
		"description": universityDescription,
	}
	jsonPayload, err := json.Marshal(payload)
	fmt.Println("EEEE3")
	if err != nil{
		return fmt.Sprintf("Error: Failed to marshal payload: %v", err)
	}

	fmt.Println("HERE")

	backendServerUrl := "http://localhost:3000"

	fmt.Println("Request URL:", backendServerUrl+"/api/universities/register")
	res, err := http.Post(backendServerUrl+"/api/universities/register", "application/json", bytes.NewBuffer(jsonPayload))
	if err != nil {
		return fmt.Sprintf("Error: Failed to save file to backend: %v", err)
	}
	defer res.Body.Close()

	fmt.Println("HERE2")

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return fmt.Sprintf("Error: Failed to read response body: %v", err)
	}

	fmt.Println("HERE3")

	if res.StatusCode != http.StatusOK && res.StatusCode != http.StatusCreated {
		return fmt.Sprintf("Error: Failed to save file to backend: %s", string(body))
	}

	fmt.Println("HERE4")

	result, err := RegisterUniversity(a.contract, universityName, publicKeyUniv, universityLocation, universityDescription)
	if err != nil {
		return fmt.Sprintf("Error: Failed to register university: %v", err)
	}
	fmt.Println("EEEE4")

	return fmt.Sprintf("University registered successfully:\n%s\n\nUniversity Public Key:%s\nUniversity Private Key:%s\n", result, publicKeyUniv, privateKeyUniv)
}

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
	// "CertiBlock/application/shared/utils"
	// "bytes"
	"context"
	// "encoding/base64"
	// "encoding/json"
	"fmt"
	// "io"
	// "net/http"
	// "os"

	// "github.com/wailsapp/wails/v2/pkg/runtime"

	// "github.com/gin-gonic/gin"
	// "github.com/google/uuid"
	"github.com/hyperledger/fabric-gateway/pkg/client"
	"google.golang.org/grpc"
	"CertiBlock/application/backend/certiblock/base"
	"CertiBlock/application/backend/certiblock/services/database"
	"CertiBlock/application/backend/certiblock/configurations"
	"CertiBlock/application/backend/certiblock/services/universities"
	"CertiBlock/application/backend/certiblock/base/data"
)

// App struct
type App struct {
	ctx      context.Context
	gw       *client.Gateway
	conn     *grpc.ClientConn
	contract *client.Contract
	backendContext *base.ApplicationContext
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// Startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx

	var err error
	appContext := &base.ApplicationContext{}

	appContext.Config, err = configurations.Load()
	if err != nil {
		panic(err)
	}

	err = database.InitConnection(appContext)
	if err != nil {
		panic(err)
	}

	a.backendContext = appContext
}

// Shutdown closes the Gateway and gRPC connections
func (a *App) Shutdown() string {
	if a.gw != nil {
		a.gw.Close()
	}
	if a.conn != nil {
		a.conn.Close()
	}
	if a.backendContext != nil && a.backendContext.DB != nil {
		a.backendContext.DB.Close()
	}
	return "Disconnected from Fabric Gateway and database"

	// return "Disconnected from Fabric Gateway"
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
func (a *App) RegisterUniversity(name, password, location, description string) string {
	input := &data.UniversityInput{
		Name:        name,
		Password:    password,
		Location:    location,
		Description: description,
	}
	result, err := universities.RegisterUniversity(a.backendContext, input)
	if err != nil {
		return fmt.Sprintf("Error: Failed to register university: %v", err)
	}

	return fmt.Sprintf("University registered successfully!\nPublic Key: %s\nPrivate Key: %s", result.PublicKey, result.PrivateKey)


	// return fmt.Sprintf("University registered successfully: %s", result)
}

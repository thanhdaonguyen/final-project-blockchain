package main

import (
    "CertiBlock/chaincode/educert"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

func main() {
    // This line creates a new instance of the chaincode using the contractapi.NewChaincode function. The educert.SmartContract{} is passed as an argument, which is a struct that implements the required methods for a Fabric smart contract (e.g., InitLedger, Invoke, etc.).
    chaincode, err := contractapi.NewChaincode(&educert.SmartContract{})
    if err != nil {
        panic("Error creating educert chaincode: " + err.Error())
    }

    // This line starts the chaincode, making it ready to handle requests from the Fabric network. The Start method sets up the chaincode's communication with the peer node and registers it with the Fabric runtime.
    if err := chaincode.Start(); err != nil {
        panic("Error starting educert chaincode: " + err.Error())
    }
}
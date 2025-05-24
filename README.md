# CertiBlock

A blockchain platform for decentralized, trustworthy issuance and verification of certificates worldwide.

- [CertiBlock](#certiblock)
  - [Run on Local Machine](#run-on-local-machine)
    - [Requirements](#requirements)
    - [Setup Network](#setup-network)
    - [Run Applications](#run-applications)
      - [Backend Service](#the-backend-for-handling-web-services-and-connect-to-blockchain)
      - [Student Interface](#the-student-interface-for-viewing-personal-certificates-and-issuing-new-certificates)
      - [University Interface](#the-university-interface-for-examing-requests-from-students-to-acknowledge-digital-certificates)
      - [Verifier Web App](#the-web-app-for-verifying-certificates-by-qr-codes)
  - [Technologies](#technologies)

## Run on Local Machine

### Requirements

- **A Linux-based system.** On Windows, use WSL2.
- **Install Go.** One way to do that is as follows:

    ```sh
    wget https://go.dev/dl/go1.24.1.linux-amd64.tar.gz
    sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.24.1.linux-amd64.tar.gz
    echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
    source ~/.bashrc
    ```

- **Install Wails:** <https://wails.io/docs/gettingstarted/installation>
- **Install Fabric:**
    - Get the install script:

        ```sh
        curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh
        ```

    - Install bin and docker components:

        ```sh
        ./install-fabric.sh docker binary
        ```

### Setup Network

In project root:

```sh
cd network
./network.sh up createChannel -ca -c mychannel -s couchdb
./network.sh deployCC -ccn certicontract -ccp ../application/backend/chaincode -ccv 1 -ccl go
```

In case one of the above commands fails, you might want to try
**deleting all Docker containers, volumes and networks.** (this
is dangerous so proceed with caution.) Still in that `network`
directory, run:

```sh
./delete-all-docker-containers-volumes-and-networks.sh
```

### Run Applications

#### The Backend for handling Web services and connect to Blockchain.

```
cd application/backend/certiblock
./run
```

#### The Student Interface for Viewing Personal Certificates and Issuing New Certificates

```sh
cd application/frontend/recipient
npm install
npm run dev
```

#### The University Interface for Examing Requests from students to acknowledge digital certificates.


```sh
cd /application/frontend/registerUniversity
npm install
npm run dev
```

#### The Web App for Verifying Certificates by QR Codes

```sh
cd /application/frontend/verifier
npm install
npm run dev
```

## Technologies

CertiBlock leverages the following technologies:

- **Hyperledger Fabric**: Permissioned blockchain framework for secure, scalable certificate management.
- **Go**: Backend and smart contract (chaincode) development.
- **Node.js & npm**: Frontend development and package management.
- **React**: User interfaces for web applications.
- **Docker**: Containerization of services and network components.
- **CouchDB**: State database for Hyperledger Fabric.
- **QR Code Libraries**: For certificate verification workflows.
- **WSL2**: For running Linux-based tools on Windows environments.



    .


    |-- README.md
    |-- application --> Chứa source code cho 3 phần chính của app: backend/desktop-app/web-app
    |   |-- backend
    |   |   |-- README.md
    |   |   |-- api --> Folder này được sử dụng để test hoặc là chứa file entry của cấu trúc code cũ. có thể xoá bỏ vì không thực sự dùng đến.
    |   |   |-- certiblock --> Nơi chứa source code chạy server.
    |   |   |   |-- base --> Định nghĩa ra các struct dữ liệu sẽ sử dụng để API thao tác với application. Dùng trong 'controllers', 'main'; Định nghĩa ra struct ApplicationContext, để cho các handler thao tác với DB, contract, configurations.
    |   |   |   |-- configurations --> Định nghĩa ra các struct dữ liệu dùng cho việc set up DB. Dùng trong 'main'.
    |   |   |   |-- controllers --> 
    |   |   |   |-- docs
    |   |   |   |-- main.go
    |   |   |   |-- run
    |   |   |   `-- services
    |   |   |-- chaincode --> Nơi chứa sourcecode định nghĩa chaincode.
    |   |   |-- gateway --> Nơi định nghĩa ra các thao tác gateway: app --> gateway --> network --> chaincode --> transaction. Sẽ được sử dụng bởi certiblock và api
    |   |   `-- main.go --> Nhiệm vụ duy nhất là định nghĩa ra package 'backend'
    |   |-- frontend
    |   |   |-- README.md --> 
    |   |   |-- issuer
    |   |   |-- recipient
    |   |   `-- verifier
    |   |-- keygen
    |   |   |-- main.go
    |   |   |-- student.json
    |   |   `-- university.txt
    |   |-- nodeapp
    |   |   |-- README.md
    |   |   |-- app.go
    |   |   |-- build
    |   |   |-- frontend
    |   |   |-- gateway.go
    |   |   |-- main.go
    |   |   `-- wails.json
    |   `-- shared
    |       |-- main.go
    |       `-- utils
    |-- bin
    |-- builders
    |-- config --> Các file config xử dụng cho các mục đích khác nhau
    |   |-- configtx.yaml
    |   |-- core.yaml
    |   `-- orderer.yaml
    |-- go.mod
    |-- go.sum
    |-- install-fabric.sh
    |-- network
    |   |-- addOrg3
    |   |   |-- README.md
    |   |   |-- addOrg3.sh
    |   |   |-- ccp-generate.sh
    |   |   |-- ccp-template.json
    |   |   |-- ccp-template.yaml
    |   |   |-- compose
    |   |   |-- configtx.yaml
    |   |   |-- fabric-ca
    |   |   |-- log.txt
    |   |   `-- org3-crypto.yaml
    |   |-- addOrg4
    |   |   |-- README.md
    |   |   |-- addOrg4.sh
    |   |   |-- ccp-generate.sh
    |   |   |-- ccp-template.json
    |   |   |-- ccp-template.yaml
    |   |   |-- compose
    |   |   |-- configtx.yaml
    |   |   |-- fabric-ca
    |   |   |-- log.txt
    |   |   `-- org4-crypto.yaml
    |   |-- certicontract.tar.gz
    |   |-- channel-artifacts
    |   |   |-- HUSMSPanchors.tx
    |   |   |-- HUSMSPconfig.json
    |   |   |-- HUSMSPmodified_config.json
    |   |   |-- Org3MSPanchors.tx
    |   |   |-- Org3MSPconfig.json
    |   |   |-- Org3MSPmodified_config.json
    |   |   |-- UETMSPanchors.tx
    |   |   |-- UETMSPconfig.json
    |   |   |-- UETMSPmodified_config.json
    |   |   |-- config.json
    |   |   |-- config_block.json
    |   |   |-- config_block.pb
    |   |   |-- config_update.json
    |   |   |-- config_update.pb
    |   |   |-- config_update_in_envelope.json
    |   |   |-- modified_config.json
    |   |   |-- modified_config.pb
    |   |   |-- mychannel.block
    |   |   |-- org3_update_in_envelope.pb
    |   |   `-- original_config.pb
    |   |-- compose
    |   |   |-- compose-bft-test-net.yaml
    |   |   |-- compose-ca.yaml
    |   |   |-- compose-couch.yaml
    |   |   |-- compose-test-net.yaml
    |   |   `-- docker
    |   |-- configtx
    |   |   `-- configtx.yaml
    |   |-- delete-all-docker-containers-volumes-and-networks.sh
    |   |-- log.txt
    |   |-- monitordocker.sh
    |   |-- network.config
    |   |-- network.sh
    |   |-- organizations
    |   |   |-- ccp-generate.sh
    |   |   |-- ccp-template.json
    |   |   |-- ccp-template.yaml
    |   |   |-- cfssl
    |   |   |-- cryptogen
    |   |   |-- fabric-ca
    |   |   |-- ordererOrganizations
    |   |   `-- peerOrganizations
    |   |-- scripts
    |   |   |-- add_new_orderer_to_config.py
    |   |   |-- ccutils.sh
    |   |   |-- configUpdate.sh
    |   |   |-- createChannel.sh
    |   |   |-- deployCC.sh
    |   |   |-- deployCCAAS.sh
    |   |   |-- envVar.sh
    |   |   |-- orderer.sh
    |   |   |-- orderer2.sh
    |   |   |-- orderer3.sh
    |   |   |-- orderer4.sh
    |   |   |-- org3-scripts
    |   |   |-- org4-scripts
    |   |   |-- packageCC.sh
    |   |   |-- pkgcc.sh
    |   |   |-- setAnchorPeer.sh
    |   |   `-- utils.sh
    |   |-- setOrgEnv.sh
    |   `-- system-genesis-block
    |-- note-on-source-code.md
    `-- test-scripts.txt








|-- README.md
|-- application
|   |-- backend
|   |   |-- README.md
|   |   |-- api
|   |   |   `-- main.go
|   |   |-- certiblock
|   |   |   |-- README.md
|   |   |   |-- base
|   |   |   |-- configurations
|   |   |   |-- controllers
|   |   |   |-- docs
|   |   |   |-- main.go
|   |   |   |-- run
|   |   |   `-- services
|   |   |-- chaincode
|   |   |   |-- META-INF
|   |   |   |-- educert
|   |   |   |-- educert.go
|   |   |   |-- go.mod
|   |   |   |-- go.sum
|   |   |   `-- vendor
|   |   |-- gateway
|   |   |   `-- educert.go
|   |   `-- main.go
|   |-- frontend
|   |   |-- README.md
|   |   |-- issuer
|   |   |   |-- README.md
|   |   |   |-- app
|   |   |   |-- eslint.config.mjs
|   |   |   |-- next-env.d.ts
|   |   |   |-- next.config.ts
|   |   |   |-- node_modules
|   |   |   |-- package-lock.json
|   |   |   |-- package.json
|   |   |   |-- postcss.config.mjs
|   |   |   |-- public
|   |   |   `-- tsconfig.json
|   |   |-- recipient
|   |   |   |-- README.md
|   |   |   |-- app
|   |   |   |-- components
|   |   |   |-- eslint.config.mjs
|   |   |   |-- next-env.d.ts
|   |   |   |-- next.config.mjs
|   |   |   |-- node_modules
|   |   |   |-- package-lock.json
|   |   |   |-- package.json
|   |   |   |-- postcss.config.mjs
|   |   |   |-- public
|   |   |   |-- tsconfig.json
|   |   |   `-- utils
|   |   `-- verifier
|   |       |-- README.md
|   |       |-- app
|   |       |-- eslint.config.mjs
|   |       |-- next-env.d.ts
|   |       |-- next.config.ts
|   |       |-- node_modules
|   |       |-- package-lock.json
|   |       |-- package.json
|   |       |-- postcss.config.mjs
|   |       |-- public
|   |       `-- tsconfig.json
|   |-- keygen
|   |   |-- main.go
|   |   |-- student.json
|   |   `-- university.txt
|   |-- nodeapp
|   |   |-- README.md
|   |   |-- app.go
|   |   |-- build
|   |   |   |-- README.md
|   |   |   |-- appicon.png
|   |   |   |-- bin
|   |   |   |-- darwin
|   |   |   `-- windows
|   |   |-- frontend
|   |   |   |-- dist
|   |   |   |-- index.html
|   |   |   |-- node_modules
|   |   |   |-- package-lock.json
|   |   |   |-- package.json
|   |   |   |-- package.json.md5
|   |   |   |-- src
|   |   |   |-- vite.config.js
|   |   |   `-- wailsjs
|   |   |-- gateway.go
|   |   |-- main.go
|   |   `-- wails.json
|   `-- shared
|       |-- main.go
|       `-- utils
|           `-- pubpri.go
|-- bin
|   |-- configtxgen
|   |-- configtxlator
|   |-- cryptogen
|   |-- discover
|   |-- fabric-ca-client
|   |-- fabric-ca-server
|   |-- ledgerutil
|   |-- orderer
|   |-- osnadmin
|   `-- peer
|-- builders
|   `-- ccaas
|       `-- bin
|           |-- build
|           |-- detect
|           `-- release
|-- config
|   |-- configtx.yaml
|   |-- core.yaml
|   `-- orderer.yaml
|-- go.mod
|-- go.sum
|-- install-fabric.sh
|-- network
|   |-- addOrg3
|   |   |-- README.md
|   |   |-- addOrg3.sh
|   |   |-- ccp-generate.sh
|   |   |-- ccp-template.json
|   |   |-- ccp-template.yaml
|   |   |-- compose
|   |   |   |-- compose-ca-org3.yaml
|   |   |   |-- compose-couch-org3.yaml
|   |   |   |-- compose-org3.yaml
|   |   |   |-- docker
|   |   |   `-- podman
|   |   |-- configtx.yaml
|   |   |-- fabric-ca
|   |   |   |-- org3
|   |   |   `-- registerEnroll.sh
|   |   |-- log.txt
|   |   `-- org3-crypto.yaml
|   |-- addOrg4
|   |   |-- README.md
|   |   |-- addOrg4.sh
|   |   |-- ccp-generate.sh
|   |   |-- ccp-template.json
|   |   |-- ccp-template.yaml
|   |   |-- compose
|   |   |   |-- compose-ca-org4.yaml
|   |   |   |-- compose-couch-org4.yaml
|   |   |   |-- compose-org4.yaml
|   |   |   |-- docker
|   |   |   `-- podman
|   |   |-- configtx.yaml
|   |   |-- fabric-ca
|   |   |   |-- org4
|   |   |   `-- registerEnroll.sh
|   |   |-- log.txt
|   |   `-- org4-crypto.yaml
|   |-- certicontract.tar.gz
|   |-- channel-artifacts
|   |   |-- HUSMSPanchors.tx
|   |   |-- HUSMSPconfig.json
|   |   |-- HUSMSPmodified_config.json
|   |   |-- UETMSPanchors.tx
|   |   |-- UETMSPconfig.json
|   |   |-- UETMSPmodified_config.json
|   |   |-- config_block.json
|   |   |-- config_block.pb
|   |   |-- config_update.json
|   |   |-- config_update.pb
|   |   |-- config_update_in_envelope.json
|   |   |-- modified_config.pb
|   |   |-- mychannel.block
|   |   `-- original_config.pb
|   |-- compose
|   |   |-- compose-bft-test-net.yaml
|   |   |-- compose-ca.yaml
|   |   |-- compose-couch.yaml
|   |   |-- compose-test-net.yaml
|   |   `-- docker
|   |       |-- docker-compose-bft-test-net.yaml
|   |       |-- docker-compose-ca.yaml
|   |       |-- docker-compose-couch.yaml
|   |       |-- docker-compose-test-net.yaml
|   |       `-- peercfg
|   |-- configtx
|   |   `-- configtx.yaml
|   |-- delete-all-docker-containers-volumes-and-networks.sh
|   |-- log.txt
|   |-- monitordocker.sh
|   |-- network.config
|   |-- network.sh
|   |-- organizations
|   |   |-- ccp-generate.sh
|   |   |-- ccp-template.json
|   |   |-- ccp-template.yaml
|   |   |-- cfssl
|   |   |   |-- admin-csr-template.json
|   |   |   |-- ca-orderer.json
|   |   |   |-- ca-peer.json
|   |   |   |-- cert-signing-config.json
|   |   |   |-- client-csr-template.json
|   |   |   |-- orderer-csr-template.json
|   |   |   |-- peer-csr-template.json
|   |   |   `-- registerEnroll.sh
|   |   |-- cryptogen
|   |   |   |-- crypto-config-hus.yaml
|   |   |   |-- crypto-config-orderer.yaml
|   |   |   `-- crypto-config-uet.yaml
|   |   |-- fabric-ca
|   |   |   |-- hus
|   |   |   |-- ordererOrg
|   |   |   |-- registerEnroll.sh
|   |   |   `-- uet
|   |   |-- ordererOrganizations
|   |   |   `-- example
|   |   `-- peerOrganizations
|   |       |-- hus
|   |       `-- uet
|   |-- scripts
|   |   |-- add_new_orderer_to_config.py
|   |   |-- ccutils.sh
|   |   |-- configUpdate.sh
|   |   |-- createChannel.sh
|   |   |-- deployCC.sh
|   |   |-- deployCCAAS.sh
|   |   |-- envVar.sh
|   |   |-- orderer.sh
|   |   |-- orderer2.sh
|   |   |-- orderer3.sh
|   |   |-- orderer4.sh
|   |   |-- org3-scripts
|   |   |   |-- joinChannel.sh
|   |   |   `-- updateChannelConfig.sh
|   |   |-- org4-scripts
|   |   |   |-- joinChannel.sh
|   |   |   `-- updateChannelConfig.sh
|   |   |-- packageCC.sh
|   |   |-- pkgcc.sh
|   |   |-- setAnchorPeer.sh
|   |   `-- utils.sh
|   |-- setOrgEnv.sh
|   `-- system-genesis-block
|-- note-on-source-code.md
`-- test-scripts.txt
package controllers

import (
	"CertiBlock/application/backend/certiblock/base"
	// "CertiBlock/application/backend/certiblock/base/data"
	"CertiBlock/application/backend/certiblock/services/blockchain"
	"net/http"
	// "strconv"

	"github.com/gin-gonic/gin"
)

func BlockchainAPI(context *base.ApplicationContext, r *gin.RouterGroup) {
	r.GET("/all-objects", GetAllFromBlockchain(context))

}

// GET /api/blockchain/all-objects
// @Tags blockchain
// @Summary Get all blockchain
// @Description Get all blockchain
// @Produce json
// @Failure 500 {object} gin.H
// @Router /api/blockchain/all-objects [get]
func GetAllFromBlockchain(context *base.ApplicationContext) func(c *gin.Context) {
	return func(c *gin.Context) {
		blockchain, err := blockchain.GetAllFromBlockchain(context)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, blockchain)
	}
}

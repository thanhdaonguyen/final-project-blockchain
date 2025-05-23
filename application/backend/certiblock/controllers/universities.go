package controllers

import (
	"CertiBlock/application/backend/certiblock/base"
	"CertiBlock/application/backend/certiblock/base/data"
	"CertiBlock/application/backend/certiblock/services/universities"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func UniversitiesAPI(context *base.ApplicationContext, r *gin.RouterGroup) {
	r.POST("/certificate-file", AddCertificateFile(context))
	r.POST("/register", RegisterUniversity(context))
	r.GET("/certificates/on_chain", GetCertificatesOnChain(context))
	r.GET("/certificates/not_on_chain", GetCertificatesNotOnChain(context))
	r.GET("", GetUniversities(context))
	r.GET("/:id", GetUniversityById(context))
}

// POST /api/universities/certificate-file
// @Tags universities
// @Summary Add a certificate file
// @Description Add a certificate file
// @Accept json
// @Produce json
// @Param certificateFile body data.CertificateFileUpload true "Certificate file data"
// @Success 201 {object} gin.H
// @Failure 400 {object} gin.H
// @Router /api/universities/certificate-file [post]
func AddCertificateFile(context *base.ApplicationContext) func(c *gin.Context) {
	return func(c *gin.Context) {
		var certificateFileUpload data.CertificateFileUpload
		if err := c.ShouldBindJSON(&certificateFileUpload); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		_, err := universities.SaveCertificateFile(context, &certificateFileUpload)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		c.JSON(http.StatusCreated, gin.H{})
	}
}

// POST /api/universities/register
// @Tags universities
// @Summary Register a university
// @Description Register a university
// @Accept json
// @Produce json
// @Param university body data.UniversityInput true "University registration data"
// @Success 201 {object} data.UniversityOutput
// @Failure 400 {object} gin.H
// @Router /api/universities/register [post]
func RegisterUniversity(context *base.ApplicationContext) func(c *gin.Context) {
	return func(c *gin.Context) {
		var UniversityInput data.UniversityInput

		if err := c.ShouldBindJSON(&UniversityInput); err != nil {
			c.JSON(http.StatusBadRequest, gin.H {
				"error": err.Error(),
			})
			return
		}

		university, err := universities.SaveUniversity(context, &UniversityInput)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		
		c.JSON(http.StatusCreated, university)

	}
}


// GetCertificatesOnChain godoc
// @Tags Certificates
// @Summary Lấy danh sách certificate đã được đưa lên blockchain
// @Description Trả về các chứng chỉ đã được đưa lên blockchain bởi các trường đại học
// @Produce json
// @Success 200 {array} data.CertificateFileOutput
// @Failure 500 {object} gin.H
// @Router /api/universities/certificates/on_chain [get]
func GetCertificatesOnChain(context *base.ApplicationContext) func(c *gin.Context) {
	return func(c *gin.Context) {
		certs, err := universities.GetCertificatesOnChain(context)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, certs)
	}
}

// GetCertificatesNotOnChain godoc
// @Tags Certificates
// @Summary Lấy danh sách certificate chưa được đưa lên blockchain
// @Description Trả về các chứng chỉ chưa được đưa lên blockchain bởi các trường đại học
// @Produce json
// @Success 200 {array} data.CertificateFileOutput
// @Failure 500 {object} gin.H
// @Router /api/universities/certificates/not_on_chain [get]
func GetCertificatesNotOnChain(context *base.ApplicationContext) func(c *gin.Context) {
	return func(c *gin.Context) {
		certs, err := universities.GetCertificatesNotOnChain(context)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, certs)

// GET /api/universities
// @Tags universities
// @Summary Get all universities
// @Description Get all universities
// @Produce json
// @Success 200 {array} data.University
// @Failure 500 {object} gin.H
// @Router /api/universities [get]
func GetUniversities(context *base.ApplicationContext) func(c *gin.Context) {
	return func(c *gin.Context) {
		universities, err := universities.GetAll(context)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, universities)
	}
}

// GetUniversityById handles GET /api/universities/:id
// @Tags universities
// @Summary Get a university by ID
// @Description Retrieve a university by its unique ID
// @Produce json
// @Param id path int true "University ID"
// @Success 200 {object} data.University
// @Failure 400 {object} gin.H
// @Failure 404 {object} gin.H
// @Router /api/universities/{id} [get]
func GetUniversityById(context *base.ApplicationContext) func(c *gin.Context) {
	return func(c *gin.Context) {
		id := c.Param("id")
		ID, err := strconv.Atoi(id)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid ID",
			})
			return
		}

		university, err := universities.GetById(context, ID)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "University not found",
			})
			return
		}

		c.JSON(http.StatusOK, university)
	}
}
package controllers

import (
	"backend/database"
	"backend/models"
	"errors"
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

const AccessExpiry = time.Minute * 10
const RefreshExpiry = time.Hour * 4

// helper function to generate a jwt token
func GenerateToken(id int, isRefresh bool) (string, error) {
	var secretKey string
	var expiry time.Time

	if isRefresh {
		secretKey = os.Getenv("REFRESH_SECRET_KEY")
		expiry = time.Now().Add(RefreshExpiry)
	} else {
		secretKey = os.Getenv("ACCESS_SECRET_KEY")
		expiry = time.Now().Add(AccessExpiry)
	}

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{
		Issuer:    strconv.Itoa(id),
		ExpiresAt: jwt.NewNumericDate(expiry),
	})

	return claims.SignedString([]byte(secretKey))
}

// helper function to generate tokens and send to client with user data
func AuthenticateUser(c *fiber.Ctx, user models.User) error {
	refreshToken, err := GenerateToken(int(user.ID), true)
	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "could not login",
		})
	}

	accessToken, err := GenerateToken(int(user.ID), false)

	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "could not login",
		})
	}

	// set refresh token as a cookie
	newCookie := fiber.Cookie{
		Name:     "refreshToken",
		Value:    refreshToken,
		Expires:  time.Now().Add(RefreshExpiry),
		HTTPOnly: true,
	}
	c.Cookie(&newCookie)

	return c.JSON(fiber.Map{
		"token": accessToken,
		"user":  user,
	})
}

// helper function to check if access token is valid
func CheckAccessToken(c *fiber.Ctx) error {
	authHeader := c.Get("authorization")
	if len(authHeader) < 7 {
		return errors.New("unauthenticated")
	}

	accessToken := authHeader[7:]
	_, err := jwt.ParseWithClaims(accessToken, &jwt.RegisteredClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("ACCESS_SECRET_KEY")), nil
	})

	return err
}

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func Register(c *fiber.Ctx) error {
	var data Credentials

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	password, _ := bcrypt.GenerateFromPassword([]byte(data.Password), 14)

	user := models.User{
		Username: data.Username,
		Password: password,
	}

	if dbc := database.DB.Create(&user); dbc.Error != nil {
		c.Status(fiber.StatusConflict)
		return c.JSON(fiber.Map{
			"error": "duplicate username",
		})
	}

	c.Status(fiber.StatusCreated)
	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func Login(c *fiber.Ctx) error {
	var data Credentials
	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var user models.User

	database.DB.Where("username = ?", data.Username).First(&user)

	if user.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "user not found",
		})
	}

	if err := bcrypt.CompareHashAndPassword(user.Password, []byte(data.Password)); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "incorrect password",
		})
	}

	return AuthenticateUser(c, user)
}

func Refresh(c *fiber.Ctx) error {
	cookie := c.Cookies("refreshToken")

	token, err := jwt.ParseWithClaims(cookie, &jwt.RegisteredClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("REFRESH_SECRET_KEY")), nil
	})
	if err != nil {
		c.Status(fiber.StatusForbidden)
		return c.JSON(fiber.Map{
			"message": "refresh token expired",
		})
	}

	claims := token.Claims.(*jwt.RegisteredClaims)
	userId, err := strconv.ParseUint(claims.Issuer, 0, 64)
	if err != nil {
		c.Status(fiber.StatusUnprocessableEntity)
		return c.JSON(fiber.Map{
			"message": "could not process token",
		})
	}

	var user models.User
	database.DB.Where("id = ?", userId).First(&user)

	return AuthenticateUser(c, user)
}

func Logout(c *fiber.Ctx) error {
	cookie := fiber.Cookie{
		Name:     "refreshToken",
		Value:    "",
		Expires:  time.Now().Add(-1 * time.Hour), // set expiry to one hour in the past
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func User(c *fiber.Ctx) error {
	// get access token from authorization header
	authHeader := c.Get("authorization")
	if len(authHeader) < 7 {
		c.Status(fiber.StatusForbidden)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	accessToken := authHeader[7:]

	token, err := jwt.ParseWithClaims(accessToken, &jwt.RegisteredClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("ACCESS_SECRET_KEY")), nil
	})

	if err != nil {
		c.Status(fiber.StatusForbidden)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	var user models.User
	claims := token.Claims.(*jwt.RegisteredClaims)
	database.DB.Where("id = ?", claims.Issuer).First(&user)

	return c.JSON(user)
}

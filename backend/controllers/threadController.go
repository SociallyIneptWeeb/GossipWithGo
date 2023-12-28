package controllers

import (
	"backend/database"
	"backend/models"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func GetThreads(c *fiber.Ctx) error {
	err := CheckAccessToken(c)
	if err != nil {
		c.Status(fiber.StatusForbidden)
		return c.JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	categoryId := c.Query("id")

	var threads []models.Thread
	var result *gorm.DB

	if categoryId == "0" {
		result = database.DB.
			Preload(clause.Associations).
			Table("threads t").
			Order("t.updated_at desc").
			Find(&threads)
	} else {
		result = database.DB.
			Preload(clause.Associations).
			Table("threads t").
			Where("t.category_id = ?", categoryId).
			Order("t.updated_at desc").
			Find(&threads)
	}

	if result.Error != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "could not get threads",
		})
	}

	return c.JSON(threads)
}

func GetThread(c *fiber.Ctx) error {
	err := CheckAccessToken(c)
	if err != nil {
		c.Status(fiber.StatusForbidden)
		return c.JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	threadId := c.Params("id")

	var thread models.Thread

	id, err := strconv.Atoi(threadId)
	if err != nil {
		return c.JSON(fiber.Map{
			"message": "could not parse thread id",
		})
	}

	result := database.DB.Preload("Comments.User").Preload(clause.Associations).First(&thread, id)

	if result.Error != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "could not get thread",
		})
	}

	return c.JSON(thread)
}

type ThreadReq struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	CategoryId  uint   `json:"category_id"`
	UserId      uint   `json:"user_id"`
}

func CreateThread(c *fiber.Ctx) error {
	err := CheckAccessToken(c)
	if err != nil {
		c.Status(fiber.StatusForbidden)
		return c.JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	var user models.User
	var category models.Category
	var data ThreadReq

	if err := c.BodyParser(&data); err != nil {
		return c.JSON(fiber.Map{
			"message": "could not parse json",
		})
	}

	userResult := database.DB.Find(&user, data.UserId)
	if userResult.Error != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "could not find user",
		})
	}

	categoryResult := database.DB.Find(&category, data.CategoryId)
	if categoryResult.Error != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "could not find category",
		})
	}

	thread := models.Thread{Title: data.Title, Description: data.Description, User: user, Category: category}
	result := database.DB.Create(&thread)
	if result.Error != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "could not create thread",
		})
	}

	return c.JSON(thread)
}

func DeleteThread(c *fiber.Ctx) error {
	err := CheckAccessToken(c)
	if err != nil {
		c.Status(fiber.StatusForbidden)
		return c.JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	threadId := c.Params("id")

	var thread models.Thread

	id, err := strconv.Atoi(threadId)
	if err != nil {
		return c.JSON(fiber.Map{
			"message": "could not parse thread id",
		})
	}

	threadResult := database.DB.Find(&thread, id)
	if threadResult.Error != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "could not find thread",
		})
	}

	result := database.DB.Delete(&thread, id)
	if result.Error != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "could not delete thread",
		})
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func EditThread(c *fiber.Ctx) error {
	err := CheckAccessToken(c)
	if err != nil {
		c.Status(fiber.StatusForbidden)
		return c.JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	threadId := c.Params("id")

	var thread models.Thread
	var category models.Category
	var data ThreadReq

	id, err := strconv.Atoi(threadId)
	if err != nil {
		return c.JSON(fiber.Map{
			"message": "could not parse thread id",
		})
	}

	if err := c.BodyParser(&data); err != nil {
		return c.JSON(fiber.Map{
			"message": "could not parse json",
		})
	}

	threadResult := database.DB.Find(&thread, id)
	if threadResult.Error != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "could not find thread",
		})
	}

	categoryResult := database.DB.Find(&category, data.CategoryId)
	if categoryResult.Error != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "could not find category",
		})
	}

	thread.Title = data.Title
	thread.Description = data.Description
	thread.Category = category

	result := database.DB.Save(&thread)
	if result.Error != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "could not update thread",
		})
	}

	return c.JSON(thread)
}

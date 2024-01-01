package controllers

import (
	"backend/database"
	"backend/models"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

const THREADS_PER_PAGE = 5

// scope for filtering threads by category id
func ThreadCategoryId(categoryIds []string) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		return db.Where("category_id IN (?)", categoryIds)
	}
}

// scope for filtering threads by title
func ThreadTitle(title string) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		return db.Where("title ILIKE ?", "%"+title+"%")
	}
}

func GetThreads(c *fiber.Ctx) error {
	err := CheckAccessToken(c)
	if err != nil {
		c.Status(fiber.StatusForbidden)
		return c.JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	categoryId := c.Query("id")
	title := c.Query("title")
	page := c.Query("page")

	pageNumber, err := strconv.Atoi(page)
	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "could not parse page number",
		})
	}

	var threads []models.Thread
	var result *gorm.DB
	var count int64
	var categoryIds []string

	if categoryId == "0" {
		// all categories
		categoryIds = append(categoryIds, "1", "2", "3")
	} else {
		categoryIds = append(categoryIds, categoryId)
	}

	result = database.DB.
		Preload(clause.Associations).
		Table("threads t").
		Scopes(ThreadCategoryId(categoryIds), ThreadTitle("%"+title+"%")).
		Order("t.updated_at desc").
		Limit(THREADS_PER_PAGE).
		Offset((pageNumber - 1) * THREADS_PER_PAGE).
		Find(&threads)

	// get total count for pagination
	database.DB.
		Table("threads t").
		Scopes(ThreadCategoryId(categoryIds), ThreadTitle("%"+title+"%")).
		Count(&count)

	if result.Error != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "could not get threads",
		})
	}

	return c.JSON(fiber.Map{
		"threads": threads,
		"count":   count,
	})
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

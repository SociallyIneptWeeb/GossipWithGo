package controllers

import (
	"backend/database"
	"backend/models"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type CommentReq struct {
	Content  string `json:"content"`
	UserId   uint   `json:"user_id"`
	ThreadId uint   `json:"thread_id"`
}

func CreateComment(c *fiber.Ctx) error {
	err := CheckAccessToken(c)
	if err != nil {
		c.Status(fiber.StatusForbidden)
		return c.JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	var thread models.Thread
	var user models.User
	var data CommentReq

	if err := c.BodyParser(&data); err != nil {
		c.Status(fiber.StatusBadRequest)
		return err
	}

	userResult := database.DB.Find(&user, data.UserId)
	if userResult.Error != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "could not find user",
		})
	}

	threadResult := database.DB.Find(&thread, data.ThreadId)
	if threadResult.Error != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "could not find thread",
		})
	}

	comment := models.Comment{Content: data.Content, User: user, Thread: thread}
	result := database.DB.Create(&comment)

	if result.Error != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "could not create comment",
		})
	}

	return c.JSON(comment)
}

func DeleteComment(c *fiber.Ctx) error {
	err := CheckAccessToken(c)
	if err != nil {
		c.Status(fiber.StatusForbidden)
		return c.JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	var comment models.Comment

	commentId := c.Params("id")
	id, err := strconv.Atoi(commentId)
	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "could not parse comment id",
		})
	}

	commentResult := database.DB.Find(&comment, id)
	if commentResult.Error != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "could not find comment",
		})
	}

	result := database.DB.Delete(&comment, id)
	if result.Error != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "could not delete comment",
		})
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func EditComment(c *fiber.Ctx) error {
	err := CheckAccessToken(c)
	if err != nil {
		c.Status(fiber.StatusForbidden)
		return c.JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	var comment models.Comment
	var data CommentReq

	if err := c.BodyParser(&data); err != nil {
		c.Status(fiber.StatusBadRequest)
		return err
	}

	commentId := c.Params("id")
	id, err := strconv.Atoi(commentId)
	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "could not parse comment id",
		})
	}

	commentResult := database.DB.Find(&comment, id)
	if commentResult.Error != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "could not find comment",
		})
	}

	result := database.DB.Model(&comment).Update("content", data.Content)
	if result.Error != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "could not edit comment",
		})
	}

	// update thread's updated_at
	var thread models.Thread
	database.DB.Find(&thread, data.ThreadId)
	database.DB.Model(&thread).Update("updated_at", comment.UpdatedAt)

	return c.JSON(comment)
}

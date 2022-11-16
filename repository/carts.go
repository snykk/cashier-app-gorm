package repository

import (
	"a21hc3NpZ25tZW50/model"

	"gorm.io/gorm"
)

type CartRepository struct {
	db *gorm.DB
}

func NewCartRepository(db *gorm.DB) CartRepository {
	return CartRepository{db}
}

func (c *CartRepository) ReadCart() ([]model.JoinCart, error) {
	var joined []model.JoinCart
	err := c.db.Model(model.Cart{}).Select("carts.id as id, carts.product_id as product_id, products.name as name, carts.quantity as quantity, carts.total_price as total_price").Joins("JOIN products ON carts.product_id=products.id").Scan(&joined).Error
	return joined, err
}

func (c *CartRepository) AddCart(product model.Product) error {
	var cartFromDB model.Cart
	c.db.Model(model.Cart{}).Where("product_id = ?", product.ID).First(&cartFromDB)

	var productFromDB model.Product
	c.db.Model(model.Product{}).Where("id = ?", product.ID).First(&productFromDB)

	err := c.db.Model(model.Product{}).Where("id = ?", product.ID).Update("stock", productFromDB.Stock-1).Error
	if err != nil {
		return err
	}

	if cartFromDB == (model.Cart{}) {
		return c.db.Save(&model.Cart{ProductID: product.ID, Quantity: 1, TotalPrice: (100 - product.Discount) / 100 * product.Price}).Error
	}

	return c.db.Model(model.Cart{}).Where("id = ?", cartFromDB.ID).Updates(model.Cart{Quantity: cartFromDB.Quantity + 1, TotalPrice: (100-product.Discount)/100*product.Price + cartFromDB.TotalPrice}).Error
}

func (c *CartRepository) DeleteCart(id uint, productID uint) error {
	var cartFromDB model.Cart
	c.db.Model(model.Cart{}).Where("product_id = ?", productID).First(&cartFromDB)

	var productFromDB model.Product
	c.db.Model(model.Product{}).Where("id = ?", productID).First(&productFromDB)

	err := c.db.Model(model.Product{}).Where("id = ?", productID).Update("stock", productFromDB.Stock+int(cartFromDB.Quantity)).Error
	if err != nil {
		return err
	}

	return c.db.Where("id = ?", id).Delete(&model.Cart{}).Error
}

func (c *CartRepository) UpdateCart(id uint, cart model.Cart) error {
	return c.db.Model(model.Cart{}).Where("id = ?", id).Updates(cart).Error
}

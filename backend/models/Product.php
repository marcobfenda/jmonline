<?php
class Product {
    private $conn;
    private $table = 'products';

    public $id;
    public $name;
    public $description;
    public $price;
    public $stock;
    public $image_url;
    public $category_id;
    public $featured;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAll($categoryId = null, $featuredOnly = false) {
        try {
            $query = "SELECT p.*, c.name as category_name, c.id as category_id 
                      FROM " . $this->table . " p 
                      LEFT JOIN categories c ON p.category_id = c.id";
            
            $whereConditions = [];
            
            if ($categoryId !== null) {
                $whereConditions[] = "p.category_id = :category_id";
            }
            
            if ($featuredOnly) {
                $whereConditions[] = "p.featured = 1";
            }
            
            if (!empty($whereConditions)) {
                $query .= " WHERE " . implode(" AND ", $whereConditions);
            }
            
            $query .= " ORDER BY p.name ASC";
            
            $stmt = $this->conn->prepare($query);
            
            if ($categoryId !== null) {
                $stmt->bindParam(':category_id', $categoryId);
            }
            
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Fallback if categories table doesn't exist yet
            $query = "SELECT * FROM " . $this->table;
            
            $whereConditions = [];
            if ($featuredOnly) {
                $whereConditions[] = "featured = 1";
            }
            
            if (!empty($whereConditions)) {
                $query .= " WHERE " . implode(" AND ", $whereConditions);
            }
            
            $query .= " ORDER BY name ASC";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    public function getById($id) {
        try {
            $query = "SELECT p.*, c.name as category_name, c.id as category_id 
                      FROM " . $this->table . " p 
                      LEFT JOIN categories c ON p.category_id = c.id 
                      WHERE p.id = :id LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Fallback if categories table doesn't exist yet
            $query = "SELECT * FROM " . $this->table . " WHERE id = :id LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
    }

    public function create() {
        $query = "INSERT INTO " . $this->table . " (name, description, price, stock, image_url, category_id, featured) VALUES (:name, :description, :price, :stock, :image_url, :category_id, :featured)";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':price', $this->price);
        $stmt->bindParam(':stock', $this->stock);
        $stmt->bindParam(':image_url', $this->image_url);
        $stmt->bindParam(':category_id', $this->category_id);
        $featured = $this->featured ?? 0;
        $stmt->bindParam(':featured', $featured, PDO::PARAM_BOOL);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function update() {
        $query = "UPDATE " . $this->table . " SET name = :name, description = :description, price = :price, stock = :stock, image_url = :image_url, category_id = :category_id, featured = :featured WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':price', $this->price);
        $stmt->bindParam(':stock', $this->stock);
        $stmt->bindParam(':image_url', $this->image_url);
        $stmt->bindParam(':category_id', $this->category_id);
        $featured = $this->featured ?? 0;
        $stmt->bindParam(':featured', $featured, PDO::PARAM_BOOL);

        return $stmt->execute();
    }

    public function updateStock($id, $stock) {
        $query = "UPDATE " . $this->table . " SET stock = :stock WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':stock', $stock);
        return $stmt->execute();
    }

    public function bulkUpsert($products) {
        $this->conn->beginTransaction();
        try {
            foreach ($products as $product) {
                $query = "INSERT INTO " . $this->table . " (name, description, price, stock, image_url, category_id, featured) 
                          VALUES (:name, :description, :price, :stock, :image_url, :category_id, :featured)
                          ON DUPLICATE KEY UPDATE 
                          name = VALUES(name),
                          description = VALUES(description),
                          price = VALUES(price),
                          stock = VALUES(stock),
                          image_url = VALUES(image_url),
                          category_id = VALUES(category_id),
                          featured = VALUES(featured)";
                
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':name', $product['name']);
                $stmt->bindParam(':description', $product['description'] ?? '');
                $stmt->bindParam(':price', $product['price']);
                $stmt->bindParam(':stock', $product['stock']);
                $stmt->bindParam(':image_url', $product['image_url'] ?? '');
                $categoryId = $product['category_id'] ?? null;
                $stmt->bindParam(':category_id', $categoryId);
                $featured = $product['featured'] ?? 0;
                $stmt->bindParam(':featured', $featured, PDO::PARAM_BOOL);
                $stmt->execute();
            }
            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollBack();
            throw $e;
        }
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
?>


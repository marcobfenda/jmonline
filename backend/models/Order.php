<?php
class Order {
    private $conn;
    private $table = 'orders';
    private $itemsTable = 'order_items';

    public $id;
    public $user_id;
    public $total_amount;
    public $status;
    public $payment_method;
    public $payment_status;
    public $items;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $this->conn->beginTransaction();
        try {
            // Create order
            $query = "INSERT INTO " . $this->table . " (user_id, total_amount, status, payment_method, payment_status) 
                      VALUES (:user_id, :total_amount, :status, :payment_method, :payment_status)";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $this->user_id);
            $stmt->bindParam(':total_amount', $this->total_amount);
            $stmt->bindParam(':status', $this->status);
            $stmt->bindParam(':payment_method', $this->payment_method);
            $stmt->bindParam(':payment_status', $this->payment_status);
            $stmt->execute();
            $this->id = $this->conn->lastInsertId();

            // Create order items
            foreach ($this->items as $item) {
                $itemQuery = "INSERT INTO " . $this->itemsTable . " (order_id, product_id, quantity, price) 
                              VALUES (:order_id, :product_id, :quantity, :price)";
                $itemStmt = $this->conn->prepare($itemQuery);
                $itemStmt->bindParam(':order_id', $this->id);
                $itemStmt->bindParam(':product_id', $item['product_id']);
                $itemStmt->bindParam(':quantity', $item['quantity']);
                $itemStmt->bindParam(':price', $item['price']);
                $itemStmt->execute();
            }

            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollBack();
            throw $e;
        }
    }

    public function getAll($userId = null) {
        if ($userId) {
            $query = "SELECT o.*, u.username FROM " . $this->table . " o 
                      LEFT JOIN users u ON o.user_id = u.id 
                      WHERE o.user_id = :user_id 
                      ORDER BY o.created_at DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $userId);
        } else {
            $query = "SELECT o.*, u.username FROM " . $this->table . " o 
                      LEFT JOIN users u ON o.user_id = u.id 
                      ORDER BY o.created_at DESC";
            $stmt = $this->conn->prepare($query);
        }
        $stmt->execute();
        $orders = $stmt->fetchAll();

        // Get order items for each order
        foreach ($orders as &$order) {
            // Ensure status and payment_status have default values
            $order['status'] = $order['status'] ?? 'Placed';
            $order['payment_status'] = $order['payment_status'] ?? 'pending';
            $itemsQuery = "SELECT oi.*, p.name as product_name, p.image_url 
                           FROM " . $this->itemsTable . " oi 
                           LEFT JOIN products p ON oi.product_id = p.id 
                           WHERE oi.order_id = :order_id";
            $itemsStmt = $this->conn->prepare($itemsQuery);
            $itemsStmt->bindParam(':order_id', $order['id']);
            $itemsStmt->execute();
            $order['items'] = $itemsStmt->fetchAll();
        }

        return $orders;
    }

    public function getById($id) {
        $query = "SELECT o.*, u.username FROM " . $this->table . " o 
                  LEFT JOIN users u ON o.user_id = u.id 
                  WHERE o.id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $order = $stmt->fetch();

        if ($order) {
            // Ensure status and payment_status have default values
            $order['status'] = $order['status'] ?? 'Placed';
            $order['payment_status'] = $order['payment_status'] ?? 'pending';
            
            $itemsQuery = "SELECT oi.*, p.name as product_name, p.image_url 
                           FROM " . $this->itemsTable . " oi 
                           LEFT JOIN products p ON oi.product_id = p.id 
                           WHERE oi.order_id = :order_id";
            $itemsStmt = $this->conn->prepare($itemsQuery);
            $itemsStmt->bindParam(':order_id', $id);
            $itemsStmt->execute();
            $order['items'] = $itemsStmt->fetchAll();
        }

        return $order;
    }

    public function updateStatus($id, $status) {
        $query = "UPDATE " . $this->table . " SET status = :status WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':status', $status);
        return $stmt->execute();
    }

    public function updatePayment($id, $payment_method, $payment_status) {
        $query = "UPDATE " . $this->table . " SET payment_method = :payment_method, payment_status = :payment_status, status = :status WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $newStatus = $payment_status === 'paid' ? 'Paid' : 'Placed';
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':payment_method', $payment_method);
        $stmt->bindParam(':payment_status', $payment_status);
        $stmt->bindParam(':status', $newStatus);
        return $stmt->execute();
    }
}
?>


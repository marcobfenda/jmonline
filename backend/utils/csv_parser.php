<?php
function parseInventoryFile($filePath, $extension) {
    $products = [];
    
    if ($extension === 'csv') {
        $handle = fopen($filePath, 'r');
        if ($handle === false) {
            throw new Exception('Failed to open CSV file');
        }
        
        // Skip header row
        $header = fgetcsv($handle);
        
        while (($row = fgetcsv($handle)) !== false) {
            if (count($row) >= 4) {
                $products[] = [
                    'name' => trim($row[0]),
                    'description' => trim($row[1] ?? ''),
                    'price' => floatval($row[2]),
                    'stock' => intval($row[3]),
                    'image_url' => trim($row[4] ?? '')
                ];
            }
        }
        fclose($handle);
    } else {
        // For XLS/XLSX, we'll use a simple approach
        // In production, you might want to use PhpSpreadsheet library
        throw new Exception('XLS/XLSX support requires PhpSpreadsheet library. Please use CSV format for now.');
    }
    
    return $products;
}
?>


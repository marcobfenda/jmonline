#!/bin/bash
echo "Restoring demo data..."
docker exec -i jmonline_mysql mysql -ujmonline_user -pjmonline_pass jmonline < database/restore_demo_data.sql 2>&1 | grep -v "Using a password"
echo "Demo data restored!"

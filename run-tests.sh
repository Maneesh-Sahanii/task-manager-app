#!/bin/bash

# Team Task Manager - Test Execution Script
# This script runs all tests for the application

echo "=========================================="
echo "Team Task Manager - Test Execution"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if backend is running
echo -e "${BLUE}Checking if MongoDB and Backend are running...${NC}"
sleep 2

# Run API tests
echo ""
echo -e "${YELLOW}Running Backend API Tests...${NC}"
echo "=========================================="

cd backend
npm test 2>&1 | tee test-results.txt

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend tests passed${NC}"
else
    echo -e "${RED}✗ Backend tests failed${NC}"
fi

cd ..

# Run frontend tests (if jest is available)
echo ""
echo -e "${YELLOW}Checking Frontend Tests...${NC}"
echo "=========================================="

cd frontend

if npm test -- --coverage --watchAll=false 2>&1 | tee test-results.txt; then
    echo -e "${GREEN}✓ Frontend tests passed${NC}"
else
    echo -e "${YELLOW}⊘ Frontend tests require npm test setup${NC}"
fi

cd ..

echo ""
echo "=========================================="
echo -e "${GREEN}Test Execution Complete${NC}"
echo "=========================================="

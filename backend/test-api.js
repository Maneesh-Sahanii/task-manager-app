/**
 * Team Task Manager - API Test Suite
 * Tests all backend endpoints and functionality
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Test data
const testData = {
  users: {
    user1: {
      name: 'John Test',
      email: 'john@test.com',
      password: 'TestPass123',
      confirmPassword: 'TestPass123'
    },
    user2: {
      name: 'Jane Test',
      email: 'jane@test.com',
      password: 'TestPass456',
      confirmPassword: 'TestPass456'
    }
  },
  projects: {
    project1: {
      name: 'Test Project Alpha',
      description: 'Test project for validation',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  },
  tasks: {
    task1: {
      title: 'Complete Testing',
      description: 'Test task for validation',
      priority: 'high',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  }
};

// Store tokens and IDs for testing
let tokens = {};
let ids = {};

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

// Test result tracker
let testResults = {
  passed: 0,
  failed: 0,
  errors: []
};

// Helper function to make API calls
async function apiCall(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers: {}
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    };
  }
}

// Test assertion helper
function assert(condition, testName) {
  if (condition) {
    console.log(`${colors.green}✓${colors.reset} ${testName}`);
    testResults.passed++;
  } else {
    console.log(`${colors.red}✗${colors.reset} ${testName}`);
    testResults.failed++;
    testResults.errors.push(testName);
  }
}

// Main test suite
async function runTests() {
  console.log(`\n${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}   TEAM TASK MANAGER - API TEST SUITE${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}\n`);

  try {
    // 1. AUTHENTICATION TESTS
    console.log(`${colors.yellow}1. AUTHENTICATION TESTS${colors.reset}`);
    await testAuthentication();

    // 2. PROJECT MANAGEMENT TESTS
    console.log(`\n${colors.yellow}2. PROJECT MANAGEMENT TESTS${colors.reset}`);
    await testProjectManagement();

    // 3. TASK MANAGEMENT TESTS
    console.log(`\n${colors.yellow}3. TASK MANAGEMENT TESTS${colors.reset}`);
    await testTaskManagement();

    // 4. ACCESS CONTROL TESTS
    console.log(`\n${colors.yellow}4. ACCESS CONTROL TESTS${colors.reset}`);
    await testAccessControl();

    // 5. VALIDATION TESTS
    console.log(`\n${colors.yellow}5. VALIDATION TESTS${colors.reset}`);
    await testValidation();

    // Print summary
    printTestSummary();

  } catch (error) {
    console.error(`${colors.red}Fatal error during test execution:${colors.reset}`, error.message);
    process.exit(1);
  }
}

// Test Authentication
async function testAuthentication() {
  console.log('\n  Testing signup, login, and token validation...\n');

  // T1.1: Signup with valid data
  let result = await apiCall('POST', '/auth/signup', testData.users.user1);
  assert(result.success && result.status === 201, 'T1.1: Signup with valid data');
  if (result.success) {
    tokens.user1 = result.data.token;
    ids.user1 = result.data.user.id;
  }

  // T1.4: Signup with duplicate email
  result = await apiCall('POST', '/auth/signup', testData.users.user1);
  assert(!result.success && result.status === 409, 'T1.4: Signup with duplicate email (409)');

  // T1.8: Weak password
  result = await apiCall('POST', '/auth/signup', {
    name: 'Test',
    email: 'weak@test.com',
    password: '123',
    confirmPassword: '123'
  });
  assert(!result.success && result.status === 400, 'T1.8: Weak password (400)');

  // Signup second user for testing
  result = await apiCall('POST', '/auth/signup', testData.users.user2);
  assert(result.success && result.status === 201, 'Signup second test user');
  if (result.success) {
    tokens.user2 = result.data.token;
    ids.user2 = result.data.user.id;
  }

  // T1.2: Login with valid credentials
  result = await apiCall('POST', '/auth/login', {
    email: testData.users.user1.email,
    password: testData.users.user1.password
  });
  assert(result.success && result.status === 200, 'T1.2: Login with valid credentials');

  // T1.3: Login with invalid password
  result = await apiCall('POST', '/auth/login', {
    email: testData.users.user1.email,
    password: 'WrongPassword'
  });
  assert(!result.success && result.status === 401, 'T1.3: Login with invalid password (401)');

  // T1.7: Get current user
  result = await apiCall('GET', '/auth/me', null, tokens.user1);
  assert(result.success && result.status === 200, 'T1.7: Get current user with valid token');

  // T1.6: Invalid token
  result = await apiCall('GET', '/auth/me', null, 'invalid.token.here');
  assert(!result.success && result.status === 401, 'T1.6: Invalid token (401)');

  // T1.5: No token
  result = await apiCall('GET', '/auth/me', null, null);
  assert(!result.success && result.status === 401, 'T1.5: No token provided (401)');
}

// Test Project Management
async function testProjectManagement() {
  console.log('\n  Testing project CRUD operations...\n');

  // T2.1: Create project
  const projectData = testData.projects.project1;
  let result = await apiCall('POST', '/projects', projectData, tokens.user1);
  assert(result.success && result.status === 201, 'T2.1: Create project as admin');
  if (result.success) {
    ids.project1 = result.data.project._id;
  }

  // T2.4: Get all projects
  result = await apiCall('GET', '/projects', null, tokens.user1);
  assert(result.success && result.status === 200 && Array.isArray(result.data.projects), 'T2.4: Get all projects');
  assert(result.data.projects.length > 0, 'T2.4: Projects list not empty');

  // T2.5: Get single project
  result = await apiCall('GET', `/projects/${ids.project1}`, null, tokens.user1);
  assert(result.success && result.status === 200, 'T2.5: Get single project with stats');
  if (result.success) {
    assert(result.data.stats !== undefined, 'T2.5: Project stats returned');
  }

  // T2.2: Update project
  result = await apiCall('PUT', `/projects/${ids.project1}`, {
    name: 'Updated Project Name',
    description: 'Updated description'
  }, tokens.user1);
  assert(result.success && result.status === 200, 'T2.2: Update project as admin');

  // T2.6: Add member to project
  result = await apiCall('POST', `/projects/${ids.project1}/members`, {
    email: testData.users.user2.email
  }, tokens.user1);
  assert(result.success && result.status === 200, 'T2.6: Add member to project');

  // T2.9: Add duplicate member
  result = await apiCall('POST', `/projects/${ids.project1}/members`, {
    email: testData.users.user2.email
  }, tokens.user1);
  assert(!result.success && result.status === 400, 'T2.9: Add duplicate member (400)');

  // T2.8: Add non-existent user
  result = await apiCall('POST', `/projects/${ids.project1}/members`, {
    email: 'nonexistent@test.com'
  }, tokens.user1);
  assert(!result.success && result.status === 404, 'T2.8: Add non-existent user (404)');

  // T2.10: Member cannot delete project (create test first)
  result = await apiCall('DELETE', `/projects/${ids.project1}`, null, tokens.user2);
  assert(!result.success && result.status === 403, 'T2.10: Member cannot delete project (403)');

  // T2.3: Delete project (as admin)
  result = await apiCall('DELETE', `/projects/${ids.project1}`, null, tokens.user1);
  assert(result.success && result.status === 200, 'T2.3: Delete project as admin');
}

// Test Task Management
async function testTaskManagement() {
  console.log('\n  Testing task CRUD operations...\n');

  // Create a new project for task testing
  let result = await apiCall('POST', '/projects', testData.projects.project1, tokens.user1);
  assert(result.success, 'Create project for task testing');
  const projectId = result.data.project._id;
  ids.project1 = projectId;

  // Add user2 as member and wait
  await apiCall('POST', `/projects/${projectId}/members`, {
    email: testData.users.user2.email
  }, tokens.user1);

  // Small delay to ensure member is added
  await new Promise(resolve => setTimeout(resolve, 100));

  // T3.1: Create task with proper date format
  const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const taskData = {
    title: 'Complete Testing',
    description: 'Test task for validation',
    priority: 'high',
    projectId: projectId,
    dueDate: futureDate.toISOString().split('T')[0]
  };
  result = await apiCall('POST', '/tasks', taskData, tokens.user1);
  assert(result.success && result.status === 201, `T3.1: Create task in project (Status: ${result.status}, Error: ${result.data?.message})`);
  if (result.success) {
    ids.task1 = result.data.task._id;
  } else {
    console.log('Task creation failed, skipping dependent tests');
    return;
  }

  // T3.4: Assign task to member
  result = await apiCall('PUT', `/tasks/${ids.task1}`, {
    assignedTo: ids.user2
  }, tokens.user1);
  assert(result.success && result.status === 200, 'T3.4: Assign task to member');

  // T3.2: Update task status
  result = await apiCall('PUT', `/tasks/${ids.task1}`, {
    status: 'in-progress'
  }, tokens.user1);
  assert(result.success && result.status === 200, 'T3.2: Update task status');

  // T3.3: Set task priority
  result = await apiCall('PUT', `/tasks/${ids.task1}`, {
    priority: 'medium'
  }, tokens.user1);
  assert(result.success && result.status === 200, 'T3.3: Set task priority');

  // T3.5: Get tasks by status
  result = await apiCall('GET', `/tasks/project/${projectId}?status=in-progress`, null, tokens.user1);
  assert(result.success && result.status === 200, 'T3.5: Get tasks by status');
  assert(Array.isArray(result.data.tasks), 'T3.5: Tasks list returned');

  // T3.6: Get tasks by priority
  result = await apiCall('GET', `/tasks/project/${projectId}?priority=medium`, null, tokens.user1);
  assert(result.success && result.status === 200, 'T3.6: Get tasks by priority');

  // T3.7: Mark task completed
  result = await apiCall('PUT', `/tasks/${ids.task1}`, {
    status: 'completed'
  }, tokens.user1);
  assert(result.success && result.status === 200, 'T3.7: Mark task completed');
  if (result.success) {
    assert(result.data.task.completedAt !== null, 'T3.7: completedAt timestamp set');
  }

  // T3.10: Assign to non-member
  result = await apiCall('POST', '/tasks', {
    ...taskData,
    assignedTo: 'invalid-user-id'
  }, tokens.user1);
  assert(!result.success && result.status === 400, 'T3.10: Assign to non-member (400)');

  // T3.8: Delete task
  result = await apiCall('DELETE', `/tasks/${ids.task1}`, null, tokens.user1);
  assert(result.success && result.status === 200, 'T3.8: Delete task');
}

// Test Access Control
async function testAccessControl() {
  console.log('\n  Testing role-based access control...\n');

  // Create project with user1
  let result = await apiCall('POST', '/projects', testData.projects.project1, tokens.user1);
  assert(result.success, 'Create test project for access control');
  const projectId = result.data.project._id;
  ids.project1 = projectId;

  // T4.7: Member cannot access other projects
  // Create another user
  const user3 = {
    name: 'Access Test',
    email: 'access@test.com',
    password: 'TestPass789',
    confirmPassword: 'TestPass789'
  };
  result = await apiCall('POST', '/auth/signup', user3);
  const user3Token = result.data.token;

  result = await apiCall('GET', `/projects/${projectId}`, null, user3Token);
  assert(!result.success && result.status === 403, 'T4.7: Non-member cannot access project (403)');

  // T4.1: Member can view shared project
  result = await apiCall('POST', `/projects/${projectId}/members`, {
    email: user3.email
  }, tokens.user1);
  
  // Wait a bit for member to be added
  await new Promise(resolve => setTimeout(resolve, 200));
  
  result = await apiCall('GET', `/projects/${projectId}`, null, user3Token);
  assert(result.success && result.status === 200, 'T4.1: Member can access shared project');
}

// Test Validation
async function testValidation() {
  console.log('\n  Testing input validation...\n');

  // T5.2: Password minimum length
  let result = await apiCall('POST', '/auth/signup', {
    name: 'Test',
    email: 'validation@test.com',
    password: '123',
    confirmPassword: '123'
  });
  assert(!result.success && result.status === 400, 'T5.2: Password minimum length enforced');

  // T5.1: Email validation - test with truly invalid email (no @)
  result = await apiCall('POST', '/auth/signup', {
    name: 'Test',
    email: 'invalidemail',
    password: 'TestPass123',
    confirmPassword: 'TestPass123'
  });
  assert(!result.success && result.status === 400, 'T5.1: Email validation works (rejects invalid format)');

  // T5.3: Required fields
  result = await apiCall('POST', '/projects', {
    description: 'No name provided'
  }, tokens.user1);
  assert(!result.success && result.status === 400, 'T5.3: Required fields validated');

  // Test password mismatch
  result = await apiCall('POST', '/auth/signup', {
    name: 'Test',
    email: 'mismatch@test.com',
    password: 'TestPass123',
    confirmPassword: 'DifferentPass123'
  });
  assert(!result.success && result.status === 400, 'Password mismatch validation');

  // Test task without due date
  result = await apiCall('POST', '/tasks', {
    title: 'Test Task',
    projectId: ids.project1
  }, tokens.user1);
  assert(!result.success && result.status === 400, 'T5.4: Due date validation works');
}

// Print test summary
function printTestSummary() {
  console.log(`\n${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}                    TEST SUMMARY REPORT${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}\n`);

  console.log(`${colors.green}Passed: ${testResults.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${testResults.failed}${colors.reset}`);
  console.log(`Total:  ${testResults.passed + testResults.failed}\n`);

  if (testResults.errors.length > 0) {
    console.log(`${colors.red}Failed Tests:${colors.reset}`);
    testResults.errors.forEach(error => {
      console.log(`  - ${error}`);
    });
    console.log();
  }

  const passRate = ((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(2);
  console.log(`${colors.yellow}Pass Rate: ${passRate}%${colors.reset}\n`);

  if (testResults.failed === 0) {
    console.log(`${colors.green}✓ ALL TESTS PASSED! Application is ready for deployment.${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}✗ Some tests failed. Please review the issues above.${colors.reset}\n`);
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Test execution error:', error);
  process.exit(1);
});

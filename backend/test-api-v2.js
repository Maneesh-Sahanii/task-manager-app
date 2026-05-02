#!/usr/bin/env node

/**
 * Team Task Manager - Simplified API Test Suite
 * Version 2.0 - More robust error handling
 */

const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';
let passCount = 0;
let failCount = 0;

// Colors for output
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

// Test function
async function test(name, fn) {
  try {
    await fn();
    console.log(`${GREEN}✓${RESET} ${name}`);
    passCount++;
  } catch (error) {
    console.log(`${RED}✗${RESET} ${name}`);
    console.log(`  Error: ${error.message}`);
    failCount++;
  }
}

// HTTP request helper
async function request(method, path, data = null, token = null) {
  const config = {
    method,
    url: `${API_BASE}${path}`,
    headers: {}
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (data) {
    config.data = data;
  }

  const response = await axios(config);
  return response;
}

// Main test suite
async function runTests() {
  console.log(`\n${BLUE}${'='.repeat(60)}${RESET}`);
  console.log(`${BLUE}   TEAM TASK MANAGER - TEST SUITE (v2.0)${RESET}`);
  console.log(`${BLUE}${'='.repeat(60)}${RESET}\n`);

  let user1Token, user2Token, user1Id, user2Id, projectId, taskId;
  const user1Email = `user${Date.now()}@test.com`;
  const user2Email = `user${Date.now() + 1}@test.com`;

  try {
    // ===== AUTHENTICATION TESTS =====
    console.log(`${YELLOW}1. AUTHENTICATION TESTS${RESET}\n`);

    // T1: Signup User 1
    await test('Signup user 1', async () => {
      const res = await request('POST', '/auth/signup', {
        name: 'Test User 1',
        email: user1Email,
        password: 'Password123',
        confirmPassword: 'Password123'
      });
      if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
      if (!res.data.token) throw new Error('No token returned');
      user1Token = res.data.token;
      user1Id = res.data.user.id;
    });

    // T2: Signup User 2
    await test('Signup user 2', async () => {
      const res = await request('POST', '/auth/signup', {
        name: 'Test User 2',
        email: user2Email,
        password: 'Password456',
        confirmPassword: 'Password456'
      });
      if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
      user2Token = res.data.token;
      user2Id = res.data.user.id;
    });

    // T3: Login
    await test('Login with valid credentials', async () => {
      const res = await request('POST', '/auth/login', {
        email: user1Email,
        password: 'Password123'
      });
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    });

    // T4: Login with wrong password
    await test('Login fails with wrong password', async () => {
      try {
        await request('POST', '/auth/login', {
          email: user1Email,
          password: 'WrongPassword'
        });
        throw new Error('Should have failed');
      } catch (error) {
        if (error.response?.status !== 401) throw new Error(`Expected 401, got ${error.response?.status}`);
      }
    });

    // T5: Get current user
    await test('Get current user', async () => {
      const res = await request('GET', '/auth/me', null, user1Token);
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      if (!res.data.user) throw new Error('No user data returned');
    });

    // ===== PROJECT TESTS =====
    console.log(`\n${YELLOW}2. PROJECT MANAGEMENT TESTS${RESET}\n`);

    // T6: Create project
    await test('Create project', async () => {
      const res = await request('POST', '/projects', {
        name: 'Test Project',
        description: 'Test Description',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }, user1Token);
      if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
      projectId = res.data.project._id;
    });

    // T7: Get projects
    await test('Get all projects', async () => {
      const res = await request('GET', '/projects', null, user1Token);
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      if (!Array.isArray(res.data.projects)) throw new Error('Projects should be array');
    });

    // T8: Get single project
    await test('Get single project', async () => {
      const res = await request('GET', `/projects/${projectId}`, null, user1Token);
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    });

    // T9: Update project
    await test('Update project', async () => {
      const res = await request('PUT', `/projects/${projectId}`, {
        name: 'Updated Project Name'
      }, user1Token);
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    });

    // T10: Add member to project
    await test('Add member to project', async () => {
      const res = await request('POST', `/projects/${projectId}/members`, {
        email: user2Email
      }, user1Token);
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    });

    // ===== TASK TESTS =====
    console.log(`\n${YELLOW}3. TASK MANAGEMENT TESTS${RESET}\n`);

    // T11: Create task
    await test('Create task', async () => {
      const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const res = await request('POST', '/tasks', {
        title: 'Test Task',
        description: 'Test Description',
        projectId: projectId,
        priority: 'high',
        dueDate: dueDate
      }, user1Token);
      if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
      taskId = res.data.task._id;
    });

    // T12: Get tasks
    await test('Get tasks by project', async () => {
      const res = await request('GET', `/tasks/project/${projectId}`, null, user1Token);
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      if (!Array.isArray(res.data.tasks)) throw new Error('Tasks should be array');
    });

    // T13: Update task status
    await test('Update task status', async () => {
      const res = await request('PUT', `/tasks/${taskId}`, {
        status: 'in-progress'
      }, user1Token);
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    });

    // T14: Assign task to member
    await test('Assign task to member', async () => {
      const res = await request('PUT', `/tasks/${taskId}`, {
        assignedTo: user2Id
      }, user1Token);
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    });

    // ===== ACCESS CONTROL TESTS =====
    console.log(`\n${YELLOW}4. ACCESS CONTROL TESTS${RESET}\n`);

    // T15: Non-member cannot access project
    await test('Non-member cannot access project', async () => {
      try {
        const user3Email = `user${Date.now() + 2}@test.com`;
        const user3Res = await request('POST', '/auth/signup', {
          name: 'User 3',
          email: user3Email,
          password: 'Password789',
          confirmPassword: 'Password789'
        });
        const user3Token = user3Res.data.token;

        await request('GET', `/projects/${projectId}`, null, user3Token);
        throw new Error('Should have been denied');
      } catch (error) {
        if (error.response?.status !== 403) throw new Error(`Expected 403, got ${error.response?.status}`);
      }
    });

    // ===== VALIDATION TESTS =====
    console.log(`\n${YELLOW}5. VALIDATION TESTS${RESET}\n`);

    // T16: Weak password validation
    await test('Weak password rejected', async () => {
      try {
        await request('POST', '/auth/signup', {
          name: 'Test',
          email: `test${Date.now()}@test.com`,
          password: '123',
          confirmPassword: '123'
        });
        throw new Error('Should have been rejected');
      } catch (error) {
        if (error.response?.status !== 400) throw new Error(`Expected 400, got ${error.response?.status}`);
      }
    });

    // T17: Required fields validation
    await test('Required fields validation', async () => {
      try {
        await request('POST', '/projects', {
          description: 'No name'
        }, user1Token);
        throw new Error('Should have been rejected');
      } catch (error) {
        if (error.response?.status !== 400) throw new Error(`Expected 400, got ${error.response?.status}`);
      }
    });

    // T18: Delete task
    await test('Delete task', async () => {
      const res = await request('DELETE', `/tasks/${taskId}`, null, user1Token);
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    });

    // T19: Delete project
    await test('Delete project', async () => {
      const res = await request('DELETE', `/projects/${projectId}`, null, user1Token);
      if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    });

  } catch (error) {
    console.error(`\n${RED}Fatal error: ${error.message}${RESET}`);
  }

  // Print summary
  console.log(`\n${BLUE}${'='.repeat(60)}${RESET}`);
  console.log(`${BLUE}   TEST SUMMARY${RESET}`);
  console.log(`${BLUE}${'='.repeat(60)}${RESET}\n`);

  console.log(`${GREEN}Passed: ${passCount}${RESET}`);
  console.log(`${RED}Failed: ${failCount}${RESET}`);
  console.log(`Total:  ${passCount + failCount}\n`);

  const passRate = ((passCount / (passCount + failCount)) * 100).toFixed(2);
  console.log(`${YELLOW}Pass Rate: ${passRate}%${RESET}\n`);

  if (failCount === 0) {
    console.log(`${GREEN}✓ ALL TESTS PASSED!${RESET}\n`);
    process.exit(0);
  } else {
    console.log(`${RED}✗ Some tests failed${RESET}\n`);
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Test error:', error);
  process.exit(1);
});

# Team Task Manager - Test Plan 📋

## Test Plan Document

**Project**: Team Task Manager  
**Version**: 1.0.0  
**Date**: May 2, 2026  
**Scope**: Full-Stack Application (Backend API + Frontend UI)

---

## 1. Executive Summary

This document outlines the comprehensive test strategy for the Team Task Manager application. It covers functional testing, security testing, integration testing, and UI/UX validation.

### Test Coverage
- **Unit Tests**: API endpoints, database operations
- **Integration Tests**: API-Database interactions
- **Functional Tests**: Feature validation
- **Security Tests**: Authentication, authorization, validation
- **UI Tests**: Component rendering, user interactions
- **Performance Tests**: Response times, load handling

---

## 2. Test Objectives

1. ✅ Verify all core features work as specified
2. ✅ Ensure proper authentication and authorization
3. ✅ Validate data integrity and consistency
4. ✅ Test error handling and edge cases
5. ✅ Verify role-based access control
6. ✅ Validate frontend-backend integration
7. ✅ Ensure security best practices

---

## 3. Test Scope

### In Scope
- User authentication (Signup/Login)
- Project management (CRUD operations)
- Task management (CRUD operations)
- Team member management
- Role-based access control
- Data validation
- Error handling
- API responses

### Out of Scope
- Load testing beyond basic performance
- Stress testing
- Security penetration testing
- Third-party service integration

---

## 4. Test Requirements Analysis

### Requirements Mapping

#### Requirement 1: Authentication (Signup/Login)
**Tests**:
- T1.1: User can signup with valid credentials
- T1.2: User can login with valid credentials
- T1.3: User cannot login with invalid credentials
- T1.4: User cannot signup with duplicate email
- T1.5: JWT token is issued on successful login
- T1.6: Token is required for protected endpoints

#### Requirement 2: Project Management
**Tests**:
- T2.1: Admin can create project
- T2.2: Admin can update project
- T2.3: Admin can delete project
- T2.4: Admin can add members to project
- T2.5: Admin can remove members from project
- T2.6: Only admin can modify project settings
- T2.7: Project members can view project
- T2.8: Non-members cannot access project

#### Requirement 3: Task Management
**Tests**:
- T3.1: Tasks can be created in project
- T3.2: Tasks can have different status (Todo, In Progress, Completed)
- T3.3: Tasks can have priority levels (Low, Medium, High)
- T3.4: Tasks can be assigned to team members
- T3.5: Overdue status detected automatically
- T3.6: Task filtering works by status and priority
- T3.7: Only authorized users can modify tasks
- T3.8: Deleted tasks are removed from project

#### Requirement 4: Role-Based Access Control
**Tests**:
- T4.1: Admin role has full project control
- T4.2: Member role has limited access
- T4.3: Unauthorized users get 403 error
- T4.4: Token validation works properly

#### Requirement 5: Data Validation
**Tests**:
- T5.1: Email validation works
- T5.2: Password minimum length enforced
- T5.3: Required fields are validated
- T5.4: Date format validation works
- T5.5: Error messages are descriptive

#### Requirement 6: Dashboard & UI
**Tests**:
- T6.1: Dashboard displays user projects
- T6.2: Project stats are calculated correctly
- T6.3: Task status changes reflect in UI
- T6.4: Real-time updates work properly

---

## 5. Test Cases

### 5.1 Authentication Tests

| Test ID | Test Case | Input | Expected Output | Status |
|---------|-----------|-------|-----------------|--------|
| T1.1 | Signup with valid data | name, email, password | User created, token issued | ⏳ |
| T1.2 | Login with valid email/password | email, password | Token issued, user data returned | ⏳ |
| T1.3 | Login with invalid password | valid email, wrong password | 401 error | ⏳ |
| T1.4 | Signup with duplicate email | existing email | 409 error | ⏳ |
| T1.5 | JWT token validation | valid token | Access granted | ⏳ |
| T1.6 | Invalid token | malformed token | 401 error | ⏳ |
| T1.7 | Get current user | valid token | User data returned | ⏳ |
| T1.8 | Weak password | password < 6 chars | 400 error | ⏳ |

### 5.2 Project Management Tests

| Test ID | Test Case | Expected Result | Status |
|---------|-----------|-----------------|--------|
| T2.1 | Create project as admin | Project created successfully | ⏳ |
| T2.2 | Update project as admin | Project updated successfully | ⏳ |
| T2.3 | Delete project as admin | Project deleted, tasks removed | ⏳ |
| T2.4 | Get all projects | List of user's projects | ⏳ |
| T2.5 | Get single project | Project details with stats | ⏳ |
| T2.6 | Add member to project | Member added to project | ⏳ |
| T2.7 | Remove member from project | Member removed from project | ⏳ |
| T2.8 | Add non-existent user | 404 error | ⏳ |
| T2.9 | Add duplicate member | 400 error | ⏳ |
| T2.10 | Member cannot delete project | 403 error | ⏳ |

### 5.3 Task Management Tests

| Test ID | Test Case | Expected Result | Status |
|---------|-----------|-----------------|--------|
| T3.1 | Create task in project | Task created successfully | ⏳ |
| T3.2 | Update task status | Status changed in database | ⏳ |
| T3.3 | Set task priority | Priority saved correctly | ⏳ |
| T3.4 | Assign task to member | Task assigned, task.assignedTo set | ⏳ |
| T3.5 | Get tasks by status | Filtered tasks returned | ⏳ |
| T3.6 | Get tasks by priority | Filtered tasks returned | ⏳ |
| T3.7 | Mark task completed | completedAt timestamp set | ⏳ |
| T3.8 | Delete task | Task removed from database | ⏳ |
| T3.9 | Overdue detection | Status set to overdue | ⏳ |
| T3.10 | Assign to non-member | 400 error | ⏳ |

### 5.4 Security Tests

| Test ID | Test Case | Expected Result | Status |
|---------|-----------|-----------------|--------|
| T4.1 | No token in request | 401 error | ⏳ |
| T4.2 | Expired token | 401 error | ⏳ |
| T4.3 | Wrong password hash | Password not stored plain text | ⏳ |
| T4.4 | CORS check | Proper CORS headers | ⏳ |
| T4.5 | SQL Injection attempt | Sanitized, no error | ⏳ |
| T4.6 | XSS attempt in input | Sanitized, stored safely | ⏳ |
| T4.7 | Member cannot access other projects | 403 error | ⏳ |

### 5.5 Integration Tests

| Test ID | Test Case | Expected Result | Status |
|---------|-----------|-----------------|--------|
| T5.1 | Create project and add tasks | All tasks linked correctly | ⏳ |
| T5.2 | Add member and assign task | Task visible to new member | ⏳ |
| T5.3 | Delete project, tasks deleted | No orphaned tasks | ⏳ |
| T5.4 | User deletes account flow | All data cleaned up | ⏳ |

### 5.6 UI/UX Tests

| Test ID | Test Case | Expected Result | Status |
|---------|-----------|-----------------|--------|
| T6.1 | Login form renders | Form visible, inputs working | ⏳ |
| T6.2 | Signup form renders | Form visible, validation works | ⏳ |
| T6.3 | Dashboard loads projects | Projects list populated | ⏳ |
| T6.4 | Create project button works | Form appears on click | ⏳ |
| T6.5 | Task status dropdown works | Status changes update UI | ⏳ |
| T6.6 | Add member button works | Form appears for admin | ⏳ |
| T6.7 | Filter buttons work | Tasks filtered in real-time | ⏳ |
| T6.8 | Error messages display | User sees error notifications | ⏳ |

---

## 6. Test Data

### Test Users
```json
{
  "admin_user": {
    "name": "Test Admin",
    "email": "admin@test.com",
    "password": "TestPass123",
    "role": "admin"
  },
  "member_user": {
    "name": "Test Member",
    "email": "member@test.com",
    "password": "TestPass123",
    "role": "member"
  }
}
```

### Test Projects
```json
{
  "project_1": {
    "name": "Test Project Alpha",
    "description": "Test project for validation",
    "status": "active"
  },
  "project_2": {
    "name": "Test Project Beta",
    "description": "Another test project",
    "status": "active"
  }
}
```

### Test Tasks
```json
{
  "task_1": {
    "title": "Test Task 1",
    "description": "Complete testing",
    "priority": "high",
    "status": "todo"
  },
  "task_2": {
    "title": "Test Task 2",
    "description": "In progress task",
    "priority": "medium",
    "status": "in-progress"
  }
}
```

---

## 7. Test Execution Strategy

### Phase 1: Backend Testing (API)
1. Start backend server
2. Connect to test MongoDB
3. Run API endpoint tests
4. Verify database operations
5. Check error handling

### Phase 2: Frontend Testing (UI)
1. Start frontend development server
2. Test component rendering
3. Test user interactions
4. Verify form validation
5. Check navigation flow

### Phase 3: Integration Testing
1. Test full signup → login → project creation flow
2. Test project member management flow
3. Test task creation and assignment flow
4. Test cross-user permissions

---

## 8. Exit Criteria

### All Must Pass
- ✅ All authentication tests pass
- ✅ All CRUD operations work
- ✅ Role-based access control enforced
- ✅ No data corruption
- ✅ No security vulnerabilities
- ✅ All error codes correct

### No Critical Bugs
- ❌ 401 errors not returned for unauthorized access
- ❌ Data integrity issues
- ❌ Password stored in plain text
- ❌ CORS allowing invalid origins

---

## 9. Test Deliverables

1. ✅ Test Plan Document (this file)
2. ✅ Test Cases with expected results
3. ✅ Test Scripts (API tests)
4. ✅ Test Execution Report
5. ✅ Bug Report (if any)
6. ✅ Test Coverage Metrics

---

## 10. Sign-off

| Role | Name | Date | Status |
|------|------|------|--------|
| QA Lead | Automated Tests | 2026-05-02 | ⏳ |
| Dev Lead | Code Review | 2026-05-02 | ⏳ |
| Product Owner | Requirements Met | 2026-05-02 | ⏳ |

---

**Test Plan Version**: 1.0  
**Last Updated**: May 2, 2026  
**Status**: Ready for Execution

# NatuCoconut — Test Suite

## Run API Tests (while docker-compose is running)

```bash
# Basic run
node tests/api.test.js

# Against production
API_URL=https://yoursite.com/api node tests/api.test.js
```

## What's Tested (27 tests)

| Group           | Tests |
|----------------|-------|
| Health Check   | API responds, status ok |
| Auth           | Register, login, duplicate, wrong password |
| Products       | List, filter by category, search |
| Orders         | Place COD, auth required, empty items, my orders |
| Admin          | Login, get orders, stats, update status, customer blocked |
| Security       | SQL injection, XSS, JWT tamper, missing token |

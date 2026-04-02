# E2E Automation Tests
This project contains automated tests for a web application using Node.js, TypeScript, Playwright, Allure reports, and TestRail integration.

## Prerequisites
- Node.js latest LTS version installed
- Environment configuration (see Setup section)

## Setup

To set up the project and run tests locally, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the `e2e_tests` directory.
3. Install dependencies by running: 
```bash
npm install
```

4. Install Playwright by running:
```bash
npx playwright install
```

5. Create a `.env` file in the root of the project directory with the following content:
```bash
BASE_URL = https://your-app-domain.com/
API_URL = https://api.your-app-domain.com/api/v1
USERNAME = testuser@example.com
PASSWORD = your_test_password_here
PROXY = "socks5://127.0.0.1:9999"
TESTRAIL_URL = https://your-testrail-instance.io/
TESTRAIL_USERNAME = your_testrail_email@example.com
TESTRAIL_PROJECT_ID = 1
TESTRAIL_SUITE_ID = 1
TESTRAIL_PROJECT_NAME = "Your Project Name"
```
   Note: Update these values with your actual environment details.

6. To run the tests locally, execute the following command:
   (run proxy server to run tests locally)
```bash
npm run test
```

7. To run specific scenarios, use the `TAGS` parameter as follows:
```bash
npm run test <e2e_tests/tests/<test_name>.spec.ts>
```

8. To generate the test report (under test-results/reports folder), execute the following command:
```bash
npm run report-publish
```

## Directory Structure
- `pages`: contains pages in POM
- `test-results`: Contains test result files (after tests execution completes).

## Contributing
Feel free to contribute to this project by opening issues or pull requests. Contributions are welcome!

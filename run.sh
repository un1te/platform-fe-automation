npm test
cp -r allure-report/history/ allure-results/history/
allure generate allure-results -o allure-report --clean


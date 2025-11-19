# Jake's Developer Portfolio

## Getting Started

To get the frontend running, you can follow these steps.

```
# Clone this repo
git clone https://github.com/jakekohl/portfolio

# Install packages
cd frontend
npm i
```

The frontend does leverage backend API calls to load data, so you will need to also get that running as well.

## Cypress & Playwright

### Current Test Results
Cypress Cloud Results can be found here, where you can see history of runs through local development and from the CI/CD Pipeline

[![portfolio](https://img.shields.io/endpoint?url=https://cloud.cypress.io/badge/detailed/kz76nf&style=for-the-badge&logo=cypress)](https://cloud.cypress.io/projects/kz76nf/runs)


### Running Cypress Tests

You can run the Cypress test suite against the deployed site (`https://www.jakekohl.dev`) or locally after cloning the repository. Below are step-by-step instructions for both approaches.

```
# Run Cypress locally against the deployed site
npx cypress run --config baseUrl=https://www.jakekohl.dev

# Or open the Cypress UI with the deployed site as baseUrl
npx cypress open --config baseUrl=https://www.jakekohl.dev

# Local Cypress Running will need both backend and frontend running
npx cypress open
```

### Running Playwright Test Automations
`Coming Soon`
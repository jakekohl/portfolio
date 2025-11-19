# Jake's Developer Portfolio

Hey there! 👋

This project is my personal professional portfolio—a place to highlight my work, skills, and experience in tech. But it’s more than just a digital resume. I built this site as a hands-on sandbox for experimenting with modern web development tools, frameworks, and best practices. 

One of my main goals here is to showcase robust test automation, so you’ll find real-world implementations of both **Cypress** and **PlayWright** throughout the codebase. Whether you’re a recruiter, a fellow developer, or just curious, feel free to poke around and see how I approach building, testing, and continuously improving QA Test Automations within modern web applications!

## Current Technologies Implemented

This project leverages a modern web stack and several best-in-class tools:

- **Vue 3**: The core framework for building the user interface.
- **PrimeVue**: A rich UI component library for Vue, used extensively for layout and interactive elements.
- **Cypress**: End-to-end and component testing framework, with custom commands and workflows implemented.
- **Playwright**: Planned for future implementation as an additional E2E testing solution.
- **Vite**: Lightning-fast build tool and development server.
- **Other Node Packages**: For a full list of dependencies and devDependencies, see the [package.json](./package.json).

You’ll find these technologies reflected throughout the codebase, with more details and specific versions in the [package.json](./package.json).


## Cypress & Playwright

### Current Test Results
Cypress Cloud Results can be found here, where you can see history of runs through local development and from the CI/CD Pipeline

[![jakekohl.github.io](https://img.shields.io/endpoint?url=https://cloud.cypress.io/badge/detailed/kz76nf&style=for-the-badge&logo=cypress)](https://cloud.cypress.io/projects/kz76nf/runs)


### Running Cypress Tests

You can run the Cypress test suite against the deployed site (`https://www.jakekohl.dev`) or locally after cloning the repository. Below are step-by-step instructions for both approaches.

```
# Clone this repo
git clone https://github.com/jakekohl/portfolio

# Install packages
npm i

# Run Cypress locally against the deployed site
npx cypress run --config baseUrl=https://www.jakekohl.dev

# Or open the Cypress UI with the deployed site as baseUrl
npx cypress open --config baseUrl=https://www.jakekohl.dev

# If you want to run this locally, you can run the source code locally and run Cypress locally
npm run dev && npm run cy:open
```

### Running Playwright Test Automations
`Coming Soon`
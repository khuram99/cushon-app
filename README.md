# 🚀 Cushon Investment App

A React + TypeScript application that simulates ISA investment for **retail customers**, with extensibility for employee flows. Designed with modularity, scalability, and real-world investment rules in mind.

> **💡 Context**: Cushon aims to offer ISAs directly to retail customers, distinct from employer-linked offerings. This app captures user investment preferences (fund + amount), maintains session state, and lays a foundation for future multi-fund support.

---

## 🧠 Key Features

### 🔐 Authentication & Role Separation

- **Role-based logic** (Employee vs Retail) with mock login credentials
- Two simulated login flows (can be merged in a real-world app via token introspection)

### 💰 Investment Experience

- **Select a fund** (single for now, multi-fund ready)
- **Input investment amount**
- **Validation of UK ISA annual allowance** (£20,000 limit) with blocking on exceeding the cap
- Investment details are recorded, persisted, and viewable

### ⚡ Performance & UX

- ⚛️ **RTK Query for data fetching & caching**
- 🧠 **Client-side caching** with invalidation when query changes
- 💾 **Code splitting** for dashboards (Retail & Employee)
- 📊 **Fund cards** show details with optional charts (placeholder for extensibility)

### 🔧 Developer-Focused

- Modular components, typed Redux store, and clean folder structure
- Mock API layer using static JSONs – easily swappable with real backend
- React Hook Form for robust form handling

---

## 🔒 Tech & Design Decisions

| Area             | Decision                                                                     |
| ---------------- | ---------------------------------------------------------------------------- |
| Fund selection   | Used Dropdown with array state to support single or multi funds              |
| ISA cap (£20k)   | Warns user if exceeding UK limit, but allows submission (future enhancement) |
| Authentication   | Simple email/password mock with `.env` config, no real token parsing         |
| Persistence      | Local/session storage for session state                                      |
| State Management | Redux Toolkit with RTK Query                                                 |
| Data Loading     | Lazy load dashboards via dynamic imports for better separation               |
| Component Reuse  | Shared UI components between roles where appropriate                         |
| API Security     | Skipped for mock, recommended usage of token-based auth in real setup        |

---

## 📈 Potential Enhancements (for real-world app)

| Area                 | Suggested Improvement                                                           |
| -------------------- | ------------------------------------------------------------------------------- |
| Auth Provider        | Use Auth0, Cognito, or Okta to issue JWTs and manage sessions                   |
| Real API Integration | Replace mock API layer with REST/GraphQL backend                                |
| Single Login Form    | Merge employee/retail login, derive role from backend token                     |
| Design System        | Use an internal component library for styling consistency and rapid prototyping |
| Accessibility        | Improve ARIA labels and keyboard navigation support                             |
| CI/CD                | Add GitHub Actions or CircleCI for test/lint/build pipelines                    |
| Fund Filtering       | Add search/sort/filter options for fund list                                    |
| Investment History   | View historical investments per user                                            |

---

## ⚙️ Quick Start

### 1. Clone and Configure

```bash
git clone https://github.com/khuram99/cushon-app.git
cd cushon-app
cp .env .env

# Employee Credentials
VITE_EMPLOYEE_EMAIL=employee@cushon.com
VITE_EMPLOYEE_PASSWORD=StrongPassword123

# Retail Customer Credentials
VITE_RETAIL_EMAIL=customer@retail.com
VITE_RETAIL_PASSWORD=StrongPassword123
```

### 2. Start App (Dev)

```bash
npm install
npm run dev
```

### 3. Login with Demo Accouts

| Role        | Email                 | Password          |
| ----------- | --------------------- | ----------------- |
| Employee    | [employee@cushon.com] | StrongPassword123 |
| Retail User | [customer@retail.com] | StrongPassword123 |

### 4. Running Tests

```bash
npm test                 # Watch mode
npm run test:run         # One-time run
npm run test:coverage    # Coverage report
```

### Test Types

| Type            | Description                                    |
| --------------- | ---------------------------------------------- |
| Unit Tests      | Redux slices, utilities, and validation logic  |
| Component Tests | Skipped but can be added with snapshot testing |
| Integration     | Login → Invest → View flow                     |

🏗️ ## Tech Stack
| Layer | Tech Used |
| ------------- | ------------------------------ |
| Framework | React 19 + Vite |
| Language | TypeScript |
| State Mgmt | Redux Toolkit + RTK Query |
| Forms | React Hook Form |
| Routing | React Router |
| UI Components | MUI (Material-UI) |
| Testing | Vitest + React Testing Library |
| Persistence | localStorage, sessionStorage |

📁 ## Folder Structure

```bash
src/
├── store/api/            # RTK Query endpoints
├── components/           # Shared UI components
├── features/             # Feature-specific logic (auth, investment) NOT IMPLEMENTED DUE TO LIMITED SCOPE
├── pages/                # Route-level components
├── store/                # Redux slices and setup
├── test/                 # Test utilities
├── types/                # Global types
```

🧠 ## Known Limitations / Assumptions
No real API or auth token parsing – mocked for brevity
Investment record is local only; assumed to be fetched/saved to backend in future

# 💰 Finance Dashboard

A modern and responsive Finance Dashboard built to help users track, analyze, and understand their financial activity through a clean and intuitive interface.

This project focuses on frontend design, component structuring, and state management without relying on a backend.

---

## 🚀 Live Demo

👉 https://finance-dashboard-fawn-theta.vercel.app/

---

## 📌 Features

### 📊 Dashboard Overview

* Summary cards displaying:

  * Total Balance
  * Total Income
  * Total Expenses
* Interactive charts:

  * Line chart for financial trends over time
  * Pie chart for category-wise expense distribution

---

### 📋 Transactions Management

* View all transactions with:

  * Date
  * Amount
  * Category
  * Type (Income / Expense)
* Functionalities:

  * 🔍 Search transactions
  * 🔽 Filter by type/category
  * ↕ Sort by date or amount

---

### 👤 Role-Based UI (Frontend Simulation)

* Switch between roles:

  * **Viewer** → Read-only access
  * **Admin** → Can add, edit, and delete transactions
* Demonstrates conditional rendering and UI control

---

### 💡 Insights Section

* Displays useful financial insights:

  * Highest spending category
  * Monthly comparison
  * Key spending patterns

---

### 🧠 State Management

* Managed using React Context API
* Handles:

  * Transactions data
  * Filters and search
  * User role

---

### 🎨 UI/UX Highlights

* Clean and modern design
* Fully responsive layout (mobile + desktop)
* Smooth hover effects and transitions
* Handles empty states and edge cases gracefully

---

### ⭐ Additional Features

* 🌙 Dark mode support
* 💾 Local storage persistence
* ⚡ Fast performance using Vite

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite)
* **Styling:** Tailwind CSS
* **Charts:** Recharts
* **State Management:** Context API

---

## 📂 Project Structure

```
src/
 ├── components/
 │   ├── SummaryCard.jsx
 │   ├── TransactionTable.jsx
 │   ├── Charts.jsx
 │   ├── RoleSwitcher.jsx
 │   ├── Insights.jsx
 │   └── Modal.jsx
 │
 ├── context/
 │   └── AppContext.jsx
 │
 ├── data/
 │   └── mockData.js
 │
 ├── pages/
 │   └── Dashboard.jsx
 │
 ├── utils/
 │   └── helpers.js
 │
 └── App.jsx
```

---

## ⚙️ Setup Instructions

1. Clone the repository:

```
git clone <finance-dashboard>
cd finance-dashboard
```

2. Install dependencies:

```
npm install
```

3. Run the project:

```
npm run dev
```

4. Open in browser:

```
http://localhost:5173
```

---

## 🧩 Key Design Decisions

* Focused on **clarity over complexity** to match real-world product design
* Used **Context API** to avoid prop drilling and maintain clean state flow
* Designed reusable components for scalability
* Implemented role-based UI to simulate real application behavior

---

## ⚠️ Assumptions

* Data is mocked (no backend integration)
* Role-based access is simulated on frontend only
* Insights are computed from available mock data

---

## 📈 Future Improvements

* Backend integration (Node.js + MongoDB)
* Authentication system
* Advanced analytics & filtering
* Export reports (CSV/JSON)
* Real-time data integration

---

## 🙌 Conclusion

This project demonstrates how a simple idea can be transformed into a clean and functional financial dashboard by focusing on user experience, structured design, and maintainable code.

---

⭐ If you found this project useful, feel free to star the repository!

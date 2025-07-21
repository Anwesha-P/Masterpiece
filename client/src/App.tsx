import { useState } from "react";
import "./App.css";
import { AuditForm } from "./components/AuditForm";
import { AuditHistory } from "./components/AuditHistory"; // if/when you build this

function App() {
  const [activeTab, setActiveTab] = useState<"audit" | "history">("audit");

  return (
    <div className="app-container">
      {activeTab === "audit" ? <AuditForm /> : <AuditHistory />}

      <nav className="bottom-nav">
        <button
          className={activeTab === "audit" ? "active" : ""}
          onClick={() => setActiveTab("audit")}>
          Audit
        </button>
        <button
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
      </nav>
    </div>
  );
}

export default App;

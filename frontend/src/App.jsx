import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { analyzeCode, getProfile } from "./api";
import AuthSuccess from "./AuthSuccess";
import ScreenshotAnnotator from "./ScreenshotAnnotator";


/* ------------------------------
   GOOGLE LOGIN
-------------------------------- */
function loginWithGoogle() {
  window.location.href = "http://localhost:8000/auth/login";
}

/* ------------------------------
   HOME
-------------------------------- */
function Home() {
  const [code, setCode] = useState("");
  const [logs, setLogs] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [screenshot, setScreenshot] = useState(null);

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });


  /* ------------------------------
     LOAD PROFILE ON LOGIN
  -------------------------------- */
  useEffect(() => {
  const syncAuth = () => {
    setToken(localStorage.getItem("token"));
    const raw = localStorage.getItem("user");
    setUser(raw ? JSON.parse(raw) : null);
  };

  window.addEventListener("storage", syncAuth);
  return () => window.removeEventListener("storage", syncAuth);
}, []);


  /* ------------------------------
     LOGOUT
  -------------------------------- */
  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setResult(null);
  }

  /* ------------------------------
     ANALYZE
  -------------------------------- */
  async function handleAnalyze() {
    if (!token) {
      alert("Please sign in first");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("code", code);
      formData.append("logs", logs);

      if (screenshot) {
        formData.append("image", screenshot);
      }

      const res = await analyzeCode(formData);
      setResult(res);
    } catch (err) {
      alert(err.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.app}>
      <h1 style={styles.title}>Agentic Debug Assistant</h1>

      {/* AUTH BAR */}
      <div style={styles.authBar}>
        {!token ? (
          <button onClick={loginWithGoogle} style={styles.googleBtn}>
            Sign in with Google
          </button>
        ) : (
          user && (
            <div style={styles.profileBar}>
              <img src={user.picture} alt="profile" style={styles.avatar} />
              <div>
                <div style={{ fontWeight: "bold" }}>{user.name}</div>
                <div style={{ fontSize: "12px", opacity: 0.7 }}>
                  {user.email}
                </div>
              </div>
              <button onClick={logout} style={styles.logoutBtn}>
                Logout
              </button>
            </div>
          )
        )}
      </div>

      {/* INPUTS */}
      <div style={styles.centerContainer}>
        <div style={styles.inputCard}>
          <h2>Code</h2>
          <textarea
            style={styles.textarea}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
          />
        </div>

        <div style={styles.inputCard}>
          <h2>Logs / Error Output</h2>
          <textarea
            style={styles.textarea}
            value={logs}
            onChange={(e) => setLogs(e.target.value)}
            placeholder="Paste runtime errors or logs..."
          />
        </div>
      </div>

      {/* SCREENSHOT */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <div style={styles.inputCard}>
          <h2>Screenshot (Optional)</h2>
          <ScreenshotAnnotator onExport={setScreenshot} />
        </div>
      </div>

      {/* ANALYZE */}
      <button
        style={styles.button}
        onClick={handleAnalyze}
        disabled={loading || !token}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {/* RESULTS */}
      {result && (
        <div style={styles.resultsGrid}>
          <div style={{ ...styles.card, ...styles.errorCard }}>
            <h2>Error Detection</h2>
            <p><b>Message:</b> {result.error_summary.message}</p>
            <p><b>Root Cause:</b> {result.error_summary.root_cause}</p>
            <p>
              <b>Type & Severity:</b>{" "}
              <span style={styles.badgeRed}>
                {result.error_type} | {result.severity}
              </span>
            </p>
          </div>

          <div style={{ ...styles.card, ...styles.successCard }}>
            <h2>Fix & Explanation</h2>
            <h4>Fixed Code</h4>
            <pre style={styles.pre}>{result.fixed_code}</pre>
            <h4>Explanation</h4>
            <p>{result.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------
   ROUTES
-------------------------------- */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/success" element={<AuthSuccess />} />
    </Routes>
  );
}

/* ========================= */
/* STYLES                    */
/* ========================= */

const styles = {
  app: {
    width: "100vw",
    height: "100vh",
    background: "#0f1117",
    color: "#e6e6eb",
    padding: "32px",
    boxSizing: "border-box",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  title: {
    fontSize: "34px",
    marginBottom: "16px",
  },
  authBar: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "20px",
  },
  profileBar: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#161a22",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #242938",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
  },
  googleBtn: {
    background: "#fff",
    color: "#000",
    padding: "10px 18px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
  logoutBtn: {
    marginLeft: "12px",
    background: "#ff6b6b",
    color: "#000",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  centerContainer: {
    display: "flex",
    gap: "24px",
    justifyContent: "center",
    marginBottom: "24px",
  },
  inputCard: {
    width: "480px",
    background: "#161a22",
    border: "1px solid #242938",
    borderRadius: "12px",
    padding: "16px",
  },
  textarea: {
    width: "100%",
    height: "180px",
    background: "#0f1117",
    color: "#e6e6eb",
    border: "1px solid #242938",
    borderRadius: "8px",
    padding: "12px",
    resize: "none",
  },
  button: {
    display: "block",
    margin: "0 auto 32px",
    padding: "12px 28px",
    background: "#4f8cff",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
  },
  resultsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },
  card: {
    borderRadius: "14px",
    padding: "20px",
    border: "1px solid",
  },
  errorCard: {
    background: "#1a1416",
    borderColor: "#ff6b6b",
  },
  successCard: {
    background: "#141a16",
    borderColor: "#4ade80",
  },
  badgeRed: {
    background: "#ff6b6b",
    color: "#000",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "14px",
  },
  pre: {
    background: "#0f1117",
    padding: "12px",
    borderRadius: "8px",
    overflowX: "auto",
  },
};

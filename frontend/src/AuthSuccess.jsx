import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");
    const picture = params.get("picture");

    if (!token || !email) {
      alert("Login failed. Missing token.");
      navigate("/");
      return;
    }

    const user = {
      name,
      email,
      picture,
    };

    // ✅ SAVE AUTH STATE
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // ✅ REDIRECT HOME
    navigate("/", { replace: true });
  }, [navigate]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f1117",
        color: "#fff",
        fontSize: "20px",
      }}
    >
      Logging in…
    </div>
  );
}

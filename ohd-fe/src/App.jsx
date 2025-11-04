import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export default function App() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [formError, setFormError] = useState("");

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  // ✅ Login nội bộ (tạm demo)
  const handleInternalLogin = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      setLoading(true);
      // TODO: Call API login nội bộ
      showToast("success", "Đăng nhập nội bộ thành công!");
    } catch (err) {
      setFormError(err.message || "Không thể đăng nhập.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Login
  const handleGoogleSuccess = async (cred) => {
    try {
      setLoading(true);
      setFormError("");

      const idToken = cred?.credential;
      if (!idToken) return setFormError("Token Google không hợp lệ.");

      const payload = jwtDecode(idToken);
      const emailFromToken = payload?.email || "";

      const res = await fetch(`${API_BASE}/api/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: idToken, email: emailFromToken }),
        credentials: "include",
      });

      let data = null;
      try {
        data = await res.clone().json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        return setFormError(data?.message || "Email không được cấp quyền!");
      }

      if (data?.status === "approved") {
        localStorage.setItem(
          "ohd_auth",
          JSON.stringify({
            token: data.token,
            email: data?.user?.email || emailFromToken,
            name: data?.user?.name || "",
            picture: data?.user?.picture || "",
          })
        );

        setFormError("");
        // showToast("success", "Đăng nhập Google thành công!");
      } else {
        setFormError(data?.message || "Email không được cấp quyền!");
      }
    } catch (err) {
      setFormError("Không thể kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1526] flex items-center justify-center px-4 py-8">
      {/* Toast góc trên */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border ${
            toast.type === "error"
              ? "bg-rose-900/70 border-rose-600 text-rose-100"
              : "bg-emerald-900/70 border-emerald-600 text-emerald-100"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="w-full max-w-xl mx-auto space-y-8">
        {/* Tiêu đề */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">
            Cổng truy cập <span className="text-emerald-400">HelpDesk</span>
          </h2>
          <p className="text-white/60 mt-1 text-sm">
            Vui lòng đăng nhập để tiếp tục
          </p>
        </div>

        {/* Form đăng nhập */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-xl font-bold text-slate-900">Đăng nhập hệ thống</h1>
          <p className="text-slate-500 mt-1 text-sm">Email & Mật khẩu</p>

          <form onSubmit={handleInternalLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>
             <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 
                          text-slate-900 placeholder-slate-400
                          focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Mật khẩu
              </label>
              <input
                type="password"
                required
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 
                          text-slate-900 placeholder-slate-400
                          focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
              />
            </div>

            {/* ❗ Lỗi hiển thị dưới ô mật khẩu */}
            {formError && (
              <div className="p-3 rounded-lg bg-rose-100 border border-rose-400 text-rose-700 text-sm">
                {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 text-white font-semibold py-2.5 hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200"></span>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-500">Hoặc</span>
            </div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setFormError("Đăng nhập Google thất bại.")}
              theme="outline"
              shape="pill"
              text="continue_with"
              size="large"
              ux_mode="popup"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

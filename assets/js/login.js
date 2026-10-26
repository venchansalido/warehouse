// Login page logic (Supabase Auth, email + password)

const REDIRECT_AFTER_LOGIN = "dashboard.html"; // change to your first page

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submitBtn");
const btnLabel = submitBtn.querySelector(".btn__label");
const alertBox = document.getElementById("alert");
const toggleBtn = document.getElementById("togglePassword");
const forgotLink = document.getElementById("forgot");

document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Helpers ----------
function showAlert(message, type = "error") {
  alertBox.textContent = message;
  alertBox.classList.toggle("alert--success", type === "success");
  alertBox.hidden = false;
}

function clearAlert() {
  alertBox.hidden = true;
  alertBox.textContent = "";
  emailInput.classList.remove("is-invalid");
  passwordInput.classList.remove("is-invalid");
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.classList.toggle("is-loading", isLoading);
  btnLabel.textContent = isLoading ? "Signing in..." : "Sign in";
}

// ---------- Skip login if already signed in ----------
(async () => {
  const { data } = await supabaseClient.auth.getSession();
  if (data.session) window.location.replace(REDIRECT_AFTER_LOGIN);
})();

// ---------- Show / hide password ----------
toggleBtn.addEventListener("click", () => {
  const show = passwordInput.type === "password";
  passwordInput.type = show ? "text" : "password";
  toggleBtn.setAttribute("aria-label", show ? "Hide password" : "Show password");
});

// ---------- Sign in ----------
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearAlert();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    if (!email) emailInput.classList.add("is-invalid");
    if (!password) passwordInput.classList.add("is-invalid");
    showAlert("Please enter your email and password.");
    return;
  }

  if (!navigator.onLine) {
    showAlert("You're offline. Connect to the internet to sign in.");
    return;
  }

  setLoading(true);

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

  if (error) {
    setLoading(false);
    const msg = error.message.toLowerCase().includes("invalid login")
      ? "Incorrect email or password."
      : error.message;
    showAlert(msg);
    passwordInput.value = "";
    passwordInput.focus();
    return;
  }

  window.location.replace(REDIRECT_AFTER_LOGIN);
});

// ---------- Forgot password ----------
forgotLink.addEventListener("click", async (e) => {
  e.preventDefault();
  clearAlert();

  const email = emailInput.value.trim();
  if (!email) {
    emailInput.classList.add("is-invalid");
    emailInput.focus();
    showAlert("Enter your email above first, then click \"Forgot password?\".");
    return;
  }

  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + "/login.html",
  });

  if (error) showAlert(error.message);
  else showAlert("Password reset link sent. Check your email.", "success");
});
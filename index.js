
var BASE_URL = "https://gccschool.com";
// var BASE_URL = "https://kcglobed-gcc-website-932479078084.asia-south1.run.app";
var mode = "production";
var GCC_BACKEND_URL = "https://gccwebsite-admin-prod-backend-738131651355.asia-south1.run.app"
// var GCC_BACKEND_URL = "https://gccwebsite-admin-backend-738131651355.asia-south1.run.app"
// var mode = "sandbox"
var FORM_TYPE = 1

var OTP_BASE_URL = "https://gccschool.com";
let isOTPVerified = false;


window.addEventListener("scroll", function () {
  var scrollBottom = window.scrollY + window.innerHeight;
  var docHeight = document.documentElement.scrollHeight;
  if (scrollBottom > docHeight * 0.75) {
    var dc = document.getElementById("dualCta");
    if (dc && !dc.classList.contains("visible")) {
      dc.classList.add("visible");
    }
  }
});



let isReferralApplied = false;
let verifiedReferralCode = "";
let isVerifyingReferral = false;

function resetReferralState() {
  if (isReferralApplied) {
    isReferralApplied = false;
    verifiedReferralCode = "";
    document.getElementById("apply_referral_btn").innerHTML = "Apply";
    document.getElementById("apply_referral_btn").disabled = false;
    document.getElementById("apply_referral_btn").style.background = "var(--bp)";
    document.getElementById("success_gcc_referral_code").style.display = "none";
    document.getElementById("gcc_referral_code").style.borderColor = "var(--pb)";
    document.getElementById("gcc_referral_code").readOnly = false;
    
    // Reset main button text
    document.getElementById("main_submit_text").innerHTML = "Pay ₹249 &amp; Register";
  }
  document.getElementById("err_gcc_referral_code").style.display = "none";
  document.getElementById("gcc_referral_code").classList.remove("invalid");
}

async function verifyAndApplyReferral() {
  const codeInput = document.getElementById("gcc_referral_code");
  const code = codeInput.value.trim();
  const errEl = document.getElementById("err_gcc_referral_code");
  const btn = document.getElementById("apply_referral_btn");
  
  if (!code) return;
  
  isVerifyingReferral = true;
  errEl.style.display = "none";
  codeInput.classList.remove("invalid");
  btn.textContent = "Verifying...";
  btn.disabled = true;

  try {
    const verifyRes = await fetch(`${GCC_BACKEND_URL}/api/users/verify_refferal_code/`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refferal_code: code })
    });
    
    let result;
    try {
        result = await verifyRes.json();
    } catch(e) {
        throw new Error("Invalid response from server");
    }

    if (verifyRes.ok === false || result?.success === false || result?.data?.verified_status === false) {
        errEl.textContent = result?.message || result?.data?.message || 'Invalid referral code';
        errEl.style.display = "block";
        codeInput.classList.add("invalid");
        btn.textContent = "Apply";
        btn.disabled = false;
    } else {
        isReferralApplied = true;
        verifiedReferralCode = code;
        btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="margin-right:4px;"><polyline points="20 6 9 17 4 12"></polyline></svg> Applied';
        btn.style.background = "var(--gn)";
        codeInput.style.borderColor = "var(--gn)";
        codeInput.readOnly = true;
        document.getElementById("success_gcc_referral_code").style.display = "flex";
        
        // Update main button text
        document.getElementById("main_submit_text").textContent = "Register for Free";
    }
  } catch (err) {
    console.error('[Verify Referral Code] Error:', err);
    errEl.textContent = err.message || 'Invalid referral code';
    errEl.style.display = "block";
    codeInput.classList.add("invalid");
    btn.textContent = "Apply";
    btn.disabled = false;
  } finally {
    isVerifyingReferral = false;
  }
}

function closeCelebrationModal() {
  const overlay = document.getElementById("celebrationModalOverlay");
  if (overlay) overlay.classList.remove("active");
  // Reload the page to clear state after success
  window.location.reload();
}

function showCelebrationModal() {
  const overlay = document.getElementById('celebrationModalOverlay');
  const container = document.getElementById('confettiContainer');
  if (overlay) overlay.classList.add('active');
  
  if (container) {
    container.innerHTML = '';
    const colors = ['#5B32CC', '#CC7A05', '#F5A623', '#7A2899', '#1A7A4A'];
    for (let i = 0; i < 40; i++) {
      const particle = document.createElement('span');
      particle.className = 'confetti-particle';
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const animDuration = 1 + Math.random() * 2;
      const animDelay = Math.random() * 1.5;
      
      particle.style.backgroundColor = color;
      particle.style.left = left + '%';
      particle.style.animation = `confetti-fall ${animDuration}s ${animDelay}s forwards ease-in`;
      
      container.appendChild(particle);
    }
  }
}

function handlePayClick() {
  const fields = ["gcc_name", "gcc_email", "gcc_phone", "gcc_state", "gcc_city", "gcc_degree", "gcc_commerce_graduate"];

  // Reset all errors
  fields.forEach(f => {
    const errEl = document.getElementById("err_" + f);
    const inputEl = document.getElementById(f === "gcc_degree" ? "gcc_degree_search" : f);
    if (errEl) errEl.style.display = "none";
    if (inputEl) inputEl.classList.remove("invalid");
  });
  const mainErrEl = document.getElementById("gccFormError");
  if (mainErrEl) mainErrEl.style.display = "none";

  const name = document.getElementById("gcc_name").value.trim();
  const email = document.getElementById("gcc_email").value.trim();
  const phone = document.getElementById("gcc_phone").value.trim();
  const city = document.getElementById("gcc_city").value.trim();
  const state = document.getElementById("gcc_state").value.trim();
  const degree = document.getElementById("gcc_degree").value.trim();
  const commerceChecked = document.getElementById("gcc_commerce_graduate").checked;

  let hasError = false;

  if (!name) { setFieldError("gcc_name", "Full name is required"); hasError = true; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFieldError("gcc_email", "Valid email is required"); hasError = true; }
  if (!phone || !/^[6-9]\d{9}$/.test(phone)) { setFieldError("gcc_phone", "10-digit mobile number is required"); hasError = true; }
  if (!state) { setFieldError("gcc_state", "State selection is required"); hasError = true; }
  if (!city) { setFieldError("gcc_city", "City selection is required"); hasError = true; }
  if (!degree) { setFieldError("gcc_degree", "University selection is required"); hasError = true; }
  if (!commerceChecked) { setFieldError("gcc_commerce_graduate", "This confirmation is required"); hasError = true; }

  // if (!isOTPVerified) {
  //   setFieldError("gcc_phone", "Please verify your mobile number via OTP first");
  //   hasError = true;
  // }

  if (hasError) {
    // Scroll to first error
    const firstErr = document.querySelector(".field-error[style*='display: block']");
    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  showLoadingModal("Initializing secure checkout...");
  startPayment(name, email, phone, city, state, degree);
}

function setFieldError(fieldId, msg) {
  const errEl = document.getElementById("err_" + fieldId);
  const inputEl = document.getElementById(fieldId === "gcc_degree" ? "gcc_degree_search" : fieldId);
  if (errEl) {
    errEl.textContent = msg;
    errEl.style.display = "block";
  }
  if (inputEl) {
    inputEl.classList.add("invalid");
  }
}

async function startPayment(name, email, mobile, city, state, degree) {
  console.log("Starting payment initialization...", { name, email, mobile, city, state, degree });

  const urlParams = new URLSearchParams(window.location.search);
  const utm_campaign = urlParams.get("utm_campaign") || "";
  const utm_medium = urlParams.get("utm_medium") || "";
  const utm_source = urlParams.get("utm_source") || "";

  try {
    const payload = {
        full_name: name,
        email,
        phone: mobile,
        city,
        state,
        university: degree,
        utm_campaign,
        utm_medium,
        utm_source,
        source: 6,
        referred_code: isReferralApplied ? verifiedReferralCode : ""
    };

    if (isReferralApplied) {
        payload.fee_waiver_category = "Free of cost (FOC)";
    }

    // ✅ Step 1: Create Form
    const formRes = await fetch(GCC_BACKEND_URL + "/api/career/createdossierform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const formData = await formRes.json();
    console.log("createvslfinalform response:", formData);

    const latest_form_id = formData?.data?.id;
    console.log(latest_form_id, '--------')

    if (!latest_form_id) {
      throw new Error("Form ID not received");
    }

    // ✅ Step 2: Save Lead
    try {
      const leadRes = await fetch(BASE_URL + "/api/save-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          mobile,
          city,
          state,
          form_type: 1,
          form_id: latest_form_id,
          source: 6,
          action: "pay_now",
          commingAmount: isReferralApplied ? 0 : 249
        }),
      });

      const leadData = await leadRes.json();
      console.log("save-lead response:", leadData);

    } catch (leadErr) {
      console.error("Error in save-lead:", leadErr);
      // optional: continue flow
    }

    // GTM Lead Tracking: Fire only on successful form submission before moving to payment
    if (!finalFormSubmitFired) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "final_form_submit"
      });
      finalFormSubmitFired = true;
    }

    // ✅ Step 2.5: If Referral is Applied, skip payment entirely!
    if (isReferralApplied) {
      try {
        const studentRes = await fetch(GCC_BACKEND_URL + "/api/users/create_student/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: name,
            email: email,
            city: city,
            state: state,
            country: "India",
            phone1: mobile,
            referred_code: verifiedReferralCode,
          }),
        });
        const studentData = await studentRes.json();
        console.log("Student created (Referral):", studentData);

        closeStatusModal();
        
        if (studentRes.ok) {
          // Only show celebration if student was successfully created
          showCelebrationModal();
        } else {
          showStatusModal(false, studentData.message || "Could not register your profile. Please try again.", null);
        }
      } catch (studentErr) {
        console.error("Student creation failed:", studentErr);
        closeStatusModal();
        showStatusModal(false, "Server error. Could not complete registration.", null);
      }
      return;
    }

    // ✅ Step 3: Start Payment (normal flow)
    const paymentRes = await fetch(BASE_URL + "/api/start-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        mobile,
        city,
        state,
        form_type: 2,
        form_id: latest_form_id,
        source: 6,
        commingAmount: 249
      }),
    });

    const paymentData = await paymentRes.json();
    console.log("start-payment response:", paymentData);

    if (!paymentData.success) {
      showStatusModal(false, paymentData.message || "Could not initiate payment. Please try again.", null);
      return;
    }

    // ✅ Step 4: Launch Payment Gateway
    if (paymentData.gateway === "cashfree") {
      console.log("Launching Cashfree modal...");

      setTimeout(function () {
        closeStatusModal();
        launchCashfree(paymentData, { name, email, mobile, city, state, latest_form_id });
      }, 2000);

    } else {
      showStatusModal(false, "Unexpected gateway response. Please contact support.", null);
    }

  } catch (err) {
    console.error("Critical error in startPayment:", err);
    showStatusModal(false, "Something went wrong. Please try again.", null);
  }
}


function launchCashfree(data, form) {
  console.log("Initializing Cashfree checkout (v3)...");
  if (typeof Cashfree === "undefined") {
    showStatusModal(false, "Payment gateway could not be loaded. Please refresh the page.", data.cf_order_id);
    return;
  }
  const cashfree = Cashfree({ mode: mode });

  cashfree.checkout({
    paymentSessionId: data.payment_session_id,
    redirectTarget: "_modal",
  }).then((result) => {
    console.log("Cashfree checkout result object:", result);
    if (result.error) {
      console.warn("Cashfree checkout returned an error:", result.error);
      reportFailure(data.cf_order_id, null, result.error.message, result.error.code);
      showStatusModal(false, result.error.message, data.cf_order_id);
    } else if (result.paymentDetails) {
      console.log("Cashfree checkout success (via result object):", result.paymentDetails);
      completePayment(data.cf_order_id, form);
    } else if (result.redirect) {
      console.log("Cashfree checkout redirecting...");
    } else {
      console.log("Cashfree checkout finished without specific result. Verifying order status...");
      completePayment(data.cf_order_id, form);
    }
  });

  // Note: Older callbacks like onSuccess/onFailure are ignored in V3 checkout() options
  // but onClose might still be useful for manual closure detection if supported.
}


async function completePayment(cf_order_id, form) {
  console.log("Triggering /api/complete-payment for cf_order_id:", cf_order_id);
  showLoadingModal("Verifying your payment...");

  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const paymentRes = await fetch(BASE_URL + "/api/complete-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cf_order_id: cf_order_id,
        re_attempt_status: false,
      }),
    });

    const paymentData = await paymentRes.json();
    console.log("complete-payment response:", paymentData);

    if (paymentData.success) {
      console.log("Payment successful according to backend.");
      try {
        const studentRes = await fetch(GCC_BACKEND_URL + "/api/users/create_student/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: form.name,
            email: form.email,
            city: form.city,
            state: form.state,
            country: "India",
            phone1: form.mobile,
          }),
        });

        const studentData = await studentRes.json();
        console.log("Student created:", studentData);

      } catch (studentErr) {
        console.error("Student creation failed:", studentErr);
      }
      window.location.href = "/thank-you.html?cf_order_id=" + cf_order_id;

    } else {
      console.warn("Payment verification failed.", paymentData.message || "Unknown error");
      showStatusModal(false, paymentData.message || "Payment verification failed.", cf_order_id);
    }

  } catch (err) {
    console.error("complete-payment error:", err);
    showStatusModal(false, "Network error during verification.", cf_order_id);
  }
}
function showStatusModal(isSuccess, message, orderId) {
  var overlay = document.getElementById("statusModalOverlay");
  if (!overlay) return;

  var iconWrap = document.getElementById("statusIconWrap");
  var title = document.getElementById("statusTitle");
  var titleHighlight = document.getElementById("statusTitleHighlight");
  var desc = document.getElementById("statusDesc");
  var badge = document.getElementById("statusBadge");
  var dot = document.getElementById("statusDot");
  var leftText = document.getElementById("statusLeftText");
  var pid = document.getElementById("statusPaymentId");
  var retryBtn = document.getElementById("statusRetryBtn");
  var closeBtn = document.querySelector(".status-close-btn");

  overlay.classList.add("active");
  if (closeBtn) closeBtn.style.display = "flex";

  if (isSuccess) {
    iconWrap.className = "status-icon-wrap";
    iconWrap.innerHTML = '<div class="status-icon-outer"></div><div class="status-icon-middle"></div><div class="status-icon-inner"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>';
    badge.className = "status-badge";
    badge.textContent = "✦ CONFIRMED";
    title.childNodes[0].nodeValue = "Thank ";
    titleHighlight.textContent = "You!";
    titleHighlight.className = "text-yellow";
    desc.innerHTML = message ? message : 'Our team will <span class="text-highlight">reach out to you within 2 hours.</span><br>Please keep your phone accessible.';
    dot.className = "green-dot";
    leftText.textContent = "Team is online";
    retryBtn.style.display = "none";
  } else {
    iconWrap.className = "status-icon-wrap failed";
    iconWrap.innerHTML = '<div class="status-icon-outer"></div><div class="status-icon-middle"></div><div class="status-icon-inner"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div>';
    badge.className = "status-badge failed";
    badge.textContent = "✦ FAILED";
    title.childNodes[0].nodeValue = "Payment ";
    titleHighlight.textContent = "Failed";
    titleHighlight.className = "text-red";
    desc.innerHTML = message || "Your payment could not be processed.";
    dot.className = "red-dot";
    leftText.textContent = "System Error";
    retryBtn.style.display = "block";
  }

  if (orderId) {
    pid.style.display = "block";
    pid.textContent = "Payment ID: " + orderId;
  } else {
    pid.style.display = "none";
  }
}

function showLoadingModal(message) {
  var overlay = document.getElementById("statusModalOverlay");
  if (!overlay) return;

  var iconWrap = document.getElementById("statusIconWrap");
  var title = document.getElementById("statusTitle");
  var titleHighlight = document.getElementById("statusTitleHighlight");
  var desc = document.getElementById("statusDesc");
  var badge = document.getElementById("statusBadge");
  var dot = document.getElementById("statusDot");
  var leftText = document.getElementById("statusLeftText");
  var pid = document.getElementById("statusPaymentId");
  var retryBtn = document.getElementById("statusRetryBtn");
  var closeBtn = document.querySelector(".status-close-btn");

  overlay.classList.add("active");
  if (closeBtn) closeBtn.style.display = "none";

  iconWrap.className = "status-icon-wrap loading";
  iconWrap.innerHTML = '<div class="status-icon-outer" style="animation: spin 3s linear infinite;"></div><div class="status-icon-middle" style="animation: spin 2s linear infinite reverse;"></div><div class="status-icon-inner"><svg viewBox="0 0 24 24"><path d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.07-7.07l-2.83 2.83M7.76 16.24l-2.83 2.83M19.07 19.07l-2.83-2.83M4.93 4.93l2.83 2.83" style="animation: spin 1.5s linear infinite; transform-origin: 12px 12px;"/></svg></div>';

  badge.className = "status-badge loading";
  badge.textContent = "✦ PROCESSING";

  title.childNodes[0].nodeValue = "Please ";
  titleHighlight.textContent = "Wait";
  titleHighlight.className = "text-yellow";

  desc.innerHTML = message || 'We are securely initializing your payment gateway.<br>Do not refresh or close this window.';

  dot.className = "green-dot";
  leftText.textContent = "Secure Connection";

  retryBtn.style.display = "none";
  pid.style.display = "none";
}

function closeStatusModal() {
  var overlay = document.getElementById("statusModalOverlay");
  if (overlay) overlay.classList.remove("active");
}

function reportFailure(cf_order_id, payment_id, description, code) {
  console.log("Reporting payment failure to backend...", { cf_order_id, payment_id, description, code });
  fetch(BASE_URL + "/api/report-payment-failure", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cf_order_id: cf_order_id,
      cf_payment_id: payment_id || "",
      re_attempt_status: false,
      error_code: code || "",
      error_description: description || "",
      commingAmount: 249
    }),
  }).then(res => res.json()).then(data => {
    console.log("report-payment-failure response:", data);
  }).catch(function (e) {
    console.error("report-failure network error:", e);
  });
}


// State and City Dropdown Logic
let stateCityData = null;

function loadStateCityData() {
  fetch("./state-city.json")
    .then(res => res.json())
    .then(data => {
      stateCityData = data;
      const stateSelect = document.getElementById("gcc_state");
      if (stateSelect) {
        // Clear existing states
        while (stateSelect.options.length > 1) {
          stateSelect.remove(1);
        }

        // Add all states
        const states = Object.keys(data).sort();
        states.forEach(state => {
          const option = document.createElement("option");
          option.value = state;
          option.textContent = state;
          stateSelect.appendChild(option);
        });

        stateSelect.addEventListener("change", function () {
          updateCityDropdown(this.value);
        });

        // Just in case prefill has already set a value
        if (stateSelect.value) {
          updateCityDropdown(stateSelect.value);
        }
      }
    })
    .catch(err => console.error("Could not load state-city.json", err));
}

function updateCityDropdown(selectedState) {
  const citySelect = document.getElementById("gcc_city");
  if (!citySelect) return;

  // Reset options
  citySelect.innerHTML = '<option value="">Select city</option>';

  if (selectedState && stateCityData && stateCityData[selectedState]) {
    const cities = stateCityData[selectedState].sort();
    cities.forEach(city => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
  }
}

let universities = [];

function loadUniversityData() {
  if (window.UNIVERSITY_DATA && Array.isArray(window.UNIVERSITY_DATA)) {
    console.log("Loading university data from embedded source");
    universities = window.UNIVERSITY_DATA.sort();
    initSearchableSelect();
    return;
  }

  fetch("./university.json")
    .then(res => res.json())
    .then(data => {
      universities = data.sort();
      initSearchableSelect();
    })
    .catch(err => console.error("Could not load university.json", err));
}

function initSearchableSelect() {
  const searchInput = document.getElementById("gcc_degree_search");
  const hiddenInput = document.getElementById("gcc_degree");
  const optionsContainer = document.getElementById("gcc_degree_options");

  if (!searchInput || !optionsContainer) return;

  const renderOptions = (filter = "") => {
    optionsContainer.innerHTML = "";
    const filtered = universities.filter(uni =>
      uni.toLowerCase().includes(filter.toLowerCase())
    ).slice(0, 100); // Performance: show first 100 matches

    if (filtered.length === 0) {
      optionsContainer.innerHTML = '<div class="cs-opt no-res">No results found</div>';
    } else {
      filtered.forEach(uni => {
        const div = document.createElement("div");
        div.className = "cs-opt";
        div.textContent = uni;
        div.title = uni; // Tooltip for full name
        div.addEventListener("click", () => {
          searchInput.value = uni;
          hiddenInput.value = uni;
          optionsContainer.classList.remove("active");
          // Trigger change event for tracking
          searchInput.dispatchEvent(new Event('change'));
        });
        optionsContainer.appendChild(div);
      });
    }
  };

  searchInput.addEventListener("focus", () => {
    renderOptions(searchInput.value);
    optionsContainer.classList.add("active");
  });

  searchInput.addEventListener("input", () => {
    renderOptions(searchInput.value);
    optionsContainer.classList.add("active");
    // Optionally clear hidden value if input doesn't exactly match
    if (hiddenInput.value !== searchInput.value) {
      hiddenInput.value = "";
    }
  });

  // Close on click outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".custom-select-container")) {
      optionsContainer.classList.remove("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  loadStateCityData();
  loadUniversityData();
  setupAbandonmentTracking();
});

// Abandonment tracking
let abandonmentSentFor = "";
let finalFormSubmitFired = false;

function setupAbandonmentTracking() {
  const nameEl = document.getElementById("gcc_name");
  const emailEl = document.getElementById("gcc_email");
  const phoneEl = document.getElementById("gcc_phone");
  const cityEl = document.getElementById("gcc_city");
  const stateEl = document.getElementById("gcc_state");
  const degreeEl = document.getElementById("gcc_degree");

  const checkAndSend = async () => {
    const name = nameEl ? nameEl.value.trim() : "";
    const email = emailEl ? emailEl.value.trim() : "";
    const phone = phoneEl ? phoneEl.value.trim() : "";
    const city = cityEl ? cityEl.value.trim() : "";
    const state = stateEl ? stateEl.value.trim() : "";
    const degree = degreeEl ? degreeEl.value.trim() : "";

    // Validate fields
    if (!name) return;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) return;

    const contactKey = email + "|" + phone;
    if (abandonmentSentFor === contactKey) return; // Already sent for this user
    abandonmentSentFor = contactKey;

    const urlParams = new URLSearchParams(window.location.search);
    const utm_campaign = urlParams.get("utm_campaign") || "";
    const utm_medium = urlParams.get("utm_medium") || "";
    const utm_source = urlParams.get("utm_source") || "";

    try {
      await fetch(GCC_BACKEND_URL + "/api/career/createabondantform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name,
          email: email,
          phone: phone,
          city: city,
          state: state,
          university: degree,
          utm_campaign,
          utm_medium,
          utm_source,
          source: 6
        }),
      });
      console.log("Abandonment form submitted");
    } catch (e) {
      console.error("Error submitting abandonment form", e);
      abandonmentSentFor = "";
    }
  };

  if (nameEl) nameEl.addEventListener("blur", checkAndSend);
  if (emailEl) emailEl.addEventListener("blur", checkAndSend);
  if (phoneEl) phoneEl.addEventListener("blur", checkAndSend);
  if (cityEl) cityEl.addEventListener("change", checkAndSend);
  if (stateEl) stateEl.addEventListener("change", checkAndSend);
  if (degreeEl) degreeEl.addEventListener("change", checkAndSend);
}

function openPopup() {
  document.getElementById('brochure-popup').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closePopup() {
  document.getElementById('brochure-popup').classList.remove('active');
  document.body.style.overflow = '';
}

async function submitBrochure() {
  const n = document.getElementById('pp-name').value.trim();
  const p = document.getElementById('pp-phone').value.trim();
  const em = document.getElementById('pp-email').value.trim();

  if (!n || !p || !em) {
    alert('Please fill in all fields.');
    return;
  }

  // Basic validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { alert('Please enter a valid email.'); return; }
  if (!/^[6-9]\d{9}$/.test(p)) { alert('Please enter a valid 10-digit mobile number.'); return; }

  const urlParams = new URLSearchParams(window.location.search);
  const utm_campaign = urlParams.get("utm_campaign") || "";
  const utm_medium = urlParams.get("utm_medium") || "";
  const utm_source = urlParams.get("utm_source") || "";

  // Show loading state on button
  const btn = document.querySelector('#brochure-popup .lf-btn');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = 'Processing...';

  try {
    const response = await fetch(GCC_BACKEND_URL + "/api/career/createabondantform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: n,
        email: em,
        phone: p,
        source: 6,
        source_form: 1,
        utm_source: utm_source,
        utm_medium: utm_medium,
        utm_campaign: utm_campaign
      }),
    });
    const result = await response.json();
    console.log("Brochure lead captured:", result);
  } catch (e) {
    console.error("Error capturing brochure lead:", e);
  }

  btn.innerHTML = originalText;
  btn.disabled = false;
  
  closePopup();

  // Trigger PDF download
  const pdfUrl = "https://storage.googleapis.com/gcc_prod_static_files_backend/static/files/GCC%20SCHOOL%20Dossier.pdf";
  const a = document.createElement('a');
  a.href = pdfUrl;
  a.download = 'GCC_SCHOOL_Dossier.pdf';
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Send OTP Function
async function sendOTP() {
  const phone = document.getElementById("gcc_phone").value.trim();
  const btn = document.getElementById("btn_send_otp");

  if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
    setFieldError("gcc_phone", "Valid 10-digit mobile number is required");
    return;
  }

  // Clear previous errors for phone
  const errEl = document.getElementById("err_gcc_phone");
  if (errEl) errEl.style.display = "none";
  document.getElementById("gcc_phone").classList.remove("invalid");

  btn.disabled = true;
  btn.textContent = "Sending...";

  try {
    const response = await fetch(`${OTP_BASE_URL}/api/otp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile: phone }),
    });
    const result = await response.json();

    if (result.success || result.status === "success") {
      document.getElementById("otp_container").style.display = "block";
      btn.textContent = "Resend OTP";
    } else {
      setFieldError("gcc_phone", result.statusMessage || result.message || "Failed to send OTP. Try again.");
      btn.textContent = "Send OTP";
    }
  } catch (err) {
    console.error("Error sending OTP:", err);
    setFieldError("gcc_phone", "Network error. Please try again.");
    btn.textContent = "Send OTP";
  } finally {
    btn.disabled = false;
  }
}

async function verifyOTP() {
  const phone = document.getElementById("gcc_phone").value.trim();
  const otp = document.getElementById("gcc_otp").value.trim();
  const btn = document.getElementById("btn_verify_otp");

  if (!otp || otp.length < 6) {
    setFieldError("gcc_otp", "Enter a valid OTP");
    return;
  }

  // Clear previous errors for OTP
  const errEl = document.getElementById("err_gcc_otp");
  if (errEl) errEl.style.display = "none";
  document.getElementById("gcc_otp").classList.remove("invalid");

  btn.disabled = true;
  btn.textContent = "Verifying...";

  try {
    const response = await fetch(`${OTP_BASE_URL}/api/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile: phone, otp }),
    });
    const result = await response.json();

    if (result.success || result.status === "success") {
      isOTPVerified = true;
      btn.textContent = "Verified OTP";
      btn.classList.add("verified");
      btn.disabled = true;
      document.getElementById("gcc_phone").disabled = true;
      document.getElementById("btn_send_otp").style.display = "none";
      document.getElementById("gcc_otp").disabled = true;
    } else {
      setFieldError("gcc_otp", result.statusMessage || result.message || "Invalid OTP. Please try again.");
      btn.disabled = false;
      btn.textContent = "Verify OTP";
    }
  } catch (err) {
    console.error("Error verifying OTP:", err);
    setFieldError("gcc_otp", "Network error. Please try again.");
    btn.disabled = false;
    btn.textContent = "Verify OTP";
  }
}


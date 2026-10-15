import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Cross, UserRound, Mail, Phone, LockKeyhole, Eye, EyeOff,
  Building2, MapPin, FileText, UploadCloud, ShieldCheck, CheckCircle2, X
} from "lucide-react";
import "./Register.css";

const initialForm = {
  ownerName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  pharmacyName: "",
  licenseNumber: "",
  address: "",
  acceptTerms: false
};

const requiredDocuments = [
  {
    key: "pharmacyLicense",
    label: "Pharmacy / Drug Sale License",
    note: "Upload a clear copy of the valid pharmacy license.",
    accept: ".pdf,.png,.jpg,.jpeg"
  },
  {
    key: "ownerId",
    label: "Owner's Identity Document",
    note: "Upload an accepted government-issued ID.",
    accept: ".pdf,.png,.jpg,.jpeg"
  },
  {
    key: "businessRegistration",
    label: "Business Registration Certificate",
    note: "Upload the business registration document, if applicable.",
    accept: ".pdf,.png,.jpg,.jpeg"
  }
];

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [documents, setDocuments] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");

  function updateField(event) {
    const { name, value, checked, type } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value
    }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
    setNotice("");
  }

  function updateDocument(key, file) {
    setDocuments((previous) => ({ ...previous, [key]: file || null }));
    setErrors((previous) => ({ ...previous, [key]: "" }));
    setNotice("");
  }

  function validate() {
    const next = {};
    if (form.ownerName.trim().length < 2) next.ownerName = "Enter the owner's full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (!/^[0-9+\-\s()]{7,20}$/.test(form.phone.trim())) next.phone = "Enter a valid phone number.";
    if (form.password.length < 8) next.password = "Password must be at least 8 characters.";
    if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords do not match.";
    if (!form.pharmacyName.trim()) next.pharmacyName = "Enter the registered pharmacy name.";
    if (!form.licenseNumber.trim()) next.licenseNumber = "Enter the pharmacy license number.";
    if (!form.address.trim()) next.address = "Enter the pharmacy address.";

    requiredDocuments.forEach((document) => {
      const file = documents[document.key];
      if (!file) {
        next[document.key] = "This document is required.";
      } else if (file.size > 10 * 1024 * 1024) {
        next[document.key] = "File must be smaller than 10 MB.";
      } else if (!["application/pdf", "image/png", "image/jpeg"].includes(file.type)) {
        next[document.key] = "Upload a PDF, PNG, or JPG file.";
      }
    });

    if (!form.acceptTerms) next.acceptTerms = "Please confirm that the information is accurate.";
    return next;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setNotice("");

    if (Object.keys(validationErrors).length) {
      setNoticeType("error");
      setNotice("Please complete all required fields and upload the required documents.");
      return;
    }

    // This is a frontend demonstration. Files are not uploaded or stored until
    // this form is connected to a backend endpoint using FormData.
    setNoticeType("success");
    setNotice("Validation successful. Connect the form to your backend to securely submit the registration and documents.");
  }

  return (
    <main className="pharma-register-page">
      <aside className="register-aside">
        <Link to="/" className="register-logo">
          <span className="register-logo-icon"><Cross size={24} strokeWidth={3} /></span>
          <span>pharma<span className="register-logo-dot">.</span><small>SMART PHARMACY FINDER</small></span>
        </Link>

        <div className="register-aside-content">
          <span className="register-kicker"><ShieldCheck size={16} /> PHARMACY PARTNER REGISTRATION</span>
          <h1>Bring your pharmacy closer to the people who need it.</h1>
          <p>Register your pharmacy to manage medicine availability and help customers find your location.</p>
          <div className="register-points">
            <div><CheckCircle2 size={19} /><span>Manage listed medicines and stock</span></div>
            <div><CheckCircle2 size={19} /><span>Receive and manage reservation requests</span></div>
            <div><CheckCircle2 size={19} /><span>Help customers find your pharmacy</span></div>
          </div>
        </div>

        <div className="register-security-note">
          <ShieldCheck size={18} />
          <span>Documents should be reviewed securely by an authorized administrator before the pharmacy is activated.</span>
        </div>
      </aside>

      <section className="register-main">
        <div className="register-topline">
          <span>Already have an account?</span>
          <Link to="/login" className="register-login-link">Log in</Link>
        </div>

        <div className="register-form-container">
          <div className="register-heading">
            <span className="register-mobile-icon"><Cross size={23} /></span>
            <span className="register-section-label">GET STARTED</span>
            <h2>Register your pharmacy</h2>
            <p>Fill in the details below and attach the required documents.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <section className="register-form-section">
              <div className="register-section-title"><UserRound size={18} /><h3>Owner information</h3></div>
              <div className="register-fields-grid">
                <Field label="Owner's full name" name="ownerName" value={form.ownerName} onChange={updateField} error={errors.ownerName} placeholder="Enter full name" icon={<UserRound size={17} />} />
                <Field label="Email address" name="email" type="email" value={form.email} onChange={updateField} error={errors.email} placeholder="you@example.com" icon={<Mail size={17} />} />
                <Field label="Phone number" name="phone" type="tel" value={form.phone} onChange={updateField} error={errors.phone} placeholder="98XXXXXXXX" icon={<Phone size={17} />} />
                <div className="register-field">
                  <label htmlFor="password">Password <Required /></label>
                  <div className={`register-input-wrap ${errors.password ? "has-error" : ""}`}>
                    <LockKeyhole size={17} />
                    <input id="password" name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={updateField} placeholder="At least 8 characters" autoComplete="new-password" />
                    <button type="button" className="password-toggle" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
                  </div>
                  {errors.password && <span className="register-error">{errors.password}</span>}
                </div>
                <div className="register-field">
                  <label htmlFor="confirmPassword">Confirm password <Required /></label>
                  <div className={`register-input-wrap ${errors.confirmPassword ? "has-error" : ""}`}>
                    <LockKeyhole size={17} />
                    <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={form.confirmPassword} onChange={updateField} placeholder="Re-enter password" autoComplete="new-password" />
                    <button type="button" className="password-toggle" aria-label={showConfirmPassword ? "Hide password" : "Show password"} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
                  </div>
                  {errors.confirmPassword && <span className="register-error">{errors.confirmPassword}</span>}
                </div>
              </div>
            </section>

            <section className="register-form-section">
              <div className="register-section-title"><Building2 size={18} /><h3>Pharmacy information</h3></div>
              <div className="register-fields-grid">
                <Field label="Registered pharmacy name" name="pharmacyName" value={form.pharmacyName} onChange={updateField} error={errors.pharmacyName} placeholder="e.g. City Care Pharmacy" icon={<Building2 size={17} />} />
                <Field label="Pharmacy license number" name="licenseNumber" value={form.licenseNumber} onChange={updateField} error={errors.licenseNumber} placeholder="Enter license number" icon={<FileText size={17} />} />
                <div className="register-field register-full-width">
                  <label htmlFor="address">Pharmacy address <Required /></label>
                  <div className={`register-input-wrap ${errors.address ? "has-error" : ""}`}>
                    <MapPin size={17} />
                    <input id="address" name="address" value={form.address} onChange={updateField} placeholder="Street, area, city" />
                  </div>
                  {errors.address && <span className="register-error">{errors.address}</span>}
                </div>
              </div>
            </section>

            <section className="register-form-section">
              <div className="register-section-title"><FileText size={18} /><h3>Required documents</h3></div>
              <p className="register-document-intro">Upload clear, readable files. Accepted formats: PDF, JPG, or PNG. Maximum size: 10 MB per file.</p>
              <div className="register-documents">
                {requiredDocuments.map((document) => (
                  <div className={`register-document-card ${errors[document.key] ? "document-error" : ""}`} key={document.key}>
                    <div className="document-card-top">
                      <span className="document-icon"><FileText size={20} /></span>
                      <div className="document-card-copy">
                        <label htmlFor={document.key}>{document.label} <Required /></label>
                        <p>{document.note}</p>
                      </div>
                    </div>
                    <input id={document.key} className="document-input" type="file" accept={document.accept} onChange={(event) => updateDocument(document.key, event.target.files?.[0])} />
                    {documents[document.key] ? (
                      <div className="selected-file"><CheckCircle2 size={15} /><span>{documents[document.key].name}</span><button type="button" aria-label="Remove file" onClick={() => { updateDocument(document.key, null); const input = document.getElementById(document.key); if (input) input.value = ""; }}><X size={15} /></button></div>
                    ) : (
                      <label className="document-upload-button" htmlFor={document.key}><UploadCloud size={16} /> Choose file</label>
                    )}
                    {errors[document.key] && <span className="register-error">{errors[document.key]}</span>}
                  </div>
                ))}
              </div>
            </section>

            <div className="register-terms">
              <input id="acceptTerms" name="acceptTerms" type="checkbox" checked={form.acceptTerms} onChange={updateField} />
              <label htmlFor="acceptTerms">I confirm that the information and documents submitted are accurate and that the pharmacy can be contacted for verification. <Required /></label>
            </div>
            {errors.acceptTerms && <span className="register-error terms-error">{errors.acceptTerms}</span>}

            {notice && <div className={`register-notice ${noticeType}`} role="status">{notice}</div>}

            <button className="register-submit" type="submit">Submit registration <span>→</span></button>
            <p className="register-form-footnote">Your registration should remain pending until an administrator verifies the submitted documents.</p>
          </form>
        </div>
      </section>
    </main>
  );
}

function Required() {
  return <span className="required-mark" aria-label="required">*</span>;
}

function Field({ label, name, value, onChange, error, placeholder, icon, type = "text" }) {
  return (
    <div className="register-field">
      <label htmlFor={name}>{label} <Required /></label>
      <div className={`register-input-wrap ${error ? "has-error" : ""}`}>
        {icon}
        <input id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} autoComplete={name === "email" ? "email" : name === "phone" ? "tel" : "name"} />
      </div>
      {error && <span className="register-error">{error}</span>}
    </div>
  );
}

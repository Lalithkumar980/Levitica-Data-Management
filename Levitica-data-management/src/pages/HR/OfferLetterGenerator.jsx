import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import {
  FileText,
  Users,
  Download,
  Eye,
  Building2,
  User,
  DollarSign,
  Briefcase,
  FileCheck,
  ClipboardCheck,
  X,
  Plus,
  Mail,
} from "lucide-react";

const OFFER_TEMPLATES = [
  { id: "standard", name: "Standard Offer", description: "Professional offer letter with company terms.", applicableTo: ["L1", "L2", "L3", "L4", "All"] },
  { id: "formal", name: "Formal Letter", description: "Formal tone with detailed clauses.", applicableTo: ["L1", "L2", "L3", "L4", "All"] },
  { id: "short", name: "Short Offer", description: "Concise offer summary.", applicableTo: ["L1", "L2", "L3", "L4", "All"] },
];

const DEPARTMENTS = [
  "Engineering",
  "Sales",
  "Human Resources",
  "Marketing",
  "Finance",
  "Operations",
  "IT",
  "Other"
];
const OFFER_TYPES = ["Full-Time", "Contract", "Internship", "Consultant"];
const APPROVAL_WORKFLOWS = [
  { id: "direct", name: "Direct Manager → HR" },
  { id: "multi", name: "Manager → HR Head → CEO" },
  { id: "auto", name: "Auto-approval (Below ₹10L)" },
  { id: "other", name: "Other" }
];

const COUNTRIES = [
  "India",
  "USA",
  "UK",
  "Canada",
  "Australia",
  "Other"
];

const STATES_BY_COUNTRY = {
  India: [
    "Andhra Pradesh",
    "Telangana",
    "Karnataka",
    "Maharashtra",
    "Tamil Nadu",
    "Others"
  ],
  USA: [
    "California",
    "Texas",
    "Florida",
    "New York",
    "Illinois",
    "Others"
  ],
  UK: [
    "England",
    "Scotland",
    "Wales",
    "Northern Ireland",
    "London",
    "Others"
  ],
  Canada: [
    "Ontario",
    "Quebec",
    "British Columbia",
    "Alberta",
    "Manitoba",
    "Others"
  ],
  Australia: [
    "New South Wales",
    "Victoria",
    "Queensland",
    "Tasmania",
    "Western Australia",
    "Others"
  ]
};

const parseAmount = (v) => Number(String(v).replace(/,/g, "")) || 0;
const calculateGrossSalary = (ctc) =>
  parseAmount(ctc?.basic) + parseAmount(ctc?.hra) + parseAmount(ctc?.specialAllowance) + parseAmount(ctc?.conveyance) + parseAmount(ctc?.telephoneAllowance) + parseAmount(ctc?.medicalAllowance);
const calculateNetTakeHome = (ctc) =>
  calculateGrossSalary(ctc) - parseAmount(ctc?.employeePF) - parseAmount(ctc?.professionalTax) - parseAmount(ctc?.gratuityEmployee);
const calculateTotalMonthlyCTC = (ctc) =>
  calculateGrossSalary(ctc) + parseAmount(ctc?.employerPF) + parseAmount(ctc?.groupInsurance);
const calculateAnnualCTC = (ctc) => calculateTotalMonthlyCTC(ctc) * 12;
const formatCurrency = (n) => (n == null || isNaN(n) ? "0" : Number(n).toLocaleString("en-IN"));

const COMPANY = {
  name: "Levitica Technologies Private Limited",
  address: "Office #409, 4th Floor, Jain Sadguru Image's, Capital Pk Rd, Ayyappa Society, Madhapur, Hyderabad, Telangana 500081",
  phone: "+91 63056 75199",
  email: "hr@leviticatechnologies.com",
  website: "www.leviticatechnologies.com",
  CIN: "U72200TG2013PTC091836",
};

function getSalutation(gender) {
  switch (gender) {
    case "female": return "Ms.";
    case "male": return "Mr.";
    default: return "Mr./Ms.";
  }
}

function buildLeviticaOfferLetterHtml(offer) {
  const candidateName = offer?.candidateName || "Candidate";
  const position = offer?.position || "Associate Software Engineer";
  const joiningDate = offer?.joiningDate ? new Date(offer.joiningDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "To be confirmed";
  const ctc = offer?.ctc || "0";
  const gender = offer?.gender || "male";
  const fatherName = offer?.fatherName || "";
  const relation = offer?.relation && offer.relation !== "select" ? offer.relation : "S/O";
  const addr = offer?.address || {};
  const street = addr.street || "";
  const city = addr.city || "";
  const district = addr.district || "";
  const state = addr.state || addr.customState || "";
  const pincode = addr.pincode || "";
  const salutation = getSalutation(gender);
  const addressBlock = `${salutation} ${candidateName},<br>${relation} ${fatherName},<br>${street}, ${city},<br>${district}, State: ${state}. PIN Code: ${pincode}.`;
  const currentDateLong = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const ctcB = offer?.ctcBreakup || {};
  const formatAmt = (a) => (a == null || isNaN(a) ? "0" : Number(a).toLocaleString("en-IN"));
  const p = (v) => parseAmount(v);
  const breakupItems = [
    { label: "Basic Salary", amount: p(ctcB.basic) },
    { label: "House Rent Allowance (HRA)", amount: p(ctcB.hra) },
    { label: "Special Allowance", amount: p(ctcB.specialAllowance) },
    { label: "Conveyance Allowance", amount: p(ctcB.conveyance) },
    { label: "Telephone Allowance", amount: p(ctcB.telephoneAllowance) },
    { label: "Medical Allowance", amount: p(ctcB.medicalAllowance) },
    { label: "Gross Salary", amount: calculateGrossSalary(ctcB) },
    { label: "Employee PF", amount: p(ctcB.employeePF) },
    { label: "Professional Tax", amount: p(ctcB.professionalTax) },
    { label: "Gratuity", amount: p(ctcB.gratuityEmployee) },
    { label: "Net Take Home", amount: calculateNetTakeHome(ctcB) },
    { label: "Employer PF", amount: p(ctcB.employerPF) },
    { label: "Group Insurance", amount: p(ctcB.groupInsurance) },
    { label: "Total CTC (Monthly)", amount: calculateTotalMonthlyCTC(ctcB) },
  ];
  const validBreakupItems = breakupItems.filter((i) => i.amount > 0);
  const calculatedTotal = validBreakupItems.reduce((s, i) => s + i.amount, 0);
  const annexureRows = validBreakupItems.map((item) => `<tr><td>${item.label}</td><td>${formatAmt(item.amount)}</td></tr>`).join("");
  const footerBlock = `<div class="ol-footer"><div class="ol-footer-name">${COMPANY.name}</div>${COMPANY.address}</div>`;
  const headerBlock = `<div class="ol-header"><div class="ol-header-left"><img src="/assets/images/Levitica.png" alt="Logo" style="max-width:180px;height:auto" onerror="this.style.display='none'" /></div><div class="ol-header-right"><p>${COMPANY.phone}</p><p>${COMPANY.email}</p><p>${COMPANY.website}</p><p>CIN: ${COMPANY.CIN}</p></div></div>`;
  const headerSmall = `<div class="ol-headers"><div class="ol-header-lefts"><img src="/assets/images/Levitica.png" alt="Logo" style="max-width:150px;height:auto" onerror="this.style.display='none'" /></div></div>`;

  return `
<style>
  .offer-letter-body { font-family: Arial, sans-serif; color: #333; max-width: 210mm; margin: 0 auto; text-align: left; box-sizing: border-box; }
  .offer-letter-body * { box-sizing: border-box; }
  .ol-page { page-break-after: always; position: relative; width: 100%; max-width: 210mm; padding: 18px 24px 72px 24px; min-height: 290mm; font-family: Arial, sans-serif; margin: 0 auto; color: #333; line-height: 1.45; }
  .ol-page:last-child { page-break-after: auto; }
  .ol-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; padding-bottom: 12px; gap: 16px; }
  .ol-header-left { flex: 0 0 auto; min-width: 0; }
  .ol-header-left img { display: block; max-width: 180px; height: auto; }
  .ol-headers { display: flex; justify-content: flex-end; align-items: center; margin-bottom: 12px; }
  .ol-header-lefts { text-align: right; }
  .ol-header-lefts img { display: block; max-width: 150px; height: auto; margin-left: auto; }
  .ol-header-right { flex: 0 0 auto; width: 42%; min-width: 140px; background: #3F2D69; color: white; padding: 10px 14px; text-align: right; }
  .ol-header-right p { margin: 5px 0; font-size: 14px; line-height: 1.35; }
  .ol-footer { position: absolute; bottom: 0; left: 0; right: 0; width: 100%; text-align: center; border-top: 2px solid #000; padding: 10px 24px 8px; font-size: 10px; line-height: 1.4; }
  .ol-footer-name { font-weight: bold; font-size: 14px; color: #000; margin-bottom: 4px; }
  .ol-content { font-size: 15px; line-height: 1.5; margin: 0; padding: 0; text-align: left; }
  .ol-content p { margin: 0 0 8px 0; text-align: left; }
  .ol-confidential { color: #1E4E8C; text-align: center; font-weight: bold; font-size: 20px; margin: 16px 0; text-transform: uppercase; letter-spacing: 1.2px; line-height: 1.3; }
  .ol-section { font-size: 17px; font-weight: bold; margin-top: 18px; margin-bottom: 10px; color: #1E4E8C; padding-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; text-align: left; }
  .ol-section:first-of-type { margin-top: 0; }
  .ol-list { margin: 0 0 12px 0; padding: 0 0 0 28px; font-size: 15px; line-height: 1.5; text-align: left; list-style: none; }
  .ol-list p { margin: 0 0 6px 0; padding: 0 0 0 12px; position: relative; text-align: left; text-indent: 0; }
  .ol-list p::before { content: "•"; position: absolute; left: -12px; color: #3F2D69; font-weight: bold; }
  .ol-list ol { margin: 8px 0 6px 20px; padding: 0; }
  .ol-list li { margin-bottom: 6px; text-align: left; }
  .ol-annexure-table { width: 100%; border-collapse: collapse; margin: 10px 0 14px 0; font-size: 12px; table-layout: fixed; }
  .ol-annexure-table th, .ol-annexure-table td { border: 1px solid #ddd; padding: 4px 6px; vertical-align: top; }
  .ol-annexure-table th:first-child, .ol-annexure-table td:first-child { text-align: left; width: 65%; }
  .ol-annexure-table th:last-child, .ol-annexure-table td:last-child { text-align: right; width: 35%; }
  .ol-annexure-table th { background: #3F2D69; color: white; font-weight: bold; }
  .ol-annexure-table .total-row { font-weight: bold; background: #f0f0f0; }
  .ol-annexure-table .total-row td { padding: 8px; }
  .ol-signature-row { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 32px; gap: 24px; }
  .ol-signature-row > div { flex: 0 0 45%; min-width: 0; }
  .ol-signature-row > div:first-child { text-align: left; }
  .ol-signature-row > div:last-child { text-align: right; }
  .ol-signature-row p { margin: 0 0 4px 0; }
  .ol-bold { font-weight: bold; }
  .ol-to-block { margin: 0 0 20px 0; padding-left: 0; }
  .ol-address { margin: 0 0 20px 0; padding-left: 20px; font-size: 16px; line-height: 1.5; }
  .ol-intro { font-size: 16px; line-height: 1.55; margin: 0 0 24px 0; text-align: left; }
</style>
<div class="offer-letter-body">
  <!-- PAGE 1 -->
  <div class="ol-page">
    ${headerBlock}
    <div class="ol-content">
      <p class="ol-confidential">Levitica Technologies PVT.LTD</p>
      <p class="ol-bold ol-to-block" style="font-size:16px;margin-bottom:6px">Date: ${currentDateLong}</p>
      <p class="ol-bold" style="margin-bottom:4px">To,</p>
      <div class="ol-address">${addressBlock}</div>
      <p class="ol-confidential">Confidential Letter!</p>
      <p class="ol-intro">We are pleased to extend an offer for the position of <strong>"${position}"</strong> at Levitica Technologies Pvt. Ltd., with your confirmed joining date of <strong>${joiningDate}</strong>. This offer is subject to the following terms and conditions.</p>
      <p class="ol-section">1. Compensation & Benefits</p>
      <div class="ol-list">
        <p>Your total Annual Cost to Company (CTC) will be INR <strong>${ctc}</strong>, detailed in <strong>Annexure - A</strong>.</p>
        <p>Salary will be reviewed periodically based on performance and company policies.</p>
        <p>Provident Fund contributions will be based on the Basic component as per statutory rules.</p>
        <p>Remuneration may be altered without prior notice depending on company policies and legal guidelines.</p>
        <p>Compensation details are confidential and must not be disclosed to others.</p>
        <p>Employees are paid monthly via bank transfer.</p>
        <p>Additional: Performance bonuses and employee benefits (health insurance, training) may be provided at the company's discretion.</p>
      </div>
    </div>
    ${footerBlock}
  </div>
  <!-- PAGE 2 -->
  <div class="ol-page">
    ${headerSmall}
    <div class="ol-content">
      <p class="ol-section">2. Period of Service</p>
      <div class="ol-list">
        <p>You are required to sign a one-year training-cum-service agreement.</p>
        <p>A six-month probation period will apply. Your performance will be assessed before confirmation.</p>
        <p>If performance is unsatisfactory, probation may be extended or employment terminated.</p>
        <p>Additional: Breach of the service agreement during this period may result in legal consequences or compensation recovery.</p>
      </div>
      <p class="ol-section">3. Hours of Work</p>
      <div class="ol-list">
        <p>Workdays: 5 days/week. Working hours depend on your project or client location.</p>
        <p>Shift work or weekend duty may be required.</p>
        <p>The company does not provide overtime compensation.</p>
        <p>Additional: Flexible work arrangements may be granted based on managerial approval and project requirements.</p>
      </div>
      <p class="ol-section">4. Leaves & Holidays</p>
      <div class="ol-list">
        <p>You are entitled to 18 days of leave per year (12 paid + 6 casual), pro-rated from the date of joining.</p>
        <p>Earned leaves are credited monthly and can be en-cashed as per policy.</p>
        <p>Holidays depend on the location of your posting.</p>
        <p>Additional: All leave requests must be applied through the company leave management system.</p>
      </div>
      <p class="ol-section">5. Unauthorized Absence from Work</p>
      <div class="ol-list">
        <p>Any unauthorized absence for three or more consecutive days will be deemed as absconding and may result in disciplinary action or legal proceedings.</p>
      </div>
    </div>
    ${footerBlock}
  </div>
  <!-- PAGE 3 -->
  <div class="ol-page">
    ${headerSmall}
    <div class="ol-content">
      <p class="ol-section">6. Disputes</p>
      <div class="ol-list">
        <p>All employment matters shall be governed in accordance with Indian laws, including but not limited to the Indian Contract Act, 1872 and the relevant State Shops and Establishments Act. The Company encourages amicable resolution of disputes through internal grievance redressal mechanisms or arbitration before initiating litigation.</p>
        <p>Legal disputes will fall under Hyderabad jurisdiction unless otherwise specified for overseas assignments.</p>
        <p>In case of non-compete violations, the company may seek damages and injunctive relief.</p>
        <p>Additional: Disputes should first be addressed through mediation or arbitration before legal recourse.</p>
      </div>
      <p class="ol-section">7. Background Verification</p>
      <div class="ol-list">
        <p>All background checks will be carried out in compliance with relevant privacy laws. Drug screening, if performed, shall follow best practices and medical confidentiality standards. You are expected to disclose any prior legal issues or employment history honestly as per company norms.</p>
        <p>The Company reserves the right to carry out reference verifications or background checks prior to your joining the Company or during the course of your engagement with this Company. Such background checks and reference verifications, amongst others, would include past engagement and salary (this will include your immediate previous engagement), criminal records, countries resided in or worked in, etc. The Company reserves the right to carry out banned/illegal drugs/narcotics substance screening tests on you at any point of time during your engagement. You understand and acknowledge that this is a requirement and you have no objections whatsoever if such checks and verifications are carried out by the Company or a third party agency engaged by the Company.</p>
      </div>
    </div>
    ${footerBlock}
  </div>
  <!-- PAGE 4 -->
  <div class="ol-page">
    ${headerSmall}
    <div class="ol-content">
      <div class="ol-list">
        <p>In verification, the information furnished by you in your application is misstated or documents submitted by you are not correct or banned/illegal drugs/narcotics substance screening test results are positive, the Company shall, at its sole discretion, be entitled to forthwith terminate and/or revoke your engagement with the Company, without further reference in the matter. Further, termination under this Clause will not confer on you any right to stake claim of any kind of compensation from the Company.</p>
      </div>
      <p class="ol-section">8. Termination of Employment</p>
      <div class="ol-list">
        <p>Termination may be initiated by either party by serving the required notice period as defined under the applicable provisions of the Industrial Disputes Act, 1947. Misconduct, fraud, or willful breach of company policy will lead to summary dismissal without notice, subject to disciplinary procedures.</p>
        <p><strong>Separation Policy</strong><ol style="margin-top:8px;padding-left:20px"><li style="margin-bottom:6px">You are required to serve a notice period of two months prior to separation. Failure to serve the notice period will require payment equivalent to your gross salary.</li><li style="margin-bottom:6px">The employee must pay the gross salary in lieu of the notice period.</li><li style="margin-bottom:6px">Should you choose to resign before completing the stipulated service period, you will be required to pay an amount of INR 2,00,000 in compensation for breaching the service agreement, in addition to serving a notice period of two months or paying equivalent gross salary in lieu thereof.</li></ol></p>
        <p>However, should you sign any service agreement with the Company as part of your employment process or later in the course of your employment, you will not be entitled to terminate your employment unless you comply with the terms and conditions of the agreement in addition to the above.</p>
      </div>
    </div>
    ${footerBlock}
  </div>
  <!-- PAGE 5 -->
  <div class="ol-page">
    ${headerSmall}
    <div class="ol-content">
      <div class="ol-list">
        <p>Any employee leaving the organization before completion of Service agreement from his/her Date of joining will be liable for recovery of any kind of payments made to him at the time of joining (Joining Bonus, Notice Period Payment, Relocation Expenses and any other payment made at the time of joining).</p>
        <p>The company shall have the right to terminate this agreement forthwith, without any notice and without any salary in lieu of notice period in the event of any of the following:<ol style="margin-top:8px;padding-left:20px"><li style="margin-bottom:6px">Breach on your part of any terms and conditions of this contract and any other rules made applicable to you in respect of your employment with us.</li><li style="margin-bottom:6px">Violation on your part of the company's rule with regards to the authenticity and information declared at the time of joining.</li><li style="margin-bottom:6px">Any misconduct or failure to carry out any of your duties, confidential data and obligations.</li></ol></p>
      </div>
      <p class="ol-section">9. General Terms & Conditions</p>
      <div class="ol-list" style="font-size:12px">
        <p>You may be transferred between locations, departments, or entities within the organization.</p>
        <p>You must comply with all policies and procedures in force or introduced later.</p>
        <p>Additional: Any changes to your contact details or personal information must be updated with HR immediately.</p>
      </div>
      <p class="ol-section">10. Job Description / Role Expectations</p>
      <div class="ol-list">
        <p>You will handle software development, including coding, testing, debugging, and working in a collaborative environment.</p>
        <p>Detailed job responsibilities will be assigned by your reporting manager.</p>
      </div>
    </div>
    ${footerBlock}
  </div>
  <!-- PAGE 6 -->
  <div class="ol-page">
    ${headerSmall}
    <div class="ol-content">
      <p class="ol-section">11. Reporting Authority</p>
      <div class="ol-list">
        <p>You will report to your Team Lead or any other authority designated by the company.</p>
      </div>
      <p class="ol-section">12. Code of Conduct / Ethics Clause</p>
      <div class="ol-list">
        <p>In accordance with the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013, you are required to comply fully with the Company's Anti-Sexual Harassment Policy. Violations will result in disciplinary action, which may include termination as per the provisions under the Industrial Employment (Standing Orders) Act and relevant state Shops & Establishments Acts.</p>
        <p>You are expected to maintain high standards of ethics and professionalism.</p>
        <p>You must adhere to the Code of Conduct, Anti-Sexual Harassment Policy, and other policies.</p>
        <p>Additional: Violations will result in disciplinary actions, up to and including termination.</p>
      </div>
      <p class="ol-section">13. Confidentiality & Data Protection Clause</p>
      <div class="ol-list">
        <p>All inventions, software, processes, source code, documentation, or improvements conceived or developed during the course of employment are deemed to be the exclusive intellectual property of the Company and/or its clients. You are also required to strictly comply with the Information Technology Act, 2000, and its amendments related to data privacy and cybersecurity.</p>
        <p>You must not disclose any confidential, proprietary, or customer-related information during or after your employment.</p>
        <p>All work products (software, systems, ideas) developed during your tenure belong to Levitica Technologies or its clients.</p>
      </div>
    </div>
    ${footerBlock}
  </div>
  <!-- PAGE 7 -->
  <div class="ol-page">
    ${headerSmall}
    <div class="ol-content">
      <p class="ol-section">14. Health & Wellness Policy</p>
      <div class="ol-list">
        <p>Levitica promotes a healthy and inclusive workplace.</p>
        <p>You are encouraged to participate in wellness initiatives and access HR support for health issues.</p>
        <p>Additional: Mental health and preventive healthcare services may be offered via wellness partners.</p>
      </div>
      <p class="ol-section">15. Final Clauses</p>
      <div class="ol-list">
        <p>Full and final settlement will be processed within 45 days from your last working day.</p>
        <p>PAN submission is mandatory; failure will result in TDS deduction at higher rates.</p>
        <p>You must devote your full time and attention to company business.</p>
        <p>This letter is governed by company policy, and Levitica reserves the right to modify any part of it.</p>
      </div>
      <p style="margin-top:20px">We take this opportunity to welcome you to the Levitica family and wish you a satisfying engagement with us.</p>
      <p class="ol-section" style="color:#1f4e8c;font-weight:700;margin-top:25px">Acceptance of Joining</p>
      <p>The terms and conditions of this Appointment Letter are fully acceptable to me. I shall report for duties on ____________________.</p>
      <p style="margin-top:25px">Sincerely,<br><strong>For Levitica Technologies Pvt. Ltd</strong></p>
      <div class="ol-signature-row">
        <div><p>Sincerely,</p><p><strong>For Levitica Technologies Pvt. Ltd</strong></p><p style="margin-top:24px">Authorized Signature:</p></div>
        <div><p>Employee Name</p><p style="margin-top:24px">Employee Signature</p></div>
      </div>
    </div>
    ${footerBlock}
  </div>
  <!-- PAGE 8 - Annexure A -->
  <div class="ol-page">
    ${headerSmall}
    <div class="ol-content">
      <p class="ol-section">Annexure - A</p>
      <p><strong>Compensation Breakup</strong></p>
      <p><strong>Annual CTC: INR ${ctc}</strong></p>
      <table class="ol-annexure-table">
        <thead><tr><th>Component</th><th>Amount (INR)</th></tr></thead>
        <tbody>${annexureRows}
        </tbody>
      </table>
      <p><strong>Note:</strong></p>
      <div class="ol-list" style="font-size:12px">
        <p>This offer carries a 6-month probation period. Salary will not be revised post confirmation; any salary hike will be considered only after completion of one year.</p>
        <p>Health insurance premiums, if opted, will be deducted accordingly.</p>
        <p>Annual performance bonus is discretionary and not payable on a pro-rata basis for incomplete cycles.</p>
        <p>Salary structure is confidential and should not be disclosed.</p>
      </div>
<div style="display:flex; justify-content:space-between; align-items:flex-start;">

  <!-- LEFT SIDE -->
  <div style="width:50%; text-align:left;  margin-top:20px;">
    <p style="margin:0;">
      Sincerely,<br>
      <strong>For Levitica Technologies Pvt. Ltd</strong>
    </p>
  </div>

  <!-- RIGHT SIDE -->
  <div style="width:44%; text-align:right;  margin-top:40px;">
    <p style="margin:0;">
      Employee Name
    </p>
  </div>

</div>
      <div class="ol-signature-row">
        <div><p>Authorized Signature</p></div>
        <div><p style="margin-top:16px">Employee Signature</p></div>
      </div>
    </div>
    ${footerBlock}
  </div>
</div>`;
}

const inputClass =
  "w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm";
const labelClass = "block text-xs font-medium text-gray-600 uppercase tracking-wider mb-1.5";

const defaultManualForm = {
  fullName: "",
  position: "",
  department: "",
  joiningDate: "",
  salary: "",
  reportingTo: "",
  workLocation: "",
};

const defaultOfferFormData = {
  candidateName: "",
  email: "",
  phone: "",
  position: "",
  department: "Engineering",
  customDepartment: "",
  grade: "Intern",
  customGrade: "",
  gender: "male",
  candidateSource: "",
  customSource: "",
  referralDetails: { employeeId: "", role: "", designation: "", experience: "" },
  experience: "",
  noticePeriod: "30 days",
  relation: "select",
  fatherName: "",
  customRelation: "",
  guardianGender: "",
  guardianPhone: "",
  isLegalGuardian: false,
 address: {
  street: "",
  city: "",
  district: "",
  country: "",
  customCountry: "",
  state: "",
  customState: "",
  pincode: ""
},
  ctc: "",
  joiningDate: "",
  expiryDate: "",
  offerType: "Full-Time",
  template: "standard",
  approvalWorkflow: "direct",
  customApprovalWorkflow: "",
  ctcBreakup: {
    basic: "", hra: "", specialAllowance: "", conveyance: "", telephoneAllowance: "", medicalAllowance: "",
    employeePF: "", professionalTax: "", gratuityEmployee: "", employerPF: "", groupInsurance: "",
  },
  businessUnit: "", customBusinessUnit: "", location: "", customLocation: "", shiftPolicy: "", customShiftPolicy: "", weekOffPolicy: "", customWeekOffPolicy: "",
  interviewSummary: "", salaryNegotiationHistory: "", notes: "",
  terms: "1. This offer is subject to background verification.\n2. Standard company policies apply.\n3. Please acknowledge acceptance by the expiry date.",
  enableBGV: true,
  requireDigitalSignature: false,
  bgvStatus: "",
};

function OfferLetterGenerator() {
  const navigate = useNavigate();

  const [manualForm, setManualForm] = useState(defaultManualForm);
  const [selectedTemplate, setSelectedTemplate] = useState(OFFER_TEMPLATES[0].id);
  const [showPreview, setShowPreview] = useState(false);
  const [showOfferFormModal, setShowOfferFormModal] = useState(false);
  const [formData, setFormData] = useState(defaultOfferFormData);

  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setManualForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: typeof prev[parent] === "object" ? { ...prev[parent], [child]: value } : { [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }
  };

  const handleOfferFormSubmit = (e) => {
    e.preventDefault();
    setManualForm({
      fullName: formData.candidateName || "",
      position: formData.position || "",
      department: formData.department || "",
      joiningDate: formData.joiningDate || "",
      salary: formData.ctc || "",
      reportingTo: "",
      workLocation: formData.location || "Office",
    });
    setShowOfferFormModal(false);
    setShowPreview(true);
  };

  const getOfferForTemplate = () => ({
    ...formData,
    createdDate: formData.createdDate || new Date().toISOString().split("T")[0],
  });

  const generateEmailContent = (offer) => {
    const joiningDate = offer?.joiningDate
      ? new Date(offer.joiningDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
      : "To be confirmed";
    return {
      subject: `Offer Letter - ${offer?.position || "Position"} | Levitica Technologies Pvt. Ltd.`,
      body: `
Dear Mr. ${offer?.candidateName || "Candidate"},

We are pleased to offer you the position of ${offer?.position || ""} at Levitica Technologies Pvt. Ltd. Please find your offer letter attached to this email.

Your skills and background align well with our expectations, and we are confident that you will be a valuable addition to our team. As mentioned in the offer, your joining date is ${joiningDate}.

We kindly request you to carefully review the attached offer letter. If you accept the terms and conditions outlined, please sign the document and send a scanned copy to us at your earliest convenience to confirm your acceptance.

On-boarding Location:
Please report to Office #407 for the on-boarding process. Our team will be available there to assist you.
Levitica Technologies Pvt.Ltd,
Office #407 & #409, 4th Floor,
Jain Sadguru Image's,
Capital Park Road, Ayyappa Society,
VIP Hills, Madhapur,
Hyderabad, Telangana – 500081.

Note:
Please carry your original certificates including your 10th and Intermediate mark sheets for verification along with Xerox copies.
Bring one passport-size photograph (hard copy + soft copy).

Should you have any questions or need clarification, please feel free to reach out.

We look forward to welcoming you to the Levitica family and beginning an exciting journey of growth and innovation together.

Best Regards,
HR Team
Levitica Technologies Pvt. Ltd.
hr@leviticatechnologies.com
      `.trim(),
    };
  };

  const handleSendEmailFromPreview = () => {
    const offer = getOfferForTemplate();
    if (!offer?.email) {
      alert("Candidate email address is missing! Add it in the offer form.");
      return;
    }
    const { subject, body } = generateEmailContent(offer);
    window.location.href = `mailto:${offer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    alert(`Opening email client to send offer to ${offer.candidateName} (${offer.email})`);
  };

  const generateOfferLetterPDF = () => {
    const offer = getOfferForTemplate();
    const element = document.createElement("div");
    element.style.width = "210mm";
    element.style.padding = "0";
    element.style.margin = "0";
    element.style.fontFamily = "Arial, sans-serif";
    element.style.backgroundColor = "white";
    element.innerHTML = buildLeviticaOfferLetterHtml(offer);
    const candidateName = (offer?.candidateName || "Candidate").replace(/\s+/g, "_");
    const opt = {
       margin: [0, 0, 0, 0],
      filename: `Offer_Letter_${candidateName}_${new Date().toISOString().split("T")[0]}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, letterRendering: true, useCORS: true, logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait", compress: true },
    };
    html2pdf().set(opt).from(element).save();
  };

  const offerData = manualForm;
  const canGenerate = !!manualForm.fullName?.trim();
  const offerFromForm = formData?.candidateName ? getOfferForTemplate() : null;
  const showLeviticaPreview = showPreview && offerFromForm;

  const renderLetterContent = (templateId) => {
    const d = offerData;
    const companyName = "Levitica";
    const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

    if (templateId === "short") {
      return (
        <div className="space-y-4 text-sm">
          <p className="font-semibold">OFFER OF EMPLOYMENT</p>
          <p>Dear {d.fullName},</p>
          <p>
            We are pleased to offer you the position of <strong>{d.position}</strong>
            {d.department && ` in our ${d.department} department`}. Joining date: {d.joiningDate || "To be confirmed"}.
            {d.salary && ` Compensation: ${d.salary}.`}
          </p>
          <p>Please confirm your acceptance at the earliest.</p>
          <p className="pt-4">Sincerely,<br />HR Team<br />{companyName}</p>
        </div>
      );
    }

    if (templateId === "formal") {
      return (
        <div className="space-y-4 text-sm">
          <div className="text-center border-b pb-4">
            <p className="text-lg font-bold">{companyName}</p>
            <p className="text-xs text-gray-600">Offer of Employment</p>
          </div>
          <p>Date: {date}</p>
          <p>Dear {d.fullName},</p>
          <p>
            With reference to your application and subsequent discussions, we are pleased to extend to you an offer of employment with {companyName} on the following terms:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Designation:</strong> {d.position}</li>
            {d.department && <li><strong>Department:</strong> {d.department}</li>}
            <li><strong>Date of Joining:</strong> {d.joiningDate || "To be communicated"}</li>
            {d.salary && <li><strong>Compensation:</strong> {d.salary}</li>}
            {d.reportingTo && <li><strong>Reporting To:</strong> {d.reportingTo}</li>}
            <li><strong>Work Location:</strong> {d.workLocation || "As per company policy"}</li>
          </ul>
          <p>This offer is subject to the company's standard policies and your acceptance in writing.</p>
          <p className="pt-4">Yours faithfully,<br /><strong>Human Resources</strong><br />{companyName}</p>
        </div>
      );
    }

    // standard
    return (
      <div className="space-y-4 text-sm">
        <div className="flex items-center gap-2 border-b pb-4">
          <Building2 className="w-5 h-5 text-blue-600" strokeWidth={2} />
          <p className="text-lg font-bold text-gray-900">{companyName}</p>
        </div>
        <p className="text-gray-600">{date}</p>
        <p>Dear {d.fullName},</p>
        <p>
          We are delighted to offer you the position of <strong>{d.position}</strong>
          {d.department && ` in the ${d.department} team`} at {companyName}.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p><strong>Joining Date:</strong> {d.joiningDate || "To be confirmed"}</p>
          {d.salary && <p><strong>Compensation:</strong> {d.salary}</p>}
          {d.reportingTo && <p><strong>Reporting To:</strong> {d.reportingTo}</p>}
          <p><strong>Work Location:</strong> {d.workLocation || "As assigned"}</p>
        </div>
        <p>Please sign and return a copy of this letter to confirm your acceptance. We look forward to having you on board.</p>
        <p className="pt-4">Best regards,<br /><strong>HR Team</strong><br />{companyName}</p>
      </div>
    );
  };

  const getLetterHtml = (templateId) => {
    const d = offerData;
    const companyName = "Levitica";
    const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    const joinDate = d.joiningDate || "To be confirmed";
    if (templateId === "short") {
      return `
        <p><strong>OFFER OF EMPLOYMENT</strong></p>
        <p>Dear ${d.fullName},</p>
        <p>We are pleased to offer you the position of <strong>${d.position}</strong>${d.department ? ` in our ${d.department} department` : ""}. Joining date: ${joinDate}.${d.salary ? ` Compensation: ${d.salary}.` : ""}</p>
        <p>Please confirm your acceptance at the earliest.</p>
        <p style="padding-top: 1rem;">Sincerely,<br/>HR Team<br/>${companyName}</p>`;
    }
    if (templateId === "formal") {
      return `
        <div style="text-align: center; border-bottom: 1px solid #eee; padding-bottom: 1rem;">
          <p style="font-size: 1.125rem; font-weight: bold;">${companyName}</p>
          <p style="font-size: 0.75rem; color: #666;">Offer of Employment</p>
        </div>
        <p>Date: ${date}</p>
        <p>Dear ${d.fullName},</p>
        <p>With reference to your application and subsequent discussions, we are pleased to extend to you an offer of employment with ${companyName} on the following terms:</p>
        <ul style="padding-left: 1.5rem;">
          <li><strong>Designation:</strong> ${d.position}</li>
          ${d.department ? `<li><strong>Department:</strong> ${d.department}</li>` : ""}
          <li><strong>Date of Joining:</strong> ${joinDate}</li>
          ${d.salary ? `<li><strong>Compensation:</strong> ${d.salary}</li>` : ""}
          ${d.reportingTo ? `<li><strong>Reporting To:</strong> ${d.reportingTo}</li>` : ""}
          <li><strong>Work Location:</strong> ${d.workLocation || "As per company policy"}</li>
        </ul>
        <p>This offer is subject to the company's standard policies and your acceptance in writing.</p>
        <p style="padding-top: 1rem;">Yours faithfully,<br/><strong>Human Resources</strong><br/>${companyName}</p>`;
    }
    return `
        <div style="border-bottom: 1px solid #eee; padding-bottom: 1rem;"><strong>${companyName}</strong></div>
        <p style="color: #666;">${date}</p>
        <p>Dear ${d.fullName},</p>
        <p>We are delighted to offer you the position of <strong>${d.position}</strong>${d.department ? ` in the ${d.department} team` : ""} at ${companyName}.</p>
        <div style="background: #f9fafb; border-radius: 0.5rem; padding: 1rem;">
          <p><strong>Joining Date:</strong> ${joinDate}</p>
          ${d.salary ? `<p><strong>Compensation:</strong> ${d.salary}</p>` : ""}
          ${d.reportingTo ? `<p><strong>Reporting To:</strong> ${d.reportingTo}</p>` : ""}
          <p><strong>Work Location:</strong> ${d.workLocation || "As assigned"}</p>
        </div>
        <p>Please sign and return a copy of this letter to confirm your acceptance. We look forward to having you on board.</p>
        <p style="padding-top: 1rem;">Best regards,<br/><strong>HR Team</strong><br/>${companyName}</p>`;
  };

  const handleDownload = () => {
    const d = offerData;
    const bodyContent = getLetterHtml(selectedTemplate);
    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Offer Letter - ${d.fullName}</title></head>
<body style="font-family: Georgia, serif; max-width: 700px; margin: 40px auto; padding: 20px; line-height: 1.6; color: #111;">
  <div>${bodyContent}</div>
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Offer-Letter-${(d.fullName || "Candidate").replace(/\s+/g, "-")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <FileText className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <h1 className="text-lg font-bold text-black leading-tight">Offer Letter Generator</h1>
            <p className="text-[13px] text-black/70">Enter candidate details, choose a template, and generate the offer letter.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/dashboard/candidates")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
          >
            <Users className="w-4 h-4" strokeWidth={2} />
            My Candidates
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0 p-6 overflow-auto flex flex-col lg:flex-row gap-6">
        {/* Left: Source + Template */}
        <div className="lg:w-[380px] shrink-0 space-y-6">
          {/* Candidate Data */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/80">
              <h2 className="font-semibold text-black">Candidate Data</h2>
              <p className="text-xs text-gray-500 mt-0.5">Enter candidate details or fill full offer in the form</p>
            </div>
            <div className="px-4 pb-4 space-y-3">
                <button
                  type="button"
                  onClick={() => setShowOfferFormModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition text-sm mb-2"
                >
                  <Plus className="w-4 h-4" strokeWidth={2} />
                  Create Offer 
                </button>
               
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/80 flex items-center justify-between">
            <h2 className="font-semibold text-black">Offer Letter Preview</h2>
            {!showPreview && <p className="text-xs text-gray-500">Select data and click Preview or Download</p>}
          </div>
          <div className="flex-1 overflow-auto p-8">
            {showLeviticaPreview ? (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Offer summary</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li><strong>Candidate:</strong> {offerFromForm.candidateName}</li>
                    <li><strong>Joining Date:</strong> {offerFromForm.joiningDate ? new Date(offerFromForm.joiningDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}</li>
                    <li><strong>Department:</strong> {offerFromForm.department || "—"}</li>
                    <li><strong>Position:</strong> {offerFromForm.position || "—"}</li>
                    <li><strong>CTC:</strong> {offerFromForm.ctc ? `₹${offerFromForm.ctc}` : "—"}</li>
                  </ul>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={generateOfferLetterPDF}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
                  >
                    <Download className="w-4 h-4" strokeWidth={2} />
                    Download PDF
                  </button>
                  <button
                    type="button"
                    onClick={handleSendEmailFromPreview}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                  >
                    <Mail className="w-4 h-4" strokeWidth={2} />
                    Send via Email
                  </button>
                </div>
                <div
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm overflow-auto max-h-[80vh]"
                  dangerouslySetInnerHTML={{ __html: buildLeviticaOfferLetterHtml(offerFromForm) }}
                />
              </div>
            ) : showPreview && canGenerate ? (
              <div className="max-w-xl mx-auto prose prose-sm prose-gray">
                {renderLetterContent(selectedTemplate)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <FileText className="w-16 h-16 mb-4" strokeWidth={1.5} />
                <p className="text-sm font-medium">No preview yet</p>
                <p className="text-xs mt-1">Click &quot;Create Offer (fill form)&quot; in Candidate Data, fill the form, then preview will show here with Download PDF and Send via Email.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Offer Form Modal */}
      {showOfferFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
              <h2 className="text-lg font-bold text-gray-900">Create Offer – Candidate & Offer Details</h2>
              <button type="button" onClick={() => {
  setShowOfferFormModal(false);
  setFormData(defaultOfferFormData);
}} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
            <form id="offerForm" onSubmit={handleOfferFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Step 1: Candidate Information */}
              <div>
                <h3 className="flex items-center gap-2 font-bold text-gray-800 border-b border-gray-200 pb-2 mb-3">
                  <span className="rounded-full bg-blue-500 text-white text-xs w-6 h-6 flex items-center justify-center">1</span>
                  <User className="w-5 h-5" strokeWidth={2} />
                  Candidate Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Candidate Name <span className="text-danger">*</span></label>
                    <input type="text" name="candidateName" value={formData.candidateName} onChange={handleInputChange} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className={inputClass}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Email <span className="text-danger">*</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Phone <span className="text-danger">*</span></label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Candidate Source</label>
                    {formData.candidateSource === "Other" ? (
                      <input type="text" name="customSource" value={formData.customSource} onChange={handleInputChange} placeholder="Enter source" className={inputClass} />
                    ) : (
                      <select name="candidateSource" value={formData.candidateSource} onChange={handleInputChange} className={inputClass}>
                        <option value="">Select Source</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Referral">Referral</option>
                        <option value="Naukri">Naukri</option>
                        <option value="Campus">Campus</option>
                        <option value="Other">Other</option>
                      </select>
                    )}
                  </div>
                  {formData.candidateSource === "Referral" && (
                    <>
                      <div><label className={labelClass}>Employee ID</label><input type="text" name="referralDetails.employeeId" value={formData.referralDetails?.employeeId || ""} onChange={handleInputChange} className={inputClass} /></div>
                      <div><label className={labelClass}>Role</label><input type="text" name="referralDetails.role" value={formData.referralDetails?.role || ""} onChange={handleInputChange} className={inputClass} /></div>
                      <div><label className={labelClass}>Designation</label><input type="text" name="referralDetails.designation" value={formData.referralDetails?.designation || ""} onChange={handleInputChange} className={inputClass} /></div>
                      <div><label className={labelClass}>Experience</label><input type="text" name="referralDetails.experience" value={formData.referralDetails?.experience || ""} onChange={handleInputChange} className={inputClass} /></div>
                    </>
                  )}
                  <div>
                    <label className={labelClass}>Position <span className="text-danger">*</span></label>
                    <input type="text" name="position" value={formData.position} onChange={handleInputChange} className={inputClass} required />
                  </div>
<div>
  <label className={labelClass}>
    Department <span className="text-danger">*</span>
  </label>

  {formData.department === "Other" ? (
    <input
      type="text"
      name="customDepartment"
      placeholder="Enter Department"
      value={formData.customDepartment || ""}
      onChange={handleInputChange}
      className={inputClass}
    />
  ) : (
    <select
      name="department"
      value={formData.department}
      onChange={handleInputChange}
      className={inputClass}
    >
      {DEPARTMENTS.map((d) => (
        <option key={d} value={d}>
          {d}
        </option>
      ))}
    </select>
  )}
</div>
<div>
  <label className={labelClass}>
    Grade <span className="text-danger">*</span>
  </label>

  {formData.grade === "other" ? (
    <input
      type="text"
      name="customGrade"
      placeholder="Enter Grade"
      value={formData.customGrade || ""}
      onChange={handleInputChange}
      className={inputClass}
    />
  ) : (
    <select
      name="grade"
      value={formData.grade}
      onChange={handleInputChange}
      className={inputClass}
    >
      <option value="Intern">Intern</option>
      <option value="other">Other</option>
    </select>
  )}
</div>
                  <div>
                    <label className={labelClass}>Experience</label>
                    <input type="text" name="experience" value={formData.experience} onChange={handleInputChange} placeholder="e.g. 3 years" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Notice Period</label>
                    <select name="noticePeriod" value={formData.noticePeriod} onChange={handleInputChange} className={inputClass}>
                      <option value="15 days">15 days</option>
                      <option value="30 days">30 days</option>
                      <option value="60 days">60 days</option>
                      <option value="90 days">90 days</option>
                      <option value="Immediate">Immediate</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Personal Information */}
              <div>
                <h3 className="flex items-center gap-2 font-bold text-gray-800 border-b border-gray-200 pb-2 mb-3">
                  <User className="w-5 h-5" strokeWidth={2} />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Relation</label>
                    <select name="relation" value={formData.relation} onChange={handleInputChange} className={inputClass}>
                      <option value="select">Select</option>
                      <option value="S/O">S/O (Son of)</option>
                      <option value="D/O">D/O (Daughter of)</option>
                      <option value="C/O">C/O (Care of)</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Father's/Guardian's Name</label>
                    <input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} className={inputClass} />
                  </div>
                  {formData.relation === "Others" && (
                    <>
                      <div><label className={labelClass}>Specify Relationship</label><input type="text" name="customRelation" value={formData.customRelation || ""} onChange={handleInputChange} className={inputClass} /></div>
                      <div><label className={labelClass}>Guardian's Gender</label><select name="guardianGender" value={formData.guardianGender || ""} onChange={handleInputChange} className={inputClass}><option value="">Select</option><option value="male">Male</option><option value="female">Female</option></select></div>
                      <div><label className={labelClass}>Guardian's Contact</label><input type="tel" name="guardianPhone" value={formData.guardianPhone || ""} onChange={handleInputChange} className={inputClass} /></div>
                      <div className="sm:col-span-2 flex items-center gap-2">
                        <input type="checkbox" id="isLegalGuardian" name="isLegalGuardian" checked={formData.isLegalGuardian || false} onChange={handleInputChange} className="rounded" />
                        <label htmlFor="isLegalGuardian" className="text-sm">This person is my legal guardian</label>
                      </div>
                    </>
                  )}
                  <div className="sm:col-span-2"><h4 className="text-sm font-semibold text-gray-700 mb-2">Address</h4></div>

<div>
  <label className={labelClass}>Country</label>

  {formData.address?.country === "Other" ? (
    <input
      type="text"
      name="address.customCountry"
      value={formData.address?.customCountry || ""}
      onChange={handleInputChange}
      placeholder="Enter Country"
      className={inputClass}
    />
  ) : (
    <select
      name="address.country"
      value={formData.address?.country || "Select Country"}
      onChange={handleInputChange}
      className={inputClass}
    >
      <option value="">Select Country</option>
      {COUNTRIES.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  )}
</div>

<div>
  <label className={labelClass}>State</label>

  {formData.address?.state === "Others" ? (
    <input
      type="text"
      name="address.customState"
      value={formData.address?.customState || ""}
      onChange={handleInputChange}
      placeholder="Enter State"
      className={inputClass}
    />
  ) : (
    <select
      name="address.state"
      value={formData.address?.state || "Select State"}
      onChange={handleInputChange}
      className={inputClass}
    >
      <option value="">Select State</option>

      {(STATES_BY_COUNTRY[formData.address?.country] || []).map((state) => (
        <option key={state} value={state}>
          {state}
        </option>
      ))}
    </select>
  )}
</div>
                  <div><label className={labelClass}>City/Village</label><input type="text" name="address.city" value={formData.address?.city || ""} onChange={handleInputChange} className={inputClass} /></div>
                  <div><label className={labelClass}>District</label><input type="text" name="address.district" value={formData.address?.district || ""} onChange={handleInputChange} className={inputClass} /></div>
                  <div><label className={labelClass}>PIN Code</label><input type="text" name="address.pincode" value={formData.address?.pincode || ""} onChange={handleInputChange} maxLength={6} className={inputClass} /></div>
                  <div><label className={labelClass}>Street</label><input type="text" name="address.street" value={formData.address?.street || ""} onChange={handleInputChange} className={inputClass} /></div>

                </div>
              </div>

              {/* Step 3: Offer Details & CTC */}
              <div>
                <h3 className="flex items-center gap-2 font-bold text-gray-800 border-b border-gray-200 pb-2 mb-3">
                  <span className="rounded-full bg-blue-500 text-white text-xs w-6 h-6 flex items-center justify-center">2</span>
                  <DollarSign className="w-5 h-5" strokeWidth={2} />
                  Offer Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div><label className={labelClass}>CTC (₹) <span className="text-danger">*</span></label><input type="text" name="ctc" value={formData.ctc} onChange={handleInputChange} placeholder="12,00,000" className={inputClass} required /></div>
                  <div><label className={labelClass}>Joining Date <span className="text-danger">*</span></label><input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleInputChange} className={inputClass} required /></div>
                  <div><label className={labelClass}>Expiry Date <span className="text-danger">*</span></label><input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} className={inputClass} required /></div>
                  <div><label className={labelClass}>Offer Type</label><select name="offerType" value={formData.offerType} onChange={handleInputChange} className={inputClass}>{OFFER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
                  <div><label className={labelClass}>Template</label><select name="template" value={formData.template} onChange={handleInputChange} className={inputClass}>{OFFER_TEMPLATES.filter((t) => t.applicableTo?.includes(formData.grade) || t.applicableTo?.includes("All")).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
                  <div>
  <label className={labelClass}>Approval Workflow</label>

  {formData.approvalWorkflow === "other" ? (
    <input
      type="text"
      name="customApprovalWorkflow"
      placeholder="Enter Approval Workflow"
      value={formData.customApprovalWorkflow || ""}
      onChange={handleInputChange}
      className={inputClass}
    />
  ) : (
    <select
      name="approvalWorkflow"
      value={formData.approvalWorkflow}
      onChange={handleInputChange}
      className={inputClass}
    >
      {APPROVAL_WORKFLOWS.map((w) => (
        <option key={w.id} value={w.id}>
          {w.name}
        </option>
      ))}
    </select>
  )}
</div>
                </div>
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                  <h4 className="text-sm font-bold text-gray-700 mb-3">CTC Breakup</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                    {["basic", "hra", "specialAllowance", "conveyance", "telephoneAllowance", "medicalAllowance"].map((k) => (
                      <div key={k}><label className={labelClass}>{k.replace(/([A-Z])/g, " $1").trim()}</label><input type="text" name={`ctcBreakup.${k}`} value={formData.ctcBreakup?.[k] || ""} onChange={handleInputChange} className={inputClass} /></div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                    {["employeePF", "professionalTax", "gratuityEmployee", "employerPF", "groupInsurance"].map((k) => (
                      <div key={k}><label className={labelClass}>{k.replace(/([A-Z])/g, " $1").trim()}</label><input type="text" name={`ctcBreakup.${k}`} value={formData.ctcBreakup?.[k] || ""} onChange={handleInputChange} className={inputClass} /></div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span><strong>Gross (Monthly):</strong> ₹{formatCurrency(calculateGrossSalary(formData.ctcBreakup))}</span>
                    <span><strong>Net Take Home:</strong> ₹{formatCurrency(calculateNetTakeHome(formData.ctcBreakup))}</span>
                    <span><strong>Annual CTC:</strong> ₹{formatCurrency(calculateAnnualCTC(formData.ctcBreakup))}</span>
                  </div>
                </div>
              </div>

              {/* Work Profile & Policies */}
              <div>
                <h3 className="flex items-center gap-2 font-bold text-gray-800 border-b border-gray-200 pb-2 mb-3">
                  <Briefcase className="w-5 h-5" strokeWidth={2} />
                  Work Profile (Optional)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
<div>
  <label className={labelClass}>Business Unit</label>

  {formData.businessUnit === "other" ? (
    <input
      type="text"
      name="customBusinessUnit"
      placeholder="Enter Business Unit"
      value={formData.customBusinessUnit || ""}
      onChange={handleInputChange}
      className={inputClass}
    />
  ) : (
    <select
      name="businessUnit"
      value={formData.businessUnit}
      onChange={handleInputChange}
      className={inputClass}
    >
      <option value="">- Select -</option>
      <option value="IT">IT</option>
      <option value="HR">HR</option>
      <option value="Finance">Finance</option>
      <option value="other">Other</option>
    </select>
  )}
</div>

<div>
  <label className={labelClass}>Country</label>

  {formData.country === "other" ? (
    <input
      type="text"
      name="customCountry"
      placeholder="Enter Country"
      value={formData.customCountry || ""}
      onChange={handleInputChange}
      className={inputClass}
    />
  ) : (
    <select
      name="country"
      value={formData.country}
      onChange={handleInputChange}
      className={inputClass}
    >
      <option value="">- Select -</option>
      <option value="India">India</option>
      <option value="USA">USA</option>
      <option value="UK">UK</option>
      <option value="Canada">Canada</option>
      <option value="Australia">Australia</option>
      <option value="other">Other</option>
    </select>
  )}
</div>

<div>
  <label className={labelClass}>Location</label>

  {formData.location === "other" ? (
    <input
      type="text"
      name="customLocation"
      placeholder="Enter Location"
      value={formData.customLocation || ""}
      onChange={handleInputChange}
      className={inputClass}
    />
  ) : (
    <select
      name="location"
      value={formData.location}
      onChange={handleInputChange}
      className={inputClass}
    >
      <option value="">- Select -</option>

      {(STATES_BY_COUNTRY[formData.country] || []).map((loc) => (
        <option key={loc} value={loc}>
          {loc}
        </option>
      ))}
    </select>
  )}
</div>    

<div>
  <label className={labelClass}>Shift Policy</label>

  {formData.shiftPolicy === "other" ? (
    <input
      type="text"
      name="customShiftPolicy"
      placeholder="Enter Shift Policy"
      value={formData.customShiftPolicy || ""}
      onChange={handleInputChange}
      className={inputClass}
    />
  ) : (
    <select
      name="shiftPolicy"
      value={formData.shiftPolicy}
      onChange={handleInputChange}
      className={inputClass}
    >
      <option value="">- Select -</option>
      <option value="General">General</option>
      <option value="Flexible">Flexible</option>
      <option value="other">Other</option>
    </select>
  )}
</div>

<div>
  <label className={labelClass}>Week Off Policy</label>

  {formData.weekOffPolicy === "other" ? (
    <input
      type="text"
      name="customWeekOffPolicy"
      placeholder="Enter Week Off Policy"
      value={formData.customWeekOffPolicy || ""}
      onChange={handleInputChange}
      className={inputClass}
    />
  ) : (
    <select
      name="weekOffPolicy"
      value={formData.weekOffPolicy}
      onChange={handleInputChange}
      className={inputClass}
    >
      <option value="">- Select -</option>
      <option value="Sunday">Sunday</option>
      <option value="Saturday-Sunday">Sat-Sun</option>
      <option value="other">Other</option>
    </select>
  )}
</div>

                </div>
              </div>

              {/* Interview & BGV */}
              <div>
                <h3 className="flex items-center gap-2 font-bold text-gray-800 border-b border-gray-200 pb-2 mb-3">
                  <span className="rounded-full bg-blue-500 text-white text-xs w-6 h-6 flex items-center justify-center">3</span>
                  <ClipboardCheck className="w-5 h-5" strokeWidth={2} />
                  Interview & BGV
                </h3>
                <div className="space-y-3">
                  <div><label className={labelClass}>Interview Summary</label><textarea name="interviewSummary" value={formData.interviewSummary} onChange={handleInputChange} rows={3} className={inputClass} /></div>
                  <div><label className={labelClass}>Salary Negotiation History</label><textarea name="salaryNegotiationHistory" value={formData.salaryNegotiationHistory} onChange={handleInputChange} rows={2} className={inputClass} /></div>
                  <div><label className={labelClass}>BGV Status</label><select name="bgvStatus" value={formData.bgvStatus} onChange={handleInputChange} className={inputClass}><option value="">Not Started</option><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="completed">Completed</option></select></div>
                  <div><label className={labelClass}>Notes</label><textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={2} className={inputClass} /></div>
                  <div><label className={labelClass}>Terms & Conditions</label><textarea name="terms" value={formData.terms} onChange={handleInputChange} rows={4} className={inputClass} /></div>
                  <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="enableBGV" checked={formData.enableBGV} onChange={handleInputChange} className="rounded" />
                      <span className="text-sm font-medium">Enable Background Verification</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="requireDigitalSignature" checked={formData.requireDigitalSignature} onChange={handleInputChange} className="rounded" />
                      <span className="text-sm font-medium">Require Digital Signature</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button"  onClick={() => {
    setShowOfferFormModal(false);
    setFormData(defaultOfferFormData);
  }} className="px-4 py-2.5 rounded-xl border border-gray-200 font-medium hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" form="offerForm" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600">
                  <FileCheck className="w-4 h-4" strokeWidth={2} />
                  Save & Generate Offer Letter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default OfferLetterGenerator;

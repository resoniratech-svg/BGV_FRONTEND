import DashboardLayout from "../../layouts/DashboardLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, User, Mail, Phone, Briefcase, Check } from "lucide-react";
import { createCandidate } from "../../api/candidateApi";

function AddCandidate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    company_name: "",
    country: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.mobile_number.trim()) {
      newErrors.mobile_number = "Phone number is required";
    }

    if (!formData.company_name.trim()) {
      newErrors.company_name = "Company name is required";
    }
    if (!formData.country.trim()) {
    newErrors.country = "Country is required";
  }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    try {
      setIsSubmitting(true);

      const newCandidate = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email,
      phone: formData.mobile_number,
      company_name: formData.company_name,
      country: formData.country
    };

      const response = await createCandidate(newCandidate);
      console.log("Candidate Created:", response);
      toast.success("Candidate added successfully.");
      navigate("/candidates");
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to create candidate"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto pb-12">
        {/* Header with Back button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/candidates")}
            className="p-3 bg-white border border-gray-100 hover:border-gray-200 rounded-2xl shadow-sm text-gray-600 hover:text-gray-900 transition-all"
            title="Back to Candidates"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Add Candidate</h1>
            <p className="text-gray-500 mt-2">
              Create a new background verification request
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Candidate Information */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="p-2 bg-[#EEF2FF] text-[#5B5FEF] rounded-xl">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Basic Candidate Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className={`w-full bg-[#F5F7FB] border rounded-2xl px-5 py-4 outline-none transition-all text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#5B5FEF]/20 ${
                    errors.first_name ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-[#5B5FEF]"
                  }`}
                />
                {errors.first_name && (
                  <p className="text-red-500 text-xs font-medium pl-1">{errors.first_name}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className={`w-full bg-[#F5F7FB] border rounded-2xl px-5 py-4 outline-none transition-all text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#5B5FEF]/20 ${
                    errors.last_name ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-[#5B5FEF]"
                  }`}
                />
                {errors.last_name && (
                  <p className="text-red-500 text-xs font-medium pl-1">{errors.last_name}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className={`w-full bg-[#F5F7FB] border rounded-2xl pl-12 pr-5 py-4 outline-none transition-all text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#5B5FEF]/20 ${
                      errors.email ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-[#5B5FEF]"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs font-medium pl-1">{errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-400">
                    <Phone className="w-5 h-5" />
                  </span>
                  <input
                    type="tel"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className={`w-full bg-[#F5F7FB] border rounded-2xl pl-12 pr-5 py-4 outline-none transition-all text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#5B5FEF]/20 ${
                      errors.mobile_number ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-[#5B5FEF]"
                    }`}
                  />
                </div>
                {errors.mobile_number && (
                  <p className="text-red-500 text-xs font-medium pl-1">{errors.mobile_number}</p>
                )}
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-400">
                    <Briefcase className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    className={`w-full bg-[#F5F7FB] border rounded-2xl pl-12 pr-5 py-4 outline-none transition-all text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#5B5FEF]/20 ${
                      errors.company_name ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-[#5B5FEF]"
                    }`}
                  />
                </div>
                {errors.company_name && (
                  <p className="text-red-500 text-xs font-medium pl-1">{errors.company_name}</p>
                )}
              </div>
              {/* country */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Country <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Enter country"
                  className={`w-full bg-[#F5F7FB] border rounded-2xl px-5 py-4 outline-none transition-all ${
                    errors.country
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                />

                {errors.country && (
                  <p className="text-red-500 text-xs">
                    {errors.country}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/candidates")}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-semibold transition-all shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-[#5B5FEF] hover:bg-[#4B4FD8] text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-[#5B5FEF]/10 flex items-center gap-2 transition-all ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Candidate...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Create Candidate
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default AddCandidate;
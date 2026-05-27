import DashboardLayout from "../../layouts/DashboardLayout";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, User, Mail, Phone, Calendar, Briefcase, MapPin, Check } from "lucide-react";

interface Candidate {
  id: number;
  name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  role: string;
  status: string;
  progress?: number;
}

function EditCandidate() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    date_of_birth: "",
    gender: "",
    job_role: "",
    location: "",
    current_address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalCandidate, setOriginalCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem("candidates");
      if (saved) {
        const list = JSON.parse(saved);
        const candidate = list.find((c: Candidate) => c.id === parseInt(id));
        if (candidate) {
          setOriginalCandidate(candidate);
          setFormData({
            first_name: candidate.first_name || candidate.name.split(" ")[0] || "",
            last_name: candidate.last_name || candidate.name.split(" ").slice(1).join(" ") || "",
            email: candidate.email || "",
            mobile_number: candidate.mobile_number || "",
            date_of_birth: candidate.date_of_birth || "",
            gender: candidate.gender || "",
            job_role: candidate.job_role || candidate.role || "",
            location: candidate.location || "",
            current_address: candidate.current_address || "",
            city: candidate.city || "",
            state: candidate.state || "",
            pincode: candidate.pincode || "",
            country: candidate.country || "",
          });
        }
      }
    }
  }, [id]);

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
    
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = "Date of birth is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const saved = localStorage.getItem("candidates");
      const currentList = saved ? JSON.parse(saved) : [];

      const emailExists = currentList.some(
        (candidate: Candidate) => 
          candidate.email.toLowerCase() === formData.email.toLowerCase() && 
          candidate.id !== parseInt(id || "0")
      );

      if (emailExists) {
        setIsSubmitting(false);
        toast.error("Another candidate with this email already exists");
        return;
      }
      
      const updatedCandidate = {
        ...(originalCandidate || {}),
        ...formData,
        id: parseInt(id || "0"),
        name: `${formData.first_name} ${formData.last_name}`.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email,
        role: formData.job_role || "Associate",
      };

      const updatedList = currentList.map((c: Candidate) => 
        c.id === parseInt(id || "0") ? updatedCandidate : c
      );

      localStorage.setItem("candidates", JSON.stringify(updatedList));

      setIsSubmitting(false);
      toast.success("Candidate updated successfully.");
      
      setTimeout(() => navigate("/candidates"), 1000);
    }, 1500);
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
            <h1 className="text-4xl font-bold text-gray-900">Edit Candidate</h1>
            <p className="text-gray-500 mt-2">
              Update candidate information and details
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

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-400 pointer-events-none">
                    <Calendar className="w-5 h-5" />
                  </span>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className={`w-full bg-[#F5F7FB] border rounded-2xl pl-12 pr-5 py-4 outline-none transition-all text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#5B5FEF]/20 ${
                      errors.date_of_birth ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-[#5B5FEF]"
                    }`}
                  />
                </div>
                {errors.date_of_birth && (
                  <p className="text-red-500 text-xs font-medium pl-1">{errors.date_of_birth}</p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Gender
                </label>
                <div className="relative">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-[#F5F7FB] border border-gray-200 rounded-2xl px-5 py-4 outline-none transition-all text-gray-700 focus:bg-white focus:ring-2 focus:ring-[#5B5FEF]/20 focus:border-[#5B5FEF]"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Role / Designation */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Role / Designation
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-400">
                    <Briefcase className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    name="job_role"
                    value={formData.job_role}
                    onChange={handleChange}
                    placeholder="e.g. Software Engineer"
                    className="w-full bg-[#F5F7FB] border border-gray-200 rounded-2xl pl-12 pr-5 py-4 outline-none transition-all text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#5B5FEF]/20 focus:border-[#5B5FEF]"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Location
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-400">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Mumbai, India"
                    className="w-full bg-[#F5F7FB] border border-gray-200 rounded-2xl pl-12 pr-5 py-4 outline-none transition-all text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#5B5FEF]/20 focus:border-[#5B5FEF]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Address Details */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="p-2 bg-[#E0F2FE] text-[#0284C7] rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Address Details</h2>
            </div>

            <div className="space-y-6">
              {/* Current Address */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Current Address
                </label>
                <textarea
                  name="current_address"
                  value={formData.current_address}
                  onChange={handleChange}
                  placeholder="Enter full street address"
                  rows={3}
                  className="w-full bg-[#F5F7FB] border border-gray-200 rounded-2xl px-5 py-4 outline-none transition-all text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#5B5FEF]/20 focus:border-[#5B5FEF] resize-none animate-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* City */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter City"
                    className="w-full bg-[#F5F7FB] border border-gray-200 rounded-2xl px-5 py-4 outline-none transition-all text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#5B5FEF]/20 focus:border-[#5B5FEF]"
                  />
                </div>

                {/* State */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter State"
                    className="w-full bg-[#F5F7FB] border border-gray-200 rounded-2xl px-5 py-4 outline-none transition-all text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#5B5FEF]/20 focus:border-[#5B5FEF]"
                  />
                </div>

                {/* Pincode */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Enter Pincode"
                    className="w-full bg-[#F5F7FB] border border-gray-200 rounded-2xl px-5 py-4 outline-none transition-all text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#5B5FEF]/20 focus:border-[#5B5FEF]"
                  />
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Enter Country"
                    className="w-full bg-[#F5F7FB] border border-gray-200 rounded-2xl px-5 py-4 outline-none transition-all text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#5B5FEF]/20 focus:border-[#5B5FEF]"
                  />
                </div>
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
                  Update Candidate
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default EditCandidate;
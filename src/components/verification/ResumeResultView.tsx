type Props = {
  data: any;
};

function ResumeResultView({ data }: Props) {
  const resume = data || {};

  // 1. JSON parsing modifications
  const education = resume.education ? JSON.parse(resume.education) : [];
  const experience = resume.experience ? JSON.parse(resume.experience) : [];
  const projects = resume.projects ? JSON.parse(resume.projects) : [];
  const certifications = resume.certifications
    ? JSON.parse(resume.certifications)
    : [];

  const languages = resume.languages ? JSON.parse(resume.languages) : [];
  const interests = resume.interests ? JSON.parse(resume.interests) : [];
  const parsedJson = resume.parsed_json ? JSON.parse(resume.parsed_json) : {};

  const skills = resume.skills
    ? String(resume.skills)
        .split(",")
        .map((s: string) => s.trim())
    : [];

  const value = (v: any) => {
    if (v === null || v === undefined || v === "") {
      return "Not Available";
    }
    return v;
  };

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div>
        <h2 className="text-xl font-bold">Basic Information</h2>
        <div className="grid grid-cols-2 gap-5 mt-4">
          <div>
            <p className="text-gray-500">Full Name</p>
            <p className="font-semibold">{value(resume.full_name)}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-semibold">{value(resume.email)}</p>
          </div>
          <div>
            <p className="text-gray-500">Phone</p>
            <p className="font-semibold">{value(resume.phone)}</p>
          </div>
          <div>
            <p className="text-gray-500">LinkedIn</p>
            <p className="font-semibold break-all">{value(resume.linkedin)}</p>
          </div>
          <div>
            <p className="text-gray-500">Github</p>
            <p className="font-semibold break-all">
              {value(resume.github_url)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Portfolio</p>
            <p className="font-semibold break-all">
              {value(resume.portfolio_url)}
            </p>
          </div>
        </div>
      </div>

      <hr />

      {/* Location */}
      <div>
        <h2 className="text-xl font-bold">Location</h2>
        <div className="grid grid-cols-3 gap-5 mt-4">
          <div>
            <p className="text-gray-500">City</p>
            <p>{value(resume.city)}</p>
          </div>
          <div>
            <p className="text-gray-500">State</p>
            <p>{value(resume.state)}</p>
          </div>
          <div>
            <p className="text-gray-500">Country</p>
            <p>{value(resume.country)}</p>
          </div>
        </div>
      </div>

      <hr />

      {/* Experience Overview Meta */}
      <div>
        <h2 className="text-xl font-bold">Experience Metrics</h2>
        <div className="grid grid-cols-2 gap-5 mt-4">
          <div>
            <p className="text-gray-500">Experience Years</p>
            <p>{value(resume.experience_years)}</p>
          </div>
          <div>
            <p className="text-gray-500">Months</p>
            <p>{value(resume.total_experience_months)}</p>
          </div>
          <div>
            <p className="text-gray-500">Current Company</p>
            <p>{value(resume.current_company)}</p>
          </div>
          <div>
            <p className="text-gray-500">Designation</p>
            <p>{value(resume.designation)}</p>
          </div>
        </div>
      </div>

      <hr />

      {/* Education Overview Meta */}
      <div>
        <h2 className="text-xl font-bold">Education Metrics</h2>
        <div className="grid grid-cols-2 gap-5 mt-4">
          <div>
            <p className="text-gray-500">Highest Qualification</p>
            <p>{value(resume.highest_qualification)}</p>
          </div>
          <div>
            <p className="text-gray-500">Resume Score</p>
            <p>{value(resume.resume_score)}%</p>
          </div>
        </div>
      </div>

      <hr />

      {/* 2. Detailed Education History Section */}
      <div>
        <h2 className="text-xl font-bold">Education</h2>
        <div className="space-y-4 mt-4">
          {education.length > 0 ? (
            education.map((edu: any, index: number) => (
              <div key={index} className="border rounded-xl p-4">
                <p>
                  <b>School</b>: {edu.school}
                </p>
                <p>
                  <b>Degree</b>: {edu.degree}
                </p>
                <p>
                  <b>CGPA</b>: {edu.cgpa}
                </p>
              </div>
            ))
          ) : (
            <p>Not Available</p>
          )}
        </div>
      </div>

      <hr />

      {/* 3. Detailed Experience Section */}
      <div>
        <h2 className="text-xl font-bold">Experience</h2>
        <div className="space-y-4 mt-4">
          {experience.length > 0 ? (
            experience.map((exp: any, index: number) => (
              <div key={index} className="border rounded-xl p-4">
                <p>
                  <b>Company</b>: {exp.company}
                </p>
                <p>
                  <b>Position</b>: {exp.position}
                </p>
                <p>
                  <b>Dates</b>: {exp.dates}
                </p>
              </div>
            ))
          ) : (
            <p>Not Available</p>
          )}
        </div>
      </div>

      <hr />

      {/* 4. Projects Section */}
      <div>
        <h2 className="text-xl font-bold">Projects</h2>
        <div className="space-y-4 mt-4">
          {projects.length > 0 ? (
            projects.map((project: any, index: number) => (
              <div key={index} className="border rounded-xl p-4">
                <h3 className="font-semibold mb-2">{project.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack?.map((t: string, i: number) => (
                    <span
                      key={i}
                      className="bg-indigo-100 px-2 rounded text-sm text-indigo-800"
                    >
                      {t}
                    </span>
                  )) || (
                    <span className="text-gray-400 text-sm">
                      No tech stack listed
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>Not Available</p>
          )}
        </div>
      </div>

      <hr />

      {/* 5. Certifications Section */}
      <div>
        <h2 className="text-xl font-bold">Certifications</h2>
        <div className="mt-4 space-y-1">
          {certifications.length > 0 ? (
            certifications.map((item: any, i: number) => <p key={i}>{item}</p>)
          ) : (
            <p>Not Available</p>
          )}
        </div>
      </div>

      <hr />

      {/* Skills Section */}
      <div>
        <h2 className="text-xl font-bold">Skills</h2>
        <div className="flex flex-wrap gap-2 mt-4">
          {skills.length > 0 ? (
            skills.map((skill: string) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700"
              >
                {skill}
              </span>
            ))
          ) : (
            <p>Not Available</p>
          )}
        </div>
      </div>

      <hr />

      {/* 6. Languages Section */}
      <div>
        <h2 className="text-xl font-bold">Languages</h2>
        <div className="flex gap-2 flex-wrap mt-4">
          {languages.length > 0 ? (
            languages.map((l: string, i: number) => (
              <span
                key={i}
                className="bg-green-100 px-2 py-1 rounded text-green-800 text-sm"
              >
                {l}
              </span>
            ))
          ) : (
            <p>Not Available</p>
          )}
        </div>
      </div>

      <hr />

      {/* 7. Interests Section */}
      <div>
        <h2 className="text-xl font-bold">Interests</h2>
        <div className="flex gap-2 flex-wrap mt-4">
          {interests.length > 0 ? (
            interests.map((l: string, i: number) => (
              <span
                key={i}
                className="bg-orange-100 px-2 py-1 rounded text-orange-800 text-sm"
              >
                {l}
              </span>
            ))
          ) : (
            <p>Not Available</p>
          )}
        </div>
      </div>

      <hr />

      {/* Parser Information */}
      <div>
        <h2 className="text-xl font-bold">Parser Information</h2>
        <div className="grid grid-cols-2 gap-5 mt-4">
          <div>
            <p className="text-gray-500">Provider</p>
            <p>{value(resume.parser_provider)}</p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <p>{value(resume.parsing_status)}</p>
          </div>
          <div>
            <p className="text-gray-500">Resume File</p>
            <p>{value(resume.resume_file_name)}</p>
          </div>
          <div>
            <p className="text-gray-500">Created At</p>
            <p>{value(resume.created_at)}</p>
          </div>
        </div>
      </div>

      <hr />

      {/* 8. Parsed JSON Viewer */}
      <div>
        <h2 className="text-xl font-bold">Parsed JSON</h2>
        <pre className="bg-black text-green-400 p-5 mt-4 rounded-xl overflow-auto text-sm max-h-96">
          {JSON.stringify(parsedJson, null, 2)}
        </pre>
      </div>

      <hr />

      {/* 9. Raw Resume Viewer */}
      <div>
        <h2 className="text-xl font-bold">Raw Resume</h2>
        <pre className="bg-gray-100 p-4 mt-4 rounded-xl overflow-auto text-sm whitespace-pre-wrap max-h-96">
          {resume.raw_resume_text || "Not Available"}
        </pre>
      </div>
    </div>
  );
}

export default ResumeResultView;

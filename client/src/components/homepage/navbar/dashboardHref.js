const dashboardHref = (role) => {
  if (role === "recruiter") return "/dashboard/recruiter";
  if (role === "admin") return "/dashboard/admin";
  return "/dashboard/seeker";
};

export default dashboardHref;

import axios from "axios";

const API_URL = import.meta.env.VITE_API_SERVER; // Ensure your API URL is set in env variables

const convertToFhirPatient = (formData: any) => ({
    resourceType: "Patient",
    id: window.crypto.randomUUID(), // Generate unique ID
    name: [
      {
        use: "official",
        family: formData.Lastname,
        given: [formData.Firstname],
      },
    ],
    gender: "unknown", // Optional: Add gender if needed
    birthDate: `${formData.year}-${formData.month.padStart(2, "0")}-${formData.day.padStart(2, "0")}`,
    address: [
      {
        line: [formData.Street],
        city: formData.County,
        postalCode: formData.Postcode,
        country: "UK", // Change if needed
      },
    ],
    telecom: [
      {
        system: "email",
        value: formData.Email,
        use: "home",
      },
      {
        system: "phone",
        value: formData.Phone,
        use: "mobile",
      },
    ],
    active: true,
  })

export const createPatient = async (formData: {
  Firstname: string;
  Lastname: string;
  Street: string;
  County: string;
  Postcode: string;
  day: string;
  month: string;
  year: string;
}) => {
  try {
    // ✅ Convert form data to FHIR-compliant Patient object
    const fhirPatient = convertToFhirPatient(formData)

    console.log("📤 Sending FHIR Patient:", fhirPatient);

    // ✅ Send the FHIR Patient to your API
    const response = await axios.post(`http://localhost:3001/patients`, fhirPatient, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Ensure credentials (cookies) are included
    });

    console.log("✅ Patient Created:", response.data);
    return response.data;
  } catch (error) {
    console.error("🚨 Error creating patient:", error);
    throw error;
  }
};
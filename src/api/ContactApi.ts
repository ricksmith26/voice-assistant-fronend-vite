import axios from "axios";

const API_URL = import.meta.env.VITE_API_SERVER;

export const createContacts = async (
  patientId: string, // ✅ Accepts patient ID
  contacts: {
    Firstname: string;
    Lastname: string;
    Phone: string;
    Email: string;
  }[]
) => {
  try {
    // ✅ Convert contacts to FHIR `ContactPoint` format
    const fhirContacts = contacts.map((contact) => ({
      id: window.crypto.randomUUID(), // Unique ID for each contact
      name: {
        family: contact.Lastname,
        given: [contact.Firstname],
      },
      telecom: [
        {
          system: "phone",
          value: contact.Phone,
          use: "mobile",
        },
        {
          system: "email",
          value: contact.Email,
          use: "home",
        },
      ],
      relationship: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/v2-0131", code: "C", display: "Emergency Contact" }] }], // Optional
      patient: {
        reference: `Patient/${patientId}`, // ✅ Associate contact with the patient
      },
    }));

    console.log("📤 Sending FHIR Contacts:", fhirContacts);

    // ✅ Send the FHIR Contacts to your API
    /// NEED TO CREATE ENDPOINTS FOR CONTACTS
    const response = await axios.post(`http://localhost:3001/contacts`, { patientId, contacts: fhirContacts }, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    console.log("✅ Contacts Created:", response.data);
    return response.data;
  } catch (error) {
    console.error("🚨 Error creating contacts:", error);
    throw error;
  }
};
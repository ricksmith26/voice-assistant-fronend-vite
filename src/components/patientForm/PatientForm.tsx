// import Button from "../Button/Button"
import './patientForm.css'
import { PersonalDetails } from "./patientFormComponents/PersonalDetails"
import { useEffect, useState } from "react"
import { EmergencyContacts } from "./patientFormComponents/EmergencyContacts"
import { FormTitle } from "./patientFormComponents/FormTitle"
import { createPatient } from "../../api/PatientApi"
import { createRelatedPersons } from "../../api/EmergencyContactApi"

interface PatientFormProps {
    email: string;
    setMode: Function;
}

export const PatientForm = ({ email, setMode }: PatientFormProps) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [patientId, setPatientId] = useState('');
    const [patient, setPatient] = useState({
        Firstname: "",
        Lastname: "",
        Email: "",
        Phone: "",
        Street: "",
        County: "",
        Postcode: "",
        day: "",
        month: "",
        year: ""
    })
    const [contacts, setContacts] = useState([])

    const pageText = [
        "It looks like you don't have an account yet! Lets get to know you.",
        "Who would you want us to call in an emergency?"
    ]

    const onChangePatient = (event: any) => {
        const p = { ...patient, [event.target.name]: event.target.value }
        setPatient(p)
    }

    const submitPatient = async () => {
        let patientData = patient;
        patientData.Email = email;
        try {
            const response = await createPatient(patientData)
            const id = response._id
            setPatientId(id)
            setCurrentPage(currentPage + 1)
        } catch (error) {
            throw error;
        }
    }

    const submitContacts = async () => {
        try {
            await createRelatedPersons(patientId, contacts)
            setMode('idle')
        } catch (error) {
            console.log(error, "<<<<<<")
        }
    }

    return (
        <div className="patientFormBackground">
            <FormTitle text={pageText[currentPage]} />
            <div className="contentsContainer">
                {currentPage === 0
                    && <PersonalDetails onChange={onChangePatient} onClick={submitPatient} />}
                {currentPage === 1
                    && <EmergencyContacts
                        setContacts={setContacts}
                        contacts={contacts}
                        submitContacts={submitContacts} />}
            </div>
        </div>

    )
}
import Button from "../Button/Button"
import './patientForm.css'
import { PersonalDetails } from "./patientFormComponents/PersonalDetails"
import { useEffect, useState } from "react"
import { EmergencyContacts } from "./patientFormComponents/EmergencyContacts"
import { FormTitle } from "./patientFormComponents/FormTitle"

export const PatientForm = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [patient, setPatient] = useState({Firstname: '', Lastname: '', Email: '', Phone: ''})
    const [contacts, setContacts] = useState([])

    const pageText = [
        "It looks like you don't have an account yet! Lets get to know you.",
        "Who would you want us to call in an emergency?"
    ]

    const onPatientChange = (event: any) => {
        const p = { ...patient, [event.target.name]: event.target.value }
        console.log(p, '<<<<')
        setPatient(p)
    }


    useEffect(() => {
        console.log(currentPage)
    }, [currentPage])


    return (
        <div className="patientFormBackground">
            <FormTitle text={pageText[currentPage]} />

            <div className="contentsContainer">

                {currentPage === 0 && <PersonalDetails onChange={onPatientChange} onClick={() => setCurrentPage(currentPage + 1)}/>}
                {currentPage === 1 && <EmergencyContacts setContacts={setContacts} contacts={contacts}  onClick={() => setCurrentPage(currentPage + 1)}/>}
            </div>
        </div>

    )
}
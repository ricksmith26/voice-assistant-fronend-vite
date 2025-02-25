import Button from "../Button/Button"
import './patientForm.css'
import { PersonalDetails } from "./patientFormComponents/PersonalDetails"
import { useEffect, useState } from "react"
import { EmergencyContacts } from "./patientFormComponents/EmergencyContacts"
import { FormTitle } from "./patientFormComponents/FormTitle"
import { createPatient } from "../../api/PatientApi"

interface PatientFormProps {
    email: string;
}

export const PatientForm = ({email}: PatientFormProps) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [paitentId, setPatientId] =useState('');
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

    const submitPatient = async() => {
        let patientData = patient;
        patientData.Email = email;
        console.log(patientData, email)
        try {
            const response = await createPatient(patientData)
            const id = response._id
            setPatientId(id)
            setCurrentPage(currentPage + 1)
        } catch (error) {
            throw error;
        }
    }


    useEffect(() => {
        console.log(currentPage)
    }, [currentPage])


    return (
        <div className="patientFormBackground">
            <FormTitle text={pageText[currentPage]} />
            <div className="contentsContainer">
                {currentPage === 0 && <PersonalDetails onChange={onChangePatient} onClick={submitPatient}/>}
                {currentPage === 1 && <EmergencyContacts patientId={paitentId} setContacts={setContacts} contacts={contacts}  onClick={() => setCurrentPage(currentPage + 1)}/>}
            </div>
        </div>

    )
}
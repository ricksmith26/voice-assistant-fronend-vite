import Button from "../Button/Button"
import { TextInput } from "../formComponents/TextInput/TextInput"
import logo from '../../assets/logos/justLogo.jpg'
// import { AnimatedTitle } from "../Title/Title"
import './patientForm.css'
import { PersonalDetails } from "./patientFormPages/PersonalDetails"
import { FormEvent, useActionState, useEffect, useState } from "react"
import { EmergencyContacts } from "./patientFormPages/EmergencyContacts"
import { FormTitle } from "./patientFormPages/FormTitle"

const addPatient = async () => {

}

export const PatientForm = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [patient, setPatient] = useState({})
    const [contacts, setContacts] = useState([])

    const pageText = [
        "It looks like you don't have an account yet! Lets get to know you.",
        "Who would you want us to call in an emergency?"
    ]

    const onPatientChange = (event: any) => {
        const p = {...patient, [event.target.name]: event.target.value}
        console.log(p, '<<<<')
        setPatient(p)
    }

    


    useEffect(() => {
        console.log(currentPage)
    }, [currentPage])


    return (
        <>
            <FormTitle text={pageText[currentPage]}/>

            <div className="contentsContainer">

            {currentPage === 0 &&  <PersonalDetails onChange={onPatientChange}/>}
            {currentPage === 1 && <EmergencyContacts setContacts={setContacts} contacts={contacts}/>}
           {currentPage === 0  && 
           <div className="buttonContainer">
                <Button onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
            </div>} 
            {currentPage === 1 && contacts.length > 0  && 
           <div className="buttonContainer">
                <Button onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
            </div>} 
        </div>
        </>
       
    )
}
import { useEffect, useState } from "react"
import Button from "../../Button/Button"
import { TextInput } from "../../formComponents/TextInput/TextInput"

export const EmergencyContacts = ({contacts, setContacts}: {contacts: any[], setContacts: any}) => {
    const [contact, setContact] = useState({})


    const onContactChange = (event: any) => {
        const c = {...contact, [event.target.name]: event.target.value}
        console.log(c, '<<<<')
        setContact(c)
    }

    const addContact = () => {  
        const addedContactsArray = [...contacts]
        addedContactsArray.push(contact)
        setContacts(addedContactsArray)
    }



    useEffect(() => {
        console.log(contacts, "<adddedContacts<<<")
    }, [ contacts])
    return (
        <div>
            <>
            {contacts.map((contact) => {
                return (
                    <div>
                        <div>{contact.Firstname}</div>
                        <div>{contact.Lastname}</div>
                    </div>
                )
            })}
            </>
           
            <div className="inputsContainer">
                <div className="namesContainer">
                    <TextInput label='Firstname' name='Firstname' placeholder="Firstname" onChange={onContactChange}/>
                    <TextInput label='Lastname' name='Lastname' placeholder="Lastname"  onChange={onContactChange}/>
                </div>
                <div className="namesContainer">
                    <TextInput label='Phone' name='Phone' placeholder="Phone"  onChange={onContactChange}/>
                    <TextInput label='Email' name='Email' placeholder="Email" style={{marginLeft: '8px'}}  onChange={onContactChange}/>
                </div>
            </div>
            <div className="buttonContainer">
                <Button onClick={addContact}>Add +</Button>
            </div>
        </div>
    )
}
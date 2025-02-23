import Button from "../../Button/Button"
import { TextInput } from "../../formComponents/TextInput/TextInput"

export const EmergencyContacts = () => {
    return (
        <div>
            <div className="inputsContainer">
                <div className="namesContainer">
                    <TextInput label='Firstname' name='Firstname' placeholder="Firstname" />
                    <TextInput label='Lastname' name='Lastname' placeholder="Lastname" />
                </div>
                <div className="namesContainer">
                    <TextInput label='Phone' name='Phone' placeholder="Phone" />
                    <TextInput label='Email' name='Email' placeholder="Email" style={{marginLeft: '8px'}}/>
                </div>
            </div>
            <div className="buttonContainer">
                <Button>Add +</Button>
            </div>
        </div>
    )
}
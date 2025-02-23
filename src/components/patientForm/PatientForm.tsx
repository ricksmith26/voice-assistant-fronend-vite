import Button from "../Button/Button"
import { TextInput } from "../formComponents/TextInput/TextInput"
import logo from '../../assets/logos/justLogo.jpg'
// import { AnimatedTitle } from "../Title/Title"
import './patientForm.css'

export const PatientForm = () => {
    return (
        <div className="titleContainer">
            <div className="formContainer">
                <div className="logo">
                    <img src={logo} style={{ maxHeight: '150px' }} />
                </div>
                <h4 style={{ width: 'max-content' }}>It looks like you don't have an account yet! Lets get to know you.</h4>
            </div>
            <div className="inputsContainer">
                <div className="namesContainer">
                    <TextInput label='Firstname' name='Firstname' placeholder="Firstname" />
                    <TextInput label='Lastname' name='Lastname' placeholder="Lastname" />
                </div>

                <div className="addressContainer">
                    <TextInput label='Street' name='Street' placeholder="Street" style={{ marginLeft: '24px' }} />
                    <TextInput label='Town' name='Town' placeholder="Town" style={{ marginLeft: '30px' }} />
                    <TextInput label='County' name='County' placeholder="County" style={{ marginLeft: '16px' }} />
                    <TextInput label='Postcode' name='Postcode' placeholder="Postcode" style={{ width: '100px', marginLeft: '0px' }} />
                </div>
            </div>
            <div className="buttonContainer">
                <Button>Next</Button>
            </div>
        </div>
    )
}
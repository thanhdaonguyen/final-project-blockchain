import { useState } from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';
import { Connect, RegisterUniversity} from '../wailsjs/go/main/App';

function App() {
    const [resultText, setResultText] = useState("Click a button to interact with the blockchain 👇");

    const [univInputs, setUnivInputs] = useState({
        name: '',
        password: '',
        location: '',
        description: '',
    });

    const [universities, setUniversities] = useState([]);

    const handleConnect = () => {
        Connect()
            .then((result) => setResultText(result))
            .catch((err) => setResultText(`Error: ${err}`));
    };


    const updateUnivInput = (e) => {
        setUnivInputs({ ...univInputs, [e.target.name]: e.target.value });
    };

    const handleRegisterUniversity = async (e) => {
        e.preventDefault();

        RegisterUniversity(
            univInputs.name,
            univInputs.password,
            univInputs.location,
            univInputs.description
        )
            .then((result) => {
                setResultText(result);

                const publicKeyMatch = result.match(/Public Key:\s*(.*)/);
                const privateKeyMatch = result.match(/Private Key:\s*(.*)/);

                setUniversities((prev) => [
                    ...prev,
                    {...univInputs,
                        publicKey: publicKeyMatch ? publicKeyMatch[1] : '',
                        privateKey: privateKeyMatch ? privateKeyMatch[1] : '',
                    }
                ]);

                setUnivInputs({
                    name: '',
                    password: '',
                    location: '',
                    description: '',
                });
            })
            .catch((err) => setResultText(`Error: ${err}`));
    };

    const truncateText = (text, maxLength) => {
        if (text && text.length > maxLength) {
            return `${text.substring(0, maxLength)}...`;
        }
        return text || '-';
    };

    return (
        <div id="App">
            <img src={logo} id="logo" alt="logo" />
            <div id="result" className="result">
                {resultText}
                {universities.length > 0 && (
                    <div className="table-wrapper">
                        <table className="certificate-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Public Key</th>
                                    <th>Private Key</th>
                                    <th>Location</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {certificates.map((cert, index) => ( */}
                                {universities.map((univ, index) => (
                                    <tr key={index}>
                                        <td title={univ.name}>{truncateText(univ.name, 10)}</td>
                                        <td title={univ.publicKey}>{truncateText(univ.publicKey, 10)}</td>
                                        <td title={univ.privateKey}>{truncateText(univ.privateKey, 10)}</td>
                                        <td title={univ.location}>{truncateText(univ.location, 10)}</td>
                                        <td title={univ.description}>{truncateText(univ.description, 10)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="button-group">
                <button className="btn" onClick={handleConnect}>Connect</button>
            </div>

            <div className="input-box">
                <h3>Register University</h3>
                <form onSubmit={handleRegisterUniversity}>
                    <input className="input" name="name" placeholder="University Name" value={univInputs.name} onChange={updateUnivInput} />
                    <input className="input" name="password" placeholder="Password" value={univInputs.password} onChange={updateUnivInput} />
                    <input className="input" name="location" placeholder="Location" value={univInputs.location} onChange={updateUnivInput} />
                    <input className="input" name="description" placeholder="Description" value={univInputs.description} onChange={updateUnivInput} />
                    <button type="submit" className="btn">Register</button>
                </form>
            </div>
        </div>
    );
}

export default App;

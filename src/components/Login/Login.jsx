import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import app from '../../firebase/firebase.config';
import { Link } from 'react-router-dom';

const auth = getAuth(app);

const Login = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const emailRef = useRef();

    const handleLogin = event =>{
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
        console.log(email, password);

        // validation
        setError('');
        setSuccess('');
        if(!/(?=.*[A-Z].*[A-Z])/.test(password)){
            setError('Please add at least two uppercase');
            return;
        }
        else if(!/(?=.*[!#$%&*])/.test(password)){
            setError('Please add a Special character');
            return;
        }
        else if(password.length<6){
            setError('Password must be 6 characters long');
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
        .then(result => {
            const loggedUser = result.user;
            console.log(loggedUser);
            setSuccess('User login successful');
            setError('');
        })
        .catch(error => {
            setError(error.message)
        })
    }

    const handleResetPassword = event => {
        const email = emailRef.current.value;
        if(!email){
            alert('Please provide your email address to reset password');
            return;
        }
        sendPasswordResetEmail(auth, email)
        .then( () => {
            alert('Please check your email')
        })
        .catch(error => {
            console.log(error);
            setError(error.message)
        })
    }

    return (
        <div>
            <h2>Please login</h2>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" name='email' ref={emailRef} placeholder='Your Email' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required />

                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" name='password' placeholder='Your Password' className="form-control" id="exampleInputPassword1" required />
                </div>
                <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                    <label className="form-check-label" htmlFor="exampleCheck1">remember me</label>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            <p><small>Forget password? Please <button onClick={handleResetPassword} className='btn btn-link'>Reset Password</button> </small></p>
            <p><small>New to this website? Please <Link to="/register">Register</Link></small></p>
            <p className='text-danger'>{error}</p>
            <p className='text-success'>{success}</p>
        </div>
    );
};

export default Login;
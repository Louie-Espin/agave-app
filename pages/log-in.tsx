import { NextPage } from "next";
import React, { useCallback, useState } from "react";
import clientLogIn from '@firebaseUtils/client/logIn';
import { AuthAction, withAuthUser } from 'next-firebase-auth'
import {useFormik} from "formik";
import * as yup from "yup";

import { Button, Alert, AlertColor, Collapse } from "@mui/material";
import {H2, Small} from "components/Typography";
import Wrapper from "components/Forms/Wrapper";
import BazarTextField from "components/Forms/BazarTextField";
import EyeToggleButton from "components/Forms/EyeToggleButton";
import Link from "components/Link";

const LogIn: NextPage = () => {

    // Alert States
    const [alert, setAlert] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>('error');
    const [alertContent, setAlertContent] = useState('');

    // passwordVisibility Hooks
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const togglePasswordVisibility = useCallback(() => {
        setPasswordVisibility((visible) => !visible);
    }, []);

    // handling form submissions
    const handleFormSubmit = async (values: {email: string, password: string }) => {

        const { result, error } = await clientLogIn(values.email, values.password);

        if (error) {
            setAlert(true);
            setAlertSeverity('error');
            setAlertContent(error.message);

            return console.error(error);
        }

        // else successful
        setAlert(true);
        setAlertSeverity('success');
        setAlertContent("Success! Logging you in...")

        return console.log(result)
    };

    // Initializing variables to use within form, provided by useFormik
    const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
        useFormik({
                initialValues, onSubmit: handleFormSubmit, validationSchema: formSchema,
            }
        );

    return(
        <Wrapper elevation={0} passwordVisibility={passwordVisibility}>
            <form onSubmit={handleSubmit}>
                <H2 textAlign="center" mb={1}>Welcome To Agave Communications</H2>

                <Small mb={4.5} display="block" fontSize="12px" fontWeight="600" color="grey.800" textAlign="center">
                    Log in with email & password.
                </Small>

                <BazarTextField mb={1.5} fullWidth size="small" variant="outlined" name="email" type="email"
                    onBlur={handleBlur} value={values.email} onChange={handleChange}
                    label="Email Address" placeholder="example@mail.com"
                    error={!!touched.email && !!errors.email} helperText={touched.email && errors.email}
                />

                <BazarTextField mb={2} fullWidth size="small" variant="outlined" name="password" label="Password"
                    autoComplete="on" onBlur={handleBlur} onChange={handleChange} value={values.password}
                    placeholder="*********" type={passwordVisibility ? "text" : "password"}
                    error={!!touched.password && !!errors.password} helperText={touched.password && errors.password}

                    InputProps={{
                        endAdornment: (<EyeToggleButton show={passwordVisibility} click={togglePasswordVisibility}/>),
                    }}
                />

                <Button fullWidth type="submit" color="primary" variant="contained" sx={{ mb: "1.65rem", height: 44 }}>
                    Sign In
                </Button>

                <Small mb={4.5} display="block" fontSize="12px" fontWeight="600" color="grey.800" textAlign="center">
                    Dont have an account?
                    {/* TODO: [CODE SMELL] hard-coded value */}
                    <Link href="/sign-up" color="secondary" sx={{ textDecoration: 'none' }}>
                        &nbsp;Sign Up Here.
                    </Link>
                </Small>

                <Collapse in={alert}>
                    <Alert onClose={() => setAlert(false)} severity={alertSeverity}>{alertContent}</Alert>
                </Collapse>
            </form>
        </Wrapper>
    );
}

// Initial values for formik
const initialValues = { email: "", password: "", };

// Form Schema by yup
const formSchema = yup.object().shape({
    password: yup.string().required("Password is required"),
    email: yup.string().email("invalid email").required("Email is required"),
});

export default withAuthUser({
    whenAuthed: AuthAction.REDIRECT_TO_APP,
    whenAuthedBeforeRedirect: AuthAction.RETURN_NULL,
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.RENDER,
})(LogIn as any)
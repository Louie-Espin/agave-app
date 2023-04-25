import {NextPage} from "next";
import {useRouter} from 'next/navigation'
import React, {useCallback, useState} from "react";
import signIn from '@firebaseUtils/client/signIn';
import {AuthAction, withAuthUser} from 'next-firebase-auth'
import {useFormik} from "formik";
import * as yup from "yup";

import {Button} from "@mui/material";
import {H3, Small} from "components/Typography";
import Wrapper from "components/Forms/Wrapper";
import BazarTextField from "components/Forms/BazarTextField";
import EyeToggleButton from "components/Forms/EyeToggleButton";

// Initial values for formik
const initialValues = { email: "", password: "", };

// Form Schema by yup
const formSchema = yup.object().shape({
    password: yup.string().required("Password is required"),
    email: yup.string().email("invalid email").required("Email is required"),
});

const LogIn: NextPage = () => {

    const router = useRouter();

    // passwordVisibility Hooks
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const togglePasswordVisibility = useCallback(() => {
        setPasswordVisibility((visible) => !visible);
    }, []);

    // handling form submissions
    const handleFormSubmit = async (values: {email: string, password: string }) => {

        const { result, error } = await signIn(values.email, values.password);

        if (error) { return console.log(error) }

        // else successful
        console.log(result)
    };

    // Initializing variables to use within form, provided by useFormik
    const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
        useFormik({
                initialValues, onSubmit: handleFormSubmit, validationSchema: formSchema,
            }
        );

    return(
        <Wrapper elevation={3} passwordVisibility={passwordVisibility}>
            <form onSubmit={handleSubmit}>
                <H3 textAlign="center" mb={1}>Welcome To Agave Communications</H3>
                <Small mb={4.5} display="block" fontSize="12px" fontWeight="600" color="grey.800" textAlign="center">
                    Log in with email & password
                </Small>
                <BazarTextField
                    mb={1.5}
                    fullWidth
                    name="email"
                    size="small"
                    type="email"
                    variant="outlined"
                    onBlur={handleBlur}
                    value={values.email}
                    onChange={handleChange}
                    label="Email or Phone Number"
                    placeholder="example@mail.com"
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                />
                <BazarTextField
                    mb={2}
                    fullWidth
                    size="small"
                    name="password"
                    label="Password"
                    autoComplete="on"
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    placeholder="*********"
                    type={passwordVisibility ? "text" : "password"}
                    error={!!touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                    InputProps={{
                        endAdornment: (
                            <EyeToggleButton
                                show={passwordVisibility}
                                click={togglePasswordVisibility}
                            />
                        ),
                    }}
                />

                <Button
                    fullWidth
                    type="submit"
                    color="primary"
                    variant="contained"
                    sx={{ mb: "1.65rem", height: 44 }}
                >
                    Sign In
                </Button>
            </form>
        </Wrapper>
    );
}

export default withAuthUser({
    whenAuthed: AuthAction.REDIRECT_TO_APP,
    whenAuthedBeforeRedirect: AuthAction.RETURN_NULL,
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.RENDER,
})(LogIn as any)
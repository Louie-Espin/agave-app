import { FC } from 'react';
import { Box, Button, Grid, styled, TextField } from "@mui/material";
import { H3 } from 'components/Typography';
// import DropZone from "components/DropZone";
import { Formik } from "formik";
import * as yup from "yup";

// form field validation
const validationSchema = yup.object().shape({
    proposal_subject: yup.string().required("subject is required"),
    proposal_email: yup.string().required("email is required"),
    proposal_text: yup.string().required("feedback text required"),
});

const FeedbackForm: FC = () => {
    const initialValues = {
        proposal_subject: "",
        proposal_email: "",
        proposal_text: "",
    };

    const handleFormSubmit = async (values) => {
        console.log(values);
    };

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
        >
            {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
              }) => (
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <H3>Feedback Form</H3>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                color="secondary"
                                size="medium"
                                name="feedback_subject"
                                label="Subject"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.feedback_subject}
                                error={!!touched.feedback_subject && !!errors.feedback_subject}
                                helperText={touched.feedback_subject && errors.feedback_subject}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                color="secondary"
                                size="medium"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                name="feedback_email"
                                label="E-Mail"
                                value={values.feedback_email}
                                error={!!touched.feedback_email && !!errors.feedback_email}
                                helperText={touched.feedback_email && errors.feedback_email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                rows={6}
                                fullWidth
                                multiline
                                color="secondary"
                                size="medium"
                                onBlur={handleBlur}
                                name="feedback_text"
                                onChange={handleChange}
                                label="Feedback"
                                value={values.feedback_text}
                                error={!!touched.feedback_text && !!errors.feedback_text}
                                helperText={touched.feedback_text && errors.feedback_text}
                            />
                        </Grid>
                    </Grid>

                    <Button type="submit" color="secondary" variant="contained" sx={{ mt: 4 }}>
                        Submit
                    </Button>
                </form>
            )}
        </Formik>
    );
}

export default FeedbackForm;
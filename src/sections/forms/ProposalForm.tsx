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
    proposal_text: yup.string().required("proposal details required"),
});

const ProposalForm: FC = () => {
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
                            <H3>Proposal Form</H3>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                color="secondary"
                                size="medium"
                                name="proposal_subject"
                                label="Subject"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.proposal_subject}
                                error={!!touched.proposal_subject && !!errors.proposal_subject}
                                helperText={touched.proposal_subject && errors.proposal_subject}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                color="secondary"
                                size="medium"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                name="proposal_email"
                                label="E-Mail"
                                value={values.proposal_email}
                                error={!!touched.proposal_email && !!errors.proposal_email}
                                helperText={touched.proposal_email && errors.proposal_email}
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
                                name="proposal_text"
                                onChange={handleChange}
                                label="Proposal Details"
                                value={values.proposal_text}
                                error={!!touched.proposal_text && !!errors.proposal_text}
                                helperText={touched.proposal_text && errors.proposal_text}
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

export default ProposalForm;
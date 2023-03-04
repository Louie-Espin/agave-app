import { FC } from 'react';
import { Box, Button, Grid, styled, TextField, FormControlLabel, Checkbox, ToggleButtonGroup, ToggleButton, InputLabel, Select, MenuItem } from "@mui/material";
import { H3 } from 'components/Typography';
import DropZone from "components/DropZone";
import { Formik } from "formik";
import * as yup from "yup";

// form field validation
const validationSchema = yup.object().shape({
    order_slay: yup.string().required("request type is required"),
    order_emergency: yup.boolean().required("status is required"),
    order_description: yup.string().required("description is required"),
    order_type: yup.mixed().oneOf(['service', 'irrigation', 'enhancement']).defined().required()
});

const WorkOrderForm: FC = () => {
    const initialValues = {
        order_type: 'service',
        order_emergency: false,
        order_description: "",
    };

    const handleFormSubmit = async (values) => {
        console.log(values);
    };

    return(
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
                              <H3>New Request Form</H3>
                          </Grid>

                          <Grid item xs={12}>
                              <ToggleButtonGroup
                                  color="secondary"
                                  value={values.order_type}
                                  exclusive
                                  onChange={handleChange}
                                  aria-label="Request Type"
                              >
                                  <ToggleButton name="service" value="service">Standard</ToggleButton>
                                  <ToggleButton name="irrigation" value="irrigation" disabled>Irrigation</ToggleButton>
                                  <ToggleButton name="enhancement" value="enhancement" disabled>Arbor</ToggleButton>
                                  <ToggleButton name="enhancement" value="enhancement" disabled>Water</ToggleButton>
                              </ToggleButtonGroup>
                          </Grid>

                          <Grid item md={6} xs={12}>
                              <TextField
                                  fullWidth
                                  color="secondary"
                                  size="medium"
                                  name="feedback_subject"
                                  label="Place"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values.feedback_subject}
                                  error={!!touched.feedback_subject && !!errors.feedback_subject}
                                  helperText={touched.feedback_subject && errors.feedback_subject}
                              />
                          </Grid>

                          <Grid item md={6} xs={12}>
                              <InputLabel id="demo-simple-select-label">Service Type</InputLabel>
                              <Select
                                  fullWidth
                                  color="secondary"
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  value={values.order_type}
                                  label="Age"
                                  onChange={handleChange}
                              >
                                  <MenuItem value={"work_order"}>Work Order</MenuItem>
                                  <MenuItem value={"enhancement"}>Enhancement</MenuItem>
                                  <MenuItem value={"consultation"}>Consultation</MenuItem>
                              </Select>
                          </Grid>

                          <Grid item xs={12}>
                              <TextField
                                  rows={6}
                                  fullWidth
                                  multiline
                                  color="secondary"
                                  size="medium"
                                  onBlur={handleBlur}
                                  name="order_description"
                                  onChange={handleChange}
                                  label="Description"
                                  value={values.order_description}
                                  error={!!touched.order_description && !!errors.order_description}
                                  helperText={touched.order_description && errors.order_description}
                              />
                          </Grid>

                          <Grid item xs={12}>
                              <DropZone
                                  onChange={(files) => console.log(files)}
                                  title="Drag & Drop Image"
                              />
                          </Grid>

                          <Grid item xs={12}>
                              <FormControlLabel control={<Checkbox />} label="Emergency" />
                          </Grid>

                      </Grid>

                      <Button type="submit" color="secondary" variant="contained" sx={{ mt: 4, zIndex: 0 }}>
                          Submit
                      </Button>
                  </form>
            )}
        </Formik>
    );
}

export default WorkOrderForm;
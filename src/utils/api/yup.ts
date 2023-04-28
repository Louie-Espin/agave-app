import * as yup from "yup";

export const postUserSchema = yup.object().shape({
    displayName: yup.string().required("name is required"),
    email: yup.string().email("invalid email").required("email is required"),
    password: yup.string().required("password is required"),
    re_password: yup
        .string()
        .oneOf([yup.ref("password"),], "passwords must match")
        .required("please re-type password"),
});


// eslint-disable-next-line import/no-anonymous-default-export
export default {
    postUserSchema,
}
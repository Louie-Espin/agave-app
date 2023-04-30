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

export const AnnouncementSchema = yup.object().shape({
    id: yup.string().required("announcement object id is required"),
    author: yup.object({name: yup.string().required(), uid: yup.string().required()}).required("author is required"),
    created: yup.object({_seconds: yup.number().required(), _nanoseconds: yup.number().required()}).required("timestamp is required"),
    title: yup.string().required("title is required")
        .max(50, ({ max }) => `Character limit exceeded! Max ${max} characters allowed!`),
    description: yup.string().required("description is required")
        .max(500, ({ max }) => `Character limit exceeded! Max ${max} characters allowed!`),
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    postUserSchema,
    AnnouncementSchema,
}
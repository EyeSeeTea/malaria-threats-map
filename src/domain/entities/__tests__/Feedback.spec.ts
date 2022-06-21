import { Feedback } from "../Feedback";

const feeedbackData = {
    name: "Example",
    email: "example@gmail.com",
    subject: "subject example",
    message: "message exmaple",
};

describe("Email", () => {
    it("should return success response if feedback is valid", () => {
        const feedbackResult = Feedback.create(feeedbackData);

        feedbackResult.fold(
            error => fail(error),
            feedback => expect(feedback.toData()).toEqual(feeedbackData)
        );
    });
    it("should return field cannot be blank error if name argument is empty", () => {
        const feedbackResult = Feedback.create({ ...feeedbackData, name: "" });

        feedbackResult.fold(
            errors => {
                expect(errors.length).toBe(1);
                expect(errors[0]).toStrictEqual({ errors: ["field_cannot_be_blank"], property: "name", value: "" });
            },
            () => fail("should be fail")
        );
    });
    it("should return field cannot be blank error if email is empty", () => {
        const feedbackResult = Feedback.create({ ...feeedbackData, email: "" });

        feedbackResult.fold(
            errors => {
                expect(errors.length).toBe(1);
                expect(errors[0]).toStrictEqual({ errors: ["field_cannot_be_blank"], property: "email", value: "" });
            },
            () => fail("should be fail")
        );
    });
    it("should return field cannot be blank error if subject is empty", () => {
        const feedbackResult = Feedback.create({ ...feeedbackData, subject: "" });

        feedbackResult.fold(
            errors => {
                expect(errors.length).toBe(1);
                expect(errors[0]).toStrictEqual({ errors: ["field_cannot_be_blank"], property: "subject", value: "" });
            },
            () => fail("should be fail")
        );
    });
    it("should return field cannot be blank error if message is empty", () => {
        const feedbackResult = Feedback.create({ ...feeedbackData, message: "" });

        feedbackResult.fold(
            errors => {
                expect(errors.length).toBe(1);
                expect(errors[0]).toStrictEqual({ errors: ["field_cannot_be_blank"], property: "message", value: "" });
            },
            () => fail("should be fail")
        );
    });
    it("should return invalid field error if value argument is invalid", () => {
        const emailResult = Feedback.create({ ...feeedbackData, email: "example.com" });

        emailResult.fold(
            errors => {
                expect(errors.length).toBe(1);
                expect(errors[0]).toStrictEqual({ errors: ["invalid_field"], property: "email", value: "example.com" });
            },
            () => fail("should be fail")
        );
    });
});

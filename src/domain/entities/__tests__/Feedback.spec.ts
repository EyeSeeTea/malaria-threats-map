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
                expect(Object.keys(errors).length).toBe(1);
                expect(errors.name).toStrictEqual(["field_cannot_be_blank"]);
            },
            () => fail("should be fail")
        );
    });
    it("should return field cannot be blank error if email is empty", () => {
        const feedbackResult = Feedback.create({ ...feeedbackData, email: "" });

        feedbackResult.fold(
            errors => {
                expect(Object.keys(errors).length).toBe(1);
                expect(errors.email).toStrictEqual(["field_cannot_be_blank"]);
            },
            () => fail("should be fail")
        );
    });
    it("should return field cannot be blank error if subject is empty", () => {
        const feedbackResult = Feedback.create({ ...feeedbackData, subject: "" });

        feedbackResult.fold(
            errors => {
                expect(Object.keys(errors).length).toBe(1);
                expect(errors.subject).toStrictEqual(["field_cannot_be_blank"]);
            },
            () => fail("should be fail")
        );
    });
    it("should return field cannot be blank error if message is empty", () => {
        const feedbackResult = Feedback.create({ ...feeedbackData, message: "" });

        feedbackResult.fold(
            errors => {
                expect(Object.keys(errors).length).toBe(1);
                expect(errors.message).toStrictEqual(["field_cannot_be_blank"]);
            },
            () => fail("should be fail")
        );
    });
    it("should return invalid field error if value argument is invalid", () => {
        const emailResult = Feedback.create({ ...feeedbackData, email: "example.com" });

        emailResult.fold(
            errors => {
                expect(Object.keys(errors).length).toBe(1);
                expect(errors.email).toStrictEqual(["invalid_field"]);
            },
            () => fail("should be fail")
        );
    });
});

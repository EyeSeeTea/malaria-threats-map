export const scrollToSection = (id: string) => {
    document.querySelector(`#${id}`)?.scrollIntoView({
        block: "center",
        behavior: "smooth",
    });
};

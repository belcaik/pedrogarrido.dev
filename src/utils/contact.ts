import { useTranslations, type Lang } from "../i18n";

export interface ContactItem {
    label: string;
    value: string;
    url?: string | undefined;
}

export interface ContactInfo {
    email: ContactItem;
    linkedin: ContactItem;
    github?: ContactItem;
}

export function getContactData(lang: Lang) {
    const t = useTranslations(lang);

    const contactInfo: ContactInfo = {
        email: {
            label: t("contact.info.email.label") as string,
            value: t("contact.info.email.value") as string,
        },
        linkedin: {
            label: t("contact.info.linkedin.label") as string,
            value: t("contact.info.linkedin.value") as string,
            url: t("contact.info.linkedin.url") as string,
        },
        github: {
            label: t("contact.info.github.label") as string,
            value: t("contact.info.github.value") as string,
            url: t("contact.info.github.url") as string,
        },
    };

    return {
        t,
        contactInfo,
    };
}

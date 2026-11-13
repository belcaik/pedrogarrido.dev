import { useTranslations, type Lang } from "../i18n";
import { getProfile } from "../data/profile";

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
    const profile = getProfile(lang);

    const contactInfo: ContactInfo = {
        email: {
            label: t("contact.info.email.label") as string,
            value: profile.identity.email,
        },
        linkedin: {
            label: t("contact.info.linkedin.label") as string,
            value: profile.links.linkedin.display,
            url: profile.links.linkedin.url,
        },
        github: {
            label: t("contact.info.github.label") as string,
            value: profile.links.github.display,
            url: profile.links.github.url,
        },
    };

    return {
        t,
        contactInfo,
    };
}

import type { IdCardHolderData } from "@/components/certificates/IdCardPreview";
import type { CardType } from "@/constants/idCard/editorConfig";
import { formatHumanDate } from "@/lib/utils";

/** Map API user record into card holder data by card type */
export function mapUserToCardData(user: Record<string, any>, cardType: CardType): IdCardHolderData {
    if (cardType === "staff") {
        const profile = user.staff_profile ?? user.staffProfile ?? {};
        return {
            name: user.name ?? "",
            reg_no: user.reg_no ?? profile.employee_id ?? "",
            employee_id: profile.employee_id ?? "",
            designation: profile.designation ?? "",
            department: profile.department?.name ?? profile.department_name ?? "",
            joining_date: formatHumanDate(profile.joining_date) || "",
            mobile: user.mobile ?? "",
            email: user.primary_email ?? user.email ?? "",
            photo_url: user.photo_url ?? user.profile_photo_url ?? "",
            valid_until: "",
        };
    }

    const profile = user.student_profile ?? user.studentProfile ?? {};
    const permAddr = profile.permanent_address ?? {};
    const address = permAddr.village_mohalla
        ? `${permAddr.village_mohalla}, ${permAddr.district ?? ""}, ${permAddr.state ?? ""} ${permAddr.pincode ?? ""}`.trim()
        : profile.address ?? "";

    return {
        name: user.name ?? "",
        reg_no: profile.reg_no ?? user.reg_no ?? "",
        stream: profile.stream?.name ?? user.stream_name ?? "",
        blood_group: profile.blood_group ?? "",
        dob: formatHumanDate(profile.dob) || "",
        mobile: user.mobile ?? "",
        email: user.primary_email ?? user.email ?? "",
        father_name: profile.father_name ?? "",
        mother_name: profile.mother_name ?? "",
        address,
        department: profile.stream?.department?.name ?? profile.department?.name ?? "",
        session: profile.session?.name ?? "",
        photo_url: user.photo_url ?? "",
        valid_until: "",
    };
}

/** Validate required layout fields before generate */
export function validateCardDataForLayout(
    cardData: IdCardHolderData,
    layoutFields: string[],
): string | null {
    const required = layoutFields.filter((f) => ["name", "reg_no"].includes(f));
    for (const key of required) {
        const val = cardData[key as keyof IdCardHolderData];
        if (!val || !String(val).trim()) {
            return `${key.replace(/_/g, " ")} is required`;
        }
    }
    if (layoutFields.includes("valid_until")) {
        if (!cardData.valid_until?.trim()) {
            return "Valid until is required";
        }
    }
    return null;
}

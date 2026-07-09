import { GuideDefinition } from "@/types/guide";
import { useGuide } from "@/components/GuideProvider";
import { PageGuidance } from "./shared/page/PageGuidance";
import SettingsTip from "./shared/SettingsTip";

export default function HeadingSmall({
    title,
    description,
    guidance,
    id,
}: {
    title?: string;
    description?: string;
    guidance?: string | string[] | GuideDefinition;
    id?: string;
}) {
    const { activeGuide } = useGuide();

    const displayTitle = title || activeGuide?.pageTitle || "";
    const displayDescription = description || activeGuide?.pageSubtitle;

    return (
        <header id={id} className="space-y-4">
            <div>
                <h3 className="mb-0.5 text-base font-bold text-slate-900">{displayTitle}</h3>
                {displayDescription && (
                    <p className="text-sm text-muted-foreground font-medium">{displayDescription}</p>
                )}
            </div>

            <div className="space-y-4">
                {(guidance || activeGuide?.pageGuidance) && (
                    <div className="pt-1">
                        <PageGuidance guidance={guidance} />
                    </div>
                )}

                {activeGuide?.settingsTip && (
                    <SettingsTip description={activeGuide.settingsTip} />
                )}
            </div>
        </header>
    );
}

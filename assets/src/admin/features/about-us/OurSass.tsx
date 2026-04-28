/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * External dependencies
 */
import { Check, Zap } from "lucide-react";

/**
 * Internal dependencies
 */
import TimecticsBanner from "../../../../images/admin/timetics-banner.webp";

const features = [
    __(
        "Smart AI Booking — Let clients book 24/7 without back-and-forth emails",
        "optiontics",
    ),
    __(
        "Multi-Calendar Sync — Google, Outlook & iCal synced in real time",
        "optiontics",
    ),
    __(
        "Team Scheduling — Assign staff, manage availability across your whole team",
        "optiontics",
    ),
    __(
        "Automated Reminders — Reduce no-shows with SMS & email notifications",
        "optiontics",
    ),
    __(
        "Analytics Dashboard — Track revenue, peak hours & booking trends",
        "optiontics",
    ),
];

const OurSass = () => {
    return (
        <>
            <div className="flex flex-col gap-2">
                <div className="text-2xl font-bold text-black/90">
                    {__("Our SaaS", "optiontics")}
                </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-10 xl:px-15 xl:py-7.5 flex flex-col xl:flex-row items-center justify-between gap-16">
                {/* Left column */}
                <div className="flex flex-col gap-5 max-w-130 w-full shrink-0">
                    {/* Eyebrow chip */}
                    <div className="inline-flex items-center gap-2 bg-[#EBF3FF] rounded-full px-3.5 py-1.5 w-fit">
                        <span className="w-1.75 h-1.75 rounded-full bg-[#2F82FF] shrink-0" />
                        <span className="text-[#2F82FF] text-xs font-semibold">
                            {__("AI-Powered Scheduling", "optiontics")}
                        </span>
                    </div>

                    {/* Title block */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="text-black/90 text-[32px] font-bold leading-tight">
                                {__("Timetics AI", "optiontics")}
                            </div>
                            <span className="bg-[#2F82FF] text-white text-[11px] font-bold px-2.5 py-1 rounded-[6px]">
                                v2.0
                            </span>
                        </div>
                        {/* Accent bar */}
                        <div className="w-15 h-1 bg-[#2F82FF] rounded-[2px]" />
                    </div>

                    {/* Description */}
                    <div className="text-black/70 text-[15px] leading-[1.7]">
                        {__(
                            "Timetics AI is your intelligent appointment scheduling assistant. Automate bookings, sync calendars, manage services, and delight your clients — all in one place.",
                            "optiontics",
                        )}
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-[#E2E8F0]" />

                    {/* Features list */}
                    <div className="flex flex-col gap-3">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2.5"
                            >
                                <div className="w-7 h-7 rounded-lg bg-[#EBF3FF] flex items-center justify-center shrink-0">
                                    <Check
                                        className="w-3.5 h-3.5 text-[#2F82FF]"
                                        strokeWidth={2.5}
                                    />
                                </div>
                                <span className="text-black/90 text-sm">
                                    {feature}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* CTA row */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <a
                            href="https://app.timetics.ai/sign-up"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#2F82FF] text-white! text-sm font-bold px-7 py-3.5 rounded-[10px] hover:bg-[#1a6de8] transition-colors"
                        >
                            <Zap className="w-4 h-4 text-white!" />
                            {__("Get Started Free", "optiontics")}
                        </a>
                        <a
                            href="https://timetics.ai/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-white text-[#2F82FF]! text-sm font-semibold px-7 py-3.5 rounded-[10px] border border-[#2F82FF]! hover:bg-[#EBF3FF] transition-colors"
                        >
                            {__("Learn more", "optiontics")}
                        </a>
                    </div>
                </div>

                {/* Right column — banner image */}
                <div className="w-full xl:flex-1 xl:max-w-150 relative rounded-3xl p-5 before:content-[''] before:absolute before:inset-0 before:rounded-3xl before:bg-[radial-gradient(ellipse_at_center,#ddeeff_0%,#eaf4ff_35%,#f0f7ff_60%,transparent_100%)] before:z-0">
                    <img
                        src={TimecticsBanner}
                        alt={__(
                            "Timetics AI — Appointment Scheduling",
                            "optiontics",
                        )}
                        className="relative z-10 w-full h-auto rounded-[20px] object-contain"
                    />
                </div>
            </div>
        </>
    );
};

export default OurSass;

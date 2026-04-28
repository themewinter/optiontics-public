/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import aboutImage from "../../../../images/admin/about_us_image.webp";

const UShapeIcon = () => (
    <svg
        width={67}
        height={67}
        viewBox="0 0 67 67"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M34.0583 0.00456102C52.3023 0.302688 67 15.1849 67 33.5C67 51.8151 52.3023 66.6973 34.0583 66.9954L34.0583 67L-2.92866e-06 67L0 -2.92866e-06L34.0583 4.88112e-08L34.0583 0.00456102Z"
            fill="#D0DAFF"
        />
    </svg>
);

const BottomShapeIcon = () => (
    <svg
        width={49}
        height={54}
        viewBox="0 0 49 54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle
            cx={36}
            cy={36}
            r={36}
            transform="rotate(180 36 36)"
            fill="#FFF0D1"
        />
    </svg>
);

const TopRightShapeIcon = () => (
    <svg
        width={58}
        height={67}
        viewBox="0 0 58 67"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M-7.98828 28.4019C-7.98828 46.4744 6.66235 61.125 24.7348 61.125C42.8073 61.125 57.458 46.4744 57.458 28.4019L57.458 -27L-7.98828 -27L-7.98828 28.4019Z"
            fill="#D0DAFF"
        />
        <path
            d="M17.7227 66.5C35.5188 66.5 49.946 52.0735 49.9463 34.2773L49.9463 -20.625L-14.5 -20.625L-14.5 34.2773L-14.4893 35.1084C-14.0482 52.5203 0.204539 66.4998 17.7227 66.5Z"
            stroke="#B6C6FF"
        />
    </svg>
);

const HeroSection = () => {
    return (
        <div className="relative pt-10 px-5 pb-15 md:pt-5 md:pr-10 md:pb-15 md:pl-15 bg-white overflow-hidden rounded-lg">
            {/* Top-left decorative shape */}
            <span className="absolute top-0 left-0 z-1 max-md:hidden">
                <TopRightShapeIcon />
            </span>

            {/* Bottom-right decorative shape */}
            <span className="absolute -bottom-1.5 right-0 max-md:hidden">
                <BottomShapeIcon />
            </span>

            {/* Content wrapper */}
            <div className="flex flex-col text-center md:flex-row md:text-left items-center justify-between gap-7.5">
                {/* Text content — below image on mobile, left column on desktop */}
                <div className="order-2 md:order-0 w-full md:basis-[60%]">
                    <div className="text-2xl md:text-[28px] font-bold mb-5 text-black/90">
                        {__("About Our Company", "optiontics")}
                    </div>
                    <div className="text-base text-black/60 leading-[1.6] mb-4">
                        {__(
                            "Arraytics is a software company founded in 2013, specializing in WordPress, AI, Machine Learning, SaaS, and mobile applications. We're committed to delivering high-quality tech solutions that help businesses grow and simplify people's lives.",
                            "optiontics",
                        )}
                    </div>
                    <div className="text-base text-black/60 leading-[1.6] mb-4">
                        {__(
                            "Today, our products are trusted by nearly 70,000 customers across 120+ countries, powered by a passionate team of 30+ experts with over 12 years of industry experience. We're proud to be a Level 12 author on Envato.",
                            "optiontics",
                        )}
                    </div>
                </div>

                {/* Image block — above text on mobile, right column on desktop */}
                <div className="relative rounded-lg w-full mt-7.5 md:mt-0 md:basis-[40%] md:max-w-105 order-1 md:order-0">
                    <img
                        src={aboutImage}
                        alt={__("About Image", "optiontics")}
                        className="w-full h-auto max-h-90 object-cover rounded-lg"
                    />
                    {/* U-shape overlay on image */}
                    <span className="absolute top-0 right-0 z-1 max-md:hidden">
                        <UShapeIcon />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;

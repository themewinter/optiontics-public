/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { Container, PageHeader } from "@/common/components";

import HeroSection from "./HeroSection";
import OurSass from "./OurSass";
import OurPlugins from "./OurPlugins";


const AboutUs = () => {
    return (
        <>
            <PageHeader title={__("About Us", "optiontics")} />
            <Container>
                <div className="space-y-6 pb-6 max-w-7xl mx-auto sm:px-8">
                    <HeroSection />
                    <OurSass />
                    <OurPlugins />
                </div>
            </Container>
        </>
    );
};

export default AboutUs;

import BuilderHeader from "../BuilderHeader";
import ControlSidebar from "../ControlSidebar";
import EditorCanvas from "../EditorCanvas";
import Viewport from "../Viewport";
import CraftFrame from "../CraftFrame";

const isDokan = typeof window !== "undefined" && (window as any).optiontics?.option_tics_multivendor === "1";

export const BuilderLayout = () => {
    return (
        <div className={`flex flex-col bg-gray-50 page-container ${isDokan ? "" : "h-screen"}`}>
            <BuilderHeader />
            <div className={`flex flex-1 flex-col lg:flex-row opt-builder-layout ${isDokan ? "overflow-visible flex-wrap" : ""}`}>
                <div className={`flex-1 flex relative w-full ${isDokan ? "overflow-visible" : "max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto "}`}>
                    <EditorCanvas>
                        <Viewport>
                            <CraftFrame />
                        </Viewport>
                    </EditorCanvas>
                </div>
                <ControlSidebar />
            </div>
        </div>
    );
};

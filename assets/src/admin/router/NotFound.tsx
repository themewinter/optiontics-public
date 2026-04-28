/**
 * Wordpress Dependencies
 */
import { __ } from "@wordpress/i18n";

import { ErrorInstructions } from "@/common/components";
import { Button } from "@/shadcn/components/ui/button";
import { Card, CardContent } from "@/shadcn/components/ui/card";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted">
            <Card className="w-full max-w-xl shadow-xl">
                <CardContent className="p-8 text-center space-y-6">
                    <div className="text-5xl font-bold text-destructive">
                        404
                    </div>
                    <p className="text-lg text-muted-foreground">
                        {__(
                            "Sorry, the page you visited does not exist.",
                            "optiontics",
                        )}
                    </p>

                    {/* If ErrorInstructions is needed, render here */}
                    <div className="text-sm text-muted-foreground">
                        <ErrorInstructions />
                    </div>

                    <Button onClick={() => navigate("/")} className="mt-4">
                        {__("Go Home", "optiontics")}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default NotFound;

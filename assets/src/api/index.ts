import Addons from "./addons";
import Extensions from "./extensions";
import Plugins from "./plugins";
import Products from "./products";
import Analytics from "./analytics";
import AI from "./ai";
import Settings from "./settings";

const Api = {
    addons: new Addons(),
    extensions: new Extensions(),
    plugins: new Plugins(),
    products: new Products(),
    analytics: new Analytics(),
    ai: new AI(),
    settings: new Settings(),
};

export default Api;
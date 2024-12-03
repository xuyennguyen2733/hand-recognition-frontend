import { createContext, useState } from "react";

export const HandContext = createContext();

function HandProvider({children}) {
    const [handMoving, setHandMoving] = useState(false);
    const [rawLandmarks, setRawLandmarks] = useState([[],[]]);
    
    return (
        <HandContext.Provider value={({handMoving, setHandMoving, rawLandmarks, setRawLandmarks})}>
            {children}
        </HandContext.Provider>
    )
}

export default HandProvider;
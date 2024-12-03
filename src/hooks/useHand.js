import { useContext } from "react";
import { HandContext } from "../contexts/HandContext";

function useHand() {
    return useContext(HandContext);
}

export default useHand;
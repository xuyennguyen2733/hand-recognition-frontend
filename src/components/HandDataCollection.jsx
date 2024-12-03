import { useEffect, useRef, useState } from "react";
import useHand from "../hooks/useHand";

function HandDataCollection({resultLandmarks}) {
    const {handMoving} = useHand();
    const sequence = useRef([]);
    const [collecting, setCollecting] = useState(false);
    
    useEffect(() => {
        if (resultLandmarks.length > 0 && sequence.current.length < 60 && collecting) {
            console.log('collecting')
            sequence.current.push(resultLandmarks);
        }
    }, [resultLandmarks])
    
    useEffect(() => {
        if (handMoving) {
            setCollecting(true);
            console.log('start collecting')
        }
        else {
            setCollecting(false);
            console.log('stop collecting or did not start');
            sequence.current = [];
        }
    }, [handMoving])
    
  return <div>Hand is Moving? {handMoving ? 'yes' : 'no'}</div>;
}

export default HandDataCollection;
